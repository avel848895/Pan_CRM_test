const pptxgen = require('pptxgenjs');
const pres = new pptxgen();

// Configuración general
pres.layout = 'LAYOUT_WIDE';

// Colores Corporativos
const COLOR_PRIMARY = '1A237E'; // Azul Noche
const COLOR_SECONDARY = '00BFA5'; // Verde Médico
const COLOR_TEXT = '333333';

// Diapositiva 1: Portada
let slide1 = pres.addSlide();
slide1.background = { path: 'C:/Users/avel8/.gemini/antigravity/brain/e770e2e8-562d-483c-9d89-59786b8a6e6f/pharma_crm_title_slide_1773432673425.png' };
slide1.addText('Modelo de Datos de CRM y Estrategia de KPIs para Distribución Farmacéutica', {
    x: 1, y: 3.5, w: '80%', fontSize: 36, color: 'FFFFFF', bold: true, fontFace: 'Arial'
});
slide1.addText('Infraestructura de Datos para el Crecimiento de Ventas y la Toma de Decisiones Estratégicas', {
    x: 1, y: 4.8, w: '80%', fontSize: 18, color: 'FFFFFF', fontFace: 'Arial'
});

// Función para crear diapositivas estándar
function addStandardSlide(title, points) {
    let slide = pres.addSlide();
    slide.addText(title, { x: 0.5, y: 0.3, w: '90%', fontSize: 28, color: COLOR_PRIMARY, bold: true });
    slide.addShape(pres.ShapeType.rect, { x: 0.5, y: 0.9, w: 9, h: 0.05, fill: { color: COLOR_SECONDARY } });
    
    let textObjects = points.map(p => ({ text: p, options: { bullet: true, fontSize: 18, color: COLOR_TEXT, margin: 5 } }));
    
    slide.addText(textObjects, {
        x: 0.5, y: 1.2, w: '90%', h: 4, valign: 'top'
    });
}

// Diapositiva 2
addStandardSlide('Contexto del Negocio', [
    'Distribuidor farmacéutico de medicamentos especializados.',
    'Clientes clave: Doctores, Hospitales y Clínicas.',
    'Necesidad de centralizar la gestión de relaciones.',
    'Seguimiento detallado del funnel de ventas.',
    'Análisis de datos para ventaja competitiva.'
]);

// Diapositiva 3
addStandardSlide('Objetivos del CRM', [
    'Registrar y perfilar 360° a médicos e instituciones.',
    'Monitorear el pipeline de ventas en tiempo real.',
    'Gestionar interacciones (visitas médicas, llamadas).',
    'Analizar la demanda de productos por categoría.',
    'Generar KPIs estratégicos para toma de decisiones e inversionistas.'
]);

// Diapositiva 4
addStandardSlide('Entidades Principales', [
    'Clientes: Doctores, Clínicas y Hospitales.',
    'Tomadores de decisión y contactos clave.',
    'Catálogo de Productos (Medicamentos).',
    'Oportunidades de Venta (Leads/Prospectos).',
    'Pedidos, Transacciones e Historial de Pagos.'
]);

// Diapositiva 5
addStandardSlide('Estructura: Clientes', [
    'Datos Base: ID, Tipo de Cliente, Especialidad, Ubicación.',
    'Nivel de relación y representante asignado.',
    'Estado del Funnel: Potencial / Propuesta / Negociación / Cerrado.',
    'Análisis de Pérdida: Registro obligatorio de "Razón de Pérdida" (Precio, Competencia, Stock).',
    'Estado de Actividad: Activo / Inactivo / Lost.'
]);

// Diapositiva 6
addStandardSlide('Estructura: Productos', [
    'ID del Producto y Nombre Comercial.',
    'Categoría Terapéutica (Oncológicos, Cardiovascular, etc.).',
    'Precio Unitario y Fabricante.',
    'Requisitos Logísticos: Cadena de frío y regulaciones.',
    'Importancia: Permite predecir rotación de stock.'
]);

// Diapositiva 7
addStandardSlide('Pipeline de Ventas', [
    'Potencial: Identificación del lead.',
    'Contactado: Primera visita o interacción.',
    'Propuesta: Envío de cotización formal.',
    'Negociación: Ajuste de términos.',
    'Cierre: Ganado o Perdido.',
    'Proyección: Cálculo de ingresos ponderados por etapa.'
]);

// Diapositiva 8
addStandardSlide('Seguimiento de Pedidos e Ingresos', [
    'Trazabilidad completa por ID de pedido.',
    'Relación Producto-Cliente-Cantidad.',
    'Control de ingresos brutos y netos.',
    'Estado de cobranza: Pendiente, Pagado, Vencido.',
    'Alimentación automática del flujo de caja comercial.'
]);

// Diapositiva 9
addStandardSlide('Interacciones con Clientes', [
    'Registro de Visitas Médicas y Muestreo.',
    'Historial de llamadas y seguimientos virtuales.',
    'Asistencia a congresos y eventos patrocinados.',
    'Mejora la personalización de la oferta comercial.',
    'Fomenta relaciones a largo plazo con especialistas.'
]);

// Diapositiva 10: KPIs (Con Imagen)
let slide10 = pres.addSlide();
slide10.addText('Marco de KPIs (Dashboard)', { x: 0.5, y: 0.3, w: '90%', fontSize: 28, color: COLOR_PRIMARY, bold: true });
slide10.addImage({ path: 'C:/Users/avel8/.gemini/antigravity/brain/e770e2e8-562d-483c-9d89-59786b8a6e6f/pharma_crm_dashboard_mockup_1773432711302.png', x: 5, y: 1.2, w: 4.5, h: 3 });

let kpiPoints = [
    'Ventas Mensuales (MRR).',
    'Conversion Rate (% de cierre).',
    'Valor Promedio del Pedido (AOV).',
    'Pipeline Velocity (Tiempo de cierre).',
    'KPIs integrados en tiempo real.'
].map(p => ({ text: p, options: { bullet: true, fontSize: 18, color: COLOR_TEXT, margin: 5 } }));

slide10.addText(kpiPoints, { x: 0.5, y: 1.2, w: 4, valign: 'top' });

// Diapositiva 11
addStandardSlide('Desempeño Comercial', [
    'Ranking de Doctores con mayores ventas.',
    'Hospitales con mayor potencial de crecimiento.',
    'Cumplimiento de cuotas por representante.',
    'Crecimiento por categoría terapéutica.',
    'Identificación de "Best Sellers" farmacéuticos.'
]);

// Diapositiva 12
addStandardSlide('Análisis de Retención (Churn)', [
    'Monitoreo de clientes inactivos (>30 días).',
    'Customer Lifetime Value (Valor de vida del cliente).',
    'Segmentación por razón de pérdida.',
    'Alertas tempranas de riesgo de deserción.',
    'Estrategias de recuperación de cuentas.'
]);

// Diapositiva 13
addStandardSlide('Insights Estratégicos', [
    '¿Qué especialidades son más rentables?',
    '¿Por qué perdemos propuestas en clínicas grandes?',
    '¿Qué medicamentos tienen demanda insatisfecha por stock?',
    'Optimización del equipo comercial en zonas de alto valor.',
    'Toma de decisiones basada en evidencia, no intuición.'
]);

// Diapositiva 14
addStandardSlide('CRM + Inteligencia Artificial', [
    'Lead Scoring automático para priorizar visitas.',
    'Predicción de demanda estacional por zona.',
    'Detección proactiva de fuga de clientes (Churn Prediction).',
    'Recomendación inteligente de productos (Cross-selling).',
    'Automatización de reportes para gerencia.'
]);

// Diapositiva 15
addStandardSlide('Hoja de Ruta', [
    'Paso 1: Implementación del Modelo de Datos.',
    'Paso 2: Migración y Limpieza de datos históricos.',
    'Paso 3: Adopción del equipo de ventas.',
    'Paso 4: Activación de Dashboards de KPIs.',
    'Paso 5: Optimización continua e IA.'
]);

// Diapositiva 16
addStandardSlide('Conclusión', [
    'Eficiencia operativa y mayor volumen de ventas.',
    'Relaciones más sólidas con el ecosistema médico.',
    'Transparencia total para inversionistas.',
    'Activo de datos propio con valor comercial.',
    'Preparados para la escala nacional.'
]);

// Guardar
pres.writeFile({ fileName: 'c:/Users/avel8/OneDrive/Documents/PANAGRO/Pan_CRM_test/Estrategia_CRM_Farma.pptx' })
    .then(fileName => {
        console.log(`PowerPoint generado exitosamente: ${fileName}`);
    })
    .catch(err => {
        console.error(`Error al generar el PowerPoint: ${err}`);
        process.exit(1);
    });
