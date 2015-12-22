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
const dialog = require('electron').dialog;

//console.log(appPath);

fse.ensureDirSync(appPath);

fs.access(configFile, fs.W_OK && fs.R_OK, (err) => {
  if (err) {
    //var encrypted = CryptoJS.AES.encrypt('123456', key).toString();
    var cipher = _crypto.createCipher(algorithm, salt);
    var crypted = cipher.update('123456','utf8','hex');
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
        key: crypted,
        hospcode: '00000'
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
  event.returnValue = configFile;
});

ipcMain.on('quit', (event) => {
  app.quit();
});

ipcMain.on('get-app-path', (event) => {
  event.returnValue = appPath;
});

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

ipcMain.on('open-file', (event) => {
  dialog.showOpenDialog({
    properties: [ 'openFile', 'multiSelections' ],
    filters: [
      { name: 'Zip (*.zip)', extensions: ['zip'] }
    ]
  }, (files) => {
    if (files) {
      event.returnValue = files;
    } else {
      event.returnValue = null;
    }
  });
});


app.on('ready', () => {

  mainWindow = new BrowserWindow({width: 1100, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/pages/Index.html');
  // Open dev tools
  //mainWindow.webContents.openDevTools();


  mainWindow.on('closed', () => {
    mainWindow = null;
  });

});
