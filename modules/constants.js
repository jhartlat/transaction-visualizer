// Configuration Constants
const DECLINE_BACKGROUND = true;
const DEVICE_LOCALE = Device.locale().replace('_', '-');
const STYLE = {
    font: {
        row_1: Font.boldSystemFont(15),
        row_2: Font.boldSystemFont(26),
        row_3: Font.boldSystemFont(13),
        row_4: Font.boldSystemFont(13)
    },
    color: {
        negativeBalance: new Color("#DD4500"),
        greyedOut: new Color("#818589")
    }
};

// Dependencies
function widgetParameterEmpty() {
    const widget = new ListWidget();
    widget.addText(`1. Please <long press> this widget.\n`);
    widget.addText(`2. Edit Widget\n`);
    widget.addText(`3. Parameter = existing 'Card Name'.`);
    Script.setWidget(widget);
    widget.presentMedium();
    Script.complete();
}

// File Management Constants
const PARAM = args.widgetParameter ? args.widgetParameter.trimEnd() : widgetParameter();
const FM = FileManager.iCloud();
const DIRECTORY = FM.documentDirectory();
const CONFIG_FILE = `transaction-visualizer/${PARAM}/config.json`;

// Function to read configuration data
function readConfigFile() {
    const content = FM.readString(CONFIG_FILE);
    if (!content) {
      console.log(`Unable to read file: ${CONFIG_FILE}`)
      return null;
    }
    try {
      return JSON.parse(content);
    } catch (error) {
      console.log(`Error parsing JSON: ${error}`);
      return null;
    }
}

function readConfigData() {
    const CONFIG_DATA = readConfigFile();
    if (CONFIG_DATA) {
        const {
            "Card Name": cardName = '',
            "Background Color": backgroundColor = "#006400",
            "Total Spent": totalSpent = '0',
            "Monthly Limit": monthlyLimit = '0',
            "Recent": recent = '0',
            "Currency Code": currencyCode = "USD",
            "Card Type": cardType = "CREDIT",
            "Closing Date": closingDate = '',
            "Emoji": emoji = ''
        } = CONFIG_DATA;

        return {
            CARD_NAME: cardName.trimEnd(),
            BACKGROUND_COLOR: backgroundColor.trimEnd(),
            TOTAL_SPENT: parseFloat(totalSpent),
            MONTHLY_LIMIT: parse(monthlyLimit),
            RECENT: parseFloat(recent.replace(/,/g, '')),
            CURRENCY_CODE: currencyCode.trimEnd().toUppercase(),
            CARD_TYPE: cardType.trimEnd().toUppercase(),
            CLOSING_DATE: closingDate,
            EMOJI: emoji
        };
    }
}

module.exports = {
    DECLINE_BACKGROUND,
    DEVICE_LOCALE,
    STYLE,
    PARAM,
    FM,
    DIRECTORY,
    CONFIG_FILE,
    readConfigData,
};
