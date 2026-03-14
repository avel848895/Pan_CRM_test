-- ============================================================
-- PANAGRO CRM - SCHEMA DE BASE DE DATOS RELACIONAL
-- Sistema CRM para Distribución Farmacéutica
-- Compatible con PostgreSQL / MySQL
-- ============================================================

-- ============================================================
-- 1. TABLA CLIENTES
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
    client_id           SERIAL PRIMARY KEY,
    client_type         VARCHAR(20) NOT NULL CHECK (client_type IN ('Doctor', 'Clínica', 'Hospital', 'Farmacia', 'Distribuidora', 'Gubernamental', 'Otro')),
    institution_name    VARCHAR(200),
    doctor_name         VARCHAR(150),
    specialty           VARCHAR(100),
    phone               VARCHAR(30),
    email               VARCHAR(150),
    city                VARCHAR(100),
    country             VARCHAR(80) DEFAULT 'Panamá',
    zona                VARCHAR(50),
    direccion           TEXT,
    relationship_level  VARCHAR(10) CHECK (relationship_level IN ('Alto', 'Medio', 'Bajo')),
    
    -- Estado del cliente (Funnel)
    client_status       VARCHAR(20) DEFAULT 'Potencial' 
                        CHECK (client_status IN ('Potencial', 'Contactado', 'Propuesta', 'Negociación', 'Cerrado')),
    
    -- Estado de actividad
    activity_status     VARCHAR(10) DEFAULT 'Activo' 
                        CHECK (activity_status IN ('Activo', 'Inactivo', 'Perdido')),
    inactive_date       DATE,
    lost_reason         VARCHAR(30) 
                        CHECK (lost_reason IN ('Precio', 'Competencia', 'Falta de inventario', 'Relación', 'Otro')),
    
    sales_representative VARCHAR(100),
    last_contact_date    DATE,
    next_followup_date   DATE,
    notes               TEXT,
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_type ON clients(client_type);
CREATE INDEX idx_clients_status ON clients(client_status);
CREATE INDEX idx_clients_activity ON clients(activity_status);
CREATE INDEX idx_clients_rep ON clients(sales_representative);
CREATE INDEX idx_clients_city ON clients(city);

