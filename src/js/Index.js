
((window, angular) => {
  angular.module('app', [
      'lumx',
      'ui.router',
      'app.Config',
      'app.Helpers',
      'app.controllers.Main',
      'app.controllers.Typearea',
      'app.controllers.Emr',
      'app.controllers.Uploads',
      'app.services.Emr'

    ])
    .config(($stateProvider, $urlRouterProvider) => {
      $urlRouterProvider.otherwise("/");

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
        .state('uploads', {
          url: '/uploads',
          templateUrl: '../partials/Uploads.html',
          controller: 'UploadsCtrl'
        })
        .state('emr', {
          url: '/emr/:cid/:fullname',
          templateUrl: '../partials/Emr.html',
          controller: 'EmrCtrl'
        });
    });
})(window, window.angular);
