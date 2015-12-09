window.jQuery = window.$ = require('../../vendor/jquery/dist/jquery.js');
require('../../vendor/velocity/velocity.min.js');
global.moment = require('../../vendor/moment/min/moment-with-locales.js');
require('../../vendor/angular/angular.js');
require('../../vendor/angular-ui-router/release/angular-ui-router.js');
require('../../vendor/lumx/dist/lumx.js');

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
  });
