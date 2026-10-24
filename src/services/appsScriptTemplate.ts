/**
 * @file src/services/appsScriptTemplate.ts
 * @description Código oficial de Google Apps Script para enlazar la planilla de Google Sheets
 * con el sistema de reservas web de "El Cañón".
 */

export const APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * SISTEMA DE RESERVAS - "EL CAÑÓN"
 * Escuela Especial Particular Incorporada N° 1429 "Dra. Sara Faisal"
 * =========================================================================
 * Este script recibe automáticamente las reservas desde la Web App / PWA
 * y las almacena de forma ordenada y segura en tu Google Sheets.
 */

// Nombre de la pestaña donde se guardarán las reservas
const SHEET_NAME = "Reservas_El_Canon";

/**
 * Función que atiende peticiones POST provenientes de la Web App
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // Esperar hasta 10 segundos para evitar colisiones si dos personas reservan al mismo tiempo
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Si la hoja no existe, la crea con su diseño institucional
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      inicializarEncabezados(sheet);
    }

    // Si la hoja está completamente vacía, colocar encabezados
    if (sheet.getLastRow() === 0) {
      inicializarEncabezados(sheet);
    }

    // Obtener los datos enviados por la PWA
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    // Extraer campos
    const id = data.id || "CN-" + Math.floor(1000 + Math.random() * 9000);
    const registeredAt = data.registeredAt || Utilities.formatDate(new Date(), "America/Argentina/Buenos_Aires", "dd/MM/yyyy HH:mm:ss");
    const fullName = data.fullName || "Sin nombre";
    const date = data.date || "";
    const startTime = data.startTime || "";
    const durationHours = data.durationHours || 1;
    const endTime = data.endTime || "";
    const equipment = data.equipment || "El Cañón (Proyector)";
    const institution = data.institution || "Escuela Especial N° 1429 Dra. Sara Faisal";

    // Agregar la fila
    sheet.appendRow([
      id,
      registeredAt,
      fullName,
      date,
      startTime,
      durationHours,
      endTime,
      equipment,
      institution
    ]);

    // Formatear la última fila agregada
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 9)
      .setFontFamily("Segoe UI")
      .setFontSize(10)
      .setVerticalAlignment("middle");
      
    // Resaltar ID en negrita
    sheet.getRange(lastRow, 1).setFontWeight("bold");

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Reserva registrada correctamente en Google Sheets",
      id: id
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Función para probar que el Webhook responde (prueba GET)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "Reserva El Cañón - Dra. Sara Faisal",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Crea y da estilo visual a la fila de encabezados
 */
function inicializarEncabezados(sheet) {
  const headers = [
    "ID Reserva",
    "Fecha/Hora de Registro",
    "Nombre y Apellido",
    "Fecha de Reserva",
    "Horario Inicio",
    "Horas de Uso",
    "Horario Fin",
    "Equipo",
    "Institución"
  ];

  sheet.appendRow(headers);

  // Aplicar formato institucional (Azul Sara Faisal #0284c7)
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setBackground("#0284c7")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontFamily("Segoe UI")
    .setFontSize(11)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  sheet.setRowHeight(1, 35);
  sheet.setFrozenRows(1);

  // Anchos de columnas sugeridos
  sheet.setColumnWidth(1, 120); // ID
  sheet.setColumnWidth(2, 170); // Registro
  sheet.setColumnWidth(3, 220); // Nombre
  sheet.setColumnWidth(4, 130); // Fecha
  sheet.setColumnWidth(5, 110); // Inicio
  sheet.setColumnWidth(6, 110); // Horas
  sheet.setColumnWidth(7, 110); // Fin
  sheet.setColumnWidth(8, 180); // Equipo
  sheet.setColumnWidth(9, 250); // Institución
}
`;

export const APPS_SCRIPT_INSTRUCTIONS = [
  {
    step: 1,
    title: 'Crear una hoja de cálculo en Google Sheets',
    description: 'Abre tu cuenta de Google Drive y crea una nueva "Hoja de cálculo de Google" vacía. Puedes nombrarla "Reservas - El Cañón - Dra. Sara Faisal".',
  },
  {
    step: 2,
    title: 'Abrir el editor de Apps Script',
    description: 'En el menú superior de la hoja, haz clic en "Extensiones" > "Apps Script". Se abrirá una nueva pestaña con el editor de código.',
  },
  {
    step: 3,
    title: 'Pegar el código del Webhook',
    description: 'Borra cualquier código que aparezca en el archivo "Código.gs" y pega exactamente el código provisto arriba.',
  },
  {
    step: 4,
    title: 'Guardar el proyecto',
    description: 'Haz clic en el ícono de disquete "Guardar proyecto" (o presiona Ctrl + S / Cmd + S).',
  },
  {
    step: 5,
    title: 'Implementar como Aplicación Web',
    description: 'En la esquina superior derecha, haz clic en el botón azul "Implementar" > "Nueva implementación".',
    substeps: [
      'Haz clic en el engranaje "Seleccionar tipo" y elige "Aplicación web".',
      'En "Descripción", escribe "Webhook Reservas El Cañón".',
      'En "Ejecutar como", selecciona "Yo (tu cuenta de correo)".',
      'IMPORTANTE: En "¿Quién tiene acceso?", selecciona "Cualquier usuario" (Anyone). Esto permite que el formulario de la PWA envíe reservas sin pedir inicio de sesión a cada docente.',
    ],
  },
  {
    step: 6,
    title: 'Copiar la URL y pegarla en la App',
    description: 'Haz clic en "Implementar", autoriza los permisos requeridos por Google, y copia la "URL de la aplicación web" generada (termina en /exec). Pégala en el panel de configuración de esta aplicación.',
  },
];
