function getGroupId(){
  const groupId = PropertiesService
    .getScriptProperties()
    .getProperty('SPLITWISE_GROUP_ID')

  if (!groupId) {
    throw new Error('SPLITWISE_GROUP_ID not set');
  }
  
  return groupId;
}

function getApiKey() {
  const apiKey = PropertiesService
    .getScriptProperties()
    .getProperty('SPLITWISE_API_KEY');

  if (!apiKey) {
    throw new Error('SPLITWISE_API_KEY not set');
  }
  
  return apiKey;
}

function splitwiseApiRequest(endpoint, params = {}) {
  const baseUrl = 'https://secure.splitwise.com/api/v3.0/';
  let url = baseUrl + endpoint;

  const queryString = Object.keys(params)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&');

  if (queryString) {
    url += '?' + queryString;
  }

  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: 'Bearer ' + getApiKey(),
    },
    muteHttpExceptions: true,
  });

  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();

  if (responseCode !== 200) {
    throw new Error('API Error: ' + responseCode + ' - ' + responseText);
  }

  return JSON.parse(responseText);
}

function getCurrentUser() {
  const response = splitwiseApiRequest('get_current_user');
  return response.user;
}

function getGroups() {
  const response = splitwiseApiRequest('get_groups');
  return response.groups;
}

function getCategories() {
  const response = splitwiseApiRequest('get_categories');
  traverse(response.categories);
  return response.categories;
}

function getExpenses() {
  // Since cron job is running multiple times a day, expenses updated in last 24 hrs would be fine
  const datedAfter = new Date();
  const daysBack = 1;
  datedAfter.setDate(datedAfter.getDate() - daysBack);

  const params = {
    group_id: getGroupId(),
    updated_after: datedAfter.toISOString(),
    limit: 100, // Maximum allowed by API
    payment: false,
  };

  const response = splitwiseApiRequest('get_expenses', params);
  
  return response.expenses;
}
