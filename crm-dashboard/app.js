// ============================================================
// PANAGRO CRM - Main Application Logic
// ============================================================

// --- Utility Functions ---
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
const fmtDec = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const pct = (n) => `${n.toFixed(1)}%`;
const getClientName = (c) => c.institution_name || c.doctor_name || c.name || '—';
const getProductByName = (name) => CRM_DATA.products.find(p => p.medicine_name === name);
const getClientById = (id) => CRM_DATA.clients.find(c => c.client_id === id);
const getProductById = (id) => CRM_DATA.products.find(p => p.product_id === id);
const getProductName = (id) => { const p = getProductById(id); return p ? p.medicine_name : '—'; };

// --- API Persistence ---
const API_URL = ''; // Same origin

async function saveRecordToAPI(table, data, id = null) {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/api/${table}/${id}` : `${API_URL}/api/${table}`;
    
    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (err) {
        console.error('API Error:', err);
        showToast('error', 'Error al sincronizar con el servidor');
    }
}

async function loadFromAPI() {
    try {
        const response = await fetch(`${API_URL}/api/data`);
        const data = await response.json();
        Object.keys(data).forEach(key => {
            if (CRM_DATA[key]) CRM_DATA[key] = data[key];
        });
        initAllSections();
    } catch (err) {
        console.error('Failed to load data from API:', err);
        // Fallback to localStorage if server is down (optional)
        const saved = localStorage.getItem('PANAGRO_CRM_DATA');
        if (saved) {
             const parsed = JSON.parse(saved);
             Object.keys(parsed).forEach(key => {
                 if (CRM_DATA[key]) CRM_DATA[key] = parsed[key];
             });
             initAllSections();
        }
    }
}

function badgeClass(val) {
    const map = { 'Pagado': 'success', 'Completo': 'success', 'Activo': 'success', 'Cerrado': 'success', 'Cerrado Ganado': 'success', 'En stock': 'success', 'Alto': 'info',
        'Pendiente': 'warning', 'Parcial': 'warning', 'Propuesta': 'warning', 'Negociación': 'warning', 'Bajo stock': 'warning', 'Medio': 'warning', 'Contactado': 'info',
        'Vencido': 'danger', 'Perdido': 'danger', 'Cerrado Perdido': 'danger', 'Inactivo': 'neutral', 'Potencial': 'purple', 'Bajo pedido': 'neutral', 'Bajo': 'neutral',
        'Regulado': 'info', 'No Regulado': 'neutral', 'Sí': 'success', 'No': 'neutral' };
    return `badge badge-${map[val] || 'neutral'}`;
}

// --- Navigation ---
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const section = item.dataset.section;
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`section-${section}`).classList.add('active');
        document.getElementById('pageTitle').textContent = item.querySelector('.nav-text').textContent;
        if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
    });
});

document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

// --- Table Renderer ---
function renderTable(containerId, headers, rows) {
    const container = document.getElementById(containerId);
    if (!rows.length) { container.innerHTML = '<p style="padding:20px;color:var(--text-muted)">No hay datos.</p>'; return; }
    let html = '<table class="data-table"><thead><tr>';
    headers.forEach(h => html += `<th>${h.label}</th>`);
    html += '</tr></thead><tbody>';
    rows.forEach(row => {
        html += '<tr>';
        headers.forEach(h => {
            const val = h.render ? h.render(row) : (row[h.key] ?? '—');
            html += `<td>${val}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

// --- Dashboard KPIs ---
function updateDashboard() {
    // Monthly revenue (March 2026)
    const marchOrders = CRM_DATA.orders.filter(o => o.order_date.startsWith('2026-03'));
    const febOrders = CRM_DATA.orders.filter(o => o.order_date.startsWith('2026-02'));
    const marchRev = marchOrders.reduce((s, o) => s + o.total_order_value, 0);
    const febRev = febOrders.reduce((s, o) => s + o.total_order_value, 0);
    const growth = febRev > 0 ? ((marchRev - febRev) / febRev * 100) : 0;
    document.getElementById('kpiMonthlyRevenue').textContent = fmt(marchRev);
    const trendEl = document.getElementById('kpiRevenueTrend');
    trendEl.textContent = `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% vs Feb`;
    trendEl.className = `kpi-trend ${growth >= 0 ? 'positive' : 'negative'}`;
    document.getElementById('kpiMonthlyOrders').textContent = marchOrders.length;

    // Pipeline
    const openOps = CRM_DATA.opportunities.filter(o => !['Cerrado Ganado', 'Cerrado Perdido'].includes(o.sales_stage));
    const pipeVal = openOps.reduce((s, o) => s + o.estimated_value, 0);
    document.getElementById('kpiPipelineValue').textContent = fmt(pipeVal);
    document.getElementById('kpiPipelineTrend').textContent = `${openOps.length} oportunidades`;

    // Active clients
    const active = CRM_DATA.clients.filter(c => c.activity_status === 'Activo').length;
    const lost = CRM_DATA.clients.filter(c => c.activity_status === 'Perdido').length;
    const churn = CRM_DATA.clients.length > 0 ? (lost / CRM_DATA.clients.length * 100) : 0;
    document.getElementById('kpiActiveClients').textContent = active;
    document.getElementById('kpiChurnRate').textContent = `Churn: ${pct(churn)}`;

    // Conversion rate
    const won = CRM_DATA.opportunities.filter(o => o.sales_stage === 'Cerrado Ganado').length;
    const closed = CRM_DATA.opportunities.filter(o => ['Cerrado Ganado', 'Cerrado Perdido'].includes(o.sales_stage)).length;
    const convRate = closed > 0 ? (won / closed * 100) : 0;
    document.getElementById('kpiConversionRate').textContent = pct(convRate);
    document.getElementById('kpiConversionDetail').textContent = `${won} de ${closed} cerradas`;

    // Gross margin
    let totalRev = 0, totalCost = 0;
    CRM_DATA.order_details.forEach(od => {
        const product = CRM_DATA.products.find(p => p.product_id === od.product_id);
        if (product) { totalRev += od.quantity * od.unit_price; totalCost += od.quantity * product.purchase_price; }
    });
    const marginPct = totalRev > 0 ? ((totalRev - totalCost) / totalRev * 100) : 0;
    document.getElementById('kpiGrossMargin').textContent = pct(marginPct);
    document.getElementById('kpiMarginDetail').textContent = fmt(totalRev - totalCost);

    renderPipelineFunnel();
    renderTopProducts();
    renderRecentOrders();
    renderPendingFollowups();
}

function renderPipelineFunnel() {
    const stages = ['Potencial', 'Contactado', 'Propuesta', 'Negociación', 'Cerrado Ganado', 'Cerrado Perdido'];
    const stageClasses = ['potencial', 'contactado', 'propuesta', 'negociacion', 'ganado', 'perdido'];
    const maxVal = Math.max(...stages.map(s => CRM_DATA.opportunities.filter(o => o.sales_stage === s).reduce((sum, o) => sum + o.estimated_value, 0)), 1);
    
    let html = '';
    stages.forEach((stage, i) => {
        const ops = CRM_DATA.opportunities.filter(o => o.sales_stage === stage);
        const val = ops.reduce((s, o) => s + o.estimated_value, 0);
        const widthPct = Math.max((val / maxVal) * 100, 8);
        html += `<div class="funnel-stage">
            <span class="funnel-label">${stage}</span>
            <div class="funnel-bar-container"><div class="funnel-bar stage-${stageClasses[i]}" style="width:${widthPct}%">${ops.length}</div></div>
            <span class="funnel-value">${fmt(val)}</span></div>`;
    });
    document.getElementById('pipelineFunnel').innerHTML = html;
}

function renderTopProducts() {
    const prodRev = {};
    CRM_DATA.order_details.forEach(od => {
        const p = CRM_DATA.products.find(pr => pr.product_id === od.product_id);
        if (p) { prodRev[p.medicine_name] = (prodRev[p.medicine_name] || 0) + od.quantity * od.unit_price; }
    });
    const sorted = Object.entries(prodRev).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxV = sorted.length ? sorted[0][1] : 1;
    let html = '';
    sorted.forEach(([name, rev]) => {
        html += `<div class="bar-item"><span class="bar-label">${name}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${(rev/maxV)*100}%"></div></div>
            <span class="bar-value">${fmt(rev)}</span></div>`;
    });
    document.getElementById('topProductsChart').innerHTML = html;
}

function renderRecentOrders() {
    const recent = [...CRM_DATA.orders].sort((a, b) => b.order_date.localeCompare(a.order_date)).slice(0, 5);
    renderTable('recentOrdersTable', [
        { label: 'Fecha', key: 'order_date' },
        { label: 'Cliente', render: r => getClientName(getClientById(r.client_id) || {}) },
        { label: 'Valor', render: r => fmt(r.total_order_value) },
        { label: 'Estado', render: r => `<span class="${badgeClass(r.payment_status)}">${r.payment_status}</span>` }
    ], recent);
}

function renderPendingFollowups() {
    const pending = CRM_DATA.clients.filter(c => c.activity_status === 'Activo' && c.next_followup_date)
        .sort((a, b) => a.next_followup_date.localeCompare(b.next_followup_date)).slice(0, 5);
    renderTable('pendingFollowups', [
        { label: 'Cliente', render: r => getClientName(r) },
        { label: 'Fecha', key: 'next_followup_date' },
        { label: 'Representante', key: 'sales_representative' },
        { label: 'Estado', render: r => `<span class="${badgeClass(r.client_status)}">${r.client_status}</span>` }
    ], pending);
}

// --- Clients Section ---
function renderClients(data) {
    renderTable('clientsTable', [
        { label: 'ID', key: 'client_id' },
        { label: 'Tipo', render: r => `<span class="${badgeClass(r.client_type)}">${r.client_type}</span>` },
        { label: 'Nombre', render: r => getClientName(r) },
        { label: 'Especialidad', key: 'specialty' },
        { label: 'Ciudad', key: 'city' },
        { label: 'Zona', key: 'zona' },
        { label: 'Dirección', key: 'direccion' },
        { label: 'Nivel', render: r => `<span class="${badgeClass(r.relationship_level)}">${r.relationship_level}</span>` },
        { label: 'Funnel', render: r => `<span class="${badgeClass(r.client_status)}">${r.client_status}</span>` },
        { label: 'Actividad', render: r => `<span class="${badgeClass(r.activity_status)}">${r.activity_status}</span>` },
        { label: 'Representante', key: 'sales_representative' },
        { label: 'Acciones', render: r => `<button class="btn-icon" onclick="editClient(${r.client_id})" title="Editar">✏️</button>` }
    ], data || CRM_DATA.clients);
}

function editClient(id) {
    const client = CRM_DATA.clients.find(c => c.client_id === id);
    if (client) {
        showModal('clientModal', client);
    }
}

function filterClients() {
    let data = [...CRM_DATA.clients];
    const type = document.getElementById('filterClientType').value;
    const status = document.getElementById('filterClientStatus').value;
    const activity = document.getElementById('filterActivityStatus').value;
    const zona = document.getElementById('filterZona').value;
    if (type) data = data.filter(c => c.client_type === type);
    if (status) data = data.filter(c => c.client_status === status);
    if (activity) data = data.filter(c => c.activity_status === activity);
    if (zona) data = data.filter(c => c.zona === zona);
    renderClients(data);
}

// --- Products Section ---
function renderProducts(data) {
    renderTable('productsTable', [
        { label: 'ID', key: 'product_id' },
        { label: 'Medicamento', key: 'medicine_name' },
        { label: 'Categoría', key: 'category' },
        { label: 'Fabricante', key: 'manufacturer' },
        { label: 'Precio Compra', render: r => fmtDec(r.purchase_price) },
        { label: 'Precio Venta', render: r => fmtDec(r.unit_price) },
        { label: 'Margen', render: r => { const m = r.unit_price > 0 ? ((r.unit_price - r.purchase_price) / r.unit_price * 100) : 0; return pct(m); }},
        { label: 'Regulación', render: r => `<span class="${badgeClass(r.price_regulation_type)}">${r.price_regulation_type}</span>` },
        { label: 'Stock', render: r => `<span class="${badgeClass(r.stock_status)}">${r.stock_status}</span>` },
        { label: 'Estratégico', render: r => `<span class="${badgeClass(r.strategic_product)}">${r.strategic_product}</span>` }
    ], data || CRM_DATA.products);
}

function filterProducts() {
    let data = [...CRM_DATA.products];
    const cat = document.getElementById('filterProductCategory').value;
    const reg = document.getElementById('filterRegulation').value;
    const stock = document.getElementById('filterStockStatus').value;
    if (cat) data = data.filter(p => p.category === cat);
    if (reg) data = data.filter(p => p.price_regulation_type === reg);
    if (stock) data = data.filter(p => p.stock_status === stock);
    renderProducts(data);
}

// --- Pipeline Kanban ---
function renderPipelineKanban() {
    const stages = ['Potencial', 'Contactado', 'Propuesta', 'Negociación', 'Cerrado Ganado', 'Cerrado Perdido'];
    const colors = ['#818cf8', '#60a5fa', '#fbbf24', '#fb923c', '#4ade80', '#f87171'];
    let html = '';
    stages.forEach((stage, i) => {
        const ops = CRM_DATA.opportunities.filter(o => o.sales_stage === stage);
        const totalVal = ops.reduce((s, o) => s + o.estimated_value, 0);
        html += `<div class="kanban-column"><div class="kanban-header" style="border-top:3px solid ${colors[i]}">
            <span>${stage}</span><span class="kanban-count">${ops.length} · ${fmt(totalVal)}</span></div><div class="kanban-body">`;
        ops.forEach(op => {
            const client = getClientById(op.client_id);
            html += `<div class="kanban-card"><div class="kanban-card-title">${getClientName(client || {})}</div>
                <div class="kanban-card-subtitle">${getProductName(op.product_id)}</div>
                <div class="kanban-card-footer"><span class="kanban-card-value">${fmt(op.estimated_value)}</span>
                <span class="kanban-card-prob">${op.probability_close}%</span></div></div>`;
        });
        html += '</div></div>';
    });
    document.getElementById('pipelineKanban').innerHTML = html;
}

// --- Orders Section ---
function renderOrders() {
    renderTable('ordersTable', [
        { label: 'Pedido #', key: 'order_id' },
        { label: 'Fecha', key: 'order_date' },
        { label: 'Cliente', render: r => getClientName(getClientById(r.client_id) || {}) },
        { label: 'Representante', key: 'sales_representative' },
        { label: 'Valor Total', render: r => fmt(r.total_order_value) },
        { label: 'Pago', render: r => `<span class="${badgeClass(r.payment_status)}">${r.payment_status}</span>` },
        { label: 'Productos', render: r => {
            const details = CRM_DATA.order_details.filter(d => d.order_id === r.order_id);
            return details.map(d => `${getProductName(d.product_id)} (${d.quantity})`).join('<br>');
        }}
    ], CRM_DATA.orders);
}

// --- Interactions ---
function renderInteractions() {
    renderTable('interactionsTable', [
        { label: 'Fecha', key: 'interaction_date' },
        { label: 'Cliente', render: r => getClientName(getClientById(r.client_id) || {}) },
        { label: 'Tipo', render: r => `<span class="${badgeClass(r.interaction_type)}">${r.interaction_type}</span>` },
        { label: 'Tema', key: 'topic' },
        { label: 'Notas', key: 'notes' },
        { label: 'Próxima Acción', key: 'next_action' },
        { label: 'Seguimiento', key: 'followup_date' },
        { label: 'Representante', key: 'sales_representative' }
    ], CRM_DATA.interactions);
}

// --- Payments ---
function renderPayments() {
    renderTable('paymentsTable', [
        { label: 'Pago #', key: 'payment_id' },
        { label: 'Pedido #', key: 'order_id' },
        { label: 'Factura', key: 'invoice_number' },
        { label: 'Monto', render: r => fmt(r.amount) },
        { label: 'Fecha', key: 'payment_date' },
        { label: 'Método', key: 'payment_method' },
        { label: 'Estado', render: r => `<span class="${badgeClass(r.payment_status)}">${r.payment_status}</span>` }
    ], CRM_DATA.payments);
}

// --- KPIs Detailed Section ---
function renderKPIsDashboard() {
    // Revenue KPIs
    const totalRev = CRM_DATA.orders.reduce((s, o) => s + o.total_order_value, 0);
    const marchRev = CRM_DATA.orders.filter(o => o.order_date.startsWith('2026-03')).reduce((s, o) => s + o.total_order_value, 0);
    const avgOrder = totalRev / Math.max(CRM_DATA.orders.length, 1);
    
    const repRevenue = {};
    CRM_DATA.orders.forEach(o => { repRevenue[o.sales_representative] = (repRevenue[o.sales_representative] || 0) + o.total_order_value; });
    
    document.getElementById('kpiRevenueGrid').innerHTML = kpiItem('Ingresos Totales', fmt(totalRev), 'Acumulado all-time') +
        kpiItem('Ingresos Marzo', fmt(marchRev), 'Mes actual') +
        kpiItem('Ticket Promedio', fmt(avgOrder), `${CRM_DATA.orders.length} pedidos`) +
        Object.entries(repRevenue).map(([rep, rev]) => kpiItem(rep, fmt(rev), 'Representante')).join('');

    // Pipeline KPIs
    const openOps = CRM_DATA.opportunities.filter(o => !['Cerrado Ganado', 'Cerrado Perdido'].includes(o.sales_stage));
    const pipeTotal = openOps.reduce((s, o) => s + o.estimated_value, 0);
    const pipeWeighted = openOps.reduce((s, o) => s + o.estimated_value * (o.probability_close / 100), 0);
    const won = CRM_DATA.opportunities.filter(o => o.sales_stage === 'Cerrado Ganado').length;
    const totalClosed = CRM_DATA.opportunities.filter(o => ['Cerrado Ganado', 'Cerrado Perdido'].includes(o.sales_stage)).length;

    document.getElementById('kpiPipelineGrid').innerHTML = kpiItem('Pipeline Total', fmt(pipeTotal), `${openOps.length} oportunidades`) +
        kpiItem('Pipeline Ponderado', fmt(pipeWeighted), 'Ajustado por probabilidad') +
        kpiItem('Tasa de Conversión', pct(totalClosed > 0 ? won/totalClosed*100 : 0), `${won}/${totalClosed} cerradas`) +
        kpiItem('Valor Prom. Ganada', fmt(CRM_DATA.opportunities.filter(o=>o.sales_stage==='Cerrado Ganado').reduce((s,o)=>s+o.estimated_value,0)/Math.max(won,1)), 'Cerrado Ganado');

    // Client KPIs
    const activeC = CRM_DATA.clients.filter(c => c.activity_status === 'Activo').length;
    const inactiveC = CRM_DATA.clients.filter(c => c.activity_status === 'Inactivo').length;
    const lostC = CRM_DATA.clients.filter(c => c.activity_status === 'Perdido').length;
    const churnRate = CRM_DATA.clients.length > 0 ? lostC / CRM_DATA.clients.length * 100 : 0;

    document.getElementById('kpiClientGrid').innerHTML = kpiItem('Clientes Activos', activeC, `de ${CRM_DATA.clients.length} totales`) +
        kpiItem('Clientes Inactivos', inactiveC, 'Sin actividad reciente') +
        kpiItem('Clientes Perdidos', lostC, CRM_DATA.clients.filter(c=>c.lost_reason).map(c=>c.lost_reason).join(', ') || '—') +
        kpiItem('Tasa de Churn', pct(churnRate), 'Clientes perdidos / total');

    // Product KPIs
    const prodData = {};
    CRM_DATA.order_details.forEach(od => {
        const p = CRM_DATA.products.find(pr => pr.product_id === od.product_id);
        if (!p) return;
        if (!prodData[p.product_id]) prodData[p.product_id] = { name: p.medicine_name, units: 0, rev: 0, cost: 0, regulated: p.price_regulation_type };
        prodData[p.product_id].units += od.quantity;
        prodData[p.product_id].rev += od.quantity * od.unit_price;
        prodData[p.product_id].cost += od.quantity * p.purchase_price;
    });
    const topProd = Object.values(prodData).sort((a, b) => b.rev - a.rev)[0];
    const regRev = Object.values(prodData).filter(p => p.regulated === 'Regulado').reduce((s, p) => s + p.rev, 0);
    const unregRev = Object.values(prodData).filter(p => p.regulated !== 'Regulado').reduce((s, p) => s + p.rev, 0);
    const totalProdRev = Object.values(prodData).reduce((s, p) => s + p.rev, 0);
    const totalProdCost = Object.values(prodData).reduce((s, p) => s + p.cost, 0);
    const avgMargin = totalProdRev > 0 ? (totalProdRev - totalProdCost) / totalProdRev * 100 : 0;

    document.getElementById('kpiProductGrid').innerHTML = kpiItem('Más Vendido', topProd ? topProd.name : '—', topProd ? fmt(topProd.rev) : '') +
        kpiItem('Vtas Regulados', fmt(regRev), `${pct(totalProdRev>0?regRev/totalProdRev*100:0)} del total`) +
        kpiItem('Vtas No Regulados', fmt(unregRev), `${pct(totalProdRev>0?unregRev/totalProdRev*100:0)} del total`) +
        kpiItem('Margen Promedio', pct(avgMargin), fmt(totalProdRev - totalProdCost));

    // Operations KPIs
    const avgLead = CRM_DATA.products.reduce((s, p) => s + p.lead_time_days, 0) / Math.max(CRM_DATA.products.length, 1);
    const inStock = CRM_DATA.products.filter(p => p.stock_status === 'En stock').length;
    const strategicRev = Object.values(prodData).filter(pd => CRM_DATA.products.find(p => p.product_id === +Object.keys(prodData).find(k => prodData[k] === pd))?.strategic_product === 'Sí').reduce((s, p) => s + p.rev, 0);

    document.getElementById('kpiOpsGrid').innerHTML = kpiItem('Lead Time Promedio', `${avgLead.toFixed(0)} días`, 'Todos los productos') +
        kpiItem('Disponibilidad', `${inStock}/${CRM_DATA.products.length}`, 'Productos en stock') +
        kpiItem('Productos Estratégicos', CRM_DATA.products.filter(p => p.strategic_product === 'Sí').length, `de ${CRM_DATA.products.length} total`) +
        kpiItem('Vtas Estratégicos', fmt(strategicRev), 'Productos prioritarios');
}

function kpiItem(label, value, sub) {
    return `<div class="kpi-detail-item"><span class="kpi-detail-label">${label}</span><span class="kpi-detail-value">${value}</span><span class="kpi-detail-sub">${sub || ''}</span></div>`;
}

// --- Modal System ---
let currentModalType = '';
let currentEditId = null;

function showModal(type, editData = null) {
    currentModalType = type;
    currentEditId = editData ? (editData.client_id || editData.product_id || editData.opportunity_id || editData.order_id || editData.interaction_id || editData.payment_id) : null;
    
    const overlay = document.getElementById('modalOverlay');
    const body = document.getElementById('modalBody');
    const title = document.getElementById('modalTitle');
    
    const forms = {
        clientModal: { title: editData ? 'Editar Cliente' : 'Nuevo Cliente', fields: [
            { row: [{ label: 'Tipo', name: 'client_type', type: 'select', options: ['Doctor','Hospital','Clínica','Farmacia'], value: editData?.client_type }, { label: 'Especialidad', name: 'specialty', value: editData?.specialty }] },
            { row: [{ label: 'Institución', name: 'institution_name', value: editData?.institution_name }, { label: 'Doctor', name: 'doctor_name', value: editData?.doctor_name }] },
            { row: [{ label: 'Teléfono', name: 'phone', value: editData?.phone }, { label: 'Email', name: 'email', value: editData?.email }] },
            { row: [{ label: 'Ciudad', name: 'city', value: editData?.city }, { label: 'Zona', name: 'zona', type: 'select', options: ['Zona Central','Zona Norte','Zona Este','Zona Occidente','Zona Atlántico','Zona Central Interior'], value: editData?.zona }] },
            { row: [{ label: 'Dirección', name: 'direccion', value: editData?.direccion }, { label: 'País', name: 'country', value: editData?.country || 'Panamá' }] },
            { row: [{ label: 'Nivel Relación', name: 'relationship_level', type: 'select', options: ['Alto','Medio','Bajo'], value: editData?.relationship_level }, { label: 'Representante', name: 'sales_representative', value: editData?.sales_representative }] },
            { label: 'Notas', name: 'notes', type: 'textarea', value: editData?.notes }
        ]},
        // ... rest of forms could be updated similarly if needed, for now focusing on clients as requested
        productModal: { title: 'Nuevo Producto', fields: [
            { row: [{ label: 'Medicamento', name: 'medicine_name' }, { label: 'Categoría', name: 'category' }] },
            { row: [{ label: 'Fabricante', name: 'manufacturer' }, { label: 'Proveedor', name: 'supplier' }] },
            { row: [{ label: 'Precio Compra', name: 'purchase_price', type: 'number' }, { label: 'Precio Venta', name: 'unit_price', type: 'number' }] },
            { row: [{ label: 'Regulación', name: 'price_regulation_type', type: 'select', options: ['No Regulado','Regulado'] }, { label: 'Precio Máx. Gobierno', name: 'government_max_price', type: 'number' }] },
            { row: [{ label: 'Lead Time (días)', name: 'lead_time_days', type: 'number' }, { label: 'Stock', name: 'stock_status', type: 'select', options: ['En stock','Bajo stock','Bajo pedido'] }] },
            { label: 'Notas', name: 'notes', type: 'textarea' }
        ]},
        opportunityModal: { title: 'Nueva Oportunidad', fields: [
            { row: [{ label: 'Cliente ID', name: 'client_id', type: 'number' }, { label: 'Producto ID', name: 'product_id', type: 'number' }] },
            { row: [{ label: 'Volumen Est.', name: 'estimated_volume', type: 'number' }, { label: 'Valor Est.', name: 'estimated_value', type: 'number' }] },
            { row: [{ label: 'Etapa', name: 'sales_stage', type: 'select', options: ['Potencial','Contactado','Propuesta','Negociación','Cerrado Ganado','Cerrado Perdido'] }, { label: 'Probabilidad %', name: 'probability_close', type: 'number' }] },
            { row: [{ label: 'Fecha Cierre', name: 'expected_close_date', type: 'date' }, { label: 'Representante', name: 'sales_representative' }] },
            { label: 'Notas', name: 'notes', type: 'textarea' }
        ]},
        orderModal: { title: 'Nuevo Pedido', fields: [
            { row: [{ label: 'Cliente ID', name: 'client_id', type: 'number' }, { label: 'Fecha', name: 'order_date', type: 'date' }] },
            { row: [{ label: 'Representante', name: 'sales_representative' }, { label: 'Valor Total', name: 'total_order_value', type: 'number' }] },
            { label: 'Estado Pago', name: 'payment_status', type: 'select', options: ['Pendiente','Parcial','Pagado','Vencido'] }
        ]},
        interactionModal: { title: 'Nueva Interacción', fields: [
            { row: [{ label: 'Cliente ID', name: 'client_id', type: 'number' }, { label: 'Fecha', name: 'interaction_date', type: 'date' }] },
            { row: [{ label: 'Tipo', name: 'interaction_type', type: 'select', options: ['Visita','Llamada','Email','Reunión','Conferencia'] }, { label: 'Representante', name: 'sales_representative' }] },
            { label: 'Tema', name: 'topic' },
            { label: 'Notas', name: 'notes', type: 'textarea' },
            { row: [{ label: 'Próx. Acción', name: 'next_action' }, { label: 'Fecha Seguimiento', name: 'followup_date', type: 'date' }] }
        ]},
        paymentModal: { title: 'Nuevo Pago', fields: [
            { row: [{ label: 'Cliente', name: 'client_id', type: 'client_select' }, { label: 'Pedido ID', name: 'order_id', type: 'number' }] },
            { row: [{ label: 'Factura', name: 'invoice_number' }, { label: 'Monto', name: 'amount', type: 'number' }] },
            { row: [{ label: 'Fecha', name: 'payment_date', type: 'date' }, { label: 'Método', name: 'payment_method', type: 'select', options: ['Transferencia','Cheque','Efectivo','Tarjeta','Crédito'] }] },
            { label: 'Estado', name: 'payment_status', type: 'select', options: ['Completo','Parcial','Pendiente','Rechazado'] }
        ]}
    };
    
    const form = forms[type];
    if (!form) return;
    title.textContent = form.title;
    body.innerHTML = form.fields.map(f => {
        if (f.row) return `<div class="form-row">${f.row.map(renderField).join('')}</div>`;
        return renderField(f);
    }).join('');
    overlay.classList.add('active');
}

function renderField(f) {
    let input;
    const val = f.value ?? '';
    if (f.type === 'client_select') {
        const clientOptions = CRM_DATA.clients.map(c => {
            const name = getClientName(c);
            const selected = String(c.client_id) === String(val) ? 'selected' : '';
            return `<option value="${c.client_id}" ${selected}>${c.client_id} — ${name}</option>`;
        }).join('');
        input = `<select class="form-select" name="${f.name}"><option value="">Seleccionar cliente...</option>${clientOptions}</select>`;
    } else if (f.type === 'select') {
        input = `<select class="form-select" name="${f.name}">${f.options.map(o => `<option value="${o}" ${o === val ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
    } else if (f.type === 'textarea') {
        input = `<textarea class="form-textarea" name="${f.name}">${val}</textarea>`;
    } else {
        input = `<input class="form-input" type="${f.type || 'text'}" name="${f.name}" value="${val}">`;
    }
    return `<div class="form-group"><label class="form-label">${f.label}</label>${input}</div>`;
}

function closeModal() { document.getElementById('modalOverlay').classList.remove('active'); }

function saveRecord() {
    const body = document.getElementById('modalBody');
    const data = {};
    body.querySelectorAll('input, select, textarea').forEach(el => { 
        data[el.name] = el.type === 'number' ? parseFloat(el.value) || 0 : el.value; 
    });
    
    const tableMap = { clientModal: 'clients', productModal: 'products', opportunityModal: 'opportunities', orderModal: 'orders', interactionModal: 'interactions', paymentModal: 'payments' };
    const table = tableMap[currentModalType];
    
    if (table && CRM_DATA[table]) {
        const idField = TABLE_FIELDS[table][0];
        
        if (currentEditId) {
            // Update existing record
            const index = CRM_DATA[table].findIndex(r => r[idField] === currentEditId);
            if (index !== -1) {
                data[idField] = currentEditId;
                CRM_DATA[table][index] = { ...CRM_DATA[table][index], ...data };
                saveRecordToAPI(table, data, currentEditId);
                showToast('success', 'Registro actualizado exitosamente');
            }
        } else {
            // Create new record
            saveRecordToAPI(table, data).then(res => {
                if (res && res.id) {
                    data[idField] = res.id;
                    CRM_DATA[table].push(data);
                    initAllSections();
                }
            });
            showToast('success', 'Registro creado exitosamente');
        }
        
        closeModal();
        initAllSections();
    }
}

// --- Import Data ---
const fileUploadZone = document.getElementById('fileUploadZone');
const importFileInput = document.getElementById('importFile');

document.getElementById('importTargetTable').addEventListener('change', (e) => {
    const table = e.target.value;
    const btnTemplate = document.getElementById('btnDownloadTemplate');
    if (btnTemplate) btnTemplate.disabled = !table;
    
    if (importedData && importedData.headers) {
        showColumnMapping(importedData.headers);
        if (document.getElementById('importTargetTable').value) {
            showImportPreview();
        }
    }
});

function downloadTemplate() {
    const table = document.getElementById('importTargetTable').value;
    if (!table || !TABLE_FIELDS[table]) {
        showToast('warning', 'Seleccione una tabla destino primero');
        return;
    }
    const fields = TABLE_FIELDS[table];
    const csvContent = "data:text/csv;charset=utf-8," + fields.join(',') + "\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `plantilla_${table}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

fileUploadZone.addEventListener('click', () => importFileInput.click());
fileUploadZone.addEventListener('dragover', e => { e.preventDefault(); fileUploadZone.classList.add('drag-over'); });
fileUploadZone.addEventListener('dragleave', () => fileUploadZone.classList.remove('drag-over'));
fileUploadZone.addEventListener('drop', e => { e.preventDefault(); fileUploadZone.classList.remove('drag-over'); handleFile(e.dataTransfer.files[0]); });
importFileInput.addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]); });

