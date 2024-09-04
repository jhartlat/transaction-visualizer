
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

function isCurrentDatePastClosing(currentDate, closingDate) {
    // Split string: 09-26-2024 by '-'
    let parts = closingDate.split('-');
    // Declare new Date(year, month, day)
    let closingDate = new Date(parts[2], (parts[0] - 1), parts[1]);
    // Is today past the closing date?
    return currentDate > closingDate;
}

function isLeap(year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
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

function main() {
    let configFile = "config.json";
    let transactionsFile = "transactions.txt";
    let monthlyLimit = getMonthlyLimit(configFile);
    let closingDate = getClosingDate(configFile);
    console.log(monthlyLimit);
    console.log(closingDate);
    console.log(typeof(closingDate));


}

main();
