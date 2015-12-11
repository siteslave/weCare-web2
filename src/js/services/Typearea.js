((window, angular) => {
  angular.module('app.services.Typearea', [])
  .factory('TypeareaService', ($q, $http, Config) => {
    let config = Config.getConfig();
    let cloudUrl = config.cloud.url;

    return {
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