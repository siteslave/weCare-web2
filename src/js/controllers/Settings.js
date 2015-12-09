angular.module('app.controllers.Settings', [])
  .controller('SettingCtrl', ($scope, Config, Helpers, LxNotificationService) => {

    $scope.config = Config.getConfig();

    $scope.config.db.password = Helpers.decrypt($scope.config.db.password);
    $scope.config.cloud.key = Helpers.decrypt($scope.config.cloud.key);

    $scope.save = () => {
      LxNotificationService.confirm('ยืนยันการบันทึก', 'คุณต้องการบันทึกรายการ ใช่หรือไม่?',
        { cancel:'ไม่ใช่', ok:'ใช่' }, (answer) =>  {
          if (answer) {
            let fse = require('fs-extra');
            let configFile = Config.getConfigFile();

            $scope.config.db.password = Helpers.encrypt($scope.config.db.password);
            $scope.config.cloud.key = Helpers.encrypt($scope.config.cloud.key);

            fse.writeJson(configFile, $scope.config, (err) => {
              if (err) {
                LxNotificationService.error(`Error: ${JSON.stringify(err)}`)
              } else {
                $scope.config.db.password = Helpers.decrypt($scope.config.db.password);
                $scope.config.cloud.key = Helpers.decrypt($scope.config.cloud.key);
                LxNotificationService.success('บันทึกเสร็จเรียบร้อยแล้ว');
              }
            })
          }
        });
    }

  });