let importedData = null;

function handleFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) { showToast('error', 'Formato no soportado. Use .csv, .xlsx o .xls'); return; }
    
    fileUploadZone.querySelector('.upload-content').innerHTML = `<span class="upload-icon">✅</span><p><strong>${file.name}</strong></p><span class="upload-hint">${(file.size/1024).toFixed(1)} KB</span>`;
    
    if (ext === 'csv') {
        const reader = new FileReader();
        reader.onload = e => { parseCSV(e.target.result); };
        reader.readAsText(file);
    } else {
        showToast('info', 'Para archivos Excel, se necesita la librería SheetJS. Se procesará como demo.');
        importedData = generateDemoImportData();
        showImportPreview();
    }
}

function parseCSV(text) {
    const rows = [];
    const lines = text.trim().split('\n');
    if (lines.length < 2) return;

    // Helper to parse CSV row correctly handling quotes
    const parseRow = (line) => {
        const result = [];
        let cur = '', inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && line[i+1] === '"') { cur += '"'; i++; }
            else if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) { result.push(cur.trim()); cur = ''; }
            else cur += char;
        }
        result.push(cur.trim());
        return result;
    };

    const headers = parseRow(lines[0]);
    for (let i = 1; i < lines.length; i++) {
        const vals = parseRow(lines[i]);
        const obj = {};
        headers.forEach((h, idx) => obj[h] = vals[idx] || '');
        rows.push(obj);
    }
    
    importedData = { headers, rows };
    showColumnMapping(headers);
    showImportPreview();
}

