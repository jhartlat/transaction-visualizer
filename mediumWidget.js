const utils = importModule('utils');
const {
    DEVICE_LOCALE,
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


function main() {
    const widget = new ListWidget();
    const mainColumn = widget.addStack();
    mainColumn.layoutVertically();
    mediumRow_1(mainColumn);
    mediumRow_2(mainColumn, remainingBalance);
    mediumRow_3(mainColumn);
    mediumRow_4(mainColumn);
}

function mediumRow_1(mainColumn) {
    const row_1 = mainColumn.addStack();

    // Card Name Label
    const cardNameLabel = row_1.addText(CARD_NAME);
    cardNameLabel.font = STYLE.font.row_1;
    row_1.addSpacer();

    // Days Left Label
    const currentDate = utils.formatCurrentDate();
    const numberOfDays = utils.daysBetweenDates(currentDate, CLOSING_DATE);
    const dayLeftLabel = row_1.addText(`${EMOJI} ${numberOfDays}`);
    daysLeftLabel.font = STYLE.font.row_1;

    // Spacer after row 1
    mainColumn.addSpacer();
}


function mediumRow_2(mainColumn, remainingBalance) {
    const row_2 = mainColumn.addStack();

    if (CARD_TYPE === "CURRENT BALANCE") {
        const totalBalance = utils.formatCurrency(TOTAL_SPENT, DEVICE_LOCALE, CURRENCY_CODE);
        const totalLabel = row_2.addText(totalBalance);
    } else {
        const formattedBalance = utils.formatCurrency(remainingBalance, DEVICE_LOCALE, CURRENCY_CODE);
        const balanceLabel = row_2.addText(formatttedBalance);
        balanceLabel.textColor = utils.getBalanceColor(remainingBalance);
        balanceLabel.font = STYLE.font.row_2;
    }
    mainColumn.addSpacer();
}

function mediumRow_3() {
    const row_3 = mainColumn.addStack();

    // Card Type Background
    const cardTypeBackground = row_3.addStack();
    cardTypeBackground.cornerRadius = 5;
    cardTypeBackground.setPadding(5, 10, 5, 10);
    cardTypeBackground.backgroundColor = new Color(generateMonochromatic(BACKGROUND_COLOR));

    // Card Type Label
    const labelText = CARD_TYPE === "CURRENT BALANCE" ? "CURRENT" : CARD_TYPE;
    const cardTypeLabel = cardTypeBackground.addText(labelText);
    cardTypeLabel.font = STYLE.font.row_3;

    // Spacer after row 3
    mainColumn.addSpacer();
}
