const DECLINE_BACKGROUND = true;
const DEVICE_LOCALE = getFormattedLocale();
const SIZE = config.widgetFamily;


const {
    TOTAL_SPENT,
    MONTHLY_LIMIT
} = extractDetails();


const STYLE = {
    font: {
        row_1: Font.boldSystemFont(15),
        row_2: Font.boldSystemFont(26),
        row_3: Font.boldSystemFont(13),
        row_4: Font.boldSystemFont(13)
    },
    color: {
        negativeBalance: new Color("#DD4500"),
        greyedOut: new Color("#818589"),
        empty: new Color("#1E1E1E")
    }
};


function extractDetails() {
    const cardDetails = getCardDetails();
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
    } = cardDetails;

    return {
        CARD_NAME: cardName.trimEnd(),
        BACKGROUND_COLOR: backgroundColor.trimEnd(),
        TOTAL_SPENT: parseFloat(totalSpent),
        MONTHLY_LIMIT: parseFloat(monthlyLimit),
        RECENT: parseFloat(recent.replace(/,/g, "")),
        CURRENCY_CODE: currencyCode.trimEnd().toUpperCase(),
        CARD_TYPE: cardType.trimEnd().toUpperCase(),
        CLOSING_DATE: closingDate,
        EMOJI: emoji
    };
}


function getCardDetails() {
    const fm = FileManager.iCloud();
    const param = getWidgetParam();
    const lhs = fm.documentsDirectory();
    const rhs = `transaction-visualizer/cards/${param}/config.json`;
    const filePath = fm.joinPath(lhs, rhs);
    const content = fm.readString(filePath);
    try {
        return JSON.parse(content);
    } catch (error) {
        console.log(`Error parsing JSON: ${error}`);
    }
}


function widgetParamEmpty() {
    const widget = new ListWidget();
    const instructions = 'Please long-press this widget, select "Edit Widget," and'
    + 'set the Parameter to your existing "Card Name."';
    widget.addText(instructions);
    Script.setWidget(widget);
    Script.complete();
}


function getWidgetParam() {
    if (!args.widgetParameter) {
        return widgetParamEmpty();
    } else {
        return args.widgetParameter.trimEnd();
    }
}


function getFormattedLocale() {
    return Device.locale().replace('_', '-');
}


function calculateBalances() {
    const remainingBalance = MONTHLY_LIMIT - TOTAL_SPENT;
    let checkingBalance, savingsBalance;

    if (TOTAL_SPENT >= MONTHLY_LIMIT) {
        checkingBalance = MONTHLY_LIMIT;
        savingsBalance = TOTAL_SPENT - MONTHLY_LIMIT;
    } else {
        checkingBalance = TOTAL_SPENT;
        savingsBalance = 0;
    }

    return {
        REMAINING_BALANCE: remainingBalance,
        CHECKING_BALANCE: checkingBalance,
        SAVINGS_BALANCE: savingsBalance
    }
}


module.exports = {
    DECLINE_BACKGROUND,
    DEVICE_LOCALE,
    SIZE,
    STYLE,
    extractDetails,
    calculateBalances
};
