
function doesFileExistScriptable(fileName) {
    let fm = FileManager.iCloud();
    let filePath = fm.documentsDirectory() + fileName;
    if (fm.fileExists(filePath)) {
        fm.writeString(filePath, "0.00");
        console.log("File created successfully.");
    }
    else {
        console.log('File already exist.');
    }
}

function doesFileExistNode(fileName) {
    let fs = require("fs");
    let filePath = fileName;
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "0.00");
        console.log("File created successfully.");
    }
    else {
        console.log("File already exist.");
    }
}

function readJsonValueScriptable(filePath, key) {
    let fm = FileManager.iCloud();
    let content = fm.readString(filePath);
    let jsonData = JSON.parse(content);
    return jsonData[key];
}

function readJsonValueNode(filePath, key) {
    let fs = require("fs");
    let content = fs.readFileSync(filePath);
    let jsonData = JSON.parse(content);
    return jsonData[key];
}

function getMonthlyLimit(filePath) {
    let key = "Monthly Limit";
    // return readJsonValueScriptable(filePath, key);
    return readJsonValueNode(filePath, key);
}

function getClosingDate(filePath) {
    let key = "Closing Date";
    // return readJsonValueScriptable(filePath, key);
    return readJsonValueNode(filePath, key);
}

function getCurrentDate() {
    let currentDate = new Date();
    return currentDate;
}

function convertToDateObj(dateStr) {
    // Split string: 09-26-2024 by '-'
    let parts = dateStr.split('-');
    // Declare new Date(year, month, day)
    dateObj = new Date(parts[2], (parts[0] - 1), parts[1]);
    return dateObj;
}

function isCurrentDatePastClosing(currentDate, closingDate) {
    closingDate = convertToDateObj(closingDate);
    // Is today past the closing date?
    return currentDate > closingDate;
}

function isLeap(year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
}

function convertToDateString(dateObj) {
    let year = dateObj.getFullYear();
    let month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    let day = dateObj.getDate().toString().padStart(2, '0');
    return `${month}-${day}-${year}`;
}

function getNextClosingDate(date) {
    let daysInMonth = {
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
    if (month == 2) {
        daysInMonth[month] = isLeap(year) ? 29 : 28;
        closingDate.setDate(closingDate.getDate() + daysInMonth[month]);
        return convertToDateString(closingDate);
    }
    else {
        closingDate.setDate(closingDate.getDate() + daysInMonth[month]);
        console.log(closingDate);
        return convertToDateString(closingDate);
    }
}

function updateClosingDateScriptable(closingDate, filePath) {
    let currentDate = getCurrentDate();
    if (!isCurrentDatePastClosing(currentDate, closingDate)) {
        return closingDate;
    }
    else {
        return getNextClosingDate(closingDate);
    }
}

function updateClosingDateNode(closingDate, filePath) {
    let currentDate = getCurrentDate();
    if (!isCurrentDatePastClosing(currentDate, closingDate)) {
        return closingDate;
    }
    else {
        let fs = require("fs");
        fs.writeFileSync(filePath, "0.00");
        return getNextClosingDate(closingDate);
    }
}

function getFilePath(fileName) {
    let fm = FileManager.iCloud();
    return fm.documentsDirectory() + `/${fileName}`;
}

function updateFileScriptable(filePath, key, newValue) {
    let fm = FileManager.iCloud();
    let content = fm.readString(filePath);
    try {
        let jsonData = JSON.parse(content);
        if (key in jsonData) {
            jsonData[key] = newValue;
            let updatedContent = JSON.stringify(jsonData, null, 2);
            fm.writeString(filePath, updatedContent);
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

function updateFileNode(filePath, key, newValue) {
    let fs = require("fs");
    let content = fs.readFileSync(filePath, "utf-8");
    try {
        let jsonData = JSON.parse(content);
        if (key in jsonData) {
            jsonData[key] = newValue;
            let updatedContent = JSON.stringify(jsonData, null, 2);
            fs.writeFileSync(filePath, updatedContent, "utf-8");
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
    let fs = require("fs");
    let content = fs.readFileSync(filePath, "utf-8");
    let transactions = content.split("\n");
    let sum = 0;
    for (let transaction of transactions) {
        let value = parseFloat(transaction);
        if (!isNaN()) {
            sum += value;
        }
    }
    return sum;
}

function getLastTransaction(filePath) {
    let fs = require("fs");
    let content = fs.readFileSync(filePath, "utf-8");
    let transactions = content.split("\n");
    return transactions[transactions.length - 1];
}

function main() {
    let configFile = "config.json";
    let transactionsFile = "transactions.txt";
    let closingDate = getClosingDate(configFile);
    let updatedClosing = updateClosingDateNode(closingDate, transactionsFile);
    let totalSpent = sumTransactions(transactionsFile);
    let recent = getLastTransaction(transactionsFile);

    // updateFileNode(configFile, "Closing Date", updatedClosing);
    // updateFileNode(configFile, "Total Spent", totalSpent);
    // updateFileNode(configFile, "Recent", recent);

    updateFileScriptable(configFile, "Closing Date", updatedClosing);
    updateFileScriptable(configFile, "Total Spent", totalSpent);
    updateFileScriptable(configFile, "Recent", recent);


}

main();
