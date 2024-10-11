// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: credit-card;

const FM = FileManager.iCloud();
const CONFIG_PATH = getFilePath(`Transaction Visualizer/${args.widgetParameter()}/config.json`);
const STYLE = {
  font: {
    row_1: Font.boldSystemFont(14),
    balance: Font.boldSystemFont(28),
    otherText: Font.boldSystemFont(14)
  },
  color: {
    negativeBalance: new Color("#DD4500")
  }
};

function getBalanceColor(balance) {
  if (balance < 0.00) {
    return STYLE.color.negativeBalance;
  }
}


function createWidget(
  closingDate="10-10-2049",
  remainingBalance=750.00,
  deductFromChecking=250.00,
  deductFromSavings=0.00,
  recent="10.00",
  title="My Credit Card",
  calendarEmoji="")
  {
  const widget = new ListWidget();
  const mainColumn = widget.addStack();
  mainColumn.layoutVertically();
  addRow_1(mainColumn, closingDate, title, emoji);
  addRow_2(mainColumn, remainingBalance);
  addRow_3(mainColumn, remainingBalance, deductFromChecking, deductFromSavings);
  addRow4(mainColumn, recent);
  return widget;
}


function addRow_1(mainColumn, title, closingDate, calendarEmoji) {
  const row_1 = mainColumn.addStack();

  // Card Name Label
  const cardNameLabel = row_1.addText(title);
  cardName.font = STYLE.font.row_1;
  row_1.addSpacer();

  // Days Left Label
  const currentDate = getCurrentDateString();
  const numberOfDays = daysBetweenDates(currentDate, closingDate);
  const daysLeftLabel = row_1.addText(`${calendarEmoji} ${numberOfDays}`);
  daysLeftLabel.font = STYLE.font.row_1;

  // Row 1 complete
  mainColumn.addSpacer();
}


function addRow_2(mainColumn, remainingBalance, currency) {
  const row_2 = mainColumn.addStack();

  // Balance Label
  let deviceLocale = navigator.language || 'en-US';
  const formattedBalance = formatCurrency(remainingBalance, deviceLocale, currency);
  const balanceLabel = row_2.addText(formattedBalance);
  balanceLabel.textColor = getBalanceColor(remainingBalance);
  balanceLabel.font = STYLE.font.balance;

  // Row 2 complete
  mainColumn.addSpacer();
}


function addRow_3(mainColumn, cardTag, deductFromChecking, deductFromSavings) {
  const row_3 = mainColumn.addStack();

  // Card Tag Background
  const cardTagBackground = row_3.addStack();
  cardTagBackground.cornerRadius = 5;
  cardTagBackground.setPadding(5, 10, 5, 10);
  if (cardTag == 'CREDIT') {
    cardTagBackground.backgroundColor = new Color("#000000");
  } else {
    cardTagBackground.backgroundColor = new Color("#43464B");
  }

  // Card Tag Label
  const cardTagLabel = cardTagBackground.addText(`${cardTag}`);

  // Checking Label
  const checkingLabel = row_3.addStack();
  checkingLabel.font = STYLE.font.row_3;
  if (deductFromChecking > limit) {
    checkingLabel.addText(`CHK: MAX`);
    checkingLabel.textColor = STYLE.color.greyedOut;
  } else {
    let formattedChecking = formatCurrency(deductFromChecking, deviceLocale);
    checkingLabel.addText(`CHK: ${formattedChecking}`);
  }

  // Savings Label
  const savingsLabel = row_3.addStack();
  savingsLabel.font = STYLE.font.row_3;
  if (deductFromSavings < 0) {
    savingsLabel.addText('SAV: ←');
    savingsLabel.textColor = STYLE.color.greyedOut;
  } else {
    let formattedSavings = formatCurrency(deductFromsavings, deviceLocale);
    savingsLabel.addText(`SAV: ${formattedSavings} `);
    savingsLabel.textColor = STYLE.color.negativeBalance;
  }

  // Row 3 complete
  mainColumn.addSpacer();
}


function addRow4(mainColumn, lastActivity) {
  const row_4 = mainColumn.addStack();

  // Last Activity Label
  const lastActivityLabel = row_4.addStack();
  lastActivityLabel.addText("Last Activity: ");
  lastActivityLabel.font = STYLE.font.row_4;
  row_4.addSpacer();

  // Activity Amount
  const activityAmount = parseFloat(lastActivity);
  let formattedAmount = null;
  if (amount > 0) {
    formattedAmount = formatCurrency((activityAmount * -1), deviceLocale);
  } else if (amount == 0) {
    formattedAmount = 'N/A';
  }
  else {
    formattedAmount = '+' + formatCurrency((activityAmount), deviceLocale);
  }

  // Amount Label
  const amountLabel = row_4.addText(formattedAmount);
  if (formattedAmount == 'N/A') {
    amountLabel.textColor = STYLE.color.greyedOut;
  }
  row_4.addSpacer();

  // Current Time Label
  const currentTime = getTime();
  const currentTimeLabel = row_4.addText(currentTime);
  currentTimeLabel.font = STYLE.font.row_4;

  // Row 4 complete
  mainColumn.addSpacer();
}


