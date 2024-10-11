// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: credit-card;

const FM = FileManager.iCloud();
const CONFIG_PATH = getFilePath(`Transaction Visualizer/${Script.name()}/config.json`);
const STYLE = {
  font: {
    row1: Font.boldSystemFont(14),
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
  addRow1(mainColumn, closingDate, title, emoji);
  addRow2(mainColumn, remainingBalance);
  addRow3(mainColumn, remainingBalance, deductFromChecking, deductFromSavings);
  addRow4(mainColumn, recent);
  return widget;
}


function addRow1(mainColumn, title, closingDate, calendarEmoji) {
  const row1 = mainColumn.addStack();

  // Card Name Label
  const cardNameLabel = row1.addText(title);
  cardName.font = STYLE.font.row1;
  row1.addSpacer();

  // Days Left Label
  const currentDate = getCurrentDateString();
  const numberOfDays = daysBetweenDates(currentDate, closingDate);
  const daysLeftLabel = row1.addText(`${calendarEmoji} ${numberOfDays}`);
  daysLeftLabel.font = STYLE.font.row1;

  // End Row 1
  mainColumn.addSpacer();
}


function addRow2(mainColumn, remainingBalance) {
  const row2 = mainColumn.addStack();
  const formattedBalance = formatAmount(remainingBalance);
  const balance = row2.addText(formattedBalance);
  balance.textColor = getBalanceColor(remainingBalance);
  balance.font = STYLE.font.balance;
  row2.addSpacer();
  mainColumn.addSpacer();
}


function addRow3(mainColumn, remainingBalance, deductFromChecking, deductFromSavings, currencySymbol) {
  const row3 = mainColumn.addStack();
  const splitText1 = row3.addText(`(PAY FROM) CHK: ${currencySymbol}${deductFromChecking.toFixed(2)}`);
  const splitText2 = row3.addText(` SAV: ${currencySymbol}${deductFromSavings.toFixed(2)}`);
  splitText1.font = STYLE.font.otherText;
  splitText2.font = STYLE.font.otherText;
  splitText2.textColor = getBalanceColor(remainingBalance);
  row3.addSpacer();
  mainColumn.addSpacer();
}


function addRow4(mainColumn, recent) {
  const row4 = mainColumn.addStack();
  const amount = parseFloat(recent);
  let lastCharge;
  if (amount == 0) {
    lastCharge = row4.addText("Recent Activity: N/A");
  }
  else if (amount > 0){
    lastCharge = row4.addText(`Recent Activity: -${recent}`);
  }
  else {
    lastCharge = row4.addText(`Recent Activity: +${recent}`);
  }
  lastCharge.font = STYLE.font.otherText;
  row4.addSpacer();
  const currentTime = getTime();
  const lastUpdate = row4.addText(currentTime);
  lastUpdate.font = STYLE.font.otherText;
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


function formatAmount(amount, currencySymbol) {
  if (amount < 0.00) {
    return `-${currencySymbol}${Math.abs(amount).toFixed(2)}`;
  }
  else {
    return `${currencySymbol}${amount.toFixed(2)}`;
  }
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
    const currencySymbol = jsonContent["Symbol"];
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
