var app = require('app');
var BrowserWindow = require('browser-window');
var ipcMain = require('electron').ipcMain;
var fse = require('fs-extra');
var path = require('path');
var fs = require('fs');
var CryptoJS = require('crypto-js');
var key = '1e90fdaa33e783fc66491b82fcdb1a2bae920aedef7b2857541ad60779eb5d41';

var mainWindow = null;

const dataPath = app.getPath('appData');
const appPath = path.join(dataPath, 'weCare');
const configFile = path.join(appPath, 'config.json');

console.log(appPath);

fse.ensureDirSync(appPath);

fs.access(configFile, fs.W_OK && fs.R_OK, (err) => {
  if (err) {
    var encrypted = CryptoJS.AES.encrypt('123456', key).toString();

    var defaultConfig = {
      db: {
        host: 'localhost',
        database: 'hos',
        port: 3306,
        user: 'sa',
        password: encrypted
      },
      cloud: {
        url: 'http://localhost',
        key: encrypted
      }
    };

    fse.writeJsonSync(configFile, defaultConfig);
  }
});

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

ipcMain.on('get-config-file', (event) => {
  event.returnValue = configFile
});

ipcMain.on('get-app-path', (event) => {
  event.returnValue = appPath
});

ipcMain.on('encrypt', (event, text) => {
  var ciphertext = CryptoJS.AES.encrypt(text, key).toString();
  event.returnValue = ciphertext;
});

ipcMain.on('decrypt', (event, text) => {
  let byte = CryptoJS.AES.decrypt(text, key);
  let decrypt_text = byte.toString(CryptoJS.enc.Utf8);
  event.returnValue = decrypt_text;
});

app.on('ready', () => {

  mainWindow = new BrowserWindow({width: 1010, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/pages/index.html');
  // Open dev tools
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

});