function generateDemoImportData() {
    return { headers: ['Nombre', 'Tipo', 'Especialidad', 'Ciudad', 'Teléfono'], rows: [
        { Nombre: 'Dr. Demo García', Tipo: 'Doctor', Especialidad: 'Pediatría', Ciudad: 'Ciudad de Panamá', Teléfono: '+507-6000-0001' },
        { Nombre: 'Clínica Demo', Tipo: 'Clínica', Especialidad: 'General', Ciudad: 'David', Teléfono: '+507-6000-0002' }
    ]};
}

function showColumnMapping(headers) {
    const targetTable = document.getElementById('importTargetTable').value;
    if (!targetTable) { showToast('warning', 'Seleccione la tabla destino primero'); return; }
    const fields = TABLE_FIELDS[targetTable] || [];
    const mapping = document.getElementById('columnMapping');
    const container = document.getElementById('mappingFields');
    mapping.style.display = 'block';
    container.innerHTML = headers.map(h => `<div class="mapping-row">
        <span class="mapping-source">${h}</span><span class="mapping-arrow">→</span>
        <div class="mapping-target"><select><option value="">Ignorar</option>${fields.map(f => `<option value="${f}" ${f.toLowerCase().includes(h.toLowerCase()) || h.toLowerCase().includes(f.toLowerCase()) ? 'selected' : ''}>${f}</option>`).join('')}</select></div>
    </div>`).join('');
}

