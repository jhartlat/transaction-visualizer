// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: credit-card;

let CARD_NAME;
let BACKGROUND_COLOR;
let TOTAL_SPENT;
let MONTHLY_LIMIT;
let RECENT;
let CURRENCY_CODE;
let CARD_TYPE;
let CLOSING_DATE;
let EMOJI;
const DEVICE_LOCALE = Device.language() || 'en-US';
const STYLE = {
  font: {
    row_1: Font.boldSystemFont(14),
    row_2: Font.boldSystemFont(26),
    row_3: Font.boldSystemFont(13),
    row_4: Font.boldSystemFont(13),
  },
  color: {
    negativeBalance: new Color("#DD4500"),
    greyedOut: new Color("#818589")

  }
};
const CONFIG_PATH = "Transaction Visualizer/SAPPHIRE PREFERRED/config.json";
const CONFIG_DATA = readConfigFile(CONFIG_PATH);
if (CONFIG_DATA) {
  const {
    "Card Name": cardName,
    "Background Color": backgroundColor,
    "Total Spent": totalSpent,
    "Monthly Limit": monthlyLimit,
    "Recent": recent,
    "Currency Code": currencyCode,
    "Card Type": cardType,
    "Closing Date": closingDate,
    "emoji": emoji
  } = CONFIG_DATA;

  CARD_NAME = cardName || "SAPPHIRE PREFERRED";
  BACKGROUND_COLOR = backgroundColor || "#0F52BA";
  TOTAL_SPENT = parseFloat(totalSpent) || 0;
  MONTHLY_LIMIT = parseFloat(monthlyLimit) || 0;
  RECENT = parseFloat(recent) || "N/A";
  CURRENCY_CODE = currencyCode || "USD";
  CARD_TYPE = cardType.toUpperCase() || "CREDIT";
  CLOSING_DATE = closingDate || "11-09-2024";
  EMOJI = emoji || "🗓️";
}
let CHECKING_ACCOUNT = TOTAL_SPENT;
let SAVINGS_ACCOUNT = 0;

function main() {
  let [remainingBalance, balanceUsed, savingsUsed] = allocateSpending();
  const widget = createWidget(remainingBalance, balanceUsed, savingsUsed);
  budgetProgressBar(widget, remainingBalance, MONTHLY_LIMIT);
  showWidget(widget);
  Script.complete();
}

function showWidget(widget) {
  if (config.runsInApp) {
    widget.presentMedium();
  }
  else if (config.runsInWidget) {
    Script.setWidget(widget);
  }
}

function budgetProgressBar(widget, remainingBalance) {
  let percentageFilled;

  if (remainingBalance > 0) {
    percentageFilled = remainingBalance/MONTHLY_LIMIT;
  }

  const background = new DrawContext();
  background.size = new Size(300, 100);

  const colorWidth = background.size.width * percentageFilled;
  background.setFillColor(new Color(BACKGROUND_COLOR));
  background.fillRect(new Rect(0, 0, colorWidth, 100));

  const emptyWidth = background.size.width * (1 - percentageFilled);
  background.setFillColor(new Color("#1E1E1E"));
  background.fillRect(new Rect(colorWidth, 0, emptyWidth, 100));

  widget.backgroundImage = background.getImage();
}

function createWidget(remainingBalance, balancedUsed, savingsUsed)
  {
  const widget = new ListWidget();
  const mainColumn = widget.addStack();
  mainColumn.layoutVertically();
  addRow_1(mainColumn);
  addRow_2(mainColumn, remainingBalance);
  addRow_3(mainColumn);
  addRow_4(mainColumn);
  return widget;
}

