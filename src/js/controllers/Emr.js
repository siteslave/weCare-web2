((window, angular) => {
  let _ = require('lodash');

  angular.module('app.controllers.Emr', [])
    .controller('EmrCtrl', ($scope, $http, $stateParams, Config, EmrService,
                            LxNotificationService, LxProgressService) => {

      let db = Config.getMySQLConnection();
      $scope.person = null;

      $scope.getHistory = () => {
        $scope.services = [];
        $scope.service = [];
        $scope.diagnosis = [];
        $scope.procedures = [];
        $scope.drugs = [];
        $scope.labs = [];

        LxProgressService.linear.show('primary', '#progress');

        if ($scope.person) {
          let _cid = $scope.person.cid ? $scope.person.cid : null;
          if (!_cid) {
            LxProgressService.linear.hide();
            LxNotificationService.error('กรุณาระบุหมายเลขบัตรประจำตัวประชาชน เพื่อใช้ตรวจสอบ');
          } else {
            EmrService.getHistory(_cid)
              .then((data) => {
                if (data.ok) {
                  LxProgressService.linear.hide();
                  $scope.services = data.rows;
                  //get first service
                  if (_.size($scope.services)) {
                    console.log($scope.services[0]);
                    $scope.getCloudServiceInfo($scope.services[0].HOSPCODE, $scope.services[0].PID, $scope.services[0].SEQ);
                  }
                } else {
                  LxProgressService.linear.hide();
                  LxNotificationService.error('Error: ' + JSON.stringify(data.msg));
                }

              }, (err) => {
                LxProgressService.linear.hide();
                LxNotificationService.error(`ไม่สามารถเชื่อมต่อกับ Server ได้ [CODE: ${JSON.stringify(err)}]`);
              });
          }
        } else {
          LxNotificationService.error('กรุณาระบุข้อมูลที่ต้อการค้นหา');
          LxProgressService.linear.hide();
        }
      };

      $scope.ajax = {
        list: [],
        selectedPerson: null,
        loading: false,
        search: function(query) {
          // search from db
          EmrService.searchPerson(db, query)
            .then(function(rows) {
              if (_.size(rows)) {
                $scope.ajax.list = rows;
                $scope.ajax.loading = false;

              } else {

                EmrService.searchPatient(db, query)
                .then((rows) => {
                  $scope.ajax.list = rows;
                  $scope.ajax.loading = false;
                });
              }
            }, function(err) {
              console.log(err);
            });
        },
        setData: function(data, callback) {
          if (data) {
            $scope.person = data;
            callback(data);
          } else {
            callback();
          }
        }
      };

      if ($stateParams.cid && $stateParams.cid != 0) {
        $scope.ajax.selectedPerson = {cid: $stateParams.cid, fullname: $stateParams.fullname};
        $scope.person = $scope.ajax.selectedPerson;
        $scope.getHistory();
      }

      $scope.getCloudServiceInfo = (hospcode, pid, seq) => {
        let params = {hospcode: hospcode, pid: pid, seq: seq};
        EmrService.getCloudHistory(params)
        .then((data) => {
          LxProgressService.linear.hide();
          if (data.ok) {
            $scope.service = data.rows.services[0];
            $scope.diagnosis = data.rows.diagnosis;
            $scope.procedures = data.rows.procedures;
            $scope.drugs = data.rows.drugs;
            $scope.labs = data.rows.labs;
          } else {
            LxProgressService.linear.hide();
            LxNotificationService.error(`เกิดข้อผิดพลาด: ${JSON.stringify(data.msg)}`);
          }
        }, (err) => {
          LxProgressService.linear.hide();
          LxNotificationService.error(`ไม่สามารถเชื่อมต่อกับ Server ได้ [CODE: ${JSON.stringify(err)}]`);
        })
      }
    });
})(window, window.angular);