function showImportPreview() {
    if (!importedData) return;
    const preview = document.getElementById('importPreview');
    preview.style.display = 'block';
    const table = document.getElementById('previewTable');
    let html = '<table class="data-table"><thead><tr>' + importedData.headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';
    importedData.rows.slice(0, 5).forEach(row => {
        html += '<tr>' + importedData.headers.map(h => `<td>${row[h] || ''}</td>`).join('') + '</tr>';
    });
    html += '</tbody></table>';
    table.innerHTML = html;
    document.getElementById('importSummary').innerHTML = `<strong>${importedData.rows.length}</strong> registros encontrados. Mostrando primeros ${Math.min(5, importedData.rows.length)}.`;
    document.getElementById('btnProcessImport').disabled = false;
}

function processImport() {
    if (!importedData) return;
    const targetTable = document.getElementById('importTargetTable').value;
    if (!targetTable || !CRM_DATA[targetTable]) { showToast('error', 'Tabla de destino no válida'); return; }

    const mappingFields = document.getElementById('mappingFields');
    const columnMap = {};
    
    // Obtener el mapeo de columnas del usuario
    mappingFields.querySelectorAll('.mapping-row').forEach(row => {
        const source = row.querySelector('.mapping-source').textContent;
        const target = row.querySelector('.mapping-target select').value;
        if (target) columnMap[source] = target;
    });

    if (Object.keys(columnMap).length === 0) { showToast('warning', 'Debe mapear al menos una columna'); return; }

    let count = 0;
    const idField = TABLE_FIELDS[targetTable][0];
    let nextId = Math.max(...CRM_DATA[targetTable].map(r => r[idField]), 0) + 1;

    importedData.rows.forEach(row => {
        const newRecord = {};
        TABLE_FIELDS[targetTable].forEach(field => newRecord[field] = null);
        
        Object.entries(columnMap).forEach(([source, target]) => {
            let val = row[source];
            if (val && (target.includes('price') || target.includes('amount') || target.includes('volume') || target.includes('quantity') || target.includes('margin') || target.endsWith('_id') || target.endsWith('value'))) {
                const num = parseFloat(val);
                if (!isNaN(num)) val = num;
            }
            newRecord[target] = val;
        });

        // Asegurar que el nombre sea visible
        if (targetTable === 'clients') {
            if (!newRecord.doctor_name && !newRecord.institution_name) {
                const anyName = row['Nombre_o_Institucion'] || row['Nombre'] || row['Name'] || Object.values(row)[0];
                newRecord.doctor_name = anyName;
            }
            if (!newRecord.activity_status) newRecord.activity_status = 'Activo';
            if (!newRecord.client_status) newRecord.client_status = 'Potencial';
        }

        newRecord[idField] = nextId++;
        CRM_DATA[targetTable].push(newRecord);
        count++;
    });

    saveToStorage(); // Guardar cambios permanentemente
    showToast('success', `¡${count} registros importados exitosamente!`);
    resetImport();
    initAllSections();
}

