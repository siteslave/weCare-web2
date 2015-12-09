angular.module('app.services.Main', [])
.factory('MainService', ($q, Config) => {

  let db = Config.getMySQLConnection();
  let moment = require('moment');

  return {
    getService: (date) => {
      let q = $q.defer();

      var date = date ? moment(date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');

      var sql = `select (select hospitalcode from opdconfig limit 1) as hospcode, p.person_id as pid,
      o.vstdate, o.hn, o.vn, p.pname, p.fname, p.lname, p.cid,
      od.icd10 as diag_code, icd.name as diag_name, o.pttype, ptt.name as pttype_name,
      timestampdiff(year, p.birthdate, o.vstdate) as age_y
      from ovst as o
      inner join person as p on p.patient_hn=o.hn
      left join ovstdiag as od on od.vn=o.vn
      left join icd101 as icd on icd.code=od.icd10
      left join pttype as ptt on ptt.pttype=o.pttype
      where o.vstdate = ?
      and od.diagtype="1"
      group by o.vn order by p.fname, p.lname`;

      db.raw(sql, [date])
        .then(function(rows) {
          q.resolve(rows[0]);
        })
        .catch(function(err) {
          q.reject(err);
        });

      return q.promise;
    }
  }
});