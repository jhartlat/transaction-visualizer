const FM = FileManager.iCloud();
const CONFIG_FILE_PATH = getFilePath("config.json");


function createWidget(closingDate, balance, checkingBill, savingsBill, recent) {
    const widget = new ListWidget();

    const mainColumn = widget.addStack();
    mainColumn.layoutVertically();

    addRow1(mainColumn);
    addRow2(mainColumn, balance);
    addRow3(mainColumn, checkingBill, savingsBill);
    addRow4(mainColumn, recent);

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

  function getCurrentDate() {
    const currentDate = new Date();
    return currentDate;
}

  function addRow1(mainColumn, closingDate) {
    const numberOfDays = daysBetweenDates(getCurrentDate(), closingDate);
    const row1 = mainColumn.addStack();

    const daysText = numberOfDays === 1 ? "1 day left..." : `${numberOfDays} days left...`;
    const closingDateText = row1.addText(daysText);
    closingDateText.font = Font.boldSystemFont(14);

    row1.addSpacer();

    const dollarSignEmoji = row1.addText("💲");

    mainColumn.addSpacer();
  }


  function addRow2(mainColumn, balance) {
    const row2 = mainColumn.addStack();
    const remainingBalance = row2.addText(`${balance}`);
    remainingBalance.font = Font.boldSystemFont(28);

    row2.addSpacer();
    mainColumn.addSpacer();
  }


  function addRow3(mainColumn, checkingBill, savingsBill) {
    const row3 = mainColumn.addStack();
    const split = row3.addText(`(ALLOC) CHK: $${checkingBill}, SAV: $${savingsBill}`);
    split.font = Font.boldSystemFont(14)
    row3.addSpacer();
    mainColumn.addSpacer();
  }


  function addRow4(mainColumn, recent) {
    const row4 = mainColumn.addStack();
    const lastCharge = row4.addText(`Recent: -$${recent}`);
    lastCharge.font = Font.boldSystemFont(14);
    row4.addSpacer();
    const lastUpdate = row4.addText(" 11:59 PM");
    lastUpdate.font = Font.boldSystemFont(14);
    mainColumn.addSpacer();
  }


  function allocateSpending(totalSpent, checkingBill, savingsBill, monthlyLimit) {
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


  function budgetProgressBar(widget, remainingBalance, monthlyLimit) {

    let percentageFilled = 0;

    if (remainingBalance > 0) {
      percentageFilled = remainingBalance/monthlyLimit;
    }

    const drawingContext = new DrawContext();
    drawingContext.size = new Size(300, 100);

    const greenWidth = drawingContext.size.width * percentageFilled;
    drawingContext.setFillColor(new Color("#007b03"));
    drawingContext.fillRect(new Rect(0, 0, greenWidth, 100));

    const grayWidth = drawingContext.size.width * (1 - percentageFilled);
    drawingContext.setFillColor(new Color("#1C1C1E"));
    drawingContext.fillRect(new Rect(greenWidth, 0, grayWidth, 100));

    widget.backgroundImage = drawingContext.getImage();

  }

  function daysBetweenDates(date1, date2) {
    const timeDifference = date2 - date1;
    const days = timeDifference / (1000 * 60 * 60 * 24);
    return days;
  }


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
    const transactionData = allocateSpending(totalSpent, checkingBill, savingsBill, monthlyLimit);
    const remainingBalance = transactionData[0];
    checkingBill = transactionData[1];
    savingsBill = transactionData[2];
    console.log(`\nTransaction Data:\
      \nClosing Date: ${closingDate}\
      \nRemaining Balance: ${remainingBalance}/$${monthlyLimit}\
      \nPay $${checkingBill} from Checking Account\
      \nPay $${savingsBill} from Savings Account`);
    const widget = createWidget(closingDate, remainingBalance, checkingBill, savingsBill, recent);
    budgetProgressBar(widget, remainingBalance, balance);

    showWidget(widget);

    Script.complete();
  }

  main();
