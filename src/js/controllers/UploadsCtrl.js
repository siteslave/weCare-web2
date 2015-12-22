"use strict";

let ipcRenderer = require('electron').ipcRenderer;
let fs = require('fs');
let path = require('path');
let fileSize = require('filesize');
let moment = require('moment');
let request = require('request');

angular.module('app.controllers.Uploads', [])
  .controller('UploadsCtrl', ($scope, Config, LxNotificationService) => {
    let _files = [];
    $scope.files = [];

    $scope.getFile = () => {
      _files = ipcRenderer.sendSync('open-file');
      if (_files.length) {
        _files.forEach((v) => {
          let fstat = fs.statSync(v);
          let obj = {};
          obj.file_name = path.basename(v);
          obj.file_size = fileSize(fstat.size);
          obj.full_path = v;
          obj.modified_date = moment(fstat.mtime).format('DD/MM/YYYY HH:mm:ss');
          $scope.files.push(obj);
        });
      }
    };

    $scope.doUploads = () => {
      let files = [];
      if ($scope.files.length) {
        $scope.files.forEach((v) => {
          let _fs = fs.createReadStream(v.full_path);
          files.push(_fs);
        });

        let config = Config.getConfig();
        let url = config.cloud.url + '/uploads';

        var formData = {
          files: files,
          _hospcode: config.cloud.hospcode,
          _key: config.cloud.key
        };

        request.post({
          url: url,
          formData: formData
        }, function (err, res, body) {
          var result = JSON.parse(body);
          if (result.ok) {
            LxNotificationService.success('อัปโหลดไฟล์เสร็จเรียบร้อยแล้ว');
            $scope.files = [];
          } else {
            LxNotificationService.error('Error: ' + JSON.stringify(result.msg))
          }
        });
      } else {
        LxNotificationService.error('กรุณาเลือกไฟล์ที่ต้องการอัปโหลด')
      }

    };
  });