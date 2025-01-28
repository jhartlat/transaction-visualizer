const { smallWidget } = importModule("transaction-visualizer/widgets/smallWidget");
const { mediumWidget } = importModule("transaction-visualizer/widgets/mediumWidget");


const {
    DECLINE_BACKGROUND,
    SIZE,
    STYLE,
    extractDetails,
    calculateBalances
} = importModule("transaction-visualizer/constants/constants");


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
    if (CARD_TYPE === "CURRENT BALANCE") {
        return 1;
    }

    if  (REMAINING_BALANCE >= 0 && DECLINE_BACKGROUND === true) {
        return REMAINING_BALANCE / MONTHLY_LIMIT;
    }

    if  (REMAINING_BALANCE >= 0 && DECLINE_BACKGROUND === false) {
        return 1;
    }


    if  (REMAINING_BALANCE <= 0) {
        return 0;
    }

}


function getWidgetDimensions() {
    if (SIZE === "small") {
        return { width: 155, height: 155 };
    } else {
        return { width: 329, height: 155 };
    }
}


function declineBackground(widget) {
    const {
        width,
        height
    } = getWidgetDimensions();
    const percentageFilled = getPercentageFilled();
    const background = new DrawContext();
    const colorWidth = width * percentageFilled;
    const emptyWidth = width * (1 - percentageFilled);
    const color = new Color(BACKGROUND_COLOR);
    const empty = STYLE.color.empty;
    const maxFunds = new Rect(0, 0, colorWidth, height);
    const spentFunds = new Rect(colorWidth, 0, emptyWidth, height);

    background.size = new Size(width, height);
    background.setFillColor(color);
    background.fillRect(maxFunds);
    background.setFillColor(empty);
    background.fillRect(spentFunds);

    widget.backgroundImage = background.getImage();
}


main();
