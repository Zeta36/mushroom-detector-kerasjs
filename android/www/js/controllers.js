angular
		.module('starter.controllers', [ 'ionic', 'ngCordova' ])
		// All this does is allow the message
		// to be sent when you tap return
		.directive('input', function($timeout) {
			return {
				restrict : 'E',
				scope : {
					'returnClose' : '=',
					'onReturn' : '&',
					'onFocus' : '&',
					'onBlur' : '&'
				},
				link : function(scope, element, attr) {
					element.bind('focus', function(e) {
						if (scope.onFocus) {
							$timeout(function() {
								scope.onFocus();
							});
						}
					});
					element.bind('blur', function(e) {
						if (scope.onBlur) {
							$timeout(function() {
								scope.onBlur();
							});
						}
					});
					element.bind('keydown', function(e) {
						if (e.which == 13) {
							if (scope.returnClose)
								element[0].blur();
							if (scope.onReturn) {
								$timeout(function() {
									scope.onReturn();
								});
							}
						}
					});
				}
			}
		})

		.controller(
				'InicioCtrl',
				function($rootScope, $scope, $ionicLoading, $http, $state,
						$ionicPlatform, $timeout, $ionicPopover, $ionicHistory, $q, Auth, $sce) {
					
					$scope.rrss_footer = function(tipo) {
						
						if(tipo == "mapa")
						{
							try {
								var latitud = "";
								var longitud = "";

								if (latitud == "" || latitud == "undefined") {
									latitud = 41.6172399;
									longitud = 0.6293067;
								}
								
								ref = window.open("google.navigation:q=" + latitud
										+ "," + longitud + "&mode=d", '_system');
																
								ref.addEventListener('loadstop', LoadStop);
								ref.addEventListener('exit', Close);
								ref.addEventListener('resume', Close);
							} catch (err) {
								//alert(err);
							}							
						}
						else if(tipo == "whatsapp")
						{
							try {
								var mensaje = "Hello, Whatsapp!!";
								$scope.mensaje_whats = encodeURIComponent(mensaje);
								
								ref = window.open("whatsapp://send?text=" + $scope.mensaje_whats, '_system');
								
								
								ref.addEventListener('loadstop', LoadStop);
								ref.addEventListener('exit', Close);
								ref.addEventListener('resume', Close);
							} catch (err) {
								//alert(err);
							}							
						}
						else
						{
							if (window.localStorage.getItem(tipo) != ""
									&& window.localStorage.getItem(tipo) != "undefined"
									&& window.localStorage.getItem(tipo) != null) {
								try {
	
									ref = window.open(encodeURI(window.localStorage
											.getItem(tipo)), '_blank',
											'location=yes'); // encode is needed

									ref.addEventListener('loadstop', LoadStop);
									ref.addEventListener('exit', Close);
									ref.addEventListener('resume', Close);
								} catch (err) {
									//alert(err);
								}
							}
						}
					};
					
					$scope.is_rrss = function(tipo) {
						
						if(tipo == "tel")
						{														
							$scope.tel = "873991896";							
							
							return true;
						}
						else
							return false;
					};


					$scope.tituloApp = "StarShot Mushrooms";
					
					$ionicPlatform.ready(function() {

					});

					$scope.openPopover = function($event, templateName) {
						// Init popover on load
						$ionicPopover.fromTemplateUrl(
								'templates/' + templateName, {
									scope : $scope,
								}).then(function(popover) {
							$scope.popover = popover;
							$scope.popover.show($event);
						});
					};


					$scope.closePopover = function() {
						$scope.popover.hide();
					};

					
					$scope.ir_inicio = function() {
						$state.go('principal.inicio');
					};

				})
		
		.controller(
				'MenuCtrl',
				function($rootScope, $scope, $ionicSideMenuDelegate,
						$ionicPlatform, $ionicLoading, $ionicHistory,
						$state) {

					$scope.ver_seccion = function($index) {

						$ionicHistory.nextViewOptions({
							disableBack : true
						});
						
						$state.go($index);
					};

					$scope.toggleLeft = function() {
						$ionicSideMenuDelegate.toggleLeft();
					};
					$scope.salir = function() {
						$scope.toggleLeft();
						$ionicHistory.nextViewOptions({
							disableBack : true
						});
						$state.go('principal.inicio');
					};
				})
		.controller(
				'principalCtrl',
				function($rootScope, $scope, $state, $ionicHistory,
						$ionicPlatform, Auth) {

					$scope.ver_seccion = function($index) {
						
						$ionicHistory.nextViewOptions({
							disableBack : true
						});
						
						$state.go($index);
					};
					
					document.addEventListener("deviceready", function() {
						if (navigator.splashscreen) {
							navigator.splashscreen.hide();
						}
					}, false);
				})
		.controller('UtilidadesCtrl',
				function($scope, $state, $ionicHistory, Auth) {
					$scope.ver_utilidad = function(tipo) {
						$ionicHistory.nextViewOptions({
							disableBack : true
						});
						if (Auth.isLoggedIn())
							$state.go(tipo);
						else
							$state.go("principal.login");
					}
					
					$scope.myGoBack = function() {
						$ionicHistory.nextViewOptions({
							disableBack : true
						});
						$state.go('principal.inicio');
					};
					
				})
		.controller(
				'RedesCtrl',
				function($scope, $state, $ionicHistory, Auth) {
					$scope.telefono = "";
					$scope.mail = "";
					$scope.date = new Date();
					
					$scope.myGoBack = function() {
						$ionicHistory.nextViewOptions({
							disableBack : true
						});
						$state.go('principal.inicio');
					};
					
					$scope.ver_utilidad_libre = function(tipo) {
						$ionicHistory.nextViewOptions({
							disableBack : true
						});
						$state.go(tipo);
					}
					
					$scope
							.$on(
									"$ionicView.enter",
									function(scopes, states) {
										
										initialize();
										
										$scope.telefono = "(+34)873991896";
										$scope.mail = "hello@starshotsoftware.com";
									});

					$scope.abrir_enlace = function(url) {

						try {

							ref = window.open(encodeURI(url), '_blank',
									'location=yes'); // encode is needed if

							ref.addEventListener('loadstop', LoadStop);
							ref.addEventListener('exit', Close);
							ref.addEventListener('resume', Close);
						} catch (err) {
							//alert(err);
						}

					}
					
					function initialize() {
						
						$("#map").html('');
						$scope.mapa_lanzado = 0;
						var latitud = "";
						var longitud = "";

						if (latitud == "" || latitud == "undefined") {
							latitud = 41.6172399;
							longitud = 0.6293067;
						}
						var myLatlng = new google.maps.LatLng(latitud, longitud);

						var mapOptions = {
							center : myLatlng,
							zoom : 15,
							mapTypeId : google.maps.MapTypeId.ROADMAP
						};
						var map = new google.maps.Map(document
								.getElementById("map"), mapOptions);

						var marker = new google.maps.Marker({
							position : myLatlng,
							map : map,
							icon: 'img/iconos/mushroom-icon.png',
							title : 'StarShot'
						});

						$scope.mapa_lanzado = 1;
						
					}															
				});

