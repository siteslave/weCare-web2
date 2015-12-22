
((window, angular) => {
  angular.module('app', [
      'lumx',
      'ui.router',
      'app.Config',
      'app.Helpers',
      'app.controllers.emr.EmrMain',
      'app.services.emr.EmrService',
      'app.controllers.emr.EmrDetail'
    ])
    .config(($stateProvider, $urlRouterProvider) => {
      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state('emr', {
          url: "/",
          templateUrl: '../partials/Emr.html'
        })
        .state('emr-detail', {
          url: '/detail/:hospcode/:pid/:seq',
          templateUrl: '../partials/emr/Detail.html',
          controller: 'EmrDetailCtrl'
        });
    });
})(window, window.angular);
