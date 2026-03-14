// ============================================================
// PANAGRO CRM - In-Memory Data Store
// Datos de ejemplo que reflejan el schema SQL
// ============================================================

const CRM_DATA = {
    // ========================================
    // CLIENTS TABLE
    // ========================================
    clients: [
        { client_id: 1, client_type: 'Doctor', institution_name: null, doctor_name: 'Dr. Ricardo Mendoza', specialty: 'Oncología', phone: '+507-6234-5678', email: 'rmendoza@medpan.com', city: 'Ciudad de Panamá', zona: 'Zona Central', direccion: 'Calle 50, Torre Global Bank, Piso 12, Bella Vista', country: 'Panamá', relationship_level: 'Alto', client_status: 'Cerrado', activity_status: 'Activo', inactive_date: null, lost_reason: null, sales_representative: 'Ana Castillo', last_contact_date: '2026-03-01', next_followup_date: '2026-03-15', notes: 'Cliente clave. Prescriptor de alto volumen en oncología.' },
        { client_id: 2, client_type: 'Hospital', institution_name: 'Hospital Nacional', doctor_name: 'Dr. Luis Herrera', specialty: 'General', phone: '+507-6301-1234', email: 'lherrera@hosnac.gob.pa', city: 'Ciudad de Panamá', zona: 'Zona Central', direccion: 'Avenida Cuba y Calle 34, Calidonia', country: 'Panamá', relationship_level: 'Alto', client_status: 'Negociación', activity_status: 'Activo', inactive_date: null, lost_reason: null, sales_representative: 'Carlos Vega', last_contact_date: '2026-02-28', next_followup_date: '2026-03-10', notes: 'Contrato anual en revisión. Volumen alto.' },
        { client_id: 3, client_type: 'Clínica', institution_name: 'Clínica Santa Fe', doctor_name: 'Dra. María Torres', specialty: 'Cardiología', phone: '+507-6445-7890', email: 'mtorres@clinicasf.com', city: 'David', zona: 'Zona Occidente', direccion: 'Avenida 3ra Este, Barrio Bolívar, David', country: 'Panamá', relationship_level: 'Medio', client_status: 'Propuesta', activity_status: 'Activo', inactive_date: null, lost_reason: null, sales_representative: 'Ana Castillo', last_contact_date: '2026-02-20', next_followup_date: '2026-03-05', notes: 'Interesados en línea cardiológica completa.' },
        { client_id: 4, client_type: 'Doctor', institution_name: null, doctor_name: 'Dr. Fernando Ríos', specialty: 'Endocrinología', phone: '+507-6512-3456', email: 'frios@gmail.com', city: 'Chitré', zona: 'Zona Central Interior', direccion: 'Calle Manuel María Icaza, Chitré Centro', country: 'Panamá', relationship_level: 'Bajo', client_status: 'Contactado', activity_status: 'Activo', inactive_date: null, lost_reason: null, sales_representative: 'Miguel López', last_contact_date: '2026-02-15', next_followup_date: '2026-03-01', notes: 'Primer contacto. Potencial de crecimiento medio.' },
        { client_id: 5, client_type: 'Farmacia', institution_name: 'Farmacia Central', doctor_name: null, specialty: 'General', phone: '+507-6100-0001', email: 'info@farmaciacentral.pa', city: 'Colón', zona: 'Zona Atlántico', direccion: 'Calle 11, Zona Libre de Colón, Edificio 24', country: 'Panamá', relationship_level: 'Medio', client_status: 'Cerrado', activity_status: 'Activo', inactive_date: null, lost_reason: null, sales_representative: 'Carlos Vega', last_contact_date: '2026-03-05', next_followup_date: '2026-03-20', notes: 'Pedidos recurrentes mensuales.' },
        { client_id: 6, client_type: 'Hospital', institution_name: 'Hospital Chiriquí', doctor_name: 'Dr. Pedro Sánchez', specialty: 'General', phone: '+507-6788-9012', email: 'psanchez@hospchiriqui.com', city: 'David', zona: 'Zona Occidente', direccion: 'Vía Interamericana, entrada de David, Chiriquí', country: 'Panamá', relationship_level: 'Alto', client_status: 'Cerrado', activity_status: 'Activo', inactive_date: null, lost_reason: null, sales_representative: 'Miguel López', last_contact_date: '2026-03-10', next_followup_date: '2026-04-01', notes: 'Contrato vigente. Compras regulares.' },
        { client_id: 7, client_type: 'Doctor', institution_name: null, doctor_name: 'Dra. Carmen Delgado', specialty: 'Dermatología', phone: '+507-6333-4455', email: 'cdelgado@dermacare.com', city: 'Ciudad de Panamá', zona: 'Zona Central', direccion: 'Calle 53 Marbella, PH Oceania Business Plaza, Piso 8', country: 'Panamá', relationship_level: 'Medio', client_status: 'Propuesta', activity_status: 'Activo', inactive_date: null, lost_reason: null, sales_representative: 'Ana Castillo', last_contact_date: '2026-02-25', next_followup_date: '2026-03-12', notes: 'Evaluando productos dermatológicos.' },
        { client_id: 8, client_type: 'Clínica', institution_name: 'Centro Médico Paitilla', doctor_name: null, specialty: 'Multi-especialidad', phone: '+507-6200-0000', email: 'compras@cmpaitilla.com', city: 'Ciudad de Panamá', zona: 'Zona Central', direccion: 'Avenida Balboa y Calle 53, Paitilla', country: 'Panamá', relationship_level: 'Alto', client_status: 'Negociación', activity_status: 'Activo', inactive_date: null, lost_reason: null, sales_representative: 'Carlos Vega', last_contact_date: '2026-03-08', next_followup_date: '2026-03-18', notes: 'Gran volumen potencial. Múltiples departamentos.' },
        { client_id: 9, client_type: 'Doctor', institution_name: null, doctor_name: 'Dr. Jorge Salas', specialty: 'Neurología', phone: '+507-6900-1122', email: 'jsalas@neurocare.pa', city: 'Ciudad de Panamá', zona: 'Zona Este', direccion: 'Vía España, Torre de las Américas, Piso 5', country: 'Panamá', relationship_level: 'Bajo', client_status: 'Potencial', activity_status: 'Activo', inactive_date: null, lost_reason: null, sales_representative: 'Miguel López', last_contact_date: '2026-01-20', next_followup_date: '2026-03-20', notes: 'Lead reciente. Necesita seguimiento.' },
        { client_id: 10, client_type: 'Hospital', institution_name: 'Hospital Santo Tomás', doctor_name: 'Dra. Elena Vargas', specialty: 'General', phone: '+507-6700-3344', email: 'evargas@hstomas.gob.pa', city: 'Ciudad de Panamá', zona: 'Zona Central', direccion: 'Avenida Balboa, Ancón, Ciudad de Panamá', country: 'Panamá', relationship_level: 'Alto', client_status: 'Cerrado', activity_status: 'Activo', inactive_date: null, lost_reason: null, sales_representative: 'Ana Castillo', last_contact_date: '2026-03-12', next_followup_date: '2026-04-01', notes: 'Hospital público de alto volumen.' },
        { client_id: 11, client_type: 'Doctor', institution_name: null, doctor_name: 'Dr. Alberto Pineda', specialty: 'Oncología', phone: '+507-6555-6677', email: 'apineda@oncomed.pa', city: 'Santiago', zona: 'Zona Central Interior', direccion: 'Avenida Central, Santiago de Veraguas', country: 'Panamá', relationship_level: 'Medio', client_status: 'Contactado', activity_status: 'Inactivo', inactive_date: '2026-01-15', lost_reason: null, sales_representative: null, last_contact_date: null, next_followup_date: null, notes: 'Sin respuesta desde enero. Evaluar re-contacto.' },
        { client_id: 12, client_type: 'Clínica', institution_name: 'Clínica Boyd', doctor_name: null, specialty: 'General', phone: '+507-6400-8899', email: 'admin@clinicaboyd.com', city: 'Ciudad de Panamá', zona: 'Zona Norte', direccion: 'Vía Simón Bolívar, Edificio 85, San Miguelito', country: 'Panamá', relationship_level: 'Bajo', client_status: 'Potencial', activity_status: 'Perdido', inactive_date: null, lost_reason: 'Precio', sales_representative: 'Carlos Vega', last_contact_date: '2025-12-01', next_followup_date: null, notes: 'Perdido por precio. Competidor ofreció 15% menos.' }
    ],

    // ========================================
    // DECISION MAKERS TABLE
    // ========================================
    decision_makers: [
        { decision_maker_id: 1, client_id: 2, name: 'Lic. Roberto Paz', role: 'Director de Compras', phone: '+507-6301-5555', email: 'rpaz@hosnac.gob.pa', influence_level: 'Alto', notes: 'Toma decisiones finales de compra.' },
        { decision_maker_id: 2, client_id: 2, name: 'Dra. Sofía Martínez', role: 'Directora de Farmacia', phone: '+507-6301-5556', email: 'smartinez@hosnac.gob.pa', influence_level: 'Alto', notes: 'Influye en formulario de medicamentos.' },
        { decision_maker_id: 3, client_id: 2, name: 'Dr. Luis Herrera', role: 'Director Médico', phone: '+507-6301-1234', email: 'lherrera@hosnac.gob.pa', influence_level: 'Medio', notes: 'Aprueba protocolo de tratamientos.' },
        { decision_maker_id: 4, client_id: 3, name: 'Laura Gómez', role: 'Gerente de Compras', phone: '+507-6445-1111', email: 'lgomez@clinicasf.com', influence_level: 'Alto', notes: 'Responsable directa de órdenes.' },
        { decision_maker_id: 5, client_id: 6, name: 'Ing. Marco Reyes', role: 'Director Administrativo', phone: '+507-6788-2222', email: 'mreyes@hospchiriqui.com', influence_level: 'Alto', notes: 'Aprueba presupuestos.' },
        { decision_maker_id: 6, client_id: 6, name: 'Dra. Ana Cornejo', role: 'Jefa de Farmacia', phone: '+507-6788-2223', email: 'acornejo@hospchiriqui.com', influence_level: 'Medio', notes: 'Gestiona inventario farmacéutico.' },
        { decision_maker_id: 7, client_id: 8, name: 'Diana Pardo', role: 'Directora de Operaciones', phone: '+507-6200-1111', email: 'dpardo@cmpaitilla.com', influence_level: 'Alto', notes: 'Coordinadora general de compras.' },
        { decision_maker_id: 8, client_id: 10, name: 'Dr. Manuel Ortega', role: 'Subdirector Médico', phone: '+507-6700-4444', email: 'mortega@hstomas.gob.pa', influence_level: 'Medio', notes: 'Participa en comités de compra.' }
    ],

    // ========================================
    // PRODUCTS TABLE
    // ========================================
    products: [
        { product_id: 1, medicine_name: 'Bevacizumab 400mg', category: 'Oncología', manufacturer: 'Roche', purchase_price: 850.00, unit_price: 1250.00, price_regulation_type: 'No Regulado', government_max_price: null, price_regulation_authority: null, price_regulation_reference: null, supplier: 'Roche Centroamérica', lead_time_days: 14, stock_status: 'En stock', strategic_product: 'Sí', product_priority: 'Alta', market_growth_potential: 'Alto', minimum_order: 5, storage_requirements: 'Refrigeración 2-8°C', regulatory_status: 'Aprobado', notes: 'Antiangiogénico. Alta demanda hospitalaria.' },
        { product_id: 2, medicine_name: 'Trastuzumab 440mg', category: 'Oncología', manufacturer: 'Roche', purchase_price: 1200.00, unit_price: 1800.00, price_regulation_type: 'No Regulado', government_max_price: null, price_regulation_authority: null, price_regulation_reference: null, supplier: 'Roche Centroamérica', lead_time_days: 14, stock_status: 'En stock', strategic_product: 'Sí', product_priority: 'Alta', market_growth_potential: 'Alto', minimum_order: 3, storage_requirements: 'Refrigeración 2-8°C', regulatory_status: 'Aprobado', notes: 'Tratamiento cáncer de mama HER2+.' },
        { product_id: 3, medicine_name: 'Atorvastatina 40mg', category: 'Cardiología', manufacturer: 'Pfizer', purchase_price: 2.50, unit_price: 6.80, price_regulation_type: 'Regulado', government_max_price: 7.50, price_regulation_authority: 'ACODECO', price_regulation_reference: 'Resolución 2024-001', supplier: 'Pfizer Panamá', lead_time_days: 7, stock_status: 'En stock', strategic_product: 'No', product_priority: 'Media', market_growth_potential: 'Medio', minimum_order: 50, storage_requirements: 'Temperatura ambiente', regulatory_status: 'Aprobado', notes: 'Estatina para colesterol. Volumen alto.' },
        { product_id: 4, medicine_name: 'Losartán 50mg', category: 'Cardiología', manufacturer: 'Novartis', purchase_price: 1.80, unit_price: 4.50, price_regulation_type: 'Regulado', government_max_price: 5.00, price_regulation_authority: 'ACODECO', price_regulation_reference: 'Resolución 2024-002', supplier: 'Novartis CA', lead_time_days: 7, stock_status: 'En stock', strategic_product: 'No', product_priority: 'Media', market_growth_potential: 'Medio', minimum_order: 100, storage_requirements: 'Temperatura ambiente', regulatory_status: 'Aprobado', notes: 'Antihipertensivo de primera línea.' },
        { product_id: 5, medicine_name: 'Metformina 850mg', category: 'Endocrinología', manufacturer: 'Merck', purchase_price: 1.20, unit_price: 3.50, price_regulation_type: 'Regulado', government_max_price: 4.00, price_regulation_authority: 'ACODECO', price_regulation_reference: 'Resolución 2024-003', supplier: 'Merck CA', lead_time_days: 5, stock_status: 'En stock', strategic_product: 'No', product_priority: 'Media', market_growth_potential: 'Medio', minimum_order: 100, storage_requirements: 'Temperatura ambiente', regulatory_status: 'Aprobado', notes: 'Antidiabético oral más prescrito.' },
        { product_id: 6, medicine_name: 'Pembrolizumab 100mg', category: 'Oncología', manufacturer: 'MSD', purchase_price: 2800.00, unit_price: 4200.00, price_regulation_type: 'No Regulado', government_max_price: null, price_regulation_authority: null, price_regulation_reference: null, supplier: 'MSD Panamá', lead_time_days: 21, stock_status: 'Bajo pedido', strategic_product: 'Sí', product_priority: 'Alta', market_growth_potential: 'Alto', minimum_order: 2, storage_requirements: 'Refrigeración 2-8°C', regulatory_status: 'Aprobado', notes: 'Inmunoterapia. Producto estrella.' },
        { product_id: 7, medicine_name: 'Adalimumab 40mg', category: 'Reumatología', manufacturer: 'AbbVie', purchase_price: 450.00, unit_price: 680.00, price_regulation_type: 'No Regulado', government_max_price: null, price_regulation_authority: null, price_regulation_reference: null, supplier: 'AbbVie LATAM', lead_time_days: 14, stock_status: 'En stock', strategic_product: 'Sí', product_priority: 'Alta', market_growth_potential: 'Alto', minimum_order: 5, storage_requirements: 'Refrigeración 2-8°C', regulatory_status: 'Aprobado', notes: 'Anti-TNF. Creciente por biosimilares.' },
        { product_id: 8, medicine_name: 'Insulina Glargina 100UI', category: 'Endocrinología', manufacturer: 'Sanofi', purchase_price: 18.00, unit_price: 35.00, price_regulation_type: 'Regulado', government_max_price: 38.00, price_regulation_authority: 'ACODECO', price_regulation_reference: 'Resolución 2024-004', supplier: 'Sanofi CA', lead_time_days: 10, stock_status: 'En stock', strategic_product: 'Sí', product_priority: 'Alta', market_growth_potential: 'Alto', minimum_order: 20, storage_requirements: 'Refrigeración 2-8°C', regulatory_status: 'Aprobado', notes: 'Insulina basal de acción prolongada.' },
        { product_id: 9, medicine_name: 'Omeprazol 20mg', category: 'Gastroenterología', manufacturer: 'AstraZeneca', purchase_price: 0.80, unit_price: 2.50, price_regulation_type: 'Regulado', government_max_price: 3.00, price_regulation_authority: 'ACODECO', price_regulation_reference: 'Resolución 2024-005', supplier: 'AstraZeneca CA', lead_time_days: 5, stock_status: 'En stock', strategic_product: 'No', product_priority: 'Baja', market_growth_potential: 'Bajo', minimum_order: 200, storage_requirements: 'Temperatura ambiente', regulatory_status: 'Aprobado', notes: 'Protector gástrico. Alto volumen, bajo margen.' },
        { product_id: 10, medicine_name: 'Rituximab 500mg', category: 'Oncología', manufacturer: 'Roche', purchase_price: 1100.00, unit_price: 1650.00, price_regulation_type: 'No Regulado', government_max_price: null, price_regulation_authority: null, price_regulation_reference: null, supplier: 'Roche Centroamérica', lead_time_days: 14, stock_status: 'Bajo stock', strategic_product: 'Sí', product_priority: 'Alta', market_growth_potential: 'Alto', minimum_order: 3, storage_requirements: 'Refrigeración 2-8°C', regulatory_status: 'Aprobado', notes: 'Anti-CD20 para linfomas y artritis.' }
    ],

    // ========================================
    // OPPORTUNITIES TABLE
    // ========================================
    opportunities: [
        { opportunity_id: 1, client_id: 1, product_id: 1, estimated_volume: 20, estimated_value: 25000.00, sales_stage: 'Cerrado Ganado', probability_close: 100, expected_close_date: '2026-01-15', sales_representative: 'Ana Castillo', notes: 'Contrato firmado para Q1 2026.' },
        { opportunity_id: 2, client_id: 2, product_id: 6, estimated_volume: 10, estimated_value: 42000.00, sales_stage: 'Negociación', probability_close: 75, expected_close_date: '2026-03-30', sales_representative: 'Carlos Vega', notes: 'Pendiente aprobación del comité de compras.' },
        { opportunity_id: 3, client_id: 3, product_id: 3, estimated_volume: 500, estimated_value: 3400.00, sales_stage: 'Propuesta', probability_close: 50, expected_close_date: '2026-04-15', sales_representative: 'Ana Castillo', notes: 'Cotización enviada. Esperando respuesta.' },
        { opportunity_id: 4, client_id: 3, product_id: 4, estimated_volume: 300, estimated_value: 1350.00, sales_stage: 'Propuesta', probability_close: 50, expected_close_date: '2026-04-15', sales_representative: 'Ana Castillo', notes: 'Incluida en la misma cotización.' },
        { opportunity_id: 5, client_id: 4, product_id: 5, estimated_volume: 200, estimated_value: 700.00, sales_stage: 'Contactado', probability_close: 25, expected_close_date: '2026-05-01', sales_representative: 'Miguel López', notes: 'Primera reunión realizada. Interés moderado.' },
        { opportunity_id: 6, client_id: 6, product_id: 2, estimated_volume: 15, estimated_value: 27000.00, sales_stage: 'Cerrado Ganado', probability_close: 100, expected_close_date: '2026-02-01', sales_representative: 'Miguel López', notes: 'Pedido entregado y facturado.' },
        { opportunity_id: 7, client_id: 6, product_id: 10, estimated_volume: 8, estimated_value: 13200.00, sales_stage: 'Cerrado Ganado', probability_close: 100, expected_close_date: '2026-02-15', sales_representative: 'Miguel López', notes: 'Compra trimestral confirmada.' },
        { opportunity_id: 8, client_id: 8, product_id: 1, estimated_volume: 30, estimated_value: 37500.00, sales_stage: 'Negociación', probability_close: 60, expected_close_date: '2026-04-01', sales_representative: 'Carlos Vega', notes: 'Gran potencial. Incluir descuento por volumen.' },
        { opportunity_id: 9, client_id: 8, product_id: 7, estimated_volume: 25, estimated_value: 17000.00, sales_stage: 'Negociación', probability_close: 65, expected_close_date: '2026-04-01', sales_representative: 'Carlos Vega', notes: 'Departamento de reumatología interesado.' },
        { opportunity_id: 10, client_id: 9, product_id: 6, estimated_volume: 5, estimated_value: 21000.00, sales_stage: 'Potencial', probability_close: 10, expected_close_date: '2026-06-01', sales_representative: 'Miguel López', notes: 'Lead muy temprano. Requiere seguimiento.' },
        { opportunity_id: 11, client_id: 10, product_id: 1, estimated_volume: 50, estimated_value: 62500.00, sales_stage: 'Cerrado Ganado', probability_close: 100, expected_close_date: '2026-01-20', sales_representative: 'Ana Castillo', notes: 'Contrato semestral. Alto volumen.' },
        { opportunity_id: 12, client_id: 10, product_id: 2, estimated_volume: 20, estimated_value: 36000.00, sales_stage: 'Cerrado Ganado', probability_close: 100, expected_close_date: '2026-01-20', sales_representative: 'Ana Castillo', notes: 'Mismo contrato semestral.' },
        { opportunity_id: 13, client_id: 7, product_id: 7, estimated_volume: 10, estimated_value: 6800.00, sales_stage: 'Propuesta', probability_close: 40, expected_close_date: '2026-04-20', sales_representative: 'Ana Castillo', notes: 'Evaluación de producto para uso dermatológico.' },
        { opportunity_id: 14, client_id: 5, product_id: 9, estimated_volume: 1000, estimated_value: 2500.00, sales_stage: 'Cerrado Ganado', probability_close: 100, expected_close_date: '2026-02-10', sales_representative: 'Carlos Vega', notes: 'Pedido mensual recurrente.' },
        { opportunity_id: 15, client_id: 12, product_id: 3, estimated_volume: 300, estimated_value: 2040.00, sales_stage: 'Cerrado Perdido', probability_close: 0, expected_close_date: '2025-12-15', sales_representative: 'Carlos Vega', notes: 'Perdido por precio. Competidor más barato.' }
    ],

    // ========================================
    // ORDERS TABLE
    // ========================================
    orders: [
        { order_id: 1, client_id: 1, order_date: '2026-01-20', sales_representative: 'Ana Castillo', total_order_value: 25000.00, payment_status: 'Pagado' },
        { order_id: 2, client_id: 6, order_date: '2026-02-05', sales_representative: 'Miguel López', total_order_value: 40200.00, payment_status: 'Pagado' },
        { order_id: 3, client_id: 10, order_date: '2026-01-25', sales_representative: 'Ana Castillo', total_order_value: 98500.00, payment_status: 'Parcial' },
        { order_id: 4, client_id: 5, order_date: '2026-02-12', sales_representative: 'Carlos Vega', total_order_value: 2500.00, payment_status: 'Pagado' },
        { order_id: 5, client_id: 1, order_date: '2026-02-20', sales_representative: 'Ana Castillo', total_order_value: 12500.00, payment_status: 'Pagado' },
        { order_id: 6, client_id: 6, order_date: '2026-03-01', sales_representative: 'Miguel López', total_order_value: 13200.00, payment_status: 'Pendiente' },
        { order_id: 7, client_id: 10, order_date: '2026-03-05', sales_representative: 'Ana Castillo', total_order_value: 37500.00, payment_status: 'Pendiente' },
        { order_id: 8, client_id: 5, order_date: '2026-03-10', sales_representative: 'Carlos Vega', total_order_value: 2500.00, payment_status: 'Pagado' }
    ],

    // ========================================
    // ORDER DETAILS TABLE
    // ========================================
    order_details: [
        { order_detail_id: 1, order_id: 1, product_id: 1, quantity: 20, unit_price: 1250.00 },
        { order_detail_id: 2, order_id: 2, product_id: 2, quantity: 15, unit_price: 1800.00 },
        { order_detail_id: 3, order_id: 2, product_id: 10, quantity: 8, unit_price: 1650.00 },
        { order_detail_id: 4, order_id: 3, product_id: 1, quantity: 50, unit_price: 1250.00 },
        { order_detail_id: 5, order_id: 3, product_id: 2, quantity: 20, unit_price: 1800.00 },
        { order_detail_id: 6, order_id: 4, product_id: 9, quantity: 1000, unit_price: 2.50 },
        { order_detail_id: 7, order_id: 5, product_id: 1, quantity: 10, unit_price: 1250.00 },
        { order_detail_id: 8, order_id: 6, product_id: 10, quantity: 8, unit_price: 1650.00 },
        { order_detail_id: 9, order_id: 7, product_id: 1, quantity: 30, unit_price: 1250.00 },
        { order_detail_id: 10, order_id: 8, product_id: 9, quantity: 1000, unit_price: 2.50 }
    ],

    // ========================================
    // INTERACTIONS TABLE
    // ========================================
    interactions: [
        { interaction_id: 1, client_id: 1, interaction_date: '2026-01-10', interaction_type: 'Visita', topic: 'Presentación línea oncológica', notes: 'Interesado en Bevacizumab.', next_action: 'Enviar cotización formal', followup_date: '2026-01-15', sales_representative: 'Ana Castillo' },
        { interaction_id: 2, client_id: 1, interaction_date: '2026-01-15', interaction_type: 'Email', topic: 'Envío de cotización', notes: 'Cotización enviada con descuento por volumen.', next_action: 'Confirmar recepción', followup_date: '2026-01-18', sales_representative: 'Ana Castillo' },
        { interaction_id: 3, client_id: 1, interaction_date: '2026-01-18', interaction_type: 'Llamada', topic: 'Seguimiento cotización', notes: 'Aceptó propuesta. Proceder con pedido.', next_action: 'Generar orden', followup_date: '2026-01-20', sales_representative: 'Ana Castillo' },
        { interaction_id: 4, client_id: 2, interaction_date: '2026-02-01', interaction_type: 'Reunión', topic: 'Revisión de contrato anual', notes: 'Reunión con equipo directivo.', next_action: 'Preparar nueva propuesta', followup_date: '2026-02-15', sales_representative: 'Carlos Vega' },
        { interaction_id: 5, client_id: 2, interaction_date: '2026-02-15', interaction_type: 'Visita', topic: 'Presentación nueva propuesta', notes: 'Propuesta con lineup ampliado.', next_action: 'Esperar decisión comité', followup_date: '2026-03-01', sales_representative: 'Carlos Vega' },
        { interaction_id: 6, client_id: 3, interaction_date: '2026-02-10', interaction_type: 'Visita', topic: 'Primera visita comercial', notes: 'Interés en Atorvastatina y Losartán.', next_action: 'Enviar cotización', followup_date: '2026-02-20', sales_representative: 'Ana Castillo' },
        { interaction_id: 7, client_id: 3, interaction_date: '2026-02-20', interaction_type: 'Email', topic: 'Cotización cardiológica', notes: 'Enviada cotización completa.', next_action: 'Llamada de seguimiento', followup_date: '2026-03-05', sales_representative: 'Ana Castillo' },
        { interaction_id: 8, client_id: 4, interaction_date: '2026-02-10', interaction_type: 'Llamada', topic: 'Primer contacto telefónico', notes: 'Interesado en Metformina.', next_action: 'Agendar visita', followup_date: '2026-02-25', sales_representative: 'Miguel López' },
        { interaction_id: 9, client_id: 4, interaction_date: '2026-02-25', interaction_type: 'Visita', topic: 'Visita presencial', notes: 'Interés moderado. Pide muestras.', next_action: 'Enviar muestras médicas', followup_date: '2026-03-10', sales_representative: 'Miguel López' },
        { interaction_id: 10, client_id: 6, interaction_date: '2026-01-20', interaction_type: 'Reunión', topic: 'Renovación contrato semestral', notes: 'Reunión con Director y Jefa de Farmacia.', next_action: 'Enviar contrato actualizado', followup_date: '2026-01-30', sales_representative: 'Miguel López' },
        { interaction_id: 11, client_id: 6, interaction_date: '2026-01-30', interaction_type: 'Email', topic: 'Contrato firmado', notes: 'Vigencia Feb-Jul 2026.', next_action: 'Primer despacho', followup_date: '2026-02-05', sales_representative: 'Miguel López' },
        { interaction_id: 12, client_id: 8, interaction_date: '2026-03-01', interaction_type: 'Visita', topic: 'Presentación a Centro Médico Paitilla', notes: 'Gran interés en oncología y reumatología.', next_action: 'Preparar propuesta integral', followup_date: '2026-03-10', sales_representative: 'Carlos Vega' },
        { interaction_id: 13, client_id: 8, interaction_date: '2026-03-10', interaction_type: 'Reunión', topic: 'Propuesta integral', notes: 'Negociando descuentos.', next_action: 'Esperar contrapropuesta', followup_date: '2026-03-20', sales_representative: 'Carlos Vega' },
        { interaction_id: 14, client_id: 9, interaction_date: '2026-01-15', interaction_type: 'Llamada', topic: 'Lead de referencia', notes: 'Referido por Dr. Mendoza.', next_action: 'Investigar necesidades', followup_date: '2026-02-01', sales_representative: 'Miguel López' },
        { interaction_id: 15, client_id: 10, interaction_date: '2026-01-10', interaction_type: 'Reunión', topic: 'Negociación contrato semestral', notes: 'Acordado contrato semestral.', next_action: 'Firmar contrato', followup_date: '2026-01-20', sales_representative: 'Ana Castillo' }
    ],

    // ========================================
    // PAYMENTS TABLE
    // ========================================
    payments: [
        { payment_id: 1, order_id: 1, invoice_number: 'INV-2026-001', amount: 25000.00, payment_date: '2026-02-15', payment_method: 'Transferencia', payment_status: 'Completo' },
        { payment_id: 2, order_id: 2, invoice_number: 'INV-2026-002', amount: 40200.00, payment_date: '2026-03-01', payment_method: 'Transferencia', payment_status: 'Completo' },
        { payment_id: 3, order_id: 3, invoice_number: 'INV-2026-003', amount: 50000.00, payment_date: '2026-02-25', payment_method: 'Transferencia', payment_status: 'Parcial' },
        { payment_id: 4, order_id: 4, invoice_number: 'INV-2026-004', amount: 2500.00, payment_date: '2026-02-28', payment_method: 'Cheque', payment_status: 'Completo' },
        { payment_id: 5, order_id: 5, invoice_number: 'INV-2026-005', amount: 12500.00, payment_date: '2026-03-10', payment_method: 'Transferencia', payment_status: 'Completo' },
        { payment_id: 6, order_id: 6, invoice_number: 'INV-2026-006', amount: 0.00, payment_date: '2026-03-01', payment_method: 'Transferencia', payment_status: 'Pendiente' },
        { payment_id: 7, order_id: 7, invoice_number: 'INV-2026-007', amount: 0.00, payment_date: '2026-03-05', payment_method: 'Transferencia', payment_status: 'Pendiente' },
        { payment_id: 8, order_id: 8, invoice_number: 'INV-2026-008', amount: 2500.00, payment_date: '2026-03-12', payment_method: 'Cheque', payment_status: 'Completo' }
    ]
};

