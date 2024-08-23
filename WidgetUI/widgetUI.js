const utils = importModule('tmUtils');

function main() {
  const FILE_NAME = "user_data.json";

  let content = utils.readFileFrom_iCloud(FILE_NAME);
  let output = utils.convertToJSON(content);

  let totalSpent = parseFloat(output['Total Spent']);
  let checkingAccount = totalSpent;
  let reservesAccount = 0;
  let recent = parseFloat(output['Recent']);
  let monthlyLimit = parseFloat(output['Monthly Limit']);

  let budget = utils.allocateBill(totalSpent, checkingAccount, reservesAccount, monthlyLimit);

  let totalBalance = budget[0];
  let checkingBalance = budget[1];
  let reservesBalance = budget[2];

  let formatClosingDate = utils.removeYearAndLeadingZero(output['Closing Date'])


/*


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
