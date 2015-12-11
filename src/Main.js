var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var ipcMain = require('electron').ipcMain;
var fse = require('fs-extra');
var path = require('path');
var fs = require('fs');

var _crypto = require('crypto');

var algorithm = 'aes-256-ctr';
var salt = 'mANiNThEdARk';

var mainWindow = null;

const dataPath = app.getPath('appData');
const appPath = path.join(dataPath, 'weCare');
const configFile = path.join(appPath, 'config.json');

console.log(appPath);

fse.ensureDirSync(appPath);

fs.access(configFile, fs.W_OK && fs.R_OK, (err) => {
  if (err) {
    //var encrypted = CryptoJS.AES.encrypt('123456', key).toString();
    var cipher = _crypto.createCipher(algorithm, salt);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');

    var defaultConfig = {
      db: {
        host: 'localhost',
        database: 'hos',
        port: 3306,
        user: 'sa',
        password: crypted
      },
      cloud: {
        url: 'http://localhost',
        key: crypted
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

//ipcMain.on('encrypt', (event, text) => {
//  var ciphertext = CryptoJS.AES.encrypt(text, key).toString();
//  event.returnValue = ciphertext;
//});
//
//ipcMain.on('decrypt', (event, text) => {
//  let byte = CryptoJS.AES.decrypt(text, key);
//  let decrypt_text = byte.toString(CryptoJS.enc.Utf8);
//  event.returnValue = decrypt_text;
//});

ipcMain.on('encrypt', (event, text) => {
  var cipher = _crypto.createCipher(algorithm, salt);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  event.returnValue = crypted;
});

ipcMain.on('decrypt', (event, text) => {
  var decipher = _crypto.createDecipher(algorithm, salt);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  event.returnValue = dec;
});


app.on('ready', () => {

  mainWindow = new BrowserWindow({width: 1010, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/pages/index.html');
  // Open dev tools
  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

});