// ========================================
// Table field definitions for column mapping
// ========================================
const TABLE_FIELDS = {
    clients: ['client_id', 'client_type', 'institution_name', 'doctor_name', 'specialty', 'phone', 'email', 'city', 'zona', 'direccion', 'country', 'relationship_level', 'client_status', 'activity_status', 'inactive_date', 'lost_reason', 'sales_representative', 'last_contact_date', 'next_followup_date', 'notes'],
    products: ['product_id', 'medicine_name', 'category', 'manufacturer', 'purchase_price', 'unit_price', 'price_regulation_type', 'government_max_price', 'price_regulation_authority', 'price_regulation_reference', 'supplier', 'lead_time_days', 'stock_status', 'strategic_product', 'product_priority', 'market_growth_potential', 'minimum_order', 'storage_requirements', 'regulatory_status', 'notes'],
    opportunities: ['opportunity_id', 'client_id', 'product_id', 'estimated_volume', 'estimated_value', 'sales_stage', 'probability_close', 'expected_close_date', 'sales_representative', 'notes'],
    orders: ['order_id', 'client_id', 'order_date', 'sales_representative', 'total_order_value', 'payment_status'],
    order_details: ['order_detail_id', 'order_id', 'product_id', 'quantity', 'unit_price'],
    interactions: ['interaction_id', 'client_id', 'interaction_date', 'interaction_type', 'topic', 'notes', 'next_action', 'followup_date', 'sales_representative'],
    payments: ['payment_id', 'order_id', 'invoice_number', 'amount', 'payment_date', 'payment_method', 'payment_status'],
    decision_makers: ['decision_maker_id', 'client_id', 'name', 'role', 'phone', 'email', 'influence_level', 'notes']
};
