const TEMPLATE_NAME = 'Monthly Expense Template';
const TABLE_START_COL = 'A';
const TABLE_START_COL_NUMBER = TABLE_START_COL.charCodeAt(0) - 64;
const TABLE_START_ROW = 1;

const SPREAD_SHEET_ID = PropertiesService
    .getScriptProperties()
    .getProperty('SPREADSHEET_ID')

if (!SPREAD_SHEET_ID) {
  throw new Error('SPREAD_SHEET_ID not set');
}
  
const SPREAD_SHEET = SpreadsheetApp.openById(SPREAD_SHEET_ID);


function getOrCreateSheet(name) {
  let sheet = SPREAD_SHEET.getSheetByName(name);

  if (!sheet) {
    let template_sheet = SPREAD_SHEET.getSheetByName(TEMPLATE_NAME);
    sheet = template_sheet.copyTo(SPREAD_SHEET).setName(name);
    sheet.showSheet();
  }

  return sheet;
}

function getCategoryMap() {
  const CATEGORY_SHEET_NAME = 'Category Mapping';
  
  const sheet = SPREAD_SHEET.getSheetByName(CATEGORY_SHEET_NAME);
  
  if (!sheet) {
    Logger.log(`Error: Sheet "${SHEET_NAME}" not found.`);
    return null;
  }

  const data = sheet.getDataRange().getValues();

  const idToCategoryMap = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    const id = row[0];   
    const ourCategory = row[3] || 'Miscellaneous';

    if (id !== "" && id != null) {
      idToCategoryMap[id] = ourCategory;
    }
  }

  return idToCategoryMap;
}

function upsertSingleRow(sheet, rowIndex, rowData = []) {
  sheet.getRange(rowIndex, TABLE_START_COL_NUMBER, 1, rowData.length).setValues([rowData]);
}

function writeExpensesToSheet(expenses, monthYear) {
  try {
    const sheet = getOrCreateSheet(monthYear);

    const tableStartCell = sheet.getRange(`${TABLE_START_COL}${TABLE_START_ROW}`);
    const tableRange = tableStartCell.getDataRegion();
    const tableValues = tableRange.getValues();

    let totalRowIndex = tableRange.getLastRow();

    const existingExpenses = {};

    let startRowIndex = -1;

    // Build a map of existing expenses in the sheet
    for (let i = 0; i < tableValues.length; i++) {
      const row = tableValues[i];
      const rowIndex = i + TABLE_START_ROW;

      /* 1st value in row is expense id
          - if it empty then we need to start from there
          - if is it the total's row, then also we need to start from there
      */
      if (row[0] === '' || rowIndex === totalRowIndex) {
        startRowIndex = rowIndex;
        break; // This stops the loop immediately
      }

      existingExpenses[row[0]] = rowIndex;
    }

    expenses.forEach((expense) => {
      rowData = getRowFromExpenseData(expense);

      insertAtRow = startRowIndex;

      if (existingExpenses[expense.id]) {
        actualRowId = existingExpenses[expense.id];
        upsertSingleRow(sheet, actualRowId, rowData);
      } else {
        if (startRowIndex === totalRowIndex) {
          sheet.insertRowBefore(totalRowIndex);
          totalRowIndex++;
        }

        upsertSingleRow(sheet, startRowIndex, rowData);

        startRowIndex++;
      }
    });
  } catch (error) {
    Logger.log('Error: ' + error.message);
    throw error;
  }
}

// APIs
function getSheetNames() {
  return SPREAD_SHEET
    .getSheets()
    .filter(sheet => !sheet.isSheetHidden())
    .map(sheet => sheet.getName());
}

function getSheetData(sheetName = 'December 2025') {
  const sheet = SPREAD_SHEET.getSheetByName(sheetName);
  
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found.`);

  const charts = sheet.getCharts().map(chart => {
    const blob = chart.getBlob();
    const base64 = Utilities.base64Encode(blob.getBytes());
    return {
      imgSrc: "data:image/png;base64," + base64
    };
  });

  const tableStartCell = sheet.getRange(`G1`);
  const tableRange = tableStartCell.getDataRegion();
  const tableData = tableRange.getDisplayValues();

  // 3. Get Specific Sheet URL (GID)
  const sheetUrl = `${SPREAD_SHEET.getUrl()}#gid=${sheet.getSheetId()}`;

  return {
    charts: charts,
    tableData: tableData,
    sheetUrl: sheetUrl
  };
}