-- ============================================================
-- 2. TABLA TOMADORES DE DECISIÓN
-- ============================================================
CREATE TABLE IF NOT EXISTS decision_makers (
    decision_maker_id   SERIAL PRIMARY KEY,
    client_id           INTEGER NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
    name                VARCHAR(150) NOT NULL,
    role                VARCHAR(100) NOT NULL,
    phone               VARCHAR(30),
    email               VARCHAR(150),
    influence_level     VARCHAR(10) CHECK (influence_level IN ('Alto', 'Medio', 'Bajo')),
    notes               TEXT,
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dm_client ON decision_makers(client_id);
CREATE INDEX idx_dm_influence ON decision_makers(influence_level);

-- ============================================================
-- 3. TABLA PRODUCTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    product_id          SERIAL PRIMARY KEY,
    medicine_name       VARCHAR(200) NOT NULL,
    category            VARCHAR(100),
    manufacturer        VARCHAR(150),
    
    -- Información de precios
    purchase_price      DECIMAL(12,2) DEFAULT 0.00,
    unit_price          DECIMAL(12,2) DEFAULT 0.00,
    gross_margin        DECIMAL(5,2) GENERATED ALWAYS AS (
                            CASE WHEN unit_price > 0 
                                 THEN ((unit_price - purchase_price) / unit_price) * 100 
                                 ELSE 0 
                            END
                        ) STORED,
    
    -- Regulación del medicamento
    price_regulation_type VARCHAR(15) DEFAULT 'No Regulado' 
                         CHECK (price_regulation_type IN ('Regulado', 'No Regulado')),
    government_max_price  DECIMAL(12,2),
    price_regulation_authority VARCHAR(150),
    price_regulation_reference VARCHAR(200),
    
    -- Información logística
    supplier            VARCHAR(150),
    lead_time_days      INTEGER DEFAULT 0,
    stock_status        VARCHAR(15) DEFAULT 'En stock' 
                        CHECK (stock_status IN ('En stock', 'Bajo stock', 'Bajo pedido')),
    
    -- Información estratégica
    strategic_product   VARCHAR(3) DEFAULT 'No' CHECK (strategic_product IN ('Sí', 'No')),
    product_priority    VARCHAR(10) DEFAULT 'Media' CHECK (product_priority IN ('Alta', 'Media', 'Baja')),
    market_growth_potential VARCHAR(10) DEFAULT 'Medio' CHECK (market_growth_potential IN ('Alto', 'Medio', 'Bajo')),
    
    -- Otros
    minimum_order       INTEGER DEFAULT 1,
    storage_requirements VARCHAR(200),
    regulatory_status   VARCHAR(100),
    notes               TEXT,
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_regulation ON products(price_regulation_type);
CREATE INDEX idx_products_strategic ON products(strategic_product);
CREATE INDEX idx_products_stock ON products(stock_status);

-- ============================================================
-- 4. TABLA OPORTUNIDADES (PIPELINE)
-- ============================================================
CREATE TABLE IF NOT EXISTS opportunities (
    opportunity_id      SERIAL PRIMARY KEY,
    client_id           INTEGER NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
    product_id          INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    
    -- Información comercial
    estimated_volume    INTEGER DEFAULT 0,
    estimated_value     DECIMAL(14,2) DEFAULT 0.00,
    
    -- Pipeline
    sales_stage         VARCHAR(20) DEFAULT 'Potencial'
                        CHECK (sales_stage IN ('Potencial', 'Contactado', 'Propuesta', 'Negociación', 'Cerrado Ganado', 'Cerrado Perdido')),
    probability_close   DECIMAL(5,2) DEFAULT 0.00,
    expected_close_date DATE,
    
    sales_representative VARCHAR(100),
    notes               TEXT,
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_opp_client ON opportunities(client_id);
CREATE INDEX idx_opp_product ON opportunities(product_id);
CREATE INDEX idx_opp_stage ON opportunities(sales_stage);
CREATE INDEX idx_opp_rep ON opportunities(sales_representative);
CREATE INDEX idx_opp_close_date ON opportunities(expected_close_date);

-- ============================================================
-- 5. TABLA PEDIDOS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    order_id            SERIAL PRIMARY KEY,
    client_id           INTEGER NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
    order_date          DATE NOT NULL DEFAULT CURRENT_DATE,
    sales_representative VARCHAR(100),
    total_order_value   DECIMAL(14,2) DEFAULT 0.00,
    payment_status      VARCHAR(15) DEFAULT 'Pendiente' 
                        CHECK (payment_status IN ('Pendiente', 'Parcial', 'Pagado', 'Vencido')),
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_rep ON orders(sales_representative);
CREATE INDEX idx_orders_payment ON orders(payment_status);

-- ============================================================
-- 6. TABLA DETALLE DE PEDIDOS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_details (
    order_detail_id     SERIAL PRIMARY KEY,
    order_id            INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id          INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    quantity            INTEGER NOT NULL DEFAULT 1,
    unit_price          DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_price         DECIMAL(14,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_od_order ON order_details(order_id);
CREATE INDEX idx_od_product ON order_details(product_id);

-- ============================================================
-- 7. TABLA INTERACCIONES
-- ============================================================
CREATE TABLE IF NOT EXISTS interactions (
    interaction_id      SERIAL PRIMARY KEY,
    client_id           INTEGER NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
    interaction_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    interaction_type    VARCHAR(15) NOT NULL 
                        CHECK (interaction_type IN ('Visita', 'Llamada', 'Email', 'Reunión', 'Conferencia')),
    topic               VARCHAR(200),
    notes               TEXT,
    next_action         VARCHAR(200),
    followup_date       DATE,
    sales_representative VARCHAR(100),
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_int_client ON interactions(client_id);
CREATE INDEX idx_int_date ON interactions(interaction_date);
CREATE INDEX idx_int_type ON interactions(interaction_type);
CREATE INDEX idx_int_rep ON interactions(sales_representative);

-- ============================================================
-- 8. TABLA PAGOS
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    payment_id          SERIAL PRIMARY KEY,
    order_id            INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    invoice_number      VARCHAR(50),
    amount              DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    payment_date        DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method      VARCHAR(30) CHECK (payment_method IN ('Transferencia', 'Cheque', 'Efectivo', 'Tarjeta', 'Crédito')),
    payment_status      VARCHAR(15) DEFAULT 'Completo' 
                        CHECK (payment_status IN ('Completo', 'Parcial', 'Pendiente', 'Rechazado')),
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pay_order ON payments(order_id);
CREATE INDEX idx_pay_date ON payments(payment_date);
CREATE INDEX idx_pay_status ON payments(payment_status);

-- ============================================================
-- VISTAS AUXILIARES PARA KPIs
-- ============================================================

-- Vista: Resumen de Ventas Mensuales
CREATE OR REPLACE VIEW v_monthly_revenue AS
SELECT 
    DATE_TRUNC('month', o.order_date) AS month,
    COUNT(DISTINCT o.order_id) AS total_orders,
    COUNT(DISTINCT o.client_id) AS unique_clients,
    SUM(o.total_order_value) AS total_revenue,
    AVG(o.total_order_value) AS avg_order_value
FROM orders o
WHERE o.payment_status != 'Vencido'
GROUP BY DATE_TRUNC('month', o.order_date)
ORDER BY month DESC;

-- Vista: Ingresos por Producto
CREATE OR REPLACE VIEW v_revenue_by_product AS
SELECT 
    p.product_id,
    p.medicine_name,
    p.category,
    p.price_regulation_type,
    SUM(od.quantity) AS total_units_sold,
    SUM(od.total_price) AS total_revenue,
    AVG(p.unit_price - p.purchase_price) AS avg_margin_per_unit,
    CASE WHEN SUM(od.quantity * p.unit_price) > 0 
         THEN (SUM(od.quantity * (p.unit_price - p.purchase_price)) / SUM(od.quantity * p.unit_price)) * 100
         ELSE 0 
    END AS margin_percentage
FROM order_details od
JOIN products p ON od.product_id = p.product_id
GROUP BY p.product_id, p.medicine_name, p.category, p.price_regulation_type
ORDER BY total_revenue DESC;

-- Vista: Ingresos por Cliente
CREATE OR REPLACE VIEW v_revenue_by_client AS
SELECT 
    c.client_id,
    c.institution_name,
    c.doctor_name,
    c.client_type,
    c.specialty,
    c.city,
    c.relationship_level,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(o.total_order_value) AS total_revenue,
    AVG(o.total_order_value) AS avg_order_value,
    MIN(o.order_date) AS first_order_date,
    MAX(o.order_date) AS last_order_date
FROM clients c
LEFT JOIN orders o ON c.client_id = o.client_id
GROUP BY c.client_id, c.institution_name, c.doctor_name, c.client_type, c.specialty, c.city, c.relationship_level
ORDER BY total_revenue DESC;

-- Vista: Ventas por Representante
CREATE OR REPLACE VIEW v_sales_by_representative AS
SELECT 
    o.sales_representative,
    COUNT(DISTINCT o.order_id) AS total_orders,
    COUNT(DISTINCT o.client_id) AS clients_served,
    SUM(o.total_order_value) AS total_revenue,
    AVG(o.total_order_value) AS avg_order_value
FROM orders o
WHERE o.sales_representative IS NOT NULL
GROUP BY o.sales_representative
ORDER BY total_revenue DESC;

-- Vista: Pipeline Comercial
CREATE OR REPLACE VIEW v_pipeline_summary AS
SELECT 
    sales_stage,
    COUNT(*) AS opportunity_count,
    SUM(estimated_value) AS total_pipeline_value,
    AVG(probability_close) AS avg_probability,
    SUM(estimated_value * (probability_close / 100)) AS weighted_pipeline_value
FROM opportunities
WHERE sales_stage NOT IN ('Cerrado Ganado', 'Cerrado Perdido')
GROUP BY sales_stage
ORDER BY CASE sales_stage
    WHEN 'Potencial' THEN 1
    WHEN 'Contactado' THEN 2
    WHEN 'Propuesta' THEN 3
    WHEN 'Negociación' THEN 4
END;

-- Vista: Tasa de Conversión
CREATE OR REPLACE VIEW v_conversion_rate AS
SELECT 
    COUNT(*) AS total_opportunities,
    SUM(CASE WHEN sales_stage = 'Cerrado Ganado' THEN 1 ELSE 0 END) AS won,
    SUM(CASE WHEN sales_stage = 'Cerrado Perdido' THEN 1 ELSE 0 END) AS lost,
    SUM(CASE WHEN sales_stage NOT IN ('Cerrado Ganado', 'Cerrado Perdido') THEN 1 ELSE 0 END) AS open_opportunities,
    CASE WHEN COUNT(*) > 0 
         THEN (SUM(CASE WHEN sales_stage = 'Cerrado Ganado' THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100 
         ELSE 0 
    END AS conversion_rate_pct
FROM opportunities;

-- Vista: Análisis de Churn
CREATE OR REPLACE VIEW v_churn_analysis AS
SELECT 
    activity_status,
    COUNT(*) AS client_count,
    lost_reason,
    COUNT(CASE WHEN activity_status = 'Perdido' THEN 1 END) AS lost_clients,
    CASE WHEN COUNT(*) > 0 
         THEN (COUNT(CASE WHEN activity_status = 'Perdido' THEN 1 END)::DECIMAL / COUNT(*)) * 100 
         ELSE 0 
    END AS churn_rate_pct
FROM clients
GROUP BY activity_status, lost_reason
ORDER BY client_count DESC;

-- Vista: Productos Regulados vs No Regulados
CREATE OR REPLACE VIEW v_regulated_vs_unregulated AS
SELECT 
    p.price_regulation_type,
    COUNT(DISTINCT p.product_id) AS product_count,
    SUM(od.quantity) AS total_units_sold,
    SUM(od.total_price) AS total_revenue,
    AVG(p.unit_price - p.purchase_price) AS avg_margin_per_unit
FROM products p
LEFT JOIN order_details od ON p.product_id = od.product_id
GROUP BY p.price_regulation_type;

-- Vista: Productos Estratégicos
CREATE OR REPLACE VIEW v_strategic_products_performance AS
SELECT 
    p.product_id,
    p.medicine_name,
    p.category,
    p.product_priority,
    p.market_growth_potential,
    SUM(od.quantity) AS total_units_sold,
    SUM(od.total_price) AS total_revenue
FROM products p
LEFT JOIN order_details od ON p.product_id = od.product_id
WHERE p.strategic_product = 'Sí'
GROUP BY p.product_id, p.medicine_name, p.category, p.product_priority, p.market_growth_potential
ORDER BY total_revenue DESC;
