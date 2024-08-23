
function main() {
  const FILE_NAME = "user_data.json";

  let content = readFileFrom_iCloud(FILE_NAME);
  let output = convertToJSON(content);



/*
    let totalSpent = parseFloat(output['Total Spent']);
    let checkingAccount = parseFloat(totalSpent);
    let reservesAccount = 0;
    let recent = parseFloat(output['Recent']);

    let monthlyLimit = parseFloat(output['Monthly Limit']);
    let budget = allocateBill(totalSpent, checkingAccount, reservesAccount, monthlyLimit);
    let bal = budget[0];
    let chkg = budget[1];
    let res = budget[2];
    let fmtClosingDate = removeYearAndLeadingZero(output['Closing Date'])

    let widget = new ListWidget();
//     let topRow = widget.addStack();

    closingDate(widget, fmtClosingDate);
    widget.addSpacer(10);
    totalAmount(widget, bal.toFixed(2));
    widget.addSpacer();

    let horizontalStack1 = widget.addStack();
    horizontalStack1.addText("(BILL) ");  checkingAmount(horizontalStack1, chkg.toFixed(2), monthlyLimit);
    horizontalStack1.addSpacer(10);
    reservesAmount(horizontalStack1, res.toFixed(2));
    widget.addSpacer();
    console.log(recent);

    let horizontalStack2 = widget.addStack();
    recentAmount(horizontalStack2, recent);
    horizontalStack2.addSpacer();
    lastUpdate(horizontalStack2);

    displayWidget(widget);
    Script.complete();
*/

}

main();
