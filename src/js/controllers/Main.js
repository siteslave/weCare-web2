angular.module('app.controllers.Main', ['app.services.Main'])
  .controller('MainCtrl', ($scope, MainService, LxProgressService, LxNotificationService) => {

    $scope.showVisit = () => {
      if ($scope.serviceDate) {
        $scope.patient = [];
        LxProgressService.linear.show('primary', '#progress');
        MainService.getService($scope.serviceDate)
          .then((rows) => {
            LxNotificationService.success(`แสดงรายการเสร็จเรียบร้อยแล้ว พบ ${rows.length} รายการ`);
            $scope.patient = rows;
            LxProgressService.linear.hide();
          }, (err) => {
            LxNotificationService.error(`Error: ${JSON.stringify(err)}`);
            LxProgressService.linear.hide();
          })
      }
    };

    $scope.serviceDate = moment().format();

    // initial service
    $scope.showVisit();

  });
