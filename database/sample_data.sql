-- ============================================================
-- PANAGRO CRM - DATOS DE EJEMPLO
-- Inserciones de ejemplo para todas las tablas
-- ============================================================

-- ============================================================
-- CLIENTES
-- ============================================================
INSERT INTO clients (client_type, institution_name, doctor_name, specialty, phone, email, city, zona, direccion, country, relationship_level, client_status, activity_status, inactive_date, lost_reason, sales_representative, last_contact_date, next_followup_date, notes)
VALUES
('Doctor', NULL, 'Dr. Ricardo Mendoza', 'Oncología', '+507-6234-5678', 'rmendoza@medpan.com', 'Ciudad de Panamá', 'Zona Central', 'Calle 50, Torre Global Bank, Piso 12, Bella Vista', 'Panamá', 'Alto', 'Cerrado', 'Activo', NULL, NULL, 'Ana Castillo', '2026-03-01', '2026-03-15', 'Cliente clave. Prescriptor de alto volumen en oncología.'),
('Hospital', 'Hospital Nacional', 'Dr. Luis Herrera', 'General', '+507-6301-1234', 'lherrera@hosnac.gob.pa', 'Ciudad de Panamá', 'Zona Central', 'Avenida Cuba y Calle 34, Calidonia', 'Panamá', 'Alto', 'Negociación', 'Activo', NULL, NULL, 'Carlos Vega', '2026-02-28', '2026-03-10', 'Contrato anual en revisión. Volumen alto.'),
('Clínica', 'Clínica Santa Fe', 'Dra. María Torres', 'Cardiología', '+507-6445-7890', 'mtorres@clinicasf.com', 'David', 'Zona Occidente', 'Avenida 3ra Este, Barrio Bolívar, David', 'Panamá', 'Medio', 'Propuesta', 'Activo', NULL, NULL, 'Ana Castillo', '2026-02-20', '2026-03-05', 'Interesados en línea cardiológica completa.'),
('Doctor', NULL, 'Dr. Fernando Ríos', 'Endocrinología', '+507-6512-3456', 'frios@gmail.com', 'Chitré', 'Zona Central Interior', 'Calle Manuel María Icaza, Chitré Centro', 'Panamá', 'Bajo', 'Contactado', 'Activo', NULL, NULL, 'Miguel López', '2026-02-15', '2026-03-01', 'Primer contacto. Potencial de crecimiento medio.'),
('Farmacia', 'Farmacia Central', NULL, 'General', '+507-6100-0001', 'info@farmaciacentral.pa', 'Colón', 'Zona Atlántico', 'Calle 11, Zona Libre de Colón, Edificio 24', 'Panamá', 'Medio', 'Cerrado', 'Activo', NULL, NULL, 'Carlos Vega', '2026-03-05', '2026-03-20', 'Pedidos recurrentes mensuales.'),
('Hospital', 'Hospital Chiriquí', 'Dr. Pedro Sánchez', 'General', '+507-6788-9012', 'psanchez@hospchiriqui.com', 'David', 'Zona Occidente', 'Vía Interamericana, entrada de David, Chiriquí', 'Panamá', 'Alto', 'Cerrado', 'Activo', NULL, NULL, 'Miguel López', '2026-03-10', '2026-04-01', 'Contrato vigente. Compras regulares.'),
('Doctor', NULL, 'Dra. Carmen Delgado', 'Dermatología', '+507-6333-4455', 'cdelgado@dermacare.com', 'Ciudad de Panamá', 'Zona Central', 'Calle 53 Marbella, PH Oceania Business Plaza, Piso 8', 'Panamá', 'Medio', 'Propuesta', 'Activo', NULL, NULL, 'Ana Castillo', '2026-02-25', '2026-03-12', 'Evaluando productos dermatológicos.'),
('Clínica', 'Centro Médico Paitilla', NULL, 'Multi-especialidad', '+507-6200-0000', 'compras@cmpaitilla.com', 'Ciudad de Panamá', 'Zona Central', 'Avenida Balboa y Calle 53, Paitilla', 'Panamá', 'Alto', 'Negociación', 'Activo', NULL, NULL, 'Carlos Vega', '2026-03-08', '2026-03-18', 'Gran volumen potencial. Múltiples departamentos.'),
('Doctor', NULL, 'Dr. Jorge Salas', 'Neurología', '+507-6900-1122', 'jsalas@neurocare.pa', 'Ciudad de Panamá', 'Zona Este', 'Vía España, Torre de las Américas, Piso 5', 'Panamá', 'Bajo', 'Potencial', 'Activo', NULL, NULL, 'Miguel López', '2026-01-20', '2026-03-20', 'Lead reciente. Necesita seguimiento.'),
('Hospital', 'Hospital Santo Tomás', 'Dra. Elena Vargas', 'General', '+507-6700-3344', 'evargas@hstomas.gob.pa', 'Ciudad de Panamá', 'Zona Central', 'Avenida Balboa, Ancón, Ciudad de Panamá', 'Panamá', 'Alto', 'Cerrado', 'Activo', NULL, NULL, 'Ana Castillo', '2026-03-12', '2026-04-01', 'Hospital público de alto volumen.'),
('Doctor', NULL, 'Dr. Alberto Pineda', 'Oncología', '+507-6555-6677', 'apineda@oncomed.pa', 'Santiago', 'Zona Central Interior', 'Avenida Central, Santiago de Veraguas', 'Panamá', 'Medio', 'Contactado', 'Inactivo', '2026-01-15', NULL, NULL, NULL, NULL, 'Sin respuesta desde enero. Evaluar re-contacto.'),
('Clínica', 'Clínica Boyd', NULL, 'General', '+507-6400-8899', 'admin@clinicaboyd.com', 'Ciudad de Panamá', 'Zona Norte', 'Vía Simón Bolívar, Edificio 85, San Miguelito', 'Panamá', 'Bajo', 'Potencial', 'Perdido', NULL, 'Precio', 'Carlos Vega', '2025-12-01', NULL, 'Perdido por precio. Competidor ofreció 15% menos.');

