-- ============================================================
-- PANAGRO CRM - CONSULTAS SQL PARA KPIs
-- Consultas de análisis para el Dashboard Comercial
-- ============================================================

-- ============================================================
-- KPI 1: INGRESOS MENSUALES (MRR)
-- ============================================================
SELECT 
    TO_CHAR(DATE_TRUNC('month', o.order_date), 'YYYY-MM') AS mes,
    COUNT(DISTINCT o.order_id) AS total_pedidos,
    COUNT(DISTINCT o.client_id) AS clientes_unicos,
    SUM(o.total_order_value) AS ingresos_totales,
    AVG(o.total_order_value) AS valor_promedio_pedido,
    LAG(SUM(o.total_order_value)) OVER (ORDER BY DATE_TRUNC('month', o.order_date)) AS ingresos_mes_anterior,
    CASE 
        WHEN LAG(SUM(o.total_order_value)) OVER (ORDER BY DATE_TRUNC('month', o.order_date)) > 0 
        THEN ((SUM(o.total_order_value) - LAG(SUM(o.total_order_value)) OVER (ORDER BY DATE_TRUNC('month', o.order_date))) 
              / LAG(SUM(o.total_order_value)) OVER (ORDER BY DATE_TRUNC('month', o.order_date))) * 100
        ELSE NULL
    END AS crecimiento_pct
FROM orders o
GROUP BY DATE_TRUNC('month', o.order_date)
ORDER BY mes DESC;


-- ============================================================
-- KPI 2: INGRESOS POR PRODUCTO (Top 10)
-- ============================================================
SELECT 
    p.medicine_name AS medicamento,
    p.category AS categoria,
    p.price_regulation_type AS tipo_regulacion,
    SUM(od.quantity) AS unidades_vendidas,
    SUM(od.total_price) AS ingresos_totales,
    AVG(od.unit_price - p.purchase_price) AS margen_promedio_unidad,
    ROUND(
        CASE WHEN SUM(od.total_price) > 0 
             THEN (SUM(od.quantity * (od.unit_price - p.purchase_price)) / SUM(od.total_price)) * 100
             ELSE 0 
        END, 2
    ) AS margen_pct
FROM order_details od
JOIN products p ON od.product_id = p.product_id
GROUP BY p.medicine_name, p.category, p.price_regulation_type
ORDER BY ingresos_totales DESC
LIMIT 10;


-- ============================================================
-- KPI 3: INGRESOS POR CLIENTE (Top 10)
-- ============================================================
SELECT 
    COALESCE(c.institution_name, c.doctor_name) AS cliente,
    c.client_type AS tipo,
    c.city AS ciudad,
    c.relationship_level AS nivel_relacion,
    COUNT(DISTINCT o.order_id) AS total_pedidos,
    SUM(o.total_order_value) AS ingresos_totales,
    AVG(o.total_order_value) AS valor_promedio,
    MAX(o.order_date) AS ultimo_pedido,
    -- Customer Lifetime Value (simplificado)
    SUM(o.total_order_value) / GREATEST(
        EXTRACT(MONTH FROM AGE(MAX(o.order_date), MIN(o.order_date))), 1
    ) AS ingreso_mensual_promedio
FROM clients c
JOIN orders o ON c.client_id = o.client_id
GROUP BY c.client_id, c.institution_name, c.doctor_name, c.client_type, c.city, c.relationship_level
ORDER BY ingresos_totales DESC
LIMIT 10;


