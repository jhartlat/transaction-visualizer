const FM = FileManager.iCloud();
const CONFIG_PATH = getFilePath("config.json");
const STICKER_PATH = getFilePath("wallet-sticker.txt");
const STYLE = {
  font: {
    daysLeft: Font.boldSystemFont(16),
    balance: Font.boldSystemFont(28),
    otherText: Font.boldSystemFont(14)
  },

  size: {
    image: new Size(32, 32)
  },

  color: {
    negativeBalance: new Color("#DD4500")
  }
};

function getBalanceColor(balance) {
  if (balance < 0.00) STYLE.color.negativeBalance;
}


function createWidget(closingDate, remainingBalance, deductFromChecking, deductFromSavings, recent) {
  const widget = new ListWidget();
  const mainColumn = widget.addStack();
  mainColumn.layoutVertically();
  addRow1(mainColumn, closingDate);
  addRow2(mainColumn, remainingBalance);
  addRow3(mainColumn, remainingBalance, deductFromChecking, deductFromSavings);
  addRow4(mainColumn, recent);
  return widget;
}


function addRow1(mainColumn, closingDate) {
  const currentDate = getCurrentDateString();
  const numberOfDays = daysBetweenDates(currentDate, closingDate);
  const row1 = mainColumn.addStack();
  let daysLeft = "";

  if (numberOfDays === 1) {
    daysLeft = "1 day left...";
  }
  else {
    daysLeft = `${numberOfDays} days left...`;
  }

  const daysLeftText = row1.addText(daysLeft);
  daysLeftText.font = STYLE.font.daysLeft;
  row1.addSpacer();

  const image = loadStickerImage();
  const sticker = row1.addImage(image);
  sticker.imageSize = STYLE.size.image;
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


function addRow3(mainColumn, remainingBalance, deductFromChecking, deductFromSavings) {
  const row3 = mainColumn.addStack();
  const splitText1 = row3.addText(`(PAY FROM) CHK: $${deductFromChecking}`);
  const splitText2 = row3.addText(` SAV: $${deductFromSavings.toFixed(2)}`);
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
    lastCharge = row4.addText("Last Charge: N/A");
  }
  else {
    lastCharge = row4.addText(`Last Charge: -$${recent}`);
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


function formatAmount(amount) {
  if (amount < 0.00) {
    return `-$${Math.abs(amount).toFixed(2)}`;
  }
  else {
    return `$${amount.toFixed(2)}`;
  }
}


function budgetProgressBar(widget, remainingBalance, monthlyLimit) {
  const balance = parseFloat(remainingBalance);
  const limit = parseFloat(monthlyLimit);
  let percentageFilled = 0;

  if (balance > 0) {
    percentageFilled = balance/limit;
  }

  const background = new DrawContext();
  background.size = new Size(300, 100);

  const greenWidth = background.size.width * percentageFilled;
  background.setFillColor(new Color("#117711"));
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


function loadStickerImage() {
  const base64String = FM.readString(STICKER_PATH);
  return Image.fromData(Data.fromBase64String(base64String));
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
    const content = FM.readString(CONFIG_PATH);
    const jsonContent = JSON.parse(content);

    // Save each key from the parsed JSON into their respective variables.
    const totalSpent = jsonContent["Total Spent"];
    const closingDate = jsonContent["Closing Date"];
    const recent = jsonContent["Recent"];
    const monthlyLimit = jsonContent["Monthly Limit"];

    // Intitialize the starting deductions for both the checking and savings accounts.
    let deductFromChecking = totalSpent;
    let deductFromSavings = 0;

    // Allocate the spending into the correct fields.
    let [remainingBalance, checking, savings]
    = allocateSpending(totalSpent, deductFromChecking, deductFromSavings, monthlyLimit);

    // Create a widget to display all of the data.
    const widget = createWidget(closingDate, remainingBalance, checking, savings, recent);

    // Create a background that dynamically shows the progression of what has been spent.
    budgetProgressBar(widget, remainingBalance, monthlyLimit);

    // Display the widget.
    showWidget(widget);
    Script.complete();
}

main();