-- ============================================================
-- TOMADORES DE DECISIÓN
-- ============================================================
INSERT INTO decision_makers (client_id, name, role, phone, email, influence_level, notes)
VALUES
(2, 'Lic. Roberto Paz', 'Director de Compras', '+507-6301-5555', 'rpaz@hosnac.gob.pa', 'Alto', 'Toma decisiones finales de compra.'),
(2, 'Dra. Sofía Martínez', 'Directora de Farmacia', '+507-6301-5556', 'smartinez@hosnac.gob.pa', 'Alto', 'Influye en formulario de medicamentos.'),
(2, 'Dr. Luis Herrera', 'Director Médico', '+507-6301-1234', 'lherrera@hosnac.gob.pa', 'Medio', 'Aprueba protocolo de tratamientos.'),
(3, 'Laura Gómez', 'Gerente de Compras', '+507-6445-1111', 'lgomez@clinicasf.com', 'Alto', 'Responsable directa de órdenes.'),
(6, 'Ing. Marco Reyes', 'Director Administrativo', '+507-6788-2222', 'mreyes@hospchiriqui.com', 'Alto', 'Aprueba presupuestos.'),
(6, 'Dra. Ana Cornejo', 'Jefa de Farmacia', '+507-6788-2223', 'acornejo@hospchiriqui.com', 'Medio', 'Gestiona inventario farmacéutico.'),
(8, 'Diana Pardo', 'Directora de Operaciones', '+507-6200-1111', 'dpardo@cmpaitilla.com', 'Alto', 'Coordinadora general de compras.'),
(10, 'Dr. Manuel Ortega', 'Subdirector Médico', '+507-6700-4444', 'mortega@hstomas.gob.pa', 'Medio', 'Participa en comités de compra.');

