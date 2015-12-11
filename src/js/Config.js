((window, angular) => {
  angular.module('app.Config', [])
    .factory('Config', (Helpers) => {
      var ipcRenderer = require('electron').ipcRenderer;
      var fse = require('fs-extra');

      var configFile = ipcRenderer.sendSync('get-config-file');
      var config = fse.readJsonSync(configFile);

      return {
        getConfig: () => {
          return config
        },
        getConfigFile: () => {
          return configFile
        },
        getMySQLConnection: () => {
          return require('knex')({
            client: 'mysql',
            connection: {
              host: config.db.host,
              database: config.db.database,
              user: config.db.user,
              password: Helpers.decrypt(config.db.password)
            }
          });
        }
      }
    })
})(window, window.angular);