function showWidget(widget) {
  if (config.runsInApp) {
    widget.presentMedium();
  }
  else if (config.runsInWidget) {
    Script.setWidget(widget);
  }
}


function getFilePath(fileName) {
  return FM.documentsDirectory() + `/${fileName}`;
}


function getCurrentDateString() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  return `${month}-${day}-${year}`;
}


function getTime() {
  const currentDate = new Date();
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  // Convert to 12-hour format.
  hours = hours % 12;
  // If hour is 0, display as 12.
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}


/**
 *@param {float} amount
 *@param {string} currencySymbol
 */

function formatCurrency(amount, locale='en-US', currency='USD') {
  return amount.toLocaleString(locale, {style: 'currency', currency: currency });
}



function budgetProgressBar(widget, remainingBalance, monthlyLimit, color="#117711") {
  const balance = parseFloat(remainingBalance);
  const limit = parseFloat(monthlyLimit);
  let percentageFilled = 0;

  if (balance > 0) {
    percentageFilled = balance/limit;
  }

  const background = new DrawContext();
  background.size = new Size(300, 100);

  const greenWidth = background.size.width * percentageFilled;
  background.setFillColor(new Color(color));
  background.fillRect(new Rect(0, 0, greenWidth, 100));

  const grayWidth = background.size.width * (1 - percentageFilled);
  background.setFillColor(new Color("#1E1E1E"));
  background.fillRect(new Rect(greenWidth, 0, grayWidth, 100));

  widget.backgroundImage = background.getImage();
}


function daysBetweenDates(currentDate, closingDate) {
  let [month, day, year] = currentDate.split("-");
  const date1 = new Date(year, parseInt(month) - 1, day);
  let [closingMonth, closingDay, closingYear] = closingDate.split("-");
  const date2 = new Date(closingYear, parseInt(closingMonth) - 1, closingDay);
  const timeDifference = date2 - date1;
  const days = Math.trunc(timeDifference / (1000 * 60 * 60 * 24));
  return days;
}


function allocateSpending(totalSpent, deductFromChecking, deductFromSavings, monthlyLimit) {
  if (deductFromChecking >= monthlyLimit) {
    deductFromChecking = monthlyLimit;
    deductFromSavings = totalSpent - monthlyLimit;
  }
  else {
    deductFromChecking = totalSpent;
    deductFromSavings = 0.00;
  }
  const remainingBalance = monthlyLimit - totalSpent;
  return [remainingBalance, deductFromChecking, deductFromSavings];
}


function main() {
    // Read the config file and parse its content.
if (!FM.fileExists(CONFIG_PATH)) {
    throw new Error(`\nCheck the 'Card Name' value in the dictionary at the top of the:\n"${Script.name()}.shortcut"\nThe Card Name must match the shortcut name exactly, with no extra spaces.`);
}

    const content = FM.readString(CONFIG_PATH);
    const jsonContent = JSON.parse(content);

    // Save each key from the parsed JSON into their respective variables.
    const totalSpent = parseFloat(jsonContent["Total Spent"]);
    const closingDate = jsonContent["Closing Date"];
    const recent = jsonContent["Recent"];
    const monthlyLimit = parseFloat(jsonContent["Monthly Limit"]);
    const currencyCode = jsonContent["Symbol"];
    const cardTag = jsonContent["Tag"];
    const calendarEmoji = jsonContent["Emoji"];

    // Intitialize the starting deductions for both the checking and savings accounts.
    let deductFromChecking = totalSpent;
    let deductFromSavings = 0;

    // Allocate the spending into the correct fields.
    let [remainingBalance, checking, savings] = allocateSpending(totalSpent, deductFromChecking, deductFromSavings, monthlyLimit);

    // Create a widget to display all of the data.
    const title = jsonContent["Card Name"];
    const widget = createWidget(closingDate, remainingBalance, checking, savings, recent, title, calendarEmoji);

    // Create a background that dynamically shows the progression of what has been spent.
    const backgroundColor = jsonContent["Background"];
    budgetProgressBar(widget, remainingBalance, monthlyLimit, backgroundColor);

    // Display the widget.
    showWidget(widget);
    Script.complete();
}


main();
