const FM = FileManager.iCloud();
const CONFIG_FILE_PATH = getFilePath("config.json");


function createWidget(closingDate, balance, checkingBill, savingsBill, recent) {
    const widget = new ListWidget();

    const mainColumn = widget.addStack();
    mainColumn.layoutVertically();

    addRow1(mainColumn);
    addRow2(mainColumn);
    addRow3(mainColumn);
    addRow4(mainColumn);

    return widget;
  }


  function showWidget(widget) {
    if (config.runsInApp) {
      widget.presentMedium();
    } else if (config.runsInWidget) {
      Script.setWidget(widget);
    }
  }


  function getFilePath(fileName) {
    return FM.documentsDirectory() + `/${fileName}`;
  }


  function addRow1(mainColumn) {
    const row1 = mainColumn.addStack();
    const closingDate = row1.addText("Closing Date: 9/26");
    closingDate.font = Font.boldSystemFont(14);

    row1.addSpacer();

    const logo = row1.addText("💲");

    mainColumn.addSpacer();
  }


  function addRow2(mainColumn) {
    const row2 = mainColumn.addStack();
    const balance = row2.addText("$294.93");
    balance.font = Font.systemFont(30);

    row2.addSpacer();
    mainColumn.addSpacer();
  }


  function addRow3(mainColumn) {
    const row3 = mainColumn.addStack();
    const bill = row3.addText("SPLIT CHK: 555, SAV: 450");
    bill.font = Font.systemFont(18)
    row3.addSpacer();
    mainColumn.addSpacer();
  }


  function addRow4(mainColumn) {
    const row4 = mainColumn.addStack();
    const recent = row4.addText("Recent: -$40.00");
    recent.font = Font.systemFont(18);
    row4.addSpacer();
    const lastUpdate = row4.addText(" 11:59 PM");
    lastUpdate.font = Font.systemFont(18);
    mainColumn.addSpacer();
  }


//   function readFileFrom_iCloud(fileName) {
//     const filePath = getFilePath(fileName);
//     if (fm.fileExists(filePath)) {
//       const content = fm.readString(filePath);
//       return content;
//     }
//     else {
//       console.log("File does not exist.");
//     }
//   }



//   function stringToJSON(content) {
//     try {
//       const modifiedContent = content.replace(/'/g,'"');
//       const result = JSON.parse(modifiedContent);
//       return result;
//     }
//     catch (error) {
//       console.log("Failed to convert content to JSON", error);
//     }
//     return null;
//   }


  function allocateSpending(
    totalSpent,
    checkingBill,
    savingsBill,
    monthlyLimit) {
      if (checkingBill >= monthlyLimit) {
        checkingBill = monthlyLimit;
        savingsBill = totalSpent - monthlyLimit;
      }
      else {
        checkingBill = totalSpent;
        savingsBill = 0;
        savingsBill = savingsBill.toFixed(2);
      }
      const remainingBalance = formatAmount(monthlyLimit - totalSpent);

      return [remainingBalance, checkingBill, savingsBill];
  }


  function formatAmount(amount) {
    return (amount < 0.00 ? `-$${Math.abs(amount).toFixed(2)}` : `$${amount.toFixed(2)}`);
  }


//   function removeYearAndLeadingZero(dateString) {
//     const parts = dateString.split('/');
//     const month = parts[0].startsWith('0') ? parts[0].substring(1) : parts[0];
//     const day = parts[1].startsWith('0') ? parts[1].substring(1) : parts[1];
//     return month + '/' + day;
//   }


  function main() {
    const content = FM.readString(CONFIG_FILE_PATH);
    const jsonContent = JSON.parse(content);
    console.log(`\nJSON Content:\n${content}`);
    const totalSpent = jsonContent["Total Spent"];
    const closingDate = jsonContent["Closing Date"];
    const recent = jsonContent["Recent"];
    const monthlyLimit = jsonContent["Monthly Limit"];
    let checkingBill = totalSpent;
    let savingsBill = 0;
    const transactionData = allocateSpending(
      totalSpent,
      checkingBill,
      savingsBill,
      monthlyLimit);
    const remainingBalance = transactionData[0];
    checkingBill = transactionData[1];
    savingsBill = transactionData[2];
    console.log(`\nTransaction Data:\
      \nClosing Date: ${closingDate}\
      \nRemaining Balance: ${remainingBalance}/$${monthlyLimit}\
      \nPay $${checkingBill} from Checking Account\
      \nPay $${savingsBill} from Savings Account`);


    const widget = createWidget(
      closingDate,
      remainingBalance,
      checkingBill,
      savingsBill);
    showWidget(widget);

    Script.complete();
  }

  main();
