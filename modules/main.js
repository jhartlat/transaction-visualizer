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

  function createVisualizer(remainingBalance) {
    let widget = new ListWidget();
    let size = config.widgetFamily;
    const mainColumn = widget.addStack();

    if (size === "small") {
        // UI for the small widget

        smallVisualizer(mainColumn);

    } else if (size === "medium") {
        // UI for the medium widget

        mainColumn.layoutVertically();
        mediumVisualizer(mainColumn);

    }

    return widget;
  }

  function smallVisualizer(mainColumn) {

  }

  function mediumVisualizer(mainColumn) {
    
  }
