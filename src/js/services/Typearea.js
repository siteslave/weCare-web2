((window, angular) => {
  angular.module('app.services.Typearea', [])
  .factory('TypeareaService', ($q, $http, Config) => {
    let config = Config.getConfig();
    let cloudUrl = config.cloud.url;

    return {
      getTypearea: (db) => {
        var q = $q.defer();
        db('house_regist_type')
          .select('house_regist_type_name', 'house_regist_type_id', 'export_code')
          .then(function (rows) {
            q.resolve(rows);
          })
          .catch(function (err) {
            q.reject(err);
          });

        return q.promise;
      },
      saveTypeareaPerson: (db, cid, typearea) => {
        var q = $q.defer();
        db('person')
          .where({
            cid: cid
          })
          .update({
            house_regist_type_id: typearea,
            last_update: moment().format('YYYY-MM-DD HH:mm:ss')
          })
          .then(function () {
            q.resolve();
          })
          .catch(function (err) {
            q.reject(err);
          });

        return q.promise;
      },
      saveTypeAreaPatient: (db, cid, typearea) => {
        var q = $q.defer();
        db('patient')
          .where({
            cid: cid
          })
          .update({
            type_area: typearea,
            last_update: moment().format('YYYY-MM-DD HH:mm:ss')
          })
          .then(function () {
            q.resolve();
          })
          .catch(function (err) {
            q.reject(err);
          });

        return q.promise;
      },
      getDuplicatedList: (hospcode) => {
        let q = $q.defer();
        let params = {};
        params._key = config.cloud.key;
        params._hospcode = config.cloud.hospcode;
        params.hospcode = hospcode;

        let options = {
          url: cloudUrl + '/typearea',
          method: 'POST',
          data: params
        };

        $http(options)
        .then((res) => {
          q.resolve(res.data)
        }, (err) => {
          q.reject(err)
        });

        return q.promise;
      },

      getDuplicatedDetail: (cid) => {
        var q = $q.defer();
        let params = {};
        params._key = config.cloud.key;
        params._hospcode = config.cloud.hospcode;
        params.cid = cid;

        let options = {
          url: `${cloudUrl}/detail`,
          method: 'POST',
          data: params
        };

        $http(options)
          .then((res) => {
            q.resolve(res.data)
          }, (err) => {
            q.reject(err)
          });

        return q.promise;
      },

      doReserve: (cid, hospcode) => {
        var q = $q.defer();

        let params = {};
        params._key = config.cloud.key;
        params._hospcode = config.cloud.hospcode;
        params.hospcode = hospcode;
        params.cid = cid;

        let options = {
          url: `${cloudUrl}/reserve`,
          method: 'POST',
          data: params
        };

        $http(options)
          .then((res) => {
            q.resolve(res.data)
          }, (err) => {
            q.reject(err)
          });

        return q.promise;
      },

      changeCloudTypeArea: (hospcode, cid, typearea) => {
        var q = $q.defer();

        let params = {};
        params._key = config.cloud.key;
        params._hospcode = config.cloud.hospcode;
        params.hospcode = hospcode;
        params.cid = cid;
        params.typearea = typearea;

        let options = {
          url: `${cloudUrl}/change-typearea`,
          method: 'POST',
          data: params
        };

        $http(options)
          .then((res) => {
            q.resolve()
          }, (err) => {
            q.reject(err)
          });

        return q.promise;
      }
    }
  });
})(window, window.angular);