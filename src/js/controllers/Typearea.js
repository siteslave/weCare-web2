angular.module('app.controllers.Typearea', ['app.services.Typearea'])
.controller('TypeareaCtrl', ($scope, Config, LxDialogService, LxProgressService, LxNotificationService, TypeareaService) => {

  $scope.patient = [];
  var ipcRenderer = require('electron').ipcRenderer;
  var _ = require('lodash');

  var _config = Config.getConfig();
  var db = Config.getMySQLConnection();

  $scope.hospcode = _config.cloud.hospcode;
  $scope.cid = null;

  TypeareaService.getTypearea(db)
  .then((rows) => {
    $scope.typeareas = rows;
  });

  $scope.closingDuplicatedDialog = () => {
    $scope.cid = null;
  };

  $scope.saveTypearea = () => {
    if ($scope.cid && $scope.typearea >= 0) {

      //$scope.typearea_export_code
      TypeareaService.saveTypeareaPerson(db, $scope.cid, $scope.typearea)
      .then(() => {
        return TypeareaService.saveTypeAreaPatient(db, $scope.cid, $scope.typearea);
      })
      .then(() => {
        let _cid = ipcRenderer.sendSync('encrypt', $scope.cid);
        return TypeareaService.changeCloudTypeArea($scope.hospcode, _cid, $scope.typearea_export_code);
      })
      .then(() => {

        LxNotificationService.success('เปลี่ยน Typearea ในฐาน HOSxP เสร็จเรียบร้อยแล้ว');

        if ($scope.typearea_export_code == "2" || $scope.typearea_export_code == "4" || $scope.typearea_export_code == "5") {
          var idx = _.findIndex($scope.patient, {cid: $scope.cid});
          if (idx >= 0) {
            $scope.patient.splice(idx, 1);
          }
        }

        LxDialogService.close('mdlChangeTypearea');
        //$scope.getList($scope.hospcode);
      }, (err) => {
        LxNotificationService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(err));
      });
    } else {
      LxNotificationService.error('กรุณาระบุ Typearea');
    }
  };

  $scope.setTypearea = (data) => {
    $scope.typearea = data.newValue.house_regist_type_id;
    $scope.typearea_export_code = data.newValue.export_code;
  };

  $scope.showDuplicated = (cid) => {
    let _cid = ipcRenderer.sendSync('encrypt', cid);
    TypeareaService.getDuplicatedDetail(_cid)
    .then((data) => {
      if (data.ok) {
        $scope.duplicatedPerson = [];
        data.rows.forEach((elm, idx) => {
          let obj = {};
          let _fname = ipcRenderer.sendSync('decrypt', elm.fname);
          let _lname = ipcRenderer.sendSync('decrypt', elm.lname);

          obj.fullname = `${_fname} ${_lname}`;
          obj.birth = elm.birth;
          obj.hospital = `${elm.hospcode} ${elm.hospname}`;
          obj.reserved = elm.reserved;
          obj.sex = elm.sex;
          obj.typearea = elm.typearea;

          $scope.duplicatedPerson.push(obj);
        });
        LxDialogService.open('mdlDuplicated');
      } else {
        LxNotificationService.error('Error: ' + JSON.stringify(data.msg));
      }
    }, (err) => {
      LxNotificationService.error('ไม่สามารถเชื่อมต่อกับ Server ได้ : ' + JSON.stringify(err));
      console.log(err);
    });

  };

  $scope.showChageTypearea = (cid) => {
    $scope.cid = cid;
    LxDialogService.open('mdlChangeTypearea');
  };

  $scope.getList = (hospcode) => {
    LxProgressService.linear.show('primary', '#progress');
    TypeareaService.getDuplicatedList(hospcode)
    .then((data) => {
      if (data.ok) {
        data.rows.forEach((elm, idx) => {
          var obj = {};
          obj.cid = ipcRenderer.sendSync('decrypt', elm.cid);
          obj.fname = ipcRenderer.sendSync('decrypt', elm.fname);
          obj.lname = ipcRenderer.sendSync('decrypt', elm.lname);
          obj.birth = elm.birth;
          obj.age = elm.age;
          obj.pid = elm.pid;
          obj.sex = elm.sex == '1' ? 'ชาย' : 'หญิง';
          obj.typearea = elm.typearea;
          obj.reserved = elm.reserved;
          obj.isOwner = elm.isOwner;

          $scope.patient.push(obj);
        });

        LxProgressService.linear.hide();
      } else {
        console.log(data.msg);
        LxNotificationService.error('Error: ' + JSON.stringify(data.msg));
        LxProgressService.linear.hide();
      }
    }, (err) => {
      console.log(err);
      LxNotificationService.error('Connection error!');
      LxProgressService.linear.hide();
    });
  };

  $scope.reserve = (cid) => {
    let _cid = ipcRenderer.sendSync('encrypt', cid);
    LxNotificationService.confirm('ยืนยัน', 'คุณต้องการจองข้อมูลกลุ่มเป้าหมายคนนี้ ใช่หรือไม่?', {ok: 'ใช่', cancel: 'ไม่ใช่'}, function (res) {
      if (res) {
        TypeareaService.doReserve(_cid, $scope.hospcode)
          .then((data) => {
            if (data.ok) {
              LxNotificationService.success('จองรายการเสร็จเรียบร้อยแล้ว');
              let idx = _.findIndex($scope.patient, {cid: cid});
              if (idx >= 0) {
                $scope.patient[idx].isOwner = 'Y';
                $scope.patient[idx].reserved = 'Y';
              }
            } else {
              LxNotificationService.error('Error: ' + JSON.stringify(data.msg));
            }
          }, (err) => {
            console.log(err);
            LxNotificationService.error('Connection error!');
          });
      }
    });

  };

  $scope.getList($scope.hospcode);

});
