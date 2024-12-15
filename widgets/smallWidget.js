const utils = importModule('utils/widgetUtils');


const {
    DEVICE_LOCALE,
    STYLE,
    extractDetails,
    calculateBalances,
} = importModule('constants/constants');


const {
    CARD_NAME,
    BACKGROUND_COLOR,
    TOTAL_SPENT,
    RECENT,
    CURRENCY_CODE,
    CARD_TYPE,
} = extractDetails();


const {
    REMAINING_BALANCE
} = calculateBalances();


function smallWidget() {
    const widget = new ListWidget();
    const mainColumn = widget.addStack();
    mainColumn.layoutVertically();
    smallRow_1(mainColumn);
    smallRow_2(mainColumn);
    smallRow_3(mainColumn);
    smallRow_4(mainColumn);
    return widget;
}


function addCardNameLabel(row_1) {
    const text = CARD_NAME + '\n';
    const cardNameLabel = row_1.addText(text);
    cardNameLabel.font = STYLE.font.row_1;
}


function smallRow_1(mainColumn) {
    const row_1 = mainColumn.addStack();
    addCardNameLabel(row_1);
    //row_1.addSpacer();
    //mainColumn.addSpacer();
}


function addCurrentBalance(row_2) {
    const currentBalance = utils.formatCurrency(TOTAL_SPENT, DEVICE_LOCALE, CURRENCY_CODE);
    const formattedBalance = utils.formatString(currentBalance);
    const currentBalanceLabel = row_2.addText(formattedBalance);
    currentBalanceLabel.font = STYLE.font.row_2;
}


function addRemainingBalance(row_2) {
    const remainingBalance = utils.formatCurrency(REMAINING_BALANCE, DEVICE_LOCALE, CURRENCY_CODE);
    const formattedBalance = utils.formatString(remainingBalance);
    const remainingBalanceLabel = row_2.addText(formattedBalance);
    remainingBalanceLabel.textColor = utils.getBalanceColor(REMAINING_BALANCE);
    remainingBalanceLabel.font = STYLE.font.row_2;
}


function smallRow_2(mainColumn) {
    const row_2 = mainColumn.addStack();
    if (CARD_TYPE === "CURRENT BALANCE") {
        addCurrentBalance(row_2);
    } else {
        addRemainingBalance(row_2);
    }
    mainColumn.addSpacer();
}


function addCardTypeBackground(row_3) {
    const cardTypeBackground = row_3.addStack();
    cardTypeBackground.cornerRadius = 5;
    cardTypeBackground.setPadding(5, 10, 5, 10);
    cardTypeBackground.backgroundColor = new Color(utils.getMonochromeColor(BACKGROUND_COLOR));
    return cardTypeBackground;
}


function addCardTypeLabel(backgroundStack, text) {
    const cardTypeLabel = backgroundStack.addText(text);
    cardTypeLabel.font = STYLE.font.row_3;
}


function smallRow_3(mainColumn) {
    const row_3 = mainColumn.addStack();
    const backgroundStack = addCardTypeBackground(row_3);
    if (CARD_TYPE === "CURRENT BALANCE") {
        addCardTypeLabel(backgroundStack, "CURRENT");
    } else {
        addCardTypeLabel(backgroundStack, CARD_TYPE);
    }
    mainColumn.addSpacer();
}


function getActivityAmount() {
    if (typeof(RECENT) === "number" && RECENT > 0) {
        return '-' + utils.formatCurrency(RECENT, DEVICE_LOCALE, CURRENCY_CODE);
    } else if (typeof(RECENT) === "number" && RECENT < 0) {
        return '+' + utils.formatCurrency((RECENT * -1), DEVICE_LOCALE, CURRENCY_CODE);
    } else {
        return "N/A";

    }
}

function addAmountLabel(row_4, formattedAmount) {
    const amountLabel = row_4.addText(formattedAmount);
    if (formattedAmount == 'N/A') {
        amountLabel.textColor = STYLE.color.greyedOut;
    }
    amountLabel.font = STYLE.font.row_4
}


function smallRow_4(mainColumn) {
    const row_4 = mainColumn.addStack();
    const activityAmount = getActivityAmount();
    addAmountLabel(row_4, activityAmount);
    row_4.addSpacer();
}


module.exports = {
    smallWidget
};
