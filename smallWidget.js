const utils = importModule('utils');
const {
    DEVICE_LOCALE,
    STYLE,
    CARD_NAME,
    BACKGROUND_COLOR,
    TOTAL_SPENT,
    MONTHLY_LIMIT,
    RECENT,
    CURRENCY_CODE,
    CARD_TYPE,
    CLOSING_DATE,
    EMOJI
} = importModule('constants');


function createSmallWidget() {
    const widget = new ListWidget();
    const mainColumn = widget.addStack();
    mainColumn.layoutVertically();
    mediumRow_1(mainColumn);
    mediumRow_2(mainColumn);
    mediumRow_3(mainColumn);
    mediumRow_4(mainColumn);
    return widget;
}


function main() {
    const smallWidget = createSmallWidget();
}


function addCardNameLabel(row_1) {
    const text = CARD_NAME + '/n';
    const cardNameLabel = row_1.addText(text);
    cardNameLabel.font = STYLE.font.row_1;
}


function smallRow_1(mainColumn) {
    const row_1 = mainColumn.addStack();
    addCardNameLabel(row_1);
    row_1.addSpacer();
    mainColumn.addSpacer();
}


function addCurrentBalance(row_2) {
    const currentBalance = utils.formatCurrency(TOTAL_SPENT, DEVICE_LOCALE, CURRENCY_CODE);
    const currentBalanceLabel = row_2.addText(utils.formatString(currentBalance));
    currentBalanceLabel.font = Font.boldSystemFont(26);
}


function addRemainingBalance(row_2) {
    const remainingBalance = utils.formatCurrency('remainingBalance', DEVICE_LOCALE, CURRENCY_CODE);
    const remainingBalanceLabel = row_2.addText(utils.formatString(remainingBalance));
    remainingBalanceLabel.textColor = utils.getBalanceColor('remainingBalance');
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


function addAlignmentStack(row_3) {
    const alignmentStack = row_3.addStack();
    alignmentStack.setPadding(5, 10, 5, 10);
    return alignmentStack;
}


function addCardTypeLabel(backgroundStack) {
    const cardTypeLabel = backgroundStack.addText(`${CARD_TYPE}`);
    cardTypeLabel.font = STYLE.font.row_3;
}


function addCheckingLabel(alignmentStack) {
    let checkingLabel;
    if ('checkingBalance' === MONTHLY_LIMIT) {
        checkingLabel = alignmentStack.addText("CHK: MAX ");
        checkingLabel.textColor = STYLE.color.greyedOut;
    } else {
        let formattedChecking = utils.formatCurrency(checkingBalance, DEVICE_LOCALE, CURRENCY_CODE);
        checkingLabel = alignmentStack.addText(`CHK: ${formattedChecking}`);
    }
    checkingLabel.font = STYLE.font.row_3;
}


function addSavingsLabel(alignmentStack) {
    let savingsLabel;
    if ('savingsBalance' === 0) {
        savingsLabel = alignmentStack.addText("SAV: ←");
        savingsLabel.textColor = STYLE.color.greyedOut;
    } else {
        let formattedSavings = utils.formatCurrency(savingsBalance, DEVICE_LOCALE, CURRENCY_CODE);
        savingsLabel = alignmentStack.addText(`SAV: ${formattedSavings}`);
        savingsLabel.textColor = STYLE.color.negativeBalance;
    }
    savingsLabel.font = STYLE.font.row_3;
}


function mediumRow_3(mainColumn) {
    const row_3 = mainColumn.addStack();
    const backgroundStack = addCardTypeBackground(row_3);
    const alignmentStack = addAlignmentStack(row_3);
    if (CARD_TYPE === "CURRENT BALANCE") {
        addCardTypeLabel(backgroundStack);
        mainColumn.addSpacer();
        return;
    }
    addCardTypeLabel(backgroundStack);
    addCheckingLabel(alignmentStack);
    addSavingsLabel(alignmentStack);
    mainColumn.addSpacer();
}


function addActivityLabel(row_4) {
    const activityLabel = row_4.addText("Last Activity: ");
    activityLabel.font = STYLE.font.row_4;
}


function getActivityAmount() {
    if (typeof(RECENT) === "number" && RECENT > 0) {
        return '-' + formatCurrency(RECENT, DEVICE_LOCALE, CURRENCY_CODE);
    } else {
        return '+' + formatCurrency((RECENT * -1), DEVICE_LOCALE, CURRENCY_CODE);
    }
}


function addAmountLabel(row_4, formattedAmount) {
    const amountLabel = row_4.addText(formattedAmount);
    if (formattedAmount == 'N/A') {
        amountLabel.textColor = STYLE.color.greyedOut;
    }
    amountLabel.font = STYLE.font.row_4
}


function addCurrentTimeLabel(row_4) {
    const currentTime = utils.getTime();
    const currentTimeLabel = row_4.addText(currentTime);
    currentTimeLabel.font = STYLE.font.row_4;
}


function mediumRow_4(mainColumn) {
    const row_4 = mainColumn.addStack();
    addActivityLabel(row_4);
    const activityAmount = getActivityAmount();
    addAmountLabel(row_4, activityAmount);
    row_4.addSpacer();
    addCurrentTimeLabel(row_4);
    mainColumn.addSpacer();
}


module.exports = {
    mediumWidget
};