-- ============================================================
-- PRODUCTOS
-- ============================================================
INSERT INTO products (medicine_name, category, manufacturer, purchase_price, unit_price, price_regulation_type, government_max_price, price_regulation_authority, price_regulation_reference, supplier, lead_time_days, stock_status, strategic_product, product_priority, market_growth_potential, minimum_order, storage_requirements, regulatory_status, notes)
VALUES
('Bevacizumab 400mg', 'Oncología', 'Roche', 850.00, 1250.00, 'No Regulado', NULL, NULL, NULL, 'Roche Centroamérica', 14, 'En stock', 'Sí', 'Alta', 'Alto', 5, 'Refrigeración 2-8°C', 'Aprobado', 'Antiangiogénico. Alta demanda hospitalaria.'),
('Trastuzumab 440mg', 'Oncología', 'Roche', 1200.00, 1800.00, 'No Regulado', NULL, NULL, NULL, 'Roche Centroamérica', 14, 'En stock', 'Sí', 'Alta', 'Alto', 3, 'Refrigeración 2-8°C', 'Aprobado', 'Tratamiento cáncer de mama HER2+.'),
('Atorvastatina 40mg', 'Cardiología', 'Pfizer', 2.50, 6.80, 'Regulado', 7.50, 'ACODECO', 'Resolución 2024-001', 'Pfizer Panamá', 7, 'En stock', 'No', 'Media', 'Medio', 50, 'Temperatura ambiente', 'Aprobado', 'Estatina para colesterol. Volumen alto.'),
('Losartán 50mg', 'Cardiología', 'Novartis', 1.80, 4.50, 'Regulado', 5.00, 'ACODECO', 'Resolución 2024-002', 'Novartis CA', 7, 'En stock', 'No', 'Media', 'Medio', 100, 'Temperatura ambiente', 'Aprobado', 'Antihipertensivo de primera línea.'),
('Metformina 850mg', 'Endocrinología', 'Merck', 1.20, 3.50, 'Regulado', 4.00, 'ACODECO', 'Resolución 2024-003', 'Merck CA', 5, 'En stock', 'No', 'Media', 'Medio', 100, 'Temperatura ambiente', 'Aprobado', 'Antidiabético oral más prescrito.'),
('Pembrolizumab 100mg', 'Oncología', 'MSD', 2800.00, 4200.00, 'No Regulado', NULL, NULL, NULL, 'MSD Panamá', 21, 'Bajo pedido', 'Sí', 'Alta', 'Alto', 2, 'Refrigeración 2-8°C', 'Aprobado', 'Inmunoterapia. Producto estrella.'),
('Adalimumab 40mg', 'Reumatología', 'AbbVie', 450.00, 680.00, 'No Regulado', NULL, NULL, NULL, 'AbbVie LATAM', 14, 'En stock', 'Sí', 'Alta', 'Alto', 5, 'Refrigeración 2-8°C', 'Aprobado', 'Anti-TNF. Creciente por biosimilares.'),
('Insulina Glargina 100UI', 'Endocrinología', 'Sanofi', 18.00, 35.00, 'Regulado', 38.00, 'ACODECO', 'Resolución 2024-004', 'Sanofi CA', 10, 'En stock', 'Sí', 'Alta', 'Alto', 20, 'Refrigeración 2-8°C', 'Aprobado', 'Insulina basal de acción prolongada.'),
('Omeprazol 20mg', 'Gastroenterología', 'AstraZeneca', 0.80, 2.50, 'Regulado', 3.00, 'ACODECO', 'Resolución 2024-005', 'AstraZeneca CA', 5, 'En stock', 'No', 'Baja', 'Bajo', 200, 'Temperatura ambiente', 'Aprobado', 'Protector gástrico. Alto volumen, bajo margen.'),
('Rituximab 500mg', 'Oncología', 'Roche', 1100.00, 1650.00, 'No Regulado', NULL, NULL, NULL, 'Roche Centroamérica', 14, 'Bajo stock', 'Sí', 'Alta', 'Alto', 3, 'Refrigeración 2-8°C', 'Aprobado', 'Anti-CD20 para linfomas y artritis.');

