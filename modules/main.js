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

function formatCurrency(amount, locale = 'en-US', currency = 'USD', includeCurrencySymbol = true) {
    const options = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    if (includeCurrencySymbol) {
        options.style = 'currency';
        options.currency = currency;
    } else {
        options.style = 'decimal';
    }
    return amount.toLocaleString(locale, options);
}

function createVisualizer(remainingBalance) {
    const widget = new ListWidget();
    const size = config.widgetFamily;
    const mainColumn = widget.addStack().layoutVertically();
    if (size === "small") {
        // UI for the small widget
        smallVisualizer(mainColumn, remainingBalance);
    } else if (size === "medium") {
        // UI for the medium widget
        mediumVisualizer(mainColumn, remainingBalance);
    }
    return widget;
}

function smallRow_1(mainColumn) {
    const row_1 = mainColumn.addStack();
    // Card Name Label
    const cardNameLabel = row_1.addText(CARD_NAME + '\n');
    cardNameLabel.font = STYLE.font.row_1;
    row_1.addSpacer();
    // Spacer after row 1
    mainColumn.addSpacer();
}

function smallRow_2(mainColumn, remainingBalance) {
    const row_2 = mainColumn.addStack();
    // Determine the balance amount and font based on CARD_TYPE
    const isCurrentBalance = CARD_TYPE === "CURRENT BALANCE";
    const balanceAmount = isCurrentBalance ? TOTAL_SPENT : remainingBalance;
    const balanceText = formatCurrency(balanceAmount, DEVICE_LOCALE, CURRENCY_CODE);
    // Add the balance text to row_2
    const balanceLabel = row_2.addText(balanceText);
    // Set font and text color
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
    // Determine the label text based on CARD_TYPE
    const labelText = CARD_TYPE === "CURRENT BALANCE" ? "CURRENT" : CARD_TYPE;
    // Card Type Label
    const cardTypeLabel = cardTypeBackground.addText(labelText);
    cardTypeLabel.font = STYLE.font.row_3;
    // Spacer after row 3
    mainColumn.addSpacer();
}

function smallRow_4(mainColumn) {
    const row_4 = mainColumn.addStack();
    let formattedAmount;
    if (typeof RECENT !== 'number' || isNaN(RECENT)) {
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

function smallVisualizer(mainColumn, remainingBalance) {
    smallRow_1(mainColumn)
    smallRow_2(mainColumn, remainingBalance)
    smallRow_3(mainColumn)
    smallRow_4(mainColumn)
}

function formatCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${month}-${day}-${year}`;
}

function daysBetweenDates(currentDate, closingDate) {
    const parseDate = (dateString) => {
        const [month, day, year] = dateString.split("-");
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    try {
        const date1 = parseDate(currentDate);
        const date2 = parseDate(closingDate);

        if (isNaN(date1) || isNaN(date2)) throw new Error("Invalid date format.");

        const timeDifference = date2 - date1;
        const days = Math.trunc(timeDifference / (1000 * 60 * 60 * 24));
        return days;
    } catch (error) {
        console.error("Error in daysBetweenDates:", error.message);
        return null;
    }
}


function mediumRow_1() {
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

function mediumRow_2() {
    

}

function mediumRow_3() {

}

function mediumRow_4() {

}

function mediumVisualizer(mainColumn, remainingBalance) {
    mediumRow_1(mainColumn)
    mediumRow_2(mainColumn, remainingBalance)
    mediumRow_3(mainColumn)
    mediumRow_4(mainColumn)
}
