const { smallWidget } = importModule("smallWidget");
const { mediumWidget } = importModule("mediumWidget");


const {
    DECLINE_BACKGROUND,
    SIZE,
    STYLe,
    extractDetails,
    calculateBalances
} = importModule("constants");


const {
    CARD_TYPE,
    MONTHLY_LIMIT,
    BACKGROUND_COLOR
} = extractDetails();


const { REMAINING_BALANCE } = calculateBalances();


function main() {
    const widget = createWidget();
    declineBackground(widget);
    showWidget(widget);
}


function createWidget() {
    if (SIZE === "small") {
        return smallWidget();
    } else {
        return mediumWidget();
    }
}


function showAlertMessage() {
    const alert = new Alert();
    alert.title = "All Widgets Refreshed";
    alert.message = "Swipe up to close.";
    alert.addAction("OK");
    alert.present();
}


function showWidget(widget) {
    if (config.runsInApp) {
        showAlertMessage();
    } else if (config.runsInWidget) {
        Script.setWidget(widget);
    }
    Script.complete();
}


function getPercentageFilled() {
    if (CARD_TYPE !== "CURRENT BALANCE" && REMAINING_BALANCE > 0 && DECLINE_BACKGROUND === true) {
        return REMAINING_BALANCE / MONTHLY_LIMIT;
    }
    return 1;
}


function getWidgetDimensions() {
    if (SIZE === "small") {
        return { width: 155, height: 155 };
    } else {
        return { width: 329, height: 155 };
    }
}


function declineBackground(widget) {
    const percentageFilled = getPercentageFilled();
    const background = new DrawContext();
    const colorWidth = width * percentageFilled;
    const emptyWidth = width * (1 - percentageFilled);
    const color = new Color(BACKGROUND_COLOR);
    const empty = STYLE.color.empty;
    const maxFunds = new Rect(0, 0, colorWidth, height);
    const spentFunds = new Rect(colorWidth, 0, emptyWidth, height);


    const {
        width,
        height
    } = getWidgetDimensions();


    background.size = new Size(width, height);
    background.setFillColor(color);
    background.fillRect(maxFunds);
    background.setFillColor(empty);
    background.fillRect(spentFunds);
}
