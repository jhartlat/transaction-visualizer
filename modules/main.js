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

// Account Variables
let CHECING_ACCOUNT = TOTAL_SPENT;
let SAVINGS_ACCOUNT = 0;

