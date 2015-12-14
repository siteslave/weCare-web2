((window, angular) => {
  angular.module('app.services.Typearea', [])
  .factory('TypeareaService', ($q, $http, Config) => {
    let config = Config.getConfig();
    let cloudUrl = config.cloud.url;

    return {
      getTypearea: (db) => {
        var q = $q.defer();
        db('house_regist_type')
          .select('house_regist_type_name', 'house_regist_type_id')
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
        let options = {
          url: cloudUrl + '/typearea',
          method: 'POST',
          data: { hospcode: hospcode }
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
        let options = {
          url: `${cloudUrl}/detail`,
          method: 'POST',
          data: {cid: cid}
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
        let options = {
          url: `${cloudUrl}/reserve`,
          method: 'POST',
          data: {cid: cid, hospcode: hospcode}
        };

        $http(options)
          .then((res) => {
            q.resolve(res.data)
          }, (err) => {
            q.reject(err)
          });

        return q.promise;
      }
    }
  });
})(window, window.angular);