function addRow_4(mainColumn) {
  const row_4 = mainColumn.addStack();

  // Last Activity Label
  const lastActivityLabel = row_4.addText("Last Activity: ");
  lastActivityLabel.font = STYLE.font.row_4;
  row_4.addSpacer();

  // Activity Amount
  let formattedAmount = RECENT;

  if (typeof(RECENT) == "float") {

    if (RECENT > 0) {
      formattedAmount = formatCurrency((RECENT * -1), DEVICE_LOCALE);
    } else {
      formattedAmount = '+' + formatCurrency(RECENT, DEVICE_LOCALE);
    }
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

function addRow_3(mainColumn) {
  const row_3 = mainColumn.addStack();

  // Card Type Background
  const cardTypeBackground = row_3.addStack();
  cardTypeBackground.cornerRadius = 5;
  cardTypeBackground.setPadding(5, 10, 5, 10);
  if (CARD_TYPE == "CREDIT") {
    cardTypeBackground.backgroundColor = new Color("#000000");
  } else {
    cardTypeBackground.backgroundColor = new Color("#43464B");
  }

  // Card Type Label
  const cardTypeLabel = cardTypeBackground.addText(`${CARD_TYPE}`);

  // Checking Label
  let checkingLabel;
  if (CHECKING_ACCOUNT > MONTHLY_LIMIT) {
    checkingLabel = row_3.addText(`CHK: MAX`);
    checkingLabel.textColor = STYLE.color.greyedOut;
  } else {
    let formattedChecking = formatCurrency(CHECKING_ACCOUNT, DEVICE_LOCALE);
    checkingLabel.addText(`CHK: ${formattedChecking}`);
  }
  checkingLabel.font = STYLE.font.row_3;

  // Savings Label
  let savingsLabel;
  if (SAVINGS_ACCOUNT == 0) {
    savingsLabel = row_3.addText('SAV: ←');
    savingsLabel.textColor = STYLE.color.greyedOut;
  } else {
    let formattedSavings = formatCurrency(SAVINGS_ACCOUNT, DEVICE_LOCALE);
    savingsLabel.addText(`SAV: ${formattedSavings}`);
    savingsLabel.textColor = STYLE.color.negativeBalance;
  }
  savingsLabel.font = STYLE.font.row_3;

  // Row 3 complete
  mainColumn.addSpacer();
}

function addRow_2(mainColumn, remainingBalance, CURRENCY_CODE) {
  const row_2 = mainColumn.addStack();

  // Balance Label
  const formattedBalance = formatCurrency(remainingBalance, DEVICE_LOCALE, CURRENCY_CODE);
  const balanceLabel = row_2.addText(formattedBalance);
  balanceLabel.textColor = getBalanceColor(remainingBalance);
  balanceLabel.font = STYLE.font.row_2;

  // Row 2 complete
  mainColumn.addSpacer();
}

function getBalanceColor(balance) {
  if (balance < 0.00) {
    return STYLE.color.negativeBalance;
  }
}

/**
 *@param {float} amount
 *@param {string} currencySymbol
 */
 function formatCurrency(amount, locale='en-US', currency='USD') {
  return amount.toLocaleString(locale, {style: 'currency', currency: currency });
}

function addRow_1(mainColumn) {
  const row_1 = mainColumn.addStack();

  // Card Name Label
  const cardNameLabel = row_1.addText(CARD_NAME);
  cardNameLabel.font = STYLE.font.row_1;
  row_1.addSpacer();

  // Days Left Label
  const currentDate = getCurrentDateString();
  const numberOfDays = daysBetweenDates(currentDate, CLOSING_DATE);
  const daysLeftLabel = row_1.addText(`${EMOJI} ${numberOfDays}`);
  daysLeftLabel.font = STYLE.font.row_1;

  // Row 1 complete
  mainColumn.addSpacer();
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

function getCurrentDateString() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  return `${month}-${day}-${year}`;
}

function allocateSpending() {
  if (CHECKING_ACCOUNT >= MONTHLY_LIMIT) {
    CHECKING_ACCOUNT = MONTHLY_LIMIT;
    SAVINGS_ACCOUNT = TOTAL_SPENT - MONTHLY_LIMIT;
  } else {
    CHECKING_ACCOUNT = TOTAL_SPENT;
    SAVINGS_ACCOUNT = 0;
  }
  const remainingBalance = MONTHLY_LIMIT - TOTAL_SPENT;
  return [remainingBalance, CHECKING_ACCOUNT, SAVINGS_ACCOUNT];
}

/**
 * Loads the card configuration from the specified path.
 *
 * @param {string} cardConfigPath - The path to the configuration file.
 * @returns {JSON} The configuration as a JSON object.
 */
function readConfigFile(configPath) {
  const fm = FileManager.iCloud();
  const directory = fm.documentsDirectory();
  const filePath = fm.joinPath(directory, configPath);

  if (!fm.fileExists(filePath)) {
    console.log(`File not found: ${filePath}`);
    return null;
  }

  const content = fm.readString(filePath);
  if (!content) {
    console.log(`Unable to read file: ${filePath}`)
    return null;
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    console.log(`Error parsing JSON: ${error}`);
    return null;
  }
}

main();