function resetImport() {
    importedData = null;
    document.getElementById('importFile').value = '';
    document.getElementById('importPreview').style.display = 'none';
    document.getElementById('columnMapping').style.display = 'none';
    document.getElementById('btnProcessImport').disabled = true;
    fileUploadZone.querySelector('.upload-content').innerHTML = `<span class="upload-icon">☁️</span><p>Arrastra tu archivo aquí o <button class="btn-link" onclick="document.getElementById('importFile').click()">selecciona un archivo</button></p><span class="upload-hint">Formatos: .xlsx, .xls, .csv</span>`;
}

function connectGoogleSheets() {
    const url = document.getElementById('googleSheetsUrl').value;
    if (!url) { showToast('warning', 'Ingrese la URL del Google Sheet'); return; }
    showToast('info', 'Conexión con Google Sheets configurada. En producción se usaría la API de Google Sheets.');
}

// --- Toast Notifications ---
function showToast(type, message) {
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-message">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 4000);
}

// --- Initialize ---
function initAllSections() {
    updateDashboard();
    renderClients();
    renderProducts();
    renderPipelineKanban();
    renderOrders();
    renderInteractions();
    renderPayments();
    renderKPIsDashboard();
}

document.addEventListener('DOMContentLoaded', () => {
    initAllSections();
    loadFromAPI();
});
