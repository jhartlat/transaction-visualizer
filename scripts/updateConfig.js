/**
 * Updates JSON file values based on a given dictionary.
 * @param {Object} inputDictionary - Key-value pairs to update in the JSON file.
 * @param {string} filePath - The file path of the JSON file (relative to iCloud documents directory).
 * @returns {Promise<boolean>} - Returns true if the update was successful, false otherwise.
 */

async function updateJsonValues(inputDictionary, filePath) {
    try {
        const fm = FileManager.iCloud();
        const jsonFilePath = fm.joinPath(fm.documentsDirectory(), filePath);

        // Ensure the file is downloaded from iCloud
        if (fm.isFileStoredIniCloud(jsonFilePath)) {
            await fm.downloadFileFromiCloud(jsonFilePath);
        }

        // Read and parse the JSON content
        const fileContent = fm.readString(jsonFilePath);
        const jsonData = JSON.parse(fileContent);

        // Update the JSON values
        for (const key in inputDictionary) {
            if (inputDictionary[key] !== "" && jsonData.hasOwnProperty(key)) {
                jsonData[key] = inputDictionary[key];
            }
        }

        // Write updated content back to the file
        const updatedContent = JSON.stringify(jsonData, null, 2);
        fm.writeString(jsonFilePath, updatedContent);

        console.log(`✅ JSON file updated successfully: ${jsonFilePath}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to update JSON file: ${error}`);
        return false;
    }
}

/**
 * Main function to handle input and update JSON file.
 * @param {Object} inputDictionary - Key-value pairs to update in the JSON file.
 * @param {string} [filePath="File Path"] - The file path of the JSON file.
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise.
 */
async function main(inputDictionary, filePath = "File Path") {
    if (!inputDictionary || typeof inputDictionary !== "object") {
        console.error("❌ Invalid input: Expected a dictionary (object).");
        return false;
    }

    return await updateJsonValues(inputDictionary, filePath);
}

module.exports = { main };
