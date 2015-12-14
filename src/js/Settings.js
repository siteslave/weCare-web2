
((window, angular) => {
  angular.module('app', [
      'lumx',
      'ui.router',
      'app.Config',
      'app.Helpers',
      'app.controllers.settings.Connection'
    ])
    .config(($stateProvider, $urlRouterProvider) => {
      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state('settings', {
          url: "/",
          templateUrl: '../partials/settings/Connection.html',
          controller: 'ConnectionCtrl'
        })
        .state('settings-lab', {
          url: '/lab',
          templateUrl: '../partials/settings/Lab.html'
        })
    })
})(window, window.angular);