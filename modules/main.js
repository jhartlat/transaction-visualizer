const widget = importModule(widget-utils.js);


function main() {
    // allocate spending
    const [remainingBalance, balancedUsed, savingsUsed]
    = widget.allocateSpending();
    // create spending
    const visualizer = createVisualizer(remainingBalance);
    // budget progress bar
    widget.budgetProgressBar(visualizer, remainingBalance);
    // show widget
    showWidget(visualizer);
    // script complete
    Script.complete();
}

function showWidget(widget) {
    if (config.runsInApp) {
        // Display an alert to inform the user the widget has been refreshed
        let alert = new Alert();
        alert.title = "All Widgets Refreshed";
        alert.message = "Swipe up to close.";
        alert.addAction("OK");
        alert.present();

        // Set the widget in the app context
        Script.setWidget(widget);
    }
    else if (config.runsInWidget) {
        // Just set the widget in the widget context
        Script.setWidget(widget);
    }
}

function mediumVisualizer(mainColumn, remainingBalance) {
    widget.mediumRow_1(mainColumn)
    widget.mediumRow_2(mainColumn, remainingBalance)
    widget.mediumRow_3(mainColumn)
    widget.mediumRow_4(mainColumn)
}

function smallVisualizer(mainColumn, remainingBalance) {
    widget.smallRow_1(mainColumn)
    widget.smallRow_2(mainColumn, remainingBalance)
    widget.smallRow_3(mainColumn)
    widget.smallRow_4(mainColumn)
}

function createVisualizer(remainingBalance) {
    const visualizer = new ListWidget();
    const size = config.widgetFamily;
    const mainColumn = visualizer.addStack().layoutVertically();
    if (size === "small") {
        // UI for the small widget
        smallVisualizer(mainColumn, remainingBalance);
    } else if (size === "medium") {
        // UI for the medium widget
        mediumVisualizer(mainColumn, remainingBalance);
    }
    return visualizer;
}
