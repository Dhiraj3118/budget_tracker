function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('📊 Analyse Your Bugdets 💸')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function fetchExpensesToSheet() {
  try {
    Logger.log('Fetching expenses from Splitwise...');

    const rawExpenses = getExpenses();

    if (rawExpenses.length === 0) {
      Logger.log('No expenses found in the specified period.');
      return;
    }

    Logger.log('Found ' + rawExpenses.length + ' expenses');

    const expenses = transformAndGroupExpenses(rawExpenses);

    Object.keys(expenses).forEach((monthYear) => {
      const monthlyExpenses = expenses[monthYear];
      writeExpensesToSheet(monthlyExpenses, monthYear);
    });
  } catch (error) {
    Logger.log("Error: " + error.message)
    sendErrorEmail(error.message);
  }
}
