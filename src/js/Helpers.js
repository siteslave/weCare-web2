((window, angular) => {

  let _ = require('lodash');
  let moment = require('moment');

  angular.module('app.Helpers', [])
    .factory('Helpers', () => {
      let ipcRenderer = require('electron').ipcRenderer;

      return {
        encrypt: (text) => {
          return ipcRenderer.sendSync('encrypt', text);
        },

        decrypt: (text) => {
          return ipcRenderer.sendSync('decrypt', text);
        },

        isSurveillanceHighRisk: (icd) => {
          let icds = [
            "A90", "A91", "A92", "A93", "A94", "A95", "A96",
            "A97", "A98", "A99", "B08", "A27", "A24", "B50"
          ];

          let idx = _.indexOf(icds, icd);

          return idx >= 0 ? true : false;

        }
      }
    })
  .filter('toLongThaiDate', () => {
    return (isoDate) => {
      return moment(isoDate).isValid() ? moment(isoDate).format('dddd D MMMM YYYY') : '';
    }
  });
})(window, window.angular);