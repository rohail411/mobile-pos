const { app, BrowserWindow, nativeImage } = require("electron");
const path = require("path");

const PORT = process.env.PORT || 4000;
const isDev = !app.isPackaged;
const appIcon = nativeImage.createFromPath(path.join(__dirname, "..", "build", "icon.png"));
if (process.platform === "darwin" && app.dock) app.dock.setIcon(appIcon);

// Running Express in-process (require, not a spawned child) keeps
// startup fast and avoids extra code-signing surface on macOS.
process.env.PORT = String(PORT);
const server = require(path.join(__dirname, "..", "index.js"));

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    title: "Mobile Shop Manager",
    icon: appIcon,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);
  if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

Promise.all([app.whenReady(), server.ready]).then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
