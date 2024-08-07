const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const url = require('url');
let mainWindow;
function createWindow () {
   mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false
    }
  });

  // mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`);
  // mainWindow.loadURL(`file://${__dirname, 'index.html'}`);
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
      }));

}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('save-file', async (event, content) => {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, 'myfile.json');
  await fs.writeFile(filePath, content);
  return { success: true, filePath };
});

ipcMain.handle('read-file', async () => {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, 'myfile.json');
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

