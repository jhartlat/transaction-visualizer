function displayWidget(widget) {
    if (config.runsInApp) {
      widget.presentMedium();
    } else if (config.runsInWidget) {
      Script.setWidget(widget);
    }
  }

  function addTextToWidget(widget, text, color, fontSize, isBold = false, alignment = 'left') {
    let textElement = widget.addText(text);
    textElement.textColor = color;
    textElement.font = isBold ? Font.boldSystemFont(fontSize) : Font.systemFont(fontSize);
    if (alignment === 'left') {
      textElement.leftAlignText();
    } else if (alignment === 'right') {
      textElement.rightAlignText();
    }
    return textElement;
  }

  function closingDate(widget, text) {
    addTextToWidget(widget, 'Closing Date: ' + text, Color.white(), 14, true);
  }

  function totalAmount(widget, text) {
    let amount = parseFloat(text);
    let formattedText = amount < 0.00 ? `-$${Math.abs(amount).toFixed(2)} 🏦` : `$${amount.toFixed(2)} 🏦`;
    if (amount < 0.00) {
      addTextToWidget(widget, formattedText, Color.red(), 36, true);
    }
    else {
      addTextToWidget(widget, formattedText, Color.green(), 36, true); // isBold is set to true
    }

  }

  function checkingAmount(widget, text, limit) {
    let amount = parseFloat(text);
    if (amount == limit) {
      addTextToWidget(widget, 'CHKG $' + text, Color.gray(), 16);
    }
    else {
      addTextToWidget(widget, 'CHKG $' + text, Color.green(), 16);
    }

  }

  function reservesAmount(widget, text) {
    let amount = parseFloat(text);
    if (amount > 0.00) {
      addTextToWidget(widget, 'RES $' + text, Color.red(), 16);
    }
    else {
      addTextToWidget(widget, 'RES $' + text, Color.gray(), 16);
    }

  }

  function recentAmount(widget, text) {
    let amount = parseFloat(text);
    console.log(amount);
    let formattedText = amount > 0.00 ? `-$${amount.toFixed(2)}` : `$${amount.toFixed(2)}`;
    addTextToWidget(widget, 'Recent: ' + formattedText, Color.white(), 14);
  }

  function lastUpdate(widget) {
    const date = getCurrentDate();
    let element = addTextToWidget(widget, '🔄: ' + date, Color.white(), 14, false, 'right');
    element.rightAlignText();
  }

  function getCurrentDate() {
    const date = new Date();
    const pad = (n) => n.toString().padStart(2, '0');

    let month = pad(date.getMonth() + 1);
    month = month.startsWith('0') ? month.substring(1) : month;
    const day = pad(date.getDate());
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12);

    const formattedDate = `${month}/${day}, ${formattedHours}:${minutes} ${ampm}`;
    return formattedDate;
  }

  function allocateBill(totalSpent, checkingAccount, reservesAccount, monthlyLimit) {
          if (checkingAccount >= monthlyLimit) {
              checkingAccount = monthlyLimit;
              reservesAccount = totalSpent - monthlyLimit;
          }
          else {
              checkingAccount = totalSpent;
              reservesAccount = 0;
          }
          let balance = monthlyLimit - totalSpent;
          return [balance, checkingAccount, reservesAccount];
  }





  // This is for the closing date
  function removeYearAndLeadingZero(dateString) {
      // Split the date string by '/'
      let parts = dateString.split('/');
      // Remove leading zero from the day if necessary
      let month = parts[0].startsWith('0') ? parts[0].substring(1) : parts[0];
      // Remove leading zero from the day if necessary
      let day = parts[1].startsWith('0') ? parts[1].substring(1) : parts[1];
      // Return the month and day parts with a slash
      return month + '/' + day;
  }

  function formatLocaleTime() {
      let d = new Date();
      let time = d.toLocaleTimeString(); // 4:07:07 PM
      let parts = time.split(':'); // '4', '07', '07 PM'
      let period = parts[2].substring(3);
      return parts[0] + ':' + parts[1] + ' ' + period

  }

  function readFileFrom_iCloud(fileName) {
    let fm = FileManager.iCloud();
    let filePath = fm.joinPath(fm.documentsDirectory(), fileName);
    if (fm.fileExists(filePath)) {
      let content = fm.readString(filePath);
      console.log(content);
      return content;
    }
    else {
      console.log("File does not exist.")
    }
  }

  function convertToJSON(content) {
    try {
      // Replace single quotes with double quotes
      let modifiedContent = content.replace(/'/g, '"');

      // Parse the JSON String
      let result = JSON.parse(modifiedContent);

      return result;
    }
    catch (error) {
      console.error("Failed to convert content to JSON", error);
    }
    return null;
  }

module.exports = {
    readFileFrom_iCloud,
    convertToJSON,
};
