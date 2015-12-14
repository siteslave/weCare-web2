
((window, angular) => {
  angular.module('app', [
      'lumx',
      'ui.router',
      'app.Config',
      'app.Helpers',
      'app.controllers.Main',
      'app.controllers.Typearea'
    ])
    .config(($stateProvider, $urlRouterProvider) => {
      $urlRouterProvider.otherwise("/typearea");

      $stateProvider
        .state('main', {
          url: "/",
          templateUrl: '../partials/Main.html',
          controller: 'MainCtrl'
        })
        .state('typearea', {
          url: '/typearea',
          templateUrl: '../partials/Typearea.html',
          controller: 'TypeareaCtrl'
        })
    })
})(window, window.angular);