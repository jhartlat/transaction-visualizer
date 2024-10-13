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
// Get the widget parameter and trim trailing spaces
let PARAM = args.widgetParameter ? args.widgetParameter.trimEnd() : null;

// Check if running in the app
if (config.runsInApp) {
  let widget = new ListWidget();
  widget.addText("This script only runs in a widget.\nAdd one to the home screen.");
  widget.presentMedium();
  Script.complete();
  return;
}

// Check if a valid parameter is provided
if (!PARAM) {
  let widget = new ListWidget();
  widget.addText("1. Please long press this widget.\n2. Edit Widget\n3. Provide an existing 'Card Name' for the parameter.");
  Script.setWidget(widget);
  widget.presentMedium();
  Script.complete();
  return;
}

// Construct the file path
const CONFIG_PATH = `Transaction Visualizer/${PARAM}/config.json`;

// File handling with iCloud
let FM = FileManager.iCloud();
let DIRECTORY = FM.documentsDirectory();
let FILE_PATH = FM.joinPath(DIRECTORY, CONFIG_PATH);

// Check if the file exists
if (!FM.fileExists(FILE_PATH)) {
  let widget = new ListWidget();
  widget.addText("This 'Card Name' parameter either does not exist, is misspelled, or has incorrect casing.");
  Script.setWidget(widget);
  widget.presentMedium();
  Script.complete();
  return;  
}

// If the file exists and all checks pass, show the card name
let widget = new ListWidget();
widget.addText(`Displaying information for card: ${PARAM}`);
Script.setWidget(widget);
widget.presentMedium();
Script.complete();
const CONFIG_DATA = readConfigFile();
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
    "Emoji": emoji
  } = CONFIG_DATA;

  CARD_NAME = cardName.trimEnd() || "SAPPHIRE PREFERRED";
  BACKGROUND_COLOR = backgroundColor.trimEnd() || "#0F52BA";
  TOTAL_SPENT = parseFloat(totalSpent) || 0;
  MONTHLY_LIMIT = parseFloat(monthlyLimit) || 0;
  RECENT = parseFloat(recent) || "N/A";
  CURRENCY_CODE = currencyCode.trimEnd() || "USD";
  CARD_TYPE = cardType.trimend() || "CREDIT";
  CLOSING_DATE = closingDate.trimEnd() || "11-09-2024";
  EMOJI = emoji.trimEnd() || "🗓️";
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
  let percentageFilled = 0;

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


  // Activity Amount
  let formattedAmount = RECENT;

  if (typeof(RECENT) == "number") {

    if (RECENT > 0) {
      formattedAmount = '-' + formatCurrency(RECENT, DEVICE_LOCALE, CURRENCY_CODE);
    } else {
      formattedAmount = '+' + formatCurrency((RECENT* -1), DEVICE_LOCALE, CURRENCY_CODE);
    }
  }

  // Amount Label
  const amountLabel = row_4.addText(formattedAmount);
  if (formattedAmount == 'N/A') {
    amountLabel.textColor = STYLE.color.greyedOut;
  }
  amountLabel.font = STYLE.font.row_4
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

function getComplementaryColor(hex) {
  if (hex.charAt(0) === '#') {
    hex = hex.slice(1);
  }
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = 255 - r;
  g = 255 - g;
  b = 255 - b;

  let complementaryHex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`

  return complementaryHex
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
    cardTypeBackground.backgroundColor = new Color(complementaryHex(BACKGROUND_COLOR));
  }

  // Alignment Stack
  const alignmentStack = row_3.addStack();
  alignmentStack.setPadding(5, 10, 5, 10);


  // Card Type Label
  const cardTypeLabel = cardTypeBackground.addText(`${CARD_TYPE}`);
  cardTypeLabel.font = STYLE.font.row_3;

  // Checking Label
  let checkingLabel;
  if (CHECKING_ACCOUNT == MONTHLY_LIMIT) {
    checkingLabel = alignmentStack.addText(`CHK: MAX `);
    checkingLabel.textColor = STYLE.color.greyedOut;
  } else {
    let formattedChecking = formatCurrency(CHECKING_ACCOUNT, DEVICE_LOCALE, CURRENCY_CODE);
    checkingLabel = alignmentStack.addText(`CHK: ${formattedChecking} `);
  }
  checkingLabel.font = STYLE.font.row_3;

  // Savings Label
  let savingsLabel;
  if (SAVINGS_ACCOUNT == 0) {
    savingsLabel = alignmentStack.addText('SAV: ←');
    savingsLabel.textColor = STYLE.color.greyedOut;
  } else {
    let formattedSavings = formatCurrency(SAVINGS_ACCOUNT, DEVICE_LOCALE, CURRENCY_CODE);
    savingsLabel = alignmentStack.addText(`SAV: ${formattedSavings}`);
    savingsLabel.textColor = STYLE.color.negativeBalance;
  }
  savingsLabel.font = STYLE.font.row_3;

  // Row 3 complete
  mainColumn.addSpacer();
}

function addRow_2(mainColumn, remainingBalance) {
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
function readConfigFile() {
  const content = FM.readString(FILE_PATH);
  if (!content) {
    console.log(`Unable to read file: ${FILE_PATH}`)
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
