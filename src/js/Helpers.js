angular.module('app.Helpers', [])
  .factory('Helpers', () => {
    let ipcRenderer = require('electron').ipcRenderer;

    return {
      encrypt: (text) => {
        return ipcRenderer.sendSync('encrypt', text);
      },

      decrypt: (text) => {
        return ipcRenderer.sendSync('decrypt', text);
      }
    }
  });