# Splitwise Budget Tracker 💸 - DIY Premium Dashboard

**Automate your home expense tracking, visualize budget leaks, and get "Premium" analytics for free.**

This Google Apps Script project connects your Splitwise group to a Google Sheet. It automatically fetches expenses, categorizes them against your monthly budget, and visualizes the data using a custom HTML dashboard.

## 🚀 Features

* **Auto-Sync:** Runs in the background to pull new expenses from Splitwise via API.
* **Smart Categorization:** Maps Splitwise expenses to your custom Google Sheet categories.
* **Budget vs. Actuals:** Real-time tracking of how much budget is left per category.
* **Auto-Scaling:** Automatically detects a new month and generates a new sheet from a template (preserving all formulas and charts).
* **Visual Dashboard:** Includes a custom `index.html` web app to view charts and tables without digging through spreadsheet cells.

---

## 🛠️ Installation & Setup

Follow these steps to get your own instance running.

### 1. Get Splitwise API Key
1. Go to [Splitwise Create Application](https://secure.splitwise.com/apps/new).
2. Register a new application (you can use `http://localhost` for the URL if asked).
3. Copy your **Consumer Key** (this is your API Key).
4. Note down your **Group ID** (you can find this in the URL when you visit your group on the Splitwise website, e.g., `splitwise.com/groups/1234567`).

### 2. Duplicate the Spreadsheet Template
1. Open the [Budget Master Template](https://docs.google.com/spreadsheets/d/1Tqzz-oOe50ItR_CmMwMrf1Az6DnT2ZJv9GJBwpOL_mY/edit?gid=691096871#gid=691096871)
2. Click **File > Make a copy**.
3. Save it to your Google Drive.
4. Copy the **Spreadsheet ID** from the URL (the long string of characters between `/d/` and `/edit`).

### 3. Setup your Budget in the Spreadsheet
1. In the `Category Mapping` sheet - F column shows the list of category. Update the existing or add more as per your requirements.
2. Update the mapping from Splitwise's category to your category in the same sheet from column A to D.
3. Now open `Monthly Budget` sheet and enter the budget allocated to each category.
4. Next open the `Monthly Expense Template` and make changes to formulas or charts if needed 

### 4. Create New Apps Script Project
1. Go to [script.google.com](https://script.google.com/).
2. Click **New Project**.
3. Name it "Splitwise Sync" (or whatever you prefer).

### 5. Copy Code Files
1. In your new Apps Script project, delete the empty `Code.gs`.
2. Copy the contents of `Code.gs` from this repository and paste it into the script editor.
3. Create a new HTML file by clicking the **+** icon > **HTML** and name it `index`.
4. Copy the contents of `index.html` from this repository and paste it there.
5. (Repeat for any other files in this repo).

### 6. Setup Environment Variables
To keep your keys secure, we use Script Properties.
1. In the Apps Script editor, click on the **Project Settings** (gear icon ⚙️) on the left sidebar.
2. Scroll down to **Script Properties**.
3. Click **Add script property** and add the following:
    * **Property:** `SPLITWISE_API_KEY`
        * **Value:** *[Your Key from Step 1]*
    * **Property:** `SPLITWISE_GROUP_ID`
        * **Value:** *[Your Group ID from Step 1]*
    * **Property:** `SPREADSHEET_ID`
        * **Value:** *[Your Sheet ID from Step 2]*
4. Click **Save script properties**.

### 7. Setup the Cron Job (Automation)
1. Click on the **Triggers** (alarm clock icon ⏰) on the left sidebar.
2. Click **+ Add Trigger**.
3. Configure the trigger:
    * **Choose which function to run:** `fetchExpenses` (or your main logic function).
    * **Select event source:** `Time-driven`.
    * **Select type of time based trigger:** `Hour timer` (or as per your preference).
    * **Select hour interval:** `Every hour`.
4. Click **Save**. (You will need to authorize the script to access your Google Sheet and external services).

---

## 🧪 Testing

To ensure everything is connected correctly:

1. Go back to the **Editor** (`Code.gs`).
2. Select the `fetchExpensesToSheet` function from the dropdown menu in the top toolbar.
3. Click **Run**.
4. Check the **Execution Log** at the bottom to see if data is being fetched.
5. Open your Google Sheet to verify that expenses have been populated.

---

## 📊 Using the Dashboard

To view the HTML Dashboard:
1. In the Apps Script editor, click **Deploy** > **Test deployments**.
2. Click the **Web app** URL provided.
3. You should see your custom dashboard with dropdowns and charts!

---

### ⚙️ Configuration & Customization
Once your script is running, you might need to tell the sheet how to handle your money.

1. **Define Your Categories:**
   * Open the `Category Mapping` sheet.
   * **Column F** lists your high-level budget buckets (e.g., *Groceries, Rent, Entertainment*). Update these or add new ones to match your lifestyle.

2. **Map Splitwise Data:**
   * In the same sheet (**Columns A-D**), map the specific Splitwise categories to your custom buckets.
   * *Example:* You can map both "Liquor" and "Dining Out" from Splitwise to your single "Entertainment" category.

3. **Set Your Budget:**
   * Open the `Monthly Budget` sheet.
   * Enter the allocated budget amount for each category. The dashboard will use these numbers to calculate your "Remaining Budget" and "Utilization %".

4. **Customize the Blueprint:**
   * Open the `Monthly Expense Template` sheet.
   * **This is the master copy.** Every time a new month starts, the script duplicates this sheet.
   * Feel free to change the chart colors or formulas here—just ensure you don't break the main data table structure!
  
---

## 🤝 Contributing

Feel free to fork this project and submit pull requests if you have ideas for better charts, new features, or code optimization.
