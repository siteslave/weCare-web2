((window, angular) => {
  angular.module('app.services.Emr', [])
    .factory('EmrService', ($q, $http, Config) => {
      let _config = Config.getConfig();
      let ipcRenderer = require('electron').ipcRenderer;

      return {
        getCloudHistory: (params) => {
          let q = $q.defer();
          params._key = _config.cloud.key;
          params._hospcode = _config.cloud.hospcode;

          let options = {
            url: _config.cloud.url + '/emr/detail',
            method: 'POST',
            data: params
          };

          $http(options)
          .success((data) => {
            q.resolve(data)
          })
          .error((data, status, header, config, statusText) => {
            q.reject(status)
          });

          return q.promise;
        },

        getHistory: (cid) => {
          let q = $q.defer();
          let _encryptCid = ipcRenderer.sendSync('encrypt', cid);

          let params = {};
          params.cid = _encryptCid;
          params._key = _config.cloud.key;
          params._hospcode = _config.cloud.hospcode;

          let options = {
            url: _config.cloud.url + '/emr/service_list',
            method: 'POST',
            data: params
          };

          $http(options)
          .success((data) => {
            q.resolve(data);
          })
          .error((data, status, header, cofig, statusText) => {
            q.reject(status);
          });

          return q.promise;
        },
        searchPatient: (db, query) => {
          let q = $q.defer();
          let _query = query.split(" ");
          let sql;
          if (_query.length == 2) {
            sql = `
            select concat(pname, fname, " ", lname) as fullname, cid, hn
            from patient
            where fname like ? and lname like ? order by fname, lname limit 20
          `;
            db.raw(sql, [`${_query[0]}%`, `${_query[1]}%`])
              .then((rows) => {
                q.resolve(rows[0]);
              })
              .catch((err) => {
                console.log(err);
                q.reject(err);
              });
          } else {
            sql = `
            select concat(pname, fname, " ", lname) as fullname, cid, hn
            from patient
            where fname like ? order by fname, lname limit 20
          `;
            db.raw(sql, [`%${query}%`])
              .then((rows) => {
                q.resolve(rows[0]);
              })
              .catch((err) => {
                console.log(err);
                q.reject(err);
              });
          }
          return q.promise;
        },
        searchPerson: (db, query) => {
          let q = $q.defer();
          let _query = query.split(" ");
          let sql;

          if (_query.length == 2) {
            sql = `
            select concat(pname, fname, " ", lname) as fullname, cid, patient_hn as hn
            from person
            where fname like ? and lname like ? order by fname, lname limit 20
          `;
            db.raw(sql, [`${_query[0]}%`, `${_query[1]}%`])
              .then((rows) => {
                q.resolve(rows[0]);
              })
              .catch((err) => {
                console.log(err);
                q.reject(err);
              });
          } else {
            sql = `
            select concat(pname, fname, " ", lname) as fullname, cid, patient_hn as hn
            from person
            where fname like ? order by fname, lname limit 20
          `;
            db.raw(sql, [`%${query}%`])
              .then((rows) => {
                q.resolve(rows[0]);
              })
              .catch((err) => {
                console.log(err);
                q.reject(err);
              });
          }
          return q.promise;
        }
      };
    });
})(window, window.angular);
