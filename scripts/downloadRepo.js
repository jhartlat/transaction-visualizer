// Repository Configuration
const config = {
    owner: "jhartlat",
    branch: "main",
    fm: FileManager.iCloud(),
};

/**
 * Fetch JSON data from a given URL.
 * @param {string} url - API URL to fetch data from.
 * @returns {Promise<any>} - Parsed JSON response.
 */

async function fetchJSON(url) {
    try {
        let req = new Request(url);
        return await req.loadJSON();
    } catch (error) {
        console.error(`Failed to fetch JSON from ${url}: ${error}`);
        return [];
    }
}

/**
 * Downloads a single file from a given URL and saves it locally.
 * @param {string} fileURL - URL of the file to download.
 * @param {string} localPath - Local path to save the file.
 */

async function downloadFile(fileURL, localPath) {
    try {
        let req = new Request(fileURL);
        let content = await req.loadString();
        config.fm.writeString(localPath, content);
        console.log(`✅ Saved: ${localPath}`);
    } catch (error) {
        console.error(`❌ Failed to download ${fileURL}: ${error}`);
    }
}

/**
 * Recursively downloads repository contents.
 * @param {string} apiURL - API URL to fetch repository contents.
 * @param {string} localPath - Local path to save repository contents.
 */
async function downloadRepo(apiURL, localPath) {
    let items = await fetchJSON(apiURL);

    for (let item of items) {
        let filePath = config.fm.joinPath(localPath, item.name);

        if (item.type === "file") {
            if (config.fm.fileExists(filePath)) {
                console.log(`⚠️ Skipping (exists): ${filePath}`);
            } else {
                console.log(`⬇️ Downloading: ${filePath}`);
                await downloadFile(item.download_url, filePath);
            }
        } else if (item.type === "dir") {
            if (!config.fm.fileExists(filePath)) {
                config.fm.createDirectory(filePath);
            }
            console.log(`📂 Entering: ${item.name}`);
            await downloadRepo(item.url, filePath);
        }
    }
}

/**
 * Main function to start repository download.
 * @param {string} repo - The repository name to download.
 * @returns {string} - The local root path of the downloaded repository.
 */
async function main(repo) {
    if (!repo) {
        console.error("❌ Repository name is required.");
        return null;
    }

    config.repo = repo;
    config.baseURL = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/`;
    config.dir = config.fm.documentsDirectory();
    config.rootPath = config.fm.joinPath(config.dir, `${config.repo}/`);

    console.log(`🚀 Starting repository download for: ${repo}...`);
    await downloadRepo(`${config.baseURL}?ref=${config.branch}`, config.rootPath);
    console.log("✅ Repository download complete!");

    return config.rootPath;
}

// Exporting the main function to be used as a module
module.exports = { main };
