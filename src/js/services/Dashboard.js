"use strict";

((window, angular) => {
  angular.module('app.services.Dashboard', [])
  .factory('DashService', ($q, $http, Config) => {
    let config = Config.getConfig();
    let db = Config.getMySQLConnection();
    let _url = config.cloud.url;
    let _key = config.cloud.key;
    let _hospcode = config.cloud.hospcode;

    return {

      getCloudSurveillance(start, end) {
        let q = $q.defer();

        let params = {};

        params._key = _key;
        params._hospcode = _hospcode;
        params.hospcode = _hospcode;
        params.start = start;
        params.end = end;

        let options = {
          url: _url + '/dashboard/surveillance',
          method: 'POST',
          data: params
        };

        $http(options)
        .success((data) => {
          q.resolve(data);
        })
        .error((data, status, header, config, statusText) => {
          q.reject(status);
        });

        return q.promise;
      },

      getCloudSurveillanceServiceDetail(vn) {
        let q = $q.defer();

        let params = {};

        params._key = _key;
        params._hospcode = _hospcode;
        params.vn = vn;

        let options = {
          url: _url + '/dashboard/surveillance/detail',
          method: 'POST',
          data: params
        };

        $http(options)
        .success((data) => {
          q.resolve(data);
        })
        .error((data, status, header, config, statusText) => {
          q.reject(status);
        });

        return q.promise;
      },

      getCloudLaborDetail(pid) {
        let q = $q.defer();

        let params = {};

        params._key = _key;
        params._hospcode = _hospcode;
        params.pid = pid;

        let options = {
          url: _url + '/dashboard/labor/detail',
          method: 'POST',
          data: params
        };

        $http(options)
        .success((data) => {
          q.resolve(data);
        })
        .error((data, status, header, config, statusText) => {
          q.reject(status);
        });

        return q.promise;
      },

      getCloudLabor() {
        let q = $q.defer();

        let params = {};

        params._key = _key;
        params._hospcode = _hospcode;
        params.hospcode = _hospcode;
        params.start = config.start_date ? config.start_date : moment().format('YYYY-MM-DD');
        params.end = config.end_date ? config.end_date : moment().format('YYYY-MM-DD');

        let options = {
          url: _url + '/dashboard/labor',
          method: 'POST',
          data: params
        };

        $http(options)
        .success((data) => {
          q.resolve(data);
        })
        .error((data, status, header, config, statusText) => {
          q.reject(status);
        });

        return q.promise;
      },

      getCloudAnc(cid, gravida) {
        let q = $q.defer();

        let params = {};

        params._key = _key;
        params._hospcode = _hospcode;
        params.cid = cid;
        params.gravida = gravida;

        let options = {
          url: _url + '/emr/anc',
          method: 'POST',
          data: params
        };

        $http(options)
        .success((data) => {
          q.resolve(data);
        })
        .error((data, status, header, config, statusText) => {
          q.reject(status);
        });

        return q.promise;
      },

      getCloudPostnatal(cid, gravida) {
        let q = $q.defer();

        let params = {};

        params._key = _key;
        params._hospcode = _hospcode;
        params.cid = cid;
        params.gravida = gravida;

        let options = {
          url: _url + '/emr/postnatal',
          method: 'POST',
          data: params
        };

        $http(options)
        .success((data) => {
          q.resolve(data);
        })
        .error((data, status, header, config, statusText) => {
          q.reject(status);
        });

        return q.promise;
      },

      getAncList() {
        let q = $q.defer();
        let sql = `
        select concat(p.pname, p.fname," ", p.lname) as fullname, p.cid, pa.labor_date, pa.edc, pa.lmp, pa.pre_labor_service1_date as date1, pa.pre_labor_service2_date as date2,
        pa.pre_labor_service3_date as date3, pa.pre_labor_service4_date as date4,
        pa.pre_labor_service5_date as date5, pa.preg_no,
        DATE_ADD(pa.lmp,INTERVAL 12 WEEK) as date11,
        DATE_ADD(pa.lmp,INTERVAL 16 WEEK) as date21, DATE_ADD(pa.lmp,INTERVAL 20 WEEK) as date22,
        DATE_ADD(pa.lmp,INTERVAL 24 WEEK) as date31, DATE_ADD(pa.lmp,INTERVAL 28 WEEK) as date32,
        DATE_ADD(pa.lmp,INTERVAL 30 WEEK) as date41, DATE_ADD(pa.lmp,INTERVAL 34 WEEK) as date42,
        DATE_ADD(pa.lmp,INTERVAL 36 WEEK) as date51, DATE_ADD(pa.lmp,INTERVAL 40 WEEK) as date52
        from person_anc as pa
        inner join person as p on p.person_id=pa.person_id
        left join house_regist_type as ht on ht.house_regist_type_id=p.house_regist_type_id
        where ht.export_code in ("1", "3")
        and pa.discharge="N" and (pa.labor_date between ? and ? or pa.labor_date is null)
        and pa.lmp is not null
        order by p.fname, p.lname
        `;

        db.raw(sql, [config.start_date, config.end_date])
        .then((rows) => {
          q.resolve(rows[0])
        })
        .catch((err) => {
          q.reject(err)
        });

        return q.promise;
      },
      getLaborCareList() {
        let q = $q.defer();
        let sql = `
        select pa.person_anc_id, pa.person_id, concat(p.pname, p.fname," ", p.lname) as fullname, p.cid,
        pa.labor_date, pa.preg_no, pa.force_complete_export, pa.force_complete_date,
        pa.post_labor_service1_date as date1, pa.post_labor_service2_date as date2,
        pa.post_labor_service3_date as date3,
        pa.labor_date as date11, DATE_ADD(pa.labor_date,INTERVAL 7 DAY) as date12,
				DATE_ADD(pa.labor_date,INTERVAL 8 DAY) as date21, DATE_ADD(pa.labor_date,INTERVAL 15 DAY) as date22,
				DATE_ADD(pa.labor_date,INTERVAL 16 DAY) as date31, DATE_ADD(pa.labor_date,INTERVAL 45 DAY) as date32
        from person_anc as pa
        inner join person as p on p.person_id=pa.person_id
        left join house_regist_type as ht on ht.house_regist_type_id=p.house_regist_type_id
        where pa.labor_date is not null
        and ht.export_code in ("1", "3")
        and (pa.discharge="N" or pa.discharge IS NULL)
        and pa.labor_date between ? and ?
        order by p.fname, p.lname
        `;

        db.raw(sql, [config.start_date, config.end_date])
        .then((rows) => {
          q.resolve(rows[0])
        })
        .catch((err) => {
          q.reject(err)
        });

        return q.promise;
      }
    }
  })
})(window, window.angular);