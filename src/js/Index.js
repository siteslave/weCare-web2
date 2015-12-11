
((window, angular) => {
  angular.module('app', [
      'lumx',
      'ui.router',
      'app.Config',
      'app.Helpers',
      'app.controllers.Main',
      'app.controllers.Settings',
      'app.controllers.Typearea'
    ])
    .config(($stateProvider, $urlRouterProvider) => {
      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state('main', {
          url: "/",
          templateUrl: '../partials/Main.html',
          controller: 'MainCtrl'
        })
        .state('settings', {
          url: '/settings',
          templateUrl: '../partials/Settings.html',
          controller: 'SettingCtrl'
        })
        .state('typearea', {
          url: '/typearea',
          templateUrl: '../partials/Typearea.html',
          controller: 'TypeareaCtrl'
        })
    })
})(window, window.angular);