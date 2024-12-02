const DECLINE_BACKGROUND = true;
const DEVICE_LOCALE = getFormattedLocale();
const SIZE = config.widgetFamily;
const {
    cardName,
    backgroundColor,
    totalSpent,
    monthlyLimit,
    recent,
    currencyCode,
    cardType,
    closingDate,
    emoji
} = extractDetails();


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
        cardName: cardName.trimEnd(),
        backgroundColor: backgroundColor.trimEnd(),
        totalSpent: parseFloat(totalSpent),
        monthlyLimit: parseFloat(monthlyLimit),
        recent: parseFloat(recent.replace(/,/g, "")),
        currencyCode: currencyCode.trimEnd().toUpperCase(),
        cardType: cardType.trimEnd().toUpperCase(),
        closingDate: closingDate,
        emoji: emoji
    };
}


function getCardDetails() {
    const fm = FileManager.iCloud();
    const param = getWidgetParam();
    const lhs = fm.documentDirectory();
    const rhs = `transaction-visualizer/${param}/config.json`;
    const filePath = fm.joinPath(lhs, rhs);
    const content = fm.readString(filePath);
    try {
        return JSON.parse(content);
    } catch (error) {
        console.log(`Error parsing JSON: ${error}`);
        Script.complete();
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
        widgetParamEmpty();
    } else {
        args.widgetParameter.trimEnd();
    }
}


function getFormattedLocale() {
    return Device.locale.replace('_', '-');
}


module.exports = {
    DECLINE_BACKGROUND,
    DEVICE_LOCALE,
    SIZE,
    cardName,
    backgroundColor,
    totalSpent,
    monthlyLimit,
    recent,
    currencyCode,
    cardType,
    closingDate,
    emoji
};
