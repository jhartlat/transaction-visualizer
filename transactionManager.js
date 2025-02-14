const CARD_NAME = args.shortcutParameter;
const FM = FileManager.iCloud();
const DIRECTORY = FM.documentsDirectory();
const CONFIG_FILE = getFilePath("config.json");
const TRANSACTION_FILE = getFilePath("transactions.txt");
const KEYS = {
    CLOSING_DATE: "Closing Date",
    MONTHLY_LIMIT: "Monthly Limit",
    RECENT: "Recent",
    TOTAL_SPENT: "Total Spent"
};


function getFilePath(fileName) {
    return FM.joinPath(DIRECTORY,`transaction-visualizer/cards/${CARD_NAME}/${fileName}`);
}


function readJsonValue(key) {
    if (!FM.fileExists(CONFIG_FILE)) {
        throw new Error(`File does not exist at ${filePath}.`);
    }
    const content = FM.readString(CONFIG_FILE);
    const jsonData = JSON.parse(content);
    return jsonData[key];
}


function convertToDateObj(dateStr) {
    const parts = dateStr.split("-");
    if (parts.length !== 3) {
        throw new Error("Invalid date string format. Expected format MM-DD-YYYY.");
    }
    const [month, day, year] = parts;
    return new Date(year, month - 1, day);
}


function isCurrentDatePastClosing(currentDate, closingDate) {
    closingDate = convertToDateObj(closingDate);
    return currentDate > closingDate;
}


function isLeap(year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}


function convertToDateString(dateObj) {
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${month}-${day}-${year}`;
}


function getNextClosingDate(date) {
    const daysInMonth = {
        "1": 31,
        "2": 28,
        "3": 31,
        "4": 30,
        "5": 31,
        "6": 30,
        "7": 31,
        "8": 31,
        "9": 30,
        "10": 31,
        "11": 30,
        "12": 31
    }
    closingDate = convertToDateObj(date);
    month = (closingDate.getMonth() + 1).toString();
    year = (closingDate.getFullYear());
    if (month == "2") {
        daysInMonth[month] = isLeap(year) ? 29 : 28;
    }
    closingDate.setDate(closingDate.getDate() + daysInMonth[month]);
    return convertToDateString(closingDate);
}


function updateClosingDate(closingDate) {
    const currentDate = new Date();
    if (!isCurrentDatePastClosing(currentDate, closingDate)) {
        return closingDate;
    }
    logAllocationFile(closingDate);
    resetTransactions(TRANSACTION_FILE);
    return getNextClosingDate(closingDate);
}


function logAllocationFile(closingDate) {
    const logName = "transaction-visualizer-log.txt"
    const totalSpent = Math.round(sumTransactions(TRANSACTION_FILE) * 100) / 100;
    let [deductFromChecking, deductFromSavings] = logSpending(totalSpent);
    let total = deductFromChecking + deductFromSavings;
    const newContent = `${closingDate}\n`
    + `CHK: ${deductFromChecking.toFixed(2)} + `
    + `SAV: ${deductFromSavings.toFixed(2)} = `
    + `${total.toFixed(2)}\n`;
    const filePath = getFilePath(logName);
    FM.writeString(filePath, newContent);
}


function logSpending(totalSpent) {
    const content = FM.readString(CONFIG_FILE);
    try {
        const jsonData = JSON.parse(content);
        if (KEYS.MONTHLY_LIMIT in jsonData) {
            let monthlyLimit = parseFloat(jsonData[KEYS.MONTHLY_LIMIT]);
            let deductFromChecking = totalSpent;
            let deductFromSavings = 0;
            if (deductFromChecking >= monthlyLimit) {
                deductFromChecking = monthlyLimit;
                deductFromSavings = totalSpent - monthlyLimit;
            } else {
                deductFromChecking = totalSpent;
                deductFromSavings = 0.00;
            }
            return [deductFromChecking, deductFromSavings];
        }
        else {
            console.log(`${key} not found in the JSON object.`);
        }
    }
    catch (e) {
        console.log(`\nError parsing JSON data:\n${e}`);
    }
}


function resetTransactions() {
    FM.writeString(TRANSACTION_FILE, "0.00");
}


function updateConfigFile(key, newValue) {
    const content = FM.readString(CONFIG_FILE);
    try {
        const jsonData = JSON.parse(content);
        if (key in jsonData) {
            jsonData[key] = newValue;
            const updatedContent = JSON.stringify(jsonData, null, 2);
            FM.writeString(CONFIG_FILE, updatedContent);
            console.log(`${key} key in file updated successfully.`);
        }
        else {
            console.log(`${key} not found in the JSON object.`);
        }
    }
    catch (e) {
        console.log(`\nError parsing JSON data:\n${e}`);
    }
}


function sumTransactions() {
    if (!FM.fileExists(TRANSACTION_FILE)) {
        FM.writeString(TRANSACTION_FILE, "0.00");
    }
    const content = FM.readString(TRANSACTION_FILE);
    const transactions = content.split("\n");
    let sum = 0;
    for (const transaction of transactions) {
        const cleanedTransaction = transaction.replace(/,/g, '');
        const value = parseFloat(cleanedTransaction);
        if (!isNaN(value)) {
            sum += value;
        }
    }
    return sum.toFixed(2);
}


function getLastTransaction(filePath) {
    const content = FM.readString(filePath);
    const transactions = content.split("\n").filter(line => line.trim() !== '');
    return transactions[transactions.length - 1];
}


function main() {
    try {
        const closingDate = readJsonValue(KEYS.CLOSING_DATE);
        const newClosingDate = updateClosingDate(closingDate);
        const totalSpent = sumTransactions(TRANSACTION_FILE);
        const recent = getLastTransaction(TRANSACTION_FILE);
        updateConfigFile(KEYS.CLOSING_DATE, newClosingDate);
        console.log(newClosingDate + "\n");
        updateConfigFile(KEYS.TOTAL_SPENT, totalSpent);
        console.log(totalSpent + "\n");
        updateConfigFile(KEYS.RECENT, recent);
        console.log(recent + "\n");
    }
    catch (e) {
        console.log(`\nAn error occurred in main: \n${e}`);
    }
}

module.exports = {
    main
};
