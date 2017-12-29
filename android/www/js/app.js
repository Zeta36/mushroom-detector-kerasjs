// Ionic Starter App

var he_entrado_en_camara = 0;
function LoadStop(event) {
	if (event.url == "cerrar_nav_interna.html") {
		// alert("fun load stop runs");
		ref.close();
	}
}
function Close(event) {
	ref.removeEventListener('loadstop', LoadStop);
	ref.removeEventListener('exit', Close);
}
function makeid() {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < 5; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

angular
		.module(
				'starter',
				[ 'ionic', 'ngCordova', 'starter.controllers',
						'starter.services' ])
		.directive('validNumber', function() {
	      return {
	    	  require: '?ngModel',
	    	  link: function(scope, element, attrs, ngModelCtrl) {
	    		  if(!ngModelCtrl) {
	    			  return; 
	    		  }
	
	    		  ngModelCtrl.$parsers.push(function(val) {
	    			  if (angular.isUndefined(val)) {
	    				  var val = '';
	    			  }
	    			  var clean = val.replace(/[^0-9\,]/g, '');
	    			  var decimalCheck = clean.split(',');
	
	    			  if(!angular.isUndefined(decimalCheck[1])) {
	    				  decimalCheck[1] = decimalCheck[1].slice(0,2);
	    				  clean =decimalCheck[0] + ',' + decimalCheck[1];
	    			  }
	
	    			  if (val !== clean) {
	    				  ngModelCtrl.$setViewValue(clean);
	    				  ngModelCtrl.$render();
	    			  }
	    			  return clean;
	    		  });
	
	    		  element.bind('keypress', function(event) {
	    			  if(event.keyCode === 32) {
	    				  event.preventDefault();
	    			  }
	    		  });
	    	  }
	      };
		})
		.run(
				function($ionicPlatform, $state, $cordovaPush, $http,
						$rootScope, $ionicHistory, $ionicPopup) {
					$ionicPlatform
							.ready(function() {

								$ionicPlatform
										.registerBackButtonAction(
												function() {
													if ($ionicHistory
															.currentStateName() == "principal.inicio") {
														navigator.app.exitApp();
													} else {
														$ionicHistory
																.nextViewOptions({
																	disableBack : true
																});
														$state
																.go('principal.inicio');
													}
												}, 100);

								var iosConfig = {
									"badge" : true,
									"sound" : true,
									"alert" : true,
								};
								
								var androidConfig = {
									"senderID" : "XXXXXXXX",
								};

								document
										.addEventListener(
												"deviceready",
												function() {
													$cordovaPush.register(androidConfig)
															.then(function(result) {
																		//Success
																	},
																	function(err) {
																		//Error
																	});

													$rootScope
															.$on(
																	'$cordovaPush:notificationReceived',
																	function(event, notification) {
																	});

												}); // deviceReady

								// Hide the accessory bar by default (remove
								// this to show the accessory bar above the
								// keyboard
								// for form inputs)
								if (window.cordova && window.cordova.plugins
										&& window.cordova.plugins.Keyboard) {
									cordova.plugins.Keyboard
											.hideKeyboardAccessoryBar(true);
								}

								if (window.StatusBar) {
									// org.apache.cordova.statusbar required
									StatusBar.styleLightContent();
								}
							});

				})

		.config(
				function($stateProvider, $urlRouterProvider,
						$ionicConfigProvider, $httpProvider) {

					$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
					$httpProvider.defaults.timeout = 10000;

					$ionicConfigProvider.backButton.text('').icon(
							'ion-chevron-left').previousTitleText(false);
					$ionicConfigProvider.tabs.position('bottom');
					$ionicConfigProvider.navBar.alignTitle('center');
					$stateProvider
							.state('principal', {
								url : "/principal",
								abstract : true,
								templateUrl : "templates/menu.html",
								controller : 'MenuCtrl'
							})
							.state('principal.inicio', {
								url : '/inicio',
								views : {
									'menuContent' : {
										templateUrl : "templates/inicio.html",
										controller : 'principalCtrl'
									}
								}

							})							
							.state(
									'principal.utilidades',
									{
										url : '/utilidades',
										views : {
											'menuContent' : {
												templateUrl : "templates/utilidades.html",
												controller : 'UtilidadesCtrl'
											}
										}
									})							
							.state(
									'principal.redes',
									{
										url : '/redes',
										views : {
											'menuContent' : {
												templateUrl : "templates/mushrooms.html",
												controller : 'RedesCtrl'
											}
										}
									})
							;

					// if none of the above states are matched, use this as the
					// fallback
					$urlRouterProvider.otherwise('/principal/inicio');

				});