-- ============================================================
-- OPORTUNIDADES (PIPELINE)
-- ============================================================
INSERT INTO opportunities (client_id, product_id, estimated_volume, estimated_value, sales_stage, probability_close, expected_close_date, sales_representative, notes)
VALUES
(1, 1, 20, 25000.00, 'Cerrado Ganado', 100, '2026-01-15', 'Ana Castillo', 'Contrato firmado para Q1 2026.'),
(2, 6, 10, 42000.00, 'Negociación', 75, '2026-03-30', 'Carlos Vega', 'Pendiente aprobación del comité de compras.'),
(3, 3, 500, 3400.00, 'Propuesta', 50, '2026-04-15', 'Ana Castillo', 'Cotización enviada. Esperando respuesta.'),
(3, 4, 300, 1350.00, 'Propuesta', 50, '2026-04-15', 'Ana Castillo', 'Incluida en la misma cotización.'),
(4, 5, 200, 700.00, 'Contactado', 25, '2026-05-01', 'Miguel López', 'Primera reunión realizada. Interés moderado.'),
(6, 2, 15, 27000.00, 'Cerrado Ganado', 100, '2026-02-01', 'Miguel López', 'Pedido entregado y facturado.'),
(6, 10, 8, 13200.00, 'Cerrado Ganado', 100, '2026-02-15', 'Miguel López', 'Compra trimestral confirmada.'),
(8, 1, 30, 37500.00, 'Negociación', 60, '2026-04-01', 'Carlos Vega', 'Gran potencial. Incluir descuento por volumen.'),
(8, 7, 25, 17000.00, 'Negociación', 65, '2026-04-01', 'Carlos Vega', 'Departamento de reumatología interesado.'),
(9, 6, 5, 21000.00, 'Potencial', 10, '2026-06-01', 'Miguel López', 'Lead muy temprano. Requiere seguimiento.'),
(10, 1, 50, 62500.00, 'Cerrado Ganado', 100, '2026-01-20', 'Ana Castillo', 'Contrato semestral. Alto volumen.'),
(10, 2, 20, 36000.00, 'Cerrado Ganado', 100, '2026-01-20', 'Ana Castillo', 'Mismo contrato semestral.'),
(7, 7, 10, 6800.00, 'Propuesta', 40, '2026-04-20', 'Ana Castillo', 'Evaluación de producto para uso dermatológico.'),
(5, 9, 1000, 2500.00, 'Cerrado Ganado', 100, '2026-02-10', 'Carlos Vega', 'Pedido mensual recurrente.'),
(12, 3, 300, 2040.00, 'Cerrado Perdido', 0, '2025-12-15', 'Carlos Vega', 'Perdido por precio. Competidor más barato.');

-- ============================================================
-- PEDIDOS
-- ============================================================
INSERT INTO orders (client_id, order_date, sales_representative, total_order_value, payment_status)
VALUES
(1, '2026-01-20', 'Ana Castillo', 25000.00, 'Pagado'),
(6, '2026-02-05', 'Miguel López', 40200.00, 'Pagado'),
(10, '2026-01-25', 'Ana Castillo', 98500.00, 'Parcial'),
(5, '2026-02-12', 'Carlos Vega', 2500.00, 'Pagado'),
(1, '2026-02-20', 'Ana Castillo', 12500.00, 'Pagado'),
(6, '2026-03-01', 'Miguel López', 13200.00, 'Pendiente'),
(10, '2026-03-05', 'Ana Castillo', 37500.00, 'Pendiente'),
(5, '2026-03-10', 'Carlos Vega', 2500.00, 'Pagado');

-- ============================================================
-- DETALLE DE PEDIDOS
-- ============================================================
INSERT INTO order_details (order_id, product_id, quantity, unit_price)
VALUES
-- Pedido 1: Dr. Mendoza - Bevacizumab
(1, 1, 20, 1250.00),
-- Pedido 2: Hospital Chiriquí - Trastuzumab + Rituximab
(2, 2, 15, 1800.00),
(2, 10, 8, 1650.00),
-- Pedido 3: Hospital Santo Tomás - Bevacizumab + Trastuzumab
(3, 1, 50, 1250.00),
(3, 2, 20, 1800.00),
-- Pedido 4: Farmacia Central - Omeprazol
(4, 9, 1000, 2.50),
-- Pedido 5: Dr. Mendoza - Bevacizumab (recompra)
(5, 1, 10, 1250.00),
-- Pedido 6: Hospital Chiriquí - Rituximab
(6, 10, 8, 1650.00),
-- Pedido 7: Hospital Santo Tomás - Bevacizumab
(7, 1, 30, 1250.00),
-- Pedido 8: Farmacia Central - Omeprazol
(8, 9, 1000, 2.50);

