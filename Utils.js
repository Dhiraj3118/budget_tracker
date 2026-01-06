const MONTH_MAP = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

function transformExpenseData(expense, categoryMap) {
  if(expense.description == 'Payment'){
    Logger.log("PAayment " + expense.payment);
  }
  let cost = expense.cost || 0;
  let description = `(${cost}) ${expense.description}` || 'No Description';
  const isDeleted = expense.deleted_at ? true : false;

  if(isDeleted) {
    description = `[Deleted] ${description}`;
    cost = 0;
  }
  
  let category = expense.category ? categoryMap[expense.category.id] : 'Miscellaneous';

  return {
    id: expense.id,
    cost: parseFloat(cost),
    category: category,
    created_at: new Date(expense.created_at),
    description: description,
    deleted: isDeleted,
  };
}

function transformAndGroupExpenses(expenses) {
  const groupedExpenses = {};

  const categoryMap = getCategoryMap();

  expenses.forEach((expense) => {
    if(expense.payment){
      return;
    }
    const transformed = transformExpenseData(expense, categoryMap);

    const created_at = transformed.created_at;
    const key = MONTH_MAP[created_at.getMonth()] + ' ' + created_at.getFullYear();

    if (!groupedExpenses[key]) {
      groupedExpenses[key] = [];
    }
    groupedExpenses[key].push(transformed);
  });

  return groupedExpenses;
}

function getRowFromExpenseData(expense){
  const row = [
    expense.id,
    expense.cost,
    expense.description,
    expense.created_at,
    expense.category,
  ];
  
  return row;
}

function sendErrorEmail(errorMessage){
  const me = Session.getActiveUser().getEmail();
  MailApp.sendEmail(me, "Error while pulling splitwise expenses", errorMessage);
}