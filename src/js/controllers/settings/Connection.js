angular.module('app.controllers.settings.Connection', [])
  .controller('ConnectionCtrl', ($scope, Config, Helpers, LxNotificationService) => {

    $scope.config = Config.getConfig();

    $scope.config.db.password = Helpers.decrypt($scope.config.db.password);
    $scope.config.cloud.key = Helpers.decrypt($scope.config.cloud.key);

    $scope.config.start_date = $scope.config.start_date ? moment($scope.config.start_date, "YYYY-MM-DD").format() : moment().format();
    $scope.config.end_date = $scope.config.end_date ? moment($scope.config.end_date, "YYYY-MM-DD").format() : moment().format();

    $scope.save = () => {
      LxNotificationService.confirm('ยืนยันการบันทึก', 'คุณต้องการบันทึกรายการ ใช่หรือไม่?',
        { cancel:'ไม่ใช่', ok:'ใช่' }, (answer) =>  {
          if (answer) {
            let fse = require('fs-extra');
            let configFile = Config.getConfigFile();

            $scope.config.db.password = Helpers.encrypt($scope.config.db.password);
            $scope.config.cloud.key = Helpers.encrypt($scope.config.cloud.key);

            $scope.config.start_date = moment($scope.config.start_date).format('YYYY-MM-DD');
            $scope.config.end_date = moment($scope.config.end_date).format('YYYY-MM-DD');

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

