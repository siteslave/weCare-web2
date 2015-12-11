
((window, angular) => {
  angular.module('app', [
      'lumx',
      'ui.router',
      'app.Config',
      'app.Helpers'
    ])
    .config(($stateProvider, $urlRouterProvider) => {
      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state('emr', {
          url: "/",
          templateUrl: '../partials/Emr.html'
        })
        .state('emr-detail', {
          url: '/detail/:cid',
          templateUrl: '../partials/emr/Detail.html'
        })
    })
})(window, window.angular);