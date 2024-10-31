const KEYS = {
    CLOSING_DATE: "Closing Date",
    MONTHLY_LIMIT: "Monthly Limit",
    RECENT: "Recent",
    TOTAL_SPENT: "Total Spent"
};
const FM = FileManager.iCloud();
const CONFIG_FILE = getFilePath("Transaction Visualizer/Card Name/config.json");
const TX_FILE_PATH = getFilePath("Transaction Visualizer/Card Name/transactions.txt");


function readJsonValue(filePath, key) {
    if (!FM.fileExists(filePath)) {
        throw new Error(`File does not exist at ${filePath}.`);
    }
    const content = FM.readString(filePath);
    const jsonData = JSON.parse(content);
    return jsonData[key];
}


function getCurrentDate() {
    const currentDate = new Date();
    return currentDate;
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
    const currentDate = getCurrentDate();
    if (!isCurrentDatePastClosing(currentDate, closingDate)) {
        return closingDate;
    }
    logAllocationFile(closingDate);
    resetTransactions(TX_FILE_PATH);
    return getNextClosingDate(closingDate);
}


function logAllocationFile(closingDate) {
    const totalSpent = Math.round(sumTransactions(TX_FILE_PATH) * 100) / 100;
    let [deductFromChecking, deductFromSavings] = logSpending(totalSpent);
    const directory = FM.documentsDirectory();
    const path = FM.joinPath(directory, "Transaction Visualizer/Card Name/Log Name");
    let existingContent = FM.readString(path);
let total = deductFromChecking + deductFromSavings;
    const newContent = `${closingDate}\nCHK: ${deductFromChecking.toFixed(2)} + SAV: ${deductFromSavings.toFixed(2)} = ${total.toFixed(2)}\n`;
FM.writeString(path, newContent);



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
            }
            else {
                deductFromChecking = totalSpent;
                deductFromSavings = 0.00;
            }
            return [deductFromChecking, deductFromSavings];
        }
        else {
            console.log(`${key} not found in the JSON object.`);
        }
    }
    catch (error) {
        console.log("Error parsing JSON data:", error);
    }
}


function resetTransactions(filePath) {
    FM.writeString(filePath, "0.00");
}


function getFilePath(fileName) {
    return FM.documentsDirectory() + `/${fileName}`;
}


function updateConfigFile(filePath, key, newValue) {
    const content = FM.readString(filePath);
    try {
        const jsonData = JSON.parse(content);
        if (key in jsonData) {
            jsonData[key] = newValue;
            const updatedContent = JSON.stringify(jsonData, null, 2);
            FM.writeString(filePath, updatedContent);
            console.log(`${key} key in file updated successfully.`);
        }
        else {
            console.log(`${key} not found in the JSON object.`);
        }
    }
    catch (error) {
        console.log("Error parsing JSON data:", error);
    }

}


function sumTransactions(filePath) {
    const content = FM.readString(filePath);
    const transactions = content.split("\n");
    let sum = 0;
    for (const transaction of transactions) {
        // Remove commas before parsing the number
        const cleanedTransaction = transaction.replace(/,/g, '');
        const value = parseFloat(cleanedTransaction);
        if (!isNaN(value)) {
            sum += value;
        }
    }
    return sum;
}


function getLastTransaction(filePath) {
    const content = FM.readString(filePath);
    const transactions = content.split("\n").filter(line => line.trim() !== '');
    return transactions[transactions.length - 1];
}


function main() {
    try {
        const closingDate = readJsonValue(CONFIG_FILE, KEYS.CLOSING_DATE);
        const newClosingDate = updateClosingDate(closingDate);
        const totalSpent = sumTransactions(TX_FILE_PATH).toFixed(2);
        const recent = getLastTransaction(TX_FILE_PATH);

        updateConfigFile(CONFIG_FILE, KEYS.CLOSING_DATE, newClosingDate);
        console.log(newClosingDate + "\n");

        updateConfigFile(CONFIG_FILE, KEYS.TOTAL_SPENT, totalSpent);
        console.log(totalSpent + "\n");

        updateConfigFile(CONFIG_FILE, KEYS.RECENT, recent);
        console.log(recent + "\n");

    }
    catch (error) {
        console.log("An error occurred in main: ", error);
    }

}

main();

Script.complete();