-- ============================================================
-- INTERACCIONES
-- ============================================================
INSERT INTO interactions (client_id, interaction_date, interaction_type, topic, notes, next_action, followup_date, sales_representative)
VALUES
(1, '2026-01-10', 'Visita', 'Presentación línea oncológica', 'Interesado en Bevacizumab. Mostró necesidad de volumen estable.', 'Enviar cotización formal', '2026-01-15', 'Ana Castillo'),
(1, '2026-01-15', 'Email', 'Envío de cotización', 'Cotización enviada por correo con descuento por volumen.', 'Confirmar recepción', '2026-01-18', 'Ana Castillo'),
(1, '2026-01-18', 'Llamada', 'Seguimiento cotización', 'Aceptó propuesta. Proceder con pedido.', 'Generar orden', '2026-01-20', 'Ana Castillo'),
(2, '2026-02-01', 'Reunión', 'Revisión de contrato anual', 'Reunión con equipo directivo. Revisando términos 2026.', 'Preparar nueva propuesta', '2026-02-15', 'Carlos Vega'),
(2, '2026-02-15', 'Visita', 'Presentación nueva propuesta', 'Propuesta presentada con lineup ampliado de oncológicos.', 'Esperar decisión comité', '2026-03-01', 'Carlos Vega'),
(3, '2026-02-10', 'Visita', 'Primera visita comercial', 'Se presentó portfolio cardiológico. Interés en Atorvastatina y Losartán.', 'Enviar cotización', '2026-02-20', 'Ana Castillo'),
(3, '2026-02-20', 'Email', 'Cotización cardiológica', 'Enviada cotización por 500 uds Atorvastatina + 300 uds Losartán.', 'Llamada de seguimiento', '2026-03-05', 'Ana Castillo'),
(4, '2026-02-10', 'Llamada', 'Primer contacto telefónico', 'Contacto inicial. Doctor interesado en Metformina para sus pacientes.', 'Agendar visita', '2026-02-25', 'Miguel López'),
(4, '2026-02-25', 'Visita', 'Visita presencial', 'Reunión en consultorio. Mostró interés moderado. Pide muestras.', 'Enviar muestras médicas', '2026-03-10', 'Miguel López'),
(6, '2026-01-20', 'Reunión', 'Renovación contrato semestral', 'Reunión con Director Administrativo y Jefa de Farmacia.', 'Enviar contrato actualizado', '2026-01-30', 'Miguel López'),
(6, '2026-01-30', 'Email', 'Contrato firmado', 'Contrato semestral firmado y devuelto. Vigencia Feb-Jul 2026.', 'Primer despacho', '2026-02-05', 'Miguel López'),
(8, '2026-03-01', 'Visita', 'Presentación a Centro Médico Paitilla', 'Reunión con Directora de Operaciones. Gran interés en oncología y reumatología.', 'Preparar propuesta integral', '2026-03-10', 'Carlos Vega'),
(8, '2026-03-10', 'Reunión', 'Propuesta integral', 'Presentada propuesta multi-departamento. Negociando descuentos.', 'Esperar contrapropuesta', '2026-03-20', 'Carlos Vega'),
(9, '2026-01-15', 'Llamada', 'Lead de referencia', 'Referido por Dr. Mendoza. Neurólogo con potencial para Pembrolizumab.', 'Investigar necesidades', '2026-02-01', 'Miguel López'),
(10, '2026-01-10', 'Reunión', 'Negociación contrato semestral', 'Reunión con Subdirector Médico. Acordado contrato semestral.', 'Firmar contrato', '2026-01-20', 'Ana Castillo');

-- ============================================================
-- PAGOS
-- ============================================================
INSERT INTO payments (order_id, invoice_number, amount, payment_date, payment_method, payment_status)
VALUES
(1, 'INV-2026-001', 25000.00, '2026-02-15', 'Transferencia', 'Completo'),
(2, 'INV-2026-002', 40200.00, '2026-03-01', 'Transferencia', 'Completo'),
(3, 'INV-2026-003', 50000.00, '2026-02-25', 'Transferencia', 'Parcial'),
(4, 'INV-2026-004', 2500.00, '2026-02-28', 'Cheque', 'Completo'),
(5, 'INV-2026-005', 12500.00, '2026-03-10', 'Transferencia', 'Completo'),
(6, 'INV-2026-006', 0.00, '2026-03-01', 'Transferencia', 'Pendiente'),
(7, 'INV-2026-007', 0.00, '2026-03-05', 'Transferencia', 'Pendiente'),
(8, 'INV-2026-008', 2500.00, '2026-03-12', 'Cheque', 'Completo');
