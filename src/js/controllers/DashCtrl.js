"use strict";
((window, angular) => {

  let _ = require('lodash');

  angular.module('app.controllers.Dashboard', ['app.services.Dashboard'])
  .controller('DashCtrl', ($scope, $window, DashService, Helpers, LxNotificationService, LxDialogService, LxProgressService) => {

    $scope.personAnc = [];
    $scope.personAncInMonth = [];
    $scope.personLabor = [];
    $scope.personLaborCareInMonth = [];
    $scope.personSurveillance = [];
    $scope.perosonCloudLabor = [];

    if ($window.sessionStorage.getItem('surveillanceDate')) {
      $scope.surveillanceDate = $window.sessionStorage.getItem('surveillanceDate');
    } else {
      $scope.surveillanceDate = moment().format();
    }

    $scope.thisYearMonth = moment().format('YYYYMM');

    LxProgressService.linear.show('primary', '#progress');

    DashService.getAncList()
    .then((rows) => {

      $scope.personAncInMonth = [];

      if (_.size(rows)) {
        rows.forEach((v) => {
          let obj = {};
          obj.fullname = v.fullname;
          obj.cid = v.cid;
          obj.edc = v.edc ? moment(v.edc).format('D/M/YYYY') : null;
          obj.date1 = v.date1 ? moment(v.date1).format('D/M/YYYY') : null;
          obj.date2 = v.date2 ? moment(v.date2).format('D/M/YYYY') : null;
          obj.date3 = v.date3 ? moment(v.date3).format('D/M/YYYY') : null;
          obj.date4 = v.date4 ? moment(v.date4).format('D/M/YYYY') : null;
          obj.date5 = v.date5 ? moment(v.date5).format('D/M/YYYY') : null;
          obj.preg_no = v.preg_no;
          obj.date11 = v.date11;
          obj.date21 = v.date21;
          obj.date22 = v.date22;
          obj.date31 = v.date31;
          obj.date32 = v.date32;
          obj.date41 = v.date41;
          obj.date42 = v.date42;
          obj.date51 = v.date51;
          obj.date52 = v.date52;

          obj.isQc1 = moment(v.date1).isBefore(moment(v.date11));
          obj.isQc2 = moment(v.date2).isBetween(moment(v.date21), moment(v.date22));
          obj.isQc3 = moment(v.date3).isBetween(moment(v.date31), moment(v.date32));
          obj.isQc4 = moment(v.date4).isBetween(moment(v.date41), moment(v.date42));
          obj.isQc5 = moment(v.date5).isBetween(moment(v.date51), moment(v.date52));
          obj.isQc = obj.isQc1 && obj.isQc2 && obj.isQc3 && obj.isQc4 && obj.isQc5;


          let _yearMonth1 = moment(v.date11).format('YYYYMM');
          let _yearMonth2 = moment(v.date22).format('YYYYMM');
          let _yearMonth3 = moment(v.date32).format('YYYYMM');
          let _yearMonth4 = moment(v.date42).format('YYYYMM');
          let _yearMonth5 = moment(v.date52).format('YYYYMM');

          if (_yearMonth1 == $scope.thisYearMonth || _yearMonth2 == $scope.thisYearMonth ||
            _yearMonth3 == $scope.thisYearMonth || _yearMonth4 == $scope.thisYearMonth || _yearMonth5 == $scope.thisYearMonth) {
            $scope.personAncInMonth.push(obj);
          }
          $scope.personAnc.push(obj);
        });

        console.log($scope.personAnc);
      }

      return DashService.getLaborCareList();
    })
    .then((rows) => {
      if (_.size(rows)) {
        $scope.personLaborCareInMonth = [];
        rows.forEach((v) => {
          let obj = {};
          obj.fullname = v.fullname;
          obj.cid = v.cid;
          obj.labor_date = v.labor_date ? moment(v.labor_date).format('D/M/YYYY') : null;
          obj.date1 = v.date1 ? moment(v.date1).format('D/M/YYYY') : null;
          obj.date2 = v.date2 ? moment(v.date2).format('D/M/YYYY') : null;
          obj.date3 = v.date3 ? moment(v.date3).format('D/M/YYYY') : null;
          obj.force_complete_export = v.force_complete_export == 'Y' ? true : false;
          obj.preg_no = v.preg_no;

          obj.date11 = v.date11;
          obj.date21 = v.date21;
          obj.date22 = v.date22;
          obj.date31 = v.date31;

          obj.isQc1 = moment(v.date1).isBetween(moment(v.date11), moment(v.date12));
          obj.isQc2 = moment(v.date2).isBetween(moment(v.date21), moment(v.date22));
          obj.isQc3 = moment(v.date3).isBetween(moment(v.date31), moment(v.date32));
          obj.isQc = obj.isQc1 && obj.isQc2 && obj.isQc3;


          let _yearMonth1 = moment(v.date11).format('YYYYMM');
          let _yearMonth2 = moment(v.date22).format('YYYYMM');
          let _yearMonth3 = moment(v.date32).format('YYYYMM');

          if (_yearMonth1 == $scope.thisYearMonth || _yearMonth2 == $scope.thisYearMonth ||
            _yearMonth3 == $scope.thisYearMonth) {
            $scope.personLaborCareInMonth.push(obj);
          }

          $scope.personLabor.push(obj);
        });

      }

      LxProgressService.linear.hide();
    }, (err) => {
      LxProgressService.linear.hide();
      console.log(err);
      LxNotificationService.error(`Error: ${err}`)
    });

    // Get surveillance list
    let getSurveillanceList = () => {

      $scope.personSurveillance = {};
      $scope.personSurveillance.risk = [];
      $scope.personSurveillance.nonRisk = [];


      LxProgressService.linear.show('primary', '#progress');

      //let month = moment($scope.surveillanceDate).get('month') + 1;
      //let year = moment($scope.surveillanceDate).get('year');
      let end = moment($scope.surveillanceDate).format('YYYY-MM-DD');
      let start = moment($scope.surveillanceDate).subtract(7, 'days').format('YYYY-MM-DD');

      DashService.getCloudSurveillance(start, end)
        .then((data) => {
          data.rows.forEach((v) => {
            let obj = {};
            obj.fullname = `${v.pname}${v.fname} ${v.lname}`;
            obj.vstdate = moment(v.vstdate).format('DD/MM/YYYY');
            obj.vsttime = v.vsttime;
            obj.diag_code = v.diag_code;
            obj.diag_name = v.diag_name;
            obj.address = `${v.addrpart} หมู่ ${v.moopart} ${v.address_name}`;
            obj.vn = v.vn;

            obj.isHighRisk = Helpers.isSurveillanceHighRisk(v.diag_code.substring(0, 3));

            if (obj.isHighRisk) {
              $scope.personSurveillance.risk.push(obj);
            } else {
              $scope.personSurveillance.nonRisk.push(obj);
            }

          });



          LxProgressService.linear.hide();
        }, (err) => {
          LxProgressService.linear.hide();
          LxNotificationService.error(`Connection error: [${err}]`);
        });
    };

    // Get surveillance list
    let getCloudLabor = () => {

      LxProgressService.linear.show('primary', '#progress');

      $scope.perosonCloudLabor = [];

      DashService.getCloudLabor()
        .then((data) => {
          data.rows.forEach((v) => {
            let obj = {};
            obj.fullname = `${v.pname}${v.fname} ${v.lname}`;
            obj.age = v.age;
            obj.labor_date = moment(v.labor_date).format('DD/MM/YYYY');
            obj.preg_no = v.preg_no;
            obj.diag_code = v.diag_code;
            obj.diag_name = v.diag_name;
            obj.person_id = v.person_id;

            $scope.perosonCloudLabor.push(obj);
          });

          LxProgressService.linear.hide();
        }, (err) => {LxProgressService.linear.hide();

          LxNotificationService.error(`Connection error: [${err}]`);
        });
    };

    $scope.getSurveillanceDetail = (vn) => {
      LxProgressService.linear.show('primary', '#progress');
      DashService.getCloudSurveillanceServiceDetail(vn)
      .then((data) => {
        //console.log(data);
        $scope.diags = data.rows.diag;
        $scope.labs = data.rows.lab;
        $scope.drugs = data.rows.drug;
        $scope.screen = data.rows.screen;
        if ($scope.screen) {
          $scope.screen.vstdate = $scope.screen.vstdate ? moment($scope.screen.vstdate).format('DD/MM/YYYY') : '';
          $scope.screen.bp = $scope.screen.bps + '/' + $scope.screen.bpd;
        }

        LxProgressService.linear.hide();
        LxDialogService.open('mdlSurveillanceDetail');

      }, (err) => {
        console.log(err);
        LxProgressService.linear.hide();
        LxNotificationService.error('เกิดข้อผิดพลาด');
      })
    };

    $scope.getLaborDetail = (pid) => {
      LxProgressService.linear.show('primary', '#progress');
      DashService.getCloudLaborDetail(pid)
      .then((res) => {
        LxProgressService.linear.hide();

        $scope.laborDetail = res.rows;
        $scope.laborDetail.risk = $scope.laborDetail.has_risk == 'Y' ? 'ใช่' : 'ไม่ใช่';

        $scope.laborDetail.edc = $scope.laborDetail.edc ? moment($scope.laborDetail.edc).format('DD/MM/YYYY') : '';
        $scope.laborDetail.lmp = $scope.laborDetail.lmp ? moment($scope.laborDetail.lmp).format('DD/MM/YYYY') : '';
        $scope.laborDetail.labor_date = $scope.laborDetail.labor_date ? moment($scope.laborDetail.labor_date).format('DD/MM/YYYY') : '';
        $scope.laborDetail.first_doctor_date = $scope.laborDetail.first_doctor_date ? moment($scope.laborDetail.first_doctor_date).format('DD/MM/YYYY') : '';

        if (_.size($scope.laborDetail)) {
          LxDialogService.open('mdlLaborDetail');
        } else {
          LxNotificationService.info('ไม่พบข้อมูลการคลอด');
        }
      }, (err) => {
        LxProgressService.linear.hide();
        console.log(err);
        LxNotificationService.error('Error: ' + JSON.stringify(err));
      })
    };

    getCloudLabor();

    $scope.$watch('surveillanceDate', function() {
      $window.sessionStorage.setItem('surveillanceDate', $scope.surveillanceDate);
      getSurveillanceList();
    });

    $scope.showAncCalendar = (calendar) => {
      $scope.ancCalendar = calendar;
      LxDialogService.open('mdlAncCalendar');
    };

    $scope.showPostnatalCalendar = (calendar) => {
      $scope.postnatalCalendar = calendar;
      LxDialogService.open('mdlPostnatalCalendar');
    };

    $scope.getCloudAnc = (cid, gravida) => {
      let _cid = Helpers.encrypt(cid);
      DashService.getCloudAnc(_cid, gravida)
      .then((data) => {

        if (data.ok) {

          $scope.ancCloudService = data.rows;

          if (_.size(data.rows)) {
            LxDialogService.open('mdlAncCloudService');
          } else {
            LxNotificationService.info('ไม่พบประวัติการฝากครรภ์');
          }
        } else {
          LxNotificationService.error('Error: ' + JSON.stringify(data.msg));
        }
      }, (err) => {
        LxNotificationService.error('Error: ' + JSON.stringify(err));
      })
    };

    $scope.getCloudPostnatal = (cid, gravida) => {
      let _cid = Helpers.encrypt(cid);
      DashService.getCloudPostnatal(_cid, gravida)
      .then((data) => {
        console.log(data);
        if (data.ok) {
          $scope.postnatalCloudService = data.rows;
          if (_.size(data.rows)) {
            LxDialogService.open('mdlPostnatalCloudService');
          } else {
            LxNotificationService.info('ไม่พบประวัติการดูแลหลังคลอด');
          }
        } else {
          LxNotificationService.error('Error: ' + JSON.stringify(data.msg));
        }
      }, (err) => {
        LxNotificationService.error('Error: ' + JSON.stringify(err));
      })
    };

  });
})(window, window.angular);