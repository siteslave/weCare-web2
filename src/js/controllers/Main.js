angular.module('app.controllers.Main', ['app.services.Main'])
  .controller('MainCtrl', ($scope, $window, MainService, LxProgressService, LxNotificationService) => {

    $scope.showVisit = () => {
      if ($scope.serviceDate) {

        $window.sessionStorage.setItem('serviceDate', $scope.serviceDate);

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

    if ($window.sessionStorage.getItem('serviceDate')) {
      $scope.serviceDate = $window.sessionStorage.getItem('serviceDate');
    } else {
      $scope.serviceDate = moment().format();
    }


    // initial service
    $scope.showVisit();

  });
