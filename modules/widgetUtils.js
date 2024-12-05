function adjustBrightness(rgb, amount) {
    return {
        r: Math.min(255, Math.max(0, rgb.r + amount)),
        g: Math.min(255, Math.max(0, rgb.g + amount)),
        b: Math.min(255, Math.max(0, rgb.b + amount))
    };
}


function formatString(currencyString) {
    if (!isNaN(currencyString[1])) {
        return currencyString;
    } else {
        const firstDigitIndex = currencyString.search(/\d/);
        if (firstDigitIndex !== -1) {
            return currencyString.substring(firstDigitIndex);
        }
        return currencyString;
    }
}


function getBalanceColor(balance) {
    if (balance < 0.00) {
        return STYLE.color.negativeBalance;
    }
}


function daysBetweenDates(currentDate, closingDate) {
    const parseDate = (dateString) => {
        const [month, day, year] = dateString.split("-");
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    try {
        const date1 = parseDate(currentDate);
        const date2 = parseDate(closingDate);

        if (isNaN(date1) || isNaN(date2)) throw new Error("Invalid date format.");

        const timeDifference = date2 - date1;
        const days = Math.trunc(timeDifference / (1000 * 60 * 60 * 24));
        return days;
    } catch (error) {
        console.error("Error in daysBetweenDates:", error.message);
        return null;
    }
}


function formatCurrency(amount, locale = 'en-US', currency = 'USD', includeCurrencySymbol = true) {
    const options = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    if (includeCurrencySymbol) {
        options.style = 'currency';
        options.currency = currency;
    } else {
        options.style = 'decimal';
    }
    return amount.toLocaleString(locale, options);
}


function formatCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${month}-${day}-${year}`;
}


function getMonochromeColor(hex) {
    // Convert hex to RGB
    let rgb = hexToRgb(hex);

    // Adjust brightness by darkening or lightening
    let adjustedColor = adjustBrightness(rgb, -40); // Adjust this value for more/less contrast

    // Convert back to hex
    return rgbToHex(adjustedColor.r, adjustedColor.g, adjustedColor.b);
}


function getTime() {
    const currentDate = new Date();
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    // Convert to 12-hour format.
    hours = hours % 12;
    // If hour is 0, display as 12.
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
}


function hexTo_RGB(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(h => h + h).join('');
    }
    const bigInt = parseInt(hex, 16);
    return {
        r: (bigInt >> 16) & 255,
        g: (bigInt >> 8) & 255,
        b: bigInt & 255,
    };
}


function RGB_ToHex(r, g, b) {
    const componentToHex = c => {
        const hex  = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


module.exports = {
    adjustBrightness,
    daysBetweenDates,
    formatCurrency,
    formatCurrentDate,
    generateMonochromatic,
    getTime,
    hexTo_RGB,
    RGB_ToHex,
    formatString
};
