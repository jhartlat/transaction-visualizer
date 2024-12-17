# Transaction Visualizer

**A simple and effective spending tracker widget for iOS**

Stay on top of your monthly budget effortlessly with this customizable solution.

---

## Description

Transaction Visualizer aggregates and displays your credit card spending progress using **Shortcuts** and **Scriptable**. Designed to work with bank transaction alerts, it updates automatically and requires minimal manual interaction.

**Key Features**:

- **Customizable Monthly Limit**: Set your budget and track your spending visually.
- **Widgets**: Displays key spending details on your home or lock screen.
- **Automatic Updates**: Integrates with bank alerts for real-time tracking.
- **Manual Editing**: Easily add or adjust transactions with compatible text editors.

---

## Setup Instructions

1. **Prerequisites**:
    - Install the **Shortcuts** and **Scriptable** apps on your iOS device.
    - Enable transaction alerts in your bank’s app.
2. **Shortcut Configuration**:
    
    Follow the instructions in the [Setup Guide](https://routinehub.co/shortcut/20167/) to configure your Shortcuts automations.
    
3. **Customize Widgets**:
    - Small and medium widgets are supported.
    - Configure color, spending limit, and card details in `config.json`.

---

## Widget Components

- **Main Script**: `main.js`
- **Transaction Manager**: Handles updates and resets.
- **Small & Medium Widgets**: Display visualized spending information.
- **Utilities**: Helper functions for formatting and calculations.

---

## Upcoming Improvements

- Enhanced manual editing options.
- Additional widget sizes and visual customizations.
- Notifications for reaching spending thresholds.