-- ============================================================
-- KPI 4: VENTAS POR REPRESENTANTE
-- ============================================================
SELECT 
    o.sales_representative AS representante,
    COUNT(DISTINCT o.order_id) AS total_pedidos,
    COUNT(DISTINCT o.client_id) AS clientes_atendidos,
    SUM(o.total_order_value) AS ingresos_totales,
    AVG(o.total_order_value) AS valor_promedio_pedido,
    -- Oportunidades abiertas del representante
    (SELECT COUNT(*) FROM opportunities op 
     WHERE op.sales_representative = o.sales_representative 
     AND op.sales_stage NOT IN ('Cerrado Ganado', 'Cerrado Perdido')) AS oportunidades_abiertas,
    -- Tasa de conversión del representante
    (SELECT ROUND(
        CASE WHEN COUNT(*) > 0 
             THEN (SUM(CASE WHEN op.sales_stage = 'Cerrado Ganado' THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100 
             ELSE 0 
        END, 2) 
     FROM opportunities op 
     WHERE op.sales_representative = o.sales_representative) AS tasa_conversion_pct
FROM orders o
GROUP BY o.sales_representative
ORDER BY ingresos_totales DESC;


-- ============================================================
-- KPI 5: VALOR TOTAL DEL PIPELINE
-- ============================================================
SELECT 
    sales_stage AS etapa,
    COUNT(*) AS oportunidades,
    SUM(estimated_value) AS valor_total,
    AVG(probability_close) AS probabilidad_promedio,
    SUM(estimated_value * (probability_close / 100)) AS valor_ponderado
FROM opportunities
WHERE sales_stage NOT IN ('Cerrado Ganado', 'Cerrado Perdido')
GROUP BY sales_stage
ORDER BY 
    CASE sales_stage
        WHEN 'Potencial' THEN 1
        WHEN 'Contactado' THEN 2
        WHEN 'Propuesta' THEN 3
        WHEN 'Negociación' THEN 4
    END;

-- Pipeline total
SELECT 
    SUM(estimated_value) AS pipeline_total,
    SUM(estimated_value * (probability_close / 100)) AS pipeline_ponderado
FROM opportunities
WHERE sales_stage NOT IN ('Cerrado Ganado', 'Cerrado Perdido');


-- ============================================================
-- KPI 6: TASA DE CONVERSIÓN
-- ============================================================
SELECT 
    COUNT(*) AS total_oportunidades,
    SUM(CASE WHEN sales_stage = 'Cerrado Ganado' THEN 1 ELSE 0 END) AS ganadas,
    SUM(CASE WHEN sales_stage = 'Cerrado Perdido' THEN 1 ELSE 0 END) AS perdidas,
    SUM(CASE WHEN sales_stage NOT IN ('Cerrado Ganado', 'Cerrado Perdido') THEN 1 ELSE 0 END) AS abiertas,
    ROUND(
        (SUM(CASE WHEN sales_stage = 'Cerrado Ganado' THEN 1 ELSE 0 END)::DECIMAL / 
         NULLIF(SUM(CASE WHEN sales_stage IN ('Cerrado Ganado', 'Cerrado Perdido') THEN 1 ELSE 0 END), 0)) * 100
    , 2) AS tasa_conversion_pct,
    -- Valor promedio de oportunidad ganada
    AVG(CASE WHEN sales_stage = 'Cerrado Ganado' THEN estimated_value END) AS valor_promedio_ganada,
    -- Valor promedio de oportunidad perdida
    AVG(CASE WHEN sales_stage = 'Cerrado Perdido' THEN estimated_value END) AS valor_promedio_perdida
FROM opportunities;


-- ============================================================
-- KPI 7: CLIENTES ACTIVOS / INACTIVOS / PERDIDOS
-- ============================================================
SELECT 
    activity_status AS estado,
    COUNT(*) AS cantidad,
    ROUND((COUNT(*)::DECIMAL / (SELECT COUNT(*) FROM clients)) * 100, 2) AS porcentaje
FROM clients
GROUP BY activity_status
ORDER BY cantidad DESC;

-- Tasa de churn
SELECT 
    ROUND(
        (COUNT(CASE WHEN activity_status = 'Perdido' THEN 1 END)::DECIMAL / 
         NULLIF(COUNT(*), 0)) * 100
    , 2) AS tasa_churn_pct,
    COUNT(CASE WHEN activity_status = 'Perdido' THEN 1 END) AS clientes_perdidos,
    COUNT(*) AS total_clientes
FROM clients;

-- Razones de pérdida
SELECT 
    lost_reason AS razon_perdida,
    COUNT(*) AS cantidad,
    ROUND((COUNT(*)::DECIMAL / NULLIF((SELECT COUNT(*) FROM clients WHERE activity_status = 'Perdido'), 0)) * 100, 2) AS porcentaje
FROM clients
WHERE activity_status = 'Perdido' AND lost_reason IS NOT NULL
GROUP BY lost_reason
ORDER BY cantidad DESC;


-- ============================================================
-- KPI 8: CUSTOMER LIFETIME VALUE (CLV)
-- ============================================================
SELECT 
    c.client_id,
    COALESCE(c.institution_name, c.doctor_name) AS cliente,
    c.client_type AS tipo,
    COUNT(DISTINCT o.order_id) AS total_pedidos,
    SUM(o.total_order_value) AS ingresos_totales,
    MIN(o.order_date) AS primer_pedido,
    MAX(o.order_date) AS ultimo_pedido,
    -- Meses activo
    GREATEST(EXTRACT(MONTH FROM AGE(MAX(o.order_date), MIN(o.order_date))), 1) AS meses_activo,
    -- Ingreso mensual promedio
    ROUND(SUM(o.total_order_value) / GREATEST(EXTRACT(MONTH FROM AGE(MAX(o.order_date), MIN(o.order_date))), 1), 2) AS ingreso_mensual,
    -- CLV proyectado a 12 meses
    ROUND((SUM(o.total_order_value) / GREATEST(EXTRACT(MONTH FROM AGE(MAX(o.order_date), MIN(o.order_date))), 1)) * 12, 2) AS clv_anual_estimado
FROM clients c
JOIN orders o ON c.client_id = o.client_id
GROUP BY c.client_id, c.institution_name, c.doctor_name, c.client_type
ORDER BY clv_anual_estimado DESC;


-- ============================================================
-- KPI 9: MEDICAMENTOS MÁS VENDIDOS
-- ============================================================
SELECT 
    p.medicine_name AS medicamento,
    p.category AS categoria,
    SUM(od.quantity) AS unidades_vendidas,
    SUM(od.total_price) AS ingresos_generados,
    COUNT(DISTINCT od.order_id) AS pedidos_con_producto,
    COUNT(DISTINCT o.client_id) AS clientes_compradores,
    DENSE_RANK() OVER (ORDER BY SUM(od.total_price) DESC) AS ranking_ingresos,
    DENSE_RANK() OVER (ORDER BY SUM(od.quantity) DESC) AS ranking_volumen
FROM order_details od
JOIN products p ON od.product_id = p.product_id
JOIN orders o ON od.order_id = o.order_id
GROUP BY p.product_id, p.medicine_name, p.category
ORDER BY ingresos_generados DESC;


-- ============================================================
-- KPI 10: REGULADOS vs NO REGULADOS
-- ============================================================
SELECT 
    p.price_regulation_type AS tipo_regulacion,
    COUNT(DISTINCT p.product_id) AS num_productos,
    SUM(od.quantity) AS unidades_vendidas,
    SUM(od.total_price) AS ingresos_totales,
    ROUND(AVG((od.unit_price - p.purchase_price) / NULLIF(od.unit_price, 0) * 100), 2) AS margen_promedio_pct,
    -- Verificación de precio máximo (solo regulados)
    SUM(CASE WHEN p.price_regulation_type = 'Regulado' AND od.unit_price > p.government_max_price THEN 1 ELSE 0 END) AS violaciones_precio_maximo
FROM order_details od
JOIN products p ON od.product_id = p.product_id
GROUP BY p.price_regulation_type;


-- ============================================================
-- KPI 11: MARGEN POR CLIENTE
-- ============================================================
SELECT 
    COALESCE(c.institution_name, c.doctor_name) AS cliente,
    c.client_type AS tipo,
    SUM(od.quantity * (od.unit_price - p.purchase_price)) AS margen_bruto_total,
    SUM(od.total_price) AS ingresos_totales,
    ROUND(
        CASE WHEN SUM(od.total_price) > 0 
             THEN (SUM(od.quantity * (od.unit_price - p.purchase_price)) / SUM(od.total_price)) * 100 
             ELSE 0 
        END, 2
    ) AS margen_pct
FROM clients c
JOIN orders o ON c.client_id = o.client_id
JOIN order_details od ON o.order_id = od.order_id
JOIN products p ON od.product_id = p.product_id
GROUP BY c.client_id, c.institution_name, c.doctor_name, c.client_type
ORDER BY margen_bruto_total DESC;


-- ============================================================
-- KPI 12: DISPONIBILIDAD DE MEDICAMENTOS
-- ============================================================
SELECT 
    stock_status AS estado_stock,
    COUNT(*) AS cantidad_productos,
    ROUND((COUNT(*)::DECIMAL / (SELECT COUNT(*) FROM products)) * 100, 2) AS porcentaje,
    STRING_AGG(medicine_name, ', ') AS productos
FROM products
GROUP BY stock_status
ORDER BY cantidad_productos DESC;


-- ============================================================
-- KPI 13: VENTAS DE PRODUCTOS ESTRATÉGICOS
-- ============================================================
SELECT 
    p.medicine_name AS medicamento,
    p.category AS categoria,
    p.product_priority AS prioridad,
    p.market_growth_potential AS potencial_crecimiento,
    COALESCE(SUM(od.quantity), 0) AS unidades_vendidas,
    COALESCE(SUM(od.total_price), 0) AS ingresos,
    ROUND(
        CASE WHEN SUM(od.total_price) > 0 
             THEN (SUM(od.quantity * (od.unit_price - p.purchase_price)) / SUM(od.total_price)) * 100 
             ELSE 0 
        END, 2
    ) AS margen_pct
FROM products p
LEFT JOIN order_details od ON p.product_id = od.product_id
WHERE p.strategic_product = 'Sí'
GROUP BY p.product_id, p.medicine_name, p.category, p.product_priority, p.market_growth_potential
ORDER BY ingresos DESC;


-- ============================================================
-- KPI 14: TIEMPO PROMEDIO DE ENTREGA (Lead Time)
-- ============================================================
SELECT 
    p.category AS categoria,
    AVG(p.lead_time_days) AS lead_time_promedio_dias,
    MIN(p.lead_time_days) AS lead_time_minimo,
    MAX(p.lead_time_days) AS lead_time_maximo
FROM products p
GROUP BY p.category
ORDER BY lead_time_promedio_dias DESC;


-- ============================================================
-- KPI 15: ALERTAS DE SEGUIMIENTO PENDIENTES
-- (Clientes que necesitan atención)
-- ============================================================
SELECT 
    COALESCE(c.institution_name, c.doctor_name) AS cliente,
    c.client_type AS tipo,
    c.client_status AS estado_funnel,
    c.next_followup_date AS proxima_fecha_seguimiento,
    c.sales_representative AS representante,
    CURRENT_DATE - c.next_followup_date AS dias_vencido,
    CASE 
        WHEN c.next_followup_date < CURRENT_DATE THEN 'VENCIDO'
        WHEN c.next_followup_date = CURRENT_DATE THEN 'HOY'
        WHEN c.next_followup_date <= CURRENT_DATE + INTERVAL '3 days' THEN 'PRÓXIMO'
        ELSE 'OK'
    END AS urgencia
FROM clients c
WHERE c.activity_status = 'Activo'
  AND c.next_followup_date IS NOT NULL
ORDER BY c.next_followup_date ASC;
