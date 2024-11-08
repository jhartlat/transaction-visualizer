// Import the constants module
const constants = importModule(`modules/constants`);

// Destructure constants and functions
const {
    DECLINE_BACKGROUND,
    DEVICE_LOCALE,
    STYLE,
    PARAM,
    FM,
    DIRECTORY,
    CONFIG_FILE,
    readConfigData
} = constants;

// Get configuration data
const {
    CARD_NAME,
    BACKGROUND_COLOR,
    TOTAL_SPENT,
    MONTHLY_LIMIT,
    RECENT,
    CURRENCY_CODE,
    CARD_TYPE,
    CLOSING_DATE,
    EMOJI
} = readConfigData();

function getBalanceColor(balance) {
    if (balance < 0.00) {
        return STYLE.color.negativeBalance;
    }
}

function allocateSpending() {
    const remainingBalance = MONTHLY_LIMIT - TOTAL_SPENT;
    let checkingAccount = TOTAL_SPENT;
    let savingsAccount = 0;
    if (TOTAL_SPENT >= MONTHLY_LIMIT) {
        checkingAccount = MONTHLY_LIMIT;
        savingsAccount = TOTAL_SPENT - MONTHLY_LIMIT;

    }
    return [remainingBalance, checkingAccount, savingsAccount];
}

function smallRow_1(mainColumn) {
    const row_1 = mainColumn.addStack();

    // Card Name Label
    const cardNameLabel = row_1.addText(CARD_NAME + '\n');
    cardNameLabel.font = STYLE.font.row_1;

    // Spacer after row 1
    mainColumn.addSpacer();
}

function smallRow_2(mainColumn, remainingBalance) {
    const row_2 = mainColumn.addStack();

    // Balance Label
    const isCurrentBalance = CARD_TYPE === "CURRENT BALANCE";
    const balanceAmount = isCurrentBalance ? TOTAL_SPENT : remainingBalance;
    const balanceText = formatCurrency(balanceAmount, DEVICE_LOCALE, CURRENCY_CODE);
    const balanceLabel = row_2.addText(balanceText);
    balanceLabel.font = STYLE.font.row_2;
    if (!isCurrentBalance) {
        balanceLabel.textColor = getBalanceColor(remainingBalance);
    }

    // Spacer after row 2
    mainColumn.addSpacer();
}

function smallRow_3(mainColumn) {
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

function smallRow_4(mainColumn) {
    const row_4 = mainColumn.addStack();

    let formattedAmount;
    if (typeof (RECENT) !== 'number' || isNaN(RECENT)) {
        formattedAmount = 'N/A';
    } else if (RECENT >= 0) {
        formattedAmount = '-' + formatCurrency(RECENT, DEVICE_LOCALE, CURRENCY_CODE);
    } else {
        formattedAmount = '+' + formatCurrency(Math.abs(RECENT), DEVICE_LOCALE, CURRENCY_CODE);
    }

    // Amount Label
    const amountLabel = amountRow.addText(formattedAmount);
    if (formattedAmount === 'N/A') {
        amountLabel.textColor = STYLE.color.greyedOut;
    }
    amountLabel.font = STYLE.font.row_4;

    // Spacer after row 4
    amountRow.addSpacer();
}

function mediumRow_1(mainColumn) {
    const row_1 = mainColumn.addStack();

    // Card Name Label
    const cardNameLabel = row_1.addText(CARD_NAME);
    cardNameLabel.font = STYLE.font.row_1;
    row_1.addSpacer();

    // Days Left Label
    const currentDate = formatCurrentDate();
    const numberOfDays = daysBetweenDates(currentDate, CLOSING_DATE);
    const dayLeftLabel = row_1.addText(`${EMOJI} ${numberOfDays}`);
    daysLeftLabel.font = STYLE.font.row_1;

    // Spacer after row 1
    mainColumn.addSpacer();
}

function mediumRow_2(mainColumn, remainingBalance) {
    const row_2 = mainColumn.addStack();

    if (CARD_TYPE === "CURRENT BALANCE") {
        const totalBalance = formatCurrency(TOTAL_SPENT, DEVICE_LOCALE, CURRENCY_CODE);
        const totalLabel = row_2.addText(totalBalance);
    } else {
        const formattedBalance = formatCurrency(remainingBalance, DEVICE_LOCALE, CURRENCY_CODE);
        const balanceLabel = row_2.addText(formatttedBalance);
        balanceLabel.textColor = getBalanceColor(remainingBalance);
        balanceLabel.font = STYLE.font.row_2;
    }
    mainColumn.addSpacer();
}

function mediumRow_3(mainColumn) {
    const row_3 = mainColumn.addStack();

    // Card Type Background
    const cardTypeBackground = row_3.addStack();
    cardTypeBackground.cornerRadius = 5;
    cardTypeBackground.setPadding(5, 10, 5, 10);
    cardTypeBackground.backgroundColor = new Color(generateMonochromatic(BACKGROUND_COLOR));

    // Alignment Stack
    const alignmentStack = row_3.addStack();
    alignmentStack.setPadding(5, 10, 5, 10);

    // Card Type Label

    if (CARD_TYPE == "CURRENT BALANCE") {
        let card_type = CARD_TYPE;
        let cardTypeLabel = cardTypeBackground.addText(`${card_type}`);
        cardTypeLabel.font = STYLE.font.row_3;
        mainColumn.addSpacer();
        return;
    }
    let cardTypeLabel = cardTypeBackground.addText(`${CARD_TYPE}`);
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

function mediumRow_4() {
    function addRow_4(mainColumn) {
        const row_4 = mainColumn.addStack();

        // Last Activity Label
        const lastActivityLabel = row_4.addText("Last Activity: ");
        lastActivityLabel.font = STYLE.font.row_4;

        // Activity Amount
        let formattedAmount = RECENT;
        if (typeof (RECENT) == "number") {

            if (RECENT > 0) {
                formattedAmount = '-' + formatCurrency(RECENT, DEVICE_LOCALE, CURRENCY_CODE);
            } else {
                formattedAmount = '+' + formatCurrency((RECENT * -1), DEVICE_LOCALE, CURRENCY_CODE);
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
}

function budgetProgressBar(widget, remainingBalance) {

    let percentageFilled = 0;
    if (CARD_TYPE === "CURRENT BALANCE") {
        percentageFilled = 1; // Ensure the progress bar is fully filled (no decline)
    } else if (remainingBalance > 0) {
        if (DECLINE_BACKGROUND) {
            percentageFilled = remainingBalance / MONTHLY_LIMIT;
        } else {
            percentageFilled = 1;
        }
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

module.exports = {
    allocateSpending,
    smallRow_1,
    smallRow_2,
    smallRow_3,
    smallRow_4,
    mediumRow_1,
    mediumRow_2,
    mediumRow_3,
    mediumRow_4,
    budgetProgressBar
}
