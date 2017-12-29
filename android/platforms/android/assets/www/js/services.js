angular
		.module('starter.services', [])
		.factory(
				'Auth',
				function($rootScope, $ionicLoading, $timeout, $http, $state,
						Ofertas, Chat, Mensajes, ControlPeso, ControlTension, ControlGlucosa, 
						ControlColesterol, Citas, $ionicHistory, Medicamentos, Recetas, Servicios) {

					var controlauth = {};
					controlauth.logout = function() {
						window.localStorage['logueado'] = 0;

						$rootScope.$broadcast('app.out');
						Chat.removeall();
						ControlPeso.removeall();
						ControlTension.removeall();
						ControlGlucosa.removeall();
						ControlColesterol.removeall();
						$ionicLoading
								.show({
									template : "<i class='ion-happy-outline'></i> Hasta luego"
								});
						$timeout(function() {
							$ionicLoading.hide();
						}, 1500);
					};
					controlauth.checkLogin = function() {

						if (controlauth.isLoggedIn()) {
							$rootScope.$broadcast('app.loggedIn');
						} else {
							$rootScope.$broadcast('app.loggedOut');
						}
					};
					controlauth.isLoggedIn = function() {
						var logueado = window.localStorage['logueado'];
						if (logueado == 1)
							return true;
						else
							return false;

					};
					controlauth.recordar_pass = function(user, idempresa) {
						
						$ionicLoading
							.show({
							template : "  <i class='ion-information-circled'></i>Enviando un correo recordatorio de su contraseña"
						});

						var datos = 'op=recordar_pass&idempresa='
								+ idempresa + "&email=" + user;
						$http(
								{
									method : 'POST',
									url : base_url_serv + '/modulos/usuarios/app/loginservice.php',
									data : datos,
									timeout : 8000,
									headers : {
										'Content-Type' : 'application/x-www-form-urlencoded'
									}
								})
								.success(
										function(data, status, headers, config) {

											if (data.resultado == 1) {
												$('#contra_login').val('');
												$ionicLoading
														.show({
															template : "  <i class='ion-checkmark-round'></i>Se le ha enviado un nuevo password a su cuenta de correo."
														});
																					
												$timeout(
														function() {
															$ionicLoading
																	.hide();

														}, 2500);
											} else {
												$ionicLoading
														.show({
															template : "  <i class='ion-alert-circled'></i> E-mail no registrado"
														});
												$timeout(function() {
													$ionicLoading.hide();
												}, 2500);
											}

										})
								.error(
										function(data, status, headers, config) {
											$ionicLoading
													.show({
														template : "<i class='ion-wifi'></i> Problemas de Red...<br> Íntentelo de nuevo más tarde" 
													});
											$timeout(function() {
												$ionicLoading.hide();
											}, 2500);
										});

						// $rootScope.$broadcast('app.loggedIn');
					};
					controlauth.login = function(user, pass, idempresa) {
						$ionicLoading
								.show({
									template : "  <ion-spinner></ion-spinner><br />Comprobando..."
								});
						var datos = 'op=cargar_perfil_login&idempresa='
								+ idempresa + "&email=" + user + "&contra="
								+ pass;
						$http(
								{
									method : 'POST',
									url : base_url_serv + '/modulos/usuarios/app/loginservice.php',
									data : datos,
									timeout : 8000,
									headers : {
										'Content-Type' : 'application/x-www-form-urlencoded'
									}
								})
								.success(
										function(data, status, headers, config) {

											if (data.resultado == 1) {
												$('#contra_login').val('');
												$ionicLoading
														.show({
															template : "  <i class='ion-checkmark-round'></i> Correcto"
														});

												// Guardamos todos los datos
												window.localStorage.setItem(
														"idusuario",
														data.idusuario);
												window.localStorage.setItem(
														"email", user);
												window.localStorage.setItem(
														"nombre", data.nombre);
												window.localStorage.setItem(
														"telefono", data.telefono);
												window.localStorage.setItem(
														"fecha_nac", data.fecha_nac);
												window.localStorage.setItem(
														"sexo", data.sexo);
												window.localStorage.setItem(
														"contra", pass);
												window.localStorage.setItem(
														"nuevos_mensajes",
														data.nuevos_mensajes);
												window.localStorage.setItem(
														"nuevos_avisos_usu",
														data.nuevos_avisos_usu);
												window.localStorage
														.setItem(
																"avisos",
																angular
																		.toJson(data.avisos));
												window.localStorage
														.setItem("carpeta",
																data.carpeta);
												window.localStorage['logueado'] = 1;
												window.localStorage
														.setItem("latitud",
																data.latitud);
												window.localStorage.setItem(
														"longitud",
														data.longitud);
												window.localStorage.setItem(
														"tel", data.tel);
												window.localStorage.setItem(
														"mail", data.mail);
												window.localStorage
														.setItem(
																"youtube",
																decodeURIComponent(data.youtube));
												window.localStorage
														.setItem(
																"twitter",
																decodeURIComponent(data.twitter));
												window.localStorage
														.setItem(
																"facebook",
																decodeURIComponent(data.facebook));
												window.localStorage
														.setItem(
																"instagram",
																decodeURIComponent(data.instagram));
												var deviceToken = window.localStorage['token'];
												if (deviceToken != ""
														&& deviceToken != "undefined"
														&& deviceToken != null) {
													var datos = 'op=registrar_token_android&idempresa='
															+ idempresa
															+ '&idusuario='
															+ data.idusuario
															+ '&token='
															+ deviceToken;
													$http
															.post(
																	base_url_serv
																			+ '/modulos/notificaciones/app/op_notificaciones.php',
																	datos);
												}
												Mensajes.removeall();
												for ( var i in data.mensajes) {
													for ( var item in data.mensajes[i])
														data.mensajes[i][item] = decodeURIComponent(data.mensajes[i][item]);
													Mensajes
															.add(data.mensajes[i]);
												}
												Citas.removeall();
												for ( var i in data.citas) {
													data.citas[i]['aviso'] = decodeURIComponent(data.citas[i]['aviso']);
													Citas.add(data.citas[i]);
												}
												ControlTension.removeall();
												for ( var i in data.tension)
													ControlTension
															.add(data.tension[i]);
												ControlGlucosa.removeall();
												for ( var i in data.glucosa)
												{
													ControlGlucosa.add(data.glucosa[i]);
												}
												ControlColesterol.removeall();
												for ( var i in data.colesterol)
												{
													ControlColesterol.add(data.colesterol[i]);
												}
												
												Servicios.removeall();
												for(var i in data.servicios)
												{
													data.servicios[i]['nombre'] = decodeURIComponent(data.servicios[i]['nombre']);
													Servicios.add(data.servicios[i]);
												}
												
												ControlPeso.removeall();
												for ( var i in data.pesos)
													ControlPeso
															.add(data.pesos[i]);
												Chat.removeall();
												for ( var i in data.chat) {
													for ( var item in data.chat[i])
														data.chat[i][item] = decodeURIComponent(data.chat[i][item]);
													Chat.add(data.chat[i]);
												}
												Ofertas.removeall();
												for ( var i in data.Ofertas)
													for ( var j in data.Ofertas[i]) {

														if (data.Ofertas[i][j] == "noticia"
																&& j == "tipo"
																&& data.Ofertas[i]['boton'] == "Consejos") {
															
															data.Ofertas[i]['titulo'] = decodeURIComponent(data.Ofertas[i]['titulo']);
															data.Ofertas[i]['texto'] = decodeURIComponent(data.Ofertas[i]['texto']);
															data.Ofertas[i]['desc_corta'] = decodeURIComponent(data.Ofertas[i]['desc_corta']);
															
															Ofertas
																	.addConsejo(data.Ofertas[i]);
														}

														if (data.Ofertas[i][j] == "noticia"
																&& j == "tipo"
																&& data.Ofertas[i]['boton'] == "Ofertas") {
															
															data.Ofertas[i]['titulo'] = decodeURIComponent(data.Ofertas[i]['titulo']);
															data.Ofertas[i]['texto'] = decodeURIComponent(data.Ofertas[i]['texto']);
															data.Ofertas[i]['desc_corta'] = decodeURIComponent(data.Ofertas[i]['desc_corta']);
						
															Ofertas
																	.add(data.Ofertas[i]);
														}
													}
												// Antes tendriamos que recorrer
												// y eliminar las fotos locales
												Recetas.limpiarMedicamentos();
												for ( var i in data.recetas) {
													data.recetas[i]['observaciones'] = decodeURIComponent(data.recetas[i]['observaciones']);
													data.recetas[i]['aviso'] = decodeURIComponent(data.recetas[i]['aviso']);
													Recetas.add(data.recetas[i]);
												}

												// Antes tendriamos que recorrer
												// y eliminar las fotos locales
												Medicamentos
														.limpiarMedicamentos();
												for ( var i in data.alertas) {
													data.alertas[i]['nombre'] = decodeURIComponent(data.alertas[i]['nombre']);
													Medicamentos
															.add(data.alertas[i]);
												}
												$rootScope
														.$broadcast('app.loggedIn');
												$rootScope
														.$emit(
																'datosactualizados',
																{});
												$rootScope.$emit(
														'avisosactualizados',
														{});
												$timeout(
														function() {
															$ionicLoading
																	.hide();
															$ionicHistory
																	.nextViewOptions({
																		disableBack : true
																	});
															$state
																	.go('principal.inicio');

														}, 500);
											} else {
												$ionicLoading
														.show({
															template : "  <i class='ion-alert-circled'></i> Email o contraseña incorrectos"
														});
												$timeout(function() {
													$ionicLoading.hide();
												}, 2500);
											}

										})
								.error(
										function(data, status, headers, config) {
											$ionicLoading
													.show({
														template : "<i class='ion-wifi'></i> Problemas de Red...<br> Íntentelo de nuevo más tarde"
													});
											$timeout(function() {
												$ionicLoading.hide();
											}, 2500);
										});

						// $rootScope.$broadcast('app.loggedIn');
					};
					controlauth.registro = function(user, pass, idempresa,
							nombre) {

						$ionicLoading
								.show({
									template : "  <ion-spinner></ion-spinner><br />Registrando..."
								});
						
						var token = window.localStorage['token'];
						//alert(token);
						var datos = 'op=registrar&idempresa=' + idempresa
								+ "&email=" + user + "&contra=" + pass
								+ "&nombre=" + nombre + (token !== undefined && token != '' ? "&token=" + token : "");
						$http(
								{
									method : 'POST',
									url : base_url_serv + '/modulos/usuarios/app/loginservice.php',
									data : datos,
									timeout : 8000,
									headers : {
										'Content-Type' : 'application/x-www-form-urlencoded'
									}
								})
								.success(
										function(data, status, headers, config) {

											if (data.resultado == 1) {
												$('#email_registro').val('');
												$('#contra1').val('');
												$('#contra2').val('');

												$ionicLoading
														.show({
															template : "  <i class='ion-star'></i> Bienvenid@"
														});
												$timeout(
														function() {
															$ionicLoading
																	.hide();
															$ionicLoading
																	.hide();
															$ionicHistory
																	.nextViewOptions({
																		disableBack : true
																	});
															$state
																	.go('principal.inicio');

														}, 1500);
												// Guardamos todos los datos
												window.localStorage.setItem(
														"idusuario",
														data.idusuario);
												window.localStorage.setItem(
														"email", user);
												window.localStorage.setItem(
														"nombre", nombre);
												window.localStorage.setItem(
														"telefono", "");
												window.localStorage.setItem(
														"sexo", "");
												window.localStorage.setItem(
														"fecha_nac", "");
												window.localStorage.setItem(
														"contra", pass);
												window.localStorage
														.setItem("carpeta",
																data.carpeta);
												window.localStorage['logueado'] = 1;
												var deviceToken = window.localStorage['token'];
												if (deviceToken != ""
														&& deviceToken != "undefined"
														&& deviceToken != null) {
													var datos = 'op=registrar_token_android&idempresa='
															+ idempresa
															+ '&idusuario='
															+ data.idusuario
															+ '&token='
															+ deviceToken;
													$http
															.post(
																	base_url_serv
																			+ '/modulos/notificaciones/app/op_notificaciones.php',
																	datos);
												}
												
												Servicios.removeall();
												for(var i in data.servicios)
												{
													data.servicios[i]['nombre'] = decodeURIComponent(data.servicios[i]['nombre']);
													Servicios.add(data.servicios[i]);
												}
												

												/*Chat.removeall();
												for ( var i in data.chat) {
													for ( var item in data.chat[i])
														data.chat[i][item] = decodeURIComponent(data.chat[i][item]);
													Chat.add(data.chat[i]);
												}*/
												/*Ofertas.removeall();
												for ( var i in data.Ofertas)
													for ( var j in data.Ofertas[i]) {

														if (data.Ofertas[i][j] == "noticia"
																&& j == "tipo"
																&& data.Ofertas[i]['boton'] == "Consejos") {
															
															data.Ofertas[i]['titulo'] = decodeURIComponent(data.Ofertas[i]['titulo']);
															data.Ofertas[i]['texto'] = decodeURIComponent(data.Ofertas[i]['texto']);
															data.Ofertas[i]['desc_corta'] = decodeURIComponent(data.Ofertas[i]['desc_corta']);
															
															Ofertas
																	.addConsejo(data.Ofertas[i]);
														}

														if (data.Ofertas[i][j] == "noticia"
																&& j == "tipo"
																&& data.Ofertas[i]['boton'] == "Ofertas") {
															
															data.Ofertas[i]['titulo'] = decodeURIComponent(data.Ofertas[i]['titulo']);
															data.Ofertas[i]['texto'] = decodeURIComponent(data.Ofertas[i]['texto']);
															data.Ofertas[i]['desc_corta'] = decodeURIComponent(data.Ofertas[i]['desc_corta']);
						
															Ofertas
																	.add(data.Ofertas[i]);
														}
													}*/
												// Antes tendriamos que recorrer
												// y eliminar las fotos locales
												/*Recetas.limpiarMedicamentos();
												for ( var i in data.recetas) {
													data.recetas[i]['observaciones'] = decodeURIComponent(data.recetas[i]['observaciones']);
													Recetas
															.add(data.recetas[i]);
												}*/
												
												// Antes tendriamos que recorrer
												// y eliminar las fotos locales
												/*Medicamentos
														.limpiarMedicamentos();
												for ( var i in data.alertas) {
													data.alertas[i]['nombre'] = decodeURIComponent(data.alertas[i]['nombre']);
													Medicamentos
															.add(data.alertas[i]);
												}*/
												$rootScope
														.$broadcast('app.loggedIn');
												$rootScope
														.$emit(
																'datosactualizados',
																{});
											} else {
												$ionicLoading
														.show({
															template : "  <i class='ion-alert-circled'></i> "
																	+ data.motivo
														});
												$timeout(function() {
													$ionicLoading.hide();
												}, 2500);
											}

										})
								.error(
										function(data, status, headers, config) {
											$ionicLoading
													.show({
														template : "<i class='ion-wifi'></i> Problemas de Red...<br> Íntentelo de nuevo más tarde"
													});
											$timeout(function() {
												$ionicLoading.hide();
											}, 2500);
										});

						// $rootScope.$broadcast('app.loggedIn');
					}; // Registro

					return controlauth;
				})
		.factory(
				'Chat',
				function() {
					// Might use a resource here that returns a JSON array

					// Some fake testing data
					var CHAT_STORAGE_KEY = 'chats';
					var chats = [];

					return {
						all : function() {
							var c = window.localStorage
									.getItem(CHAT_STORAGE_KEY);
							if (c) {
								chats = JSON.parse(c);
							} else {
								chats = [];
							}
							return chats;
						},
						remove : function(chat) {
							chats.splice(chats.indexOf(chat), 1);
							window.localStorage.setItem(CHAT_STORAGE_KEY,
									angular.toJson(chats));
						},
						set : function(listadochat) {
							chats = listadochat;
							window.localStorage.setItem(CHAT_STORAGE_KEY,
									angular.toJson(chats));
						},
						removeall : function() {
							chats = [];
							window.localStorage.setItem(CHAT_STORAGE_KEY,
									angular.toJson(chats));
						},
						add : function(chat) {
							chats.push(chat);
							window.localStorage.setItem(CHAT_STORAGE_KEY,
									angular.toJson(chats));

						}

					};
				})
		.factory(
				'Mensajes',
				function() {
					// Might use a resource here that returns a JSON array

					// Some fake testing data
					var MENSAJES_STORAGE_KEY = 'mensajes';
					var mensajes = [];

					return {
						all : function() {
							var c = window.localStorage
									.getItem(MENSAJES_STORAGE_KEY);
							if (c) {
								mensajes = JSON.parse(c);
							} else {
								mensajes = [];
							}
							return mensajes;
						},
						remove : function(mensaje) {
							mensajes.splice(mensajes.indexOf(mensaje), 1);
							window.localStorage.setItem(MENSAJES_STORAGE_KEY,
									angular.toJson(mensajes));
						},
						get : function(id) {
							if (mensajes.length > 0)
								for (var i = 0; i < mensajes.length; i++) {
									if (mensajes[i].idmensaje == id) {
										return mensajes[i];
									}
								}
						},
						marcar_leido : function(id) {
							if (mensajes.length > 0)
								for (var i = 0; i < mensajes.length; i++) {
									if (mensajes[i].idmensaje == id) {
										mensajes[i].leido = 1;
										window.localStorage.setItem(
												MENSAJES_STORAGE_KEY, angular
														.toJson(mensajes));
										return 1;
									}
								}
						},
						marcar_respuesta : function(id, respuesta) {
							if (mensajes.length > 0)
								for (var i = 0; i < mensajes.length; i++) {
									if (mensajes[i].idmensaje == id) {
										mensajes[i].estado = respuesta;
										window.localStorage.setItem(
												MENSAJES_STORAGE_KEY, angular
														.toJson(mensajes));
										return 1;
									}
								}
						},
						set : function(listadomensaje) {
							mensajes = listadomensaje;
							window.localStorage.setItem(MENSAJES_STORAGE_KEY,
									angular.toJson(mensajes));
						},
						removeall : function() {
							mensajes = [];
							window.localStorage.setItem(MENSAJES_STORAGE_KEY,
									angular.toJson(mensajes));
						},
						add : function(mensaje) {
							mensajes.push(mensaje);
							window.localStorage.setItem(MENSAJES_STORAGE_KEY,
									angular.toJson(mensajes));

						}

					};
				})
		.factory(
				'Citas',
				function() {
					// Might use a resource here that returns a JSON array
					var controlcitas = {};
					// Some fake testing data

					var CITAS_STORAGE_KEY = 'citas';

					controlcitas.citas = [];
					var c = window.localStorage.getItem(CITAS_STORAGE_KEY);
					if (c) {
						controlcitas.citas = JSON.parse(c);
					} else { // contenido por defecto
						controlcitas.citas = [];
					}

					controlcitas.remove = function(cita) {
						controlcitas.citas.splice(controlcitas.citas
								.indexOf(cita), 1);
						window.localStorage.setItem(CITAS_STORAGE_KEY, angular
								.toJson(controlcitas.citas));
					};
					controlcitas.removeall = function() {
						controlcitas.citas = [];
						window.localStorage.setItem(CITAS_STORAGE_KEY, angular
								.toJson(controlcitas.citas));
					}, controlcitas.add = function(cita) {
						controlcitas.citas.push(cita);
						window.localStorage.setItem(CITAS_STORAGE_KEY, angular
								.toJson(controlcitas.citas));
					};

					return controlcitas;

				})
		.factory('Ofertas', function() {
			// Might use a resource here that returns a JSON array

			// Some fake testing data
			var ofertas = [];
			var consejos = [];
			var utilidades = [];
			return {
				all : function() {
					return ofertas;
				},
				allConsejos : function() {
					return consejos;
				},
				get : function(id) {
					if (ofertas.length > 0)
						for (var i = 0; i < ofertas.length; i++) {
							if (ofertas[i].idnoticia == id) {
								return ofertas[i];
							}
						}
				},
				getConsejo : function(id) {
					if (consejos.length > 0)
						for (var i = 0; i < consejos.length; i++) {
							if (consejos[i].idnoticia == id) {
								return consejos[i];
							}
						}
				},
				allutilidades : function() {
					return utilidades;
				},
				getutilidad : function(id) {
					if (utilidades.length > 0)
						for (var i = 0; i < utilidades.length; i++) {
							if (utilidades[i].idnoticia == id) {
								return utilidades[i];
							}
						}
				},
				remove : function(cita) {
					ofertas.splice(ofertas.indexOf(cita), 1);
				},
				removeall : function(cita) {
					ofertas = [];
					consejos = [];
				},
				add : function(oferta) {					
					ofertas.push(oferta);
				},
				addConsejo : function(oferta) {
					consejos.push(oferta);
				},
				addutilidad : function(utilidad) {
					utilidades.push(utilidad);
				},
				set : function(las_ofertas) {
					ofertas = las_ofertas;
				}

			};
		})
		.factory(
				'ControlPeso',
				function() {
					// Might use a resource here that returns a JSON array
					var controlpeso = {};
					controlpeso.posibles_alturas = [];
					for (var i = 1; i < 220; i++)
						controlpeso.posibles_alturas.push(i);
					controlpeso.posibles_pesos = [];
					for (var i = 1; i < 201; i++)
						controlpeso.posibles_pesos.push(i);
					// Some fake testing data
					var PESO_STORAGE_KEY = 'pesos';

					controlpeso.pesos = [];
					var c = window.localStorage.getItem(PESO_STORAGE_KEY);
					if (c) {
						controlpeso.pesos = JSON.parse(c);
					} else {
						controlpeso.pesos = [];
					}
					controlpeso.all = function() {
						var c = window.localStorage.getItem(PESO_STORAGE_KEY);
						if (c) {
							controlpeso.pesos = JSON.parse(c);
						} else {
							controlpeso.pesos = [];
						}
						return controlpeso.pesos;
					};

					controlpeso.getalturas = function() {
						return controlpeso.posibles_alturas;
					};
					controlpeso.getpesos = function() {
						return posibles_pesos;
					};
					controlpeso.get = function(id) {
						if (controlpeso.pesos.length > 0)
							for (var i = 0; i < controlpeso.pesos.length; i++) {
								if (controlpeso.pesos[i].idnoticia == id) {
									return controlpeso.pesos[i];
								}
							}
					};
					controlpeso.remove = function(peso) {
						controlpeso.pesos.splice(controlpeso.pesos
								.indexOf(peso), 1);
						window.localStorage.setItem(PESO_STORAGE_KEY, angular
								.toJson(controlpeso.pesos));
					};
					controlpeso.removeall = function() {
						controlpeso.pesos = [];
						window.localStorage.setItem(PESO_STORAGE_KEY, angular
								.toJson(controlpeso.pesos));
					};
					controlpeso.set = function(pesos) {
						controlpeso.pesos = pesos;
						window.localStorage.setItem(PESO_STORAGE_KEY, angular
								.toJson(controlpeso.pesos));
					};
					controlpeso.add = function(peso) {
						controlpeso.pesos.push(peso);
						window.localStorage.setItem(PESO_STORAGE_KEY, angular
								.toJson(controlpeso.pesos));

					};
					return controlpeso;
				})
				.factory('Servicios', function() {
					// Might use a resource here that returns a JSON array
					var controlservicio = {};
					// Some fake testing data
					var SERVICIO_STORAGE_KEY = 'servicios';

					controlservicio.servicios = [];
					
					var serviciosGuardados = window.localStorage.getItem(SERVICIO_STORAGE_KEY);
					if (serviciosGuardados) {
						controlservicio.servicios = JSON.parse(serviciosGuardados);
					} else {
						controlservicio.servicios = [];
					}
					
					controlservicio.all = function() {
						var serviciosGuardados = window.localStorage.getItem(SERVICIO_STORAGE_KEY);
						if (serviciosGuardados) {
							controlservicio.servicios = JSON.parse(serviciosGuardados);
						} else {
							controlservicio.servicios = [];
						}
						return controlservicio.servicios;
					};

					controlservicio.get = function(id) {
						if (controlservicio.servicios.length > 0)
							for (var i = 0; i < controlservicio.servicios.length; i++) {
								if (controlservicio.servicios[i].idservicio == id) {
									return controlservicio.servicios[i];
								}
							}
					};
					
					controlservicio.removeall = function() {
						controlservicio.servicios = [];
						window.localStorage.setItem(SERVICIO_STORAGE_KEY, angular
								.toJson(controlservicio.servicios));
					};
					
					controlservicio.set = function(servicios) {
						controlservicio.servicios = servicios;
						window.localStorage.setItem(SERVICIO_STORAGE_KEY, angular
								.toJson(controlservicio.servicios));
					};
					
					controlservicio.add = function(servicio) {
						controlservicio.servicios.push(servicio);
						window.localStorage.setItem(SERVICIO_STORAGE_KEY, angular
								.toJson(controlservicio.servicios));

					};
					
					return controlservicio;
				})
		.factory(
				'ControlTension',
				function() {
					// Might use a resource here that returns a JSON array
					var controltension = {};
					controltension.maximas_posibles = [];
					for (var i = 50; i < 210; i += 10)
						controltension.maximas_posibles.push(i);
					controltension.minimas_posibles = [];
					for (var i = 20; i < 110; i += 10)
						controltension.minimas_posibles.push(i);
					controltension.pulsos_posibles = [];
					for (var i = 40; i < 205; i += 5)
						controltension.pulsos_posibles.push(i);
					// Some fake testing data
					var TENSION_STORAGE_KEY = 'tension';

					controltension.tensiones = [];
					var t = window.localStorage.getItem(TENSION_STORAGE_KEY);
					if (t) {
						controltension.tensiones = JSON.parse(t);
					} else {
						controltension.tensiones = [];
					}

					controltension.remove = function(tension) {
						controltension.tensiones.splice(
								controltension.tensiones.indexOf(tension), 1);
						window.localStorage.setItem(TENSION_STORAGE_KEY,
								angular.toJson(controltension.tensiones));
					}, controltension.removeall = function() {
						controltension.tensiones = [];
						window.localStorage.setItem(TENSION_STORAGE_KEY,
								angular.toJson(controltension.tensiones));
					}, controltension.add = function(tension) {
						controltension.tensiones.push(tension);
						window.localStorage.setItem(TENSION_STORAGE_KEY,
								angular.toJson(controltension.tensiones));
					}
					return controltension;
				})
				.factory(
					'ControlGlucosa',
					function() {
						// Might use a resource here that returns a JSON array
						var controlglucosa = {};
						// Some fake testing data
						var GLUCOSA_STORAGE_KEY = 'glucosa';
	
						controlglucosa.glucosas = [];
						var t = window.localStorage.getItem(GLUCOSA_STORAGE_KEY);
						if (t) {
							controlglucosa.glucosas = JSON.parse(t);
						} else {
							controlglucosa.glucosas = [];
						}
	
						controlglucosa.remove = function(tension) {
							controlglucosa.glucosas.splice(
									controlglucosa.glucosas.indexOf(tension), 1);
							window.localStorage.setItem(GLUCOSA_STORAGE_KEY,
									angular.toJson(controlglucosa.glucosas));
						}, controlglucosa.removeall = function() {
							controlglucosa.glucosas = [];
							window.localStorage.setItem(GLUCOSA_STORAGE_KEY,
									angular.toJson(controlglucosa.glucosas));
						}, controlglucosa.add = function(glucosa) {
							controlglucosa.glucosas.push(glucosa);
							window.localStorage.setItem(GLUCOSA_STORAGE_KEY,
									angular.toJson(controlglucosa.glucosas));
						}
						return controlglucosa;
					})
				.factory(
					'ControlColesterol',
					function() {
						// Might use a resource here that returns a JSON array
						var controlcolesterol = {};
						// Some fake testing data
						var COLESTEROL_STORAGE_KEY = 'colesterol';
	
						controlcolesterol.colesterol = [];
						var t = window.localStorage.getItem(COLESTEROL_STORAGE_KEY);
						if (t) {
							controlcolesterol.colesterol = JSON.parse(t);
						} else {
							controlcolesterol.colesterol = [];
						}
	
						controlcolesterol.remove = function(tension) {
							controlcolesterol.colesterol.splice(
									controlcolesterol.colesterol.indexOf(tension), 1);
							window.localStorage.setItem(COLESTEROL_STORAGE_KEY,
									angular.toJson(controlcolesterol.colesterol));
						}, controlcolesterol.removeall = function() {
							controlcolesterol.colesterol = [];
							window.localStorage.setItem(COLESTEROL_STORAGE_KEY,
									angular.toJson(controlcolesterol.colesterol));
						}, controlcolesterol.add = function(colesterol) {
							controlcolesterol.colesterol.push(colesterol);
							window.localStorage.setItem(COLESTEROL_STORAGE_KEY,
									angular.toJson(controlcolesterol.colesterol));
						}
						return controlcolesterol;
					})
		.factory(
				'Medicamentos',
				function($http, $cordovaFile, $timeout, $ionicLoading) {
					var images;
					var IMAGE_STORAGE_KEY = 'images';
					var MED_STORAGE_KEY = 'medicamentos';
					var listamedicamentos = {};
					var med = window.localStorage.getItem(MED_STORAGE_KEY);
					if (med) {
						listamedicamentos.medicamentos = JSON.parse(med);
					} else {
						listamedicamentos.medicamentos = [];
					}

					function fecha_format_date_(date) {
						var day = date.getDate();
						var monthIndex = date.getMonth();
						var year = date.getFullYear();
						return day + "-" + monthIndex + "-" + year;
					}
					
					function getMedicamentos() {
						var med = window.localStorage.getItem(MED_STORAGE_KEY);
						if (med) {
							listamedicamentos.medicamentos = JSON.parse(med);
						} else {
							listamedicamentos.medicamentos = [];
						}
						return listamedicamentos.medicamentos;
					}
					;
					listamedicamentos.limpiarMedicamentos = function() {
						listamedicamentos.medicamentos = [];
						window.localStorage.setItem(MED_STORAGE_KEY, angular
								.toJson([]));
					};
					listamedicamentos.add = function(medicamento) {
						listamedicamentos.medicamentos.push(medicamento);
						window.localStorage.setItem(MED_STORAGE_KEY, angular
								.toJson(listamedicamentos.medicamentos));
					};
					// limpiarMedicamentos();
					listamedicamentos.addMedicamento = function(scope) {
						var medicamento = scope.medicamento_tmp;
						var med_tmp = {
							idalerta : 0,
							fecha_ini : medicamento.f_ini,
							fecha_fin : medicamento.f_fin,
							nombre : medicamento.nombre,
							frecuencia : medicamento.dias_medicamento,
							horas : medicamento.horas_medicamento,
							imagen : medicamento.imagen_tmp
						};

						var idusuario = window.localStorage
								.getItem("idusuario");
						var idempresa = $('#idempresa').val();
						var datos = 'op=preparar_alerta&idempresa=' + idempresa
								+ '&idusuario=' + idusuario + '&horas='
								+ med_tmp.horas + '&frecuencia='
								+ med_tmp.frecuencia;
						datos += '&fecha_ini=' + med_tmp.fecha_ini
								+ '&fecha_fin=' + med_tmp.fecha_fin
								+ '&nombre=' + med_tmp.nombre;
						// alert("voy a mandar "+datos+" a la url
						// "+base_url_serv);
						$ionicLoading
								.show({
									template : "  <ion-spinner></ion-spinner><br />Guardando medicamento..."
								});
						$http(
								{
									method : 'POST',
									url : base_url_serv + '/modulos/alertas/app/alertas.php',
									data : datos,
									timeout : 8000,
									headers : {
										'Content-Type' : 'application/x-www-form-urlencoded'
									}
								})
								.success(
										function(data, status, headers, config) {
											$ionicLoading
													.show({
														template : "  <i class='ion-checkmark-circled'></i> Guardado"
													});
											$timeout(function() {
												$ionicLoading.hide();
											}, 500);
											if (data.resultado == 1) {

												med_tmp.idalerta = data.idalerta;
												// alert("Lo he guardado en el
												// servidor");
												// Si tiene una imagen distinta
												// a
												// img/utilidades/addmedicamento.jpg
												// hay que copiarla en el
												// directorio
												
												med_tmp.fecha_ini = fecha_format_date_(new Date(medicamento.f_ini));
												med_tmp.fecha_fin = fecha_format_date_(new Date(medicamento.f_fin));
												
												listamedicamentos.medicamentos
														.push(med_tmp);
												window.localStorage
														.setItem(
																MED_STORAGE_KEY,
																angular
																		.toJson(listamedicamentos.medicamentos));

												scope.refrescar_formu();

											} else {
												alert("Ha dado " + data.mensaje);
											}

										})
								.error(
										function(data, status, headers, config) {
											$ionicLoading
													.show({
														template : "<i class='ion-wifi'></i> Problemas de Red...<br> Íntentelo de nuevo más tarde"
													});
											$timeout(function() {
												$ionicLoading.hide();
											}, 2500);
										});

					};
					listamedicamentos.guardarImagenMedicamento = function(
							med_tmp) {
						// alert("Aqui vamos a cambiar por "+nombre_imagen);

						$cordovaFile
								.checkFile(cordova.file.dataDirectory,
										"medicamento_tmp.jpg")
								.then(
										function(success) {
											// success

											$cordovaFile
													.copyFile(
															cordova.file.dataDirectory,
															"medicamento_tmp.jpg",
															cordova.file.dataDirectory,
															med_tmp.imagen)
													.then(
															function(info) {
																listamedicamentos.medicamentos
																		.push(med_tmp);
																window.localStorage
																		.setItem(
																				MED_STORAGE_KEY,
																				angular
																						.toJson(listamedicamentos.medicamentos));

															}, function(e) {
															});
										}, function(error) {
										});

					}
					listamedicamentos.borrarImagenMedicamento = function(imagen) {
						$cordovaFile.checkFile(cordova.file.dataDirectory,
								imagen).then(
								function(success) {

									$cordovaFile.removeFile(
											cordova.file.dataDirectory, imagen)
											.then(function(success) { // success
											}, function(error) {
												// error
											});
								}, function(error) {
									// No existe
								});

					}
					listamedicamentos.deleteMedicamentobyIndex = function(index) {
						// Hay que borrar la imagen si la tiene guardada!!!!
						listamedicamentos.medicamentos.splice(index, 1);
						window.localStorage.setItem(MED_STORAGE_KEY, angular
								.toJson(listamedicamentos.medicamentos));
					}
					listamedicamentos.deleteMedicamento = function(medicamento) {
						// Hay que borrar la imagen si la tiene guardada!!!!

						var idusuario = window.localStorage
								.getItem("idusuario");
						var idempresa = $('#idempresa').val();
						var datos = 'op=eliminar_alerta&idempresa=' + idempresa
								+ '&idusuario=' + idusuario + '&idalerta='
								+ medicamento.idalerta;
						// alert("voy a mandar "+datos+" a la url
						// "+base_url_serv);
						$ionicLoading
								.show({
									template : "  <ion-spinner></ion-spinner><br />Eliminando medicamento..."
								});
						$http(
								{
									method : 'POST',
									url : base_url_serv + '/modulos/alertas/app/alertas.php',
									data : datos,
									timeout : 8000,
									headers : {
										'Content-Type' : 'application/x-www-form-urlencoded'
									}
								})
								.success(
										function(data, status, headers, config) {
											$ionicLoading
													.show({
														template : "  <i class='ion-checkmark-circled'></i> Eliminado"
													});
											$timeout(function() {
												$ionicLoading.hide();
											}, 500);
											if (data.resultado == 1) {
												
												var urltotal = medicamento.imagen;
								
												var name = urltotal
														.substr(urltotal
																.lastIndexOf('/') + 1);
									
												listamedicamentos.medicamentos
														.splice(
																listamedicamentos.medicamentos
																		.indexOf(medicamento),
																1);
			
												window.localStorage
														.setItem(
																MED_STORAGE_KEY,
																angular
																		.toJson(listamedicamentos.medicamentos));
												listamedicamentos
														.borrarImagenMedicamento(name);		
												
											} else {
												//alert("Ha dado " + data.mensaje);
											}

										})
								.error(
										function(data, status, headers, config) {

											$ionicLoading
													.show({
														template : "<i class='ion-wifi'></i> Problemas de Red...<br> Íntentelo de nuevo más tarde"
													});
											$timeout(function() {
												$ionicLoading.hide();
											}, 2500);
										});

					}

					return listamedicamentos;
				})
		// Medicamentos
		.factory(
				'Recetas',
				function($http, $cordovaFile, $timeout, $ionicLoading,
						$cordovaFileTransfer) {
					var images;
					var IMAGE_STORAGE_KEY = 'images';
					var REC_STORAGE_KEY = 'recetas';
					var listarecetas = {};
					var med = window.localStorage.getItem(REC_STORAGE_KEY);
					if (med) {
						listarecetas.recetas = JSON.parse(med);
					} else {
						listarecetas.recetas = [];
					}

					function getRecetas() {
						var med = window.localStorage.getItem(REC_STORAGE_KEY);
						if (med) {
							listarecetas.recetas = JSON.parse(med);
						} else {
							listarecetas.recetas = [];
						}
						return listarecetas.recetas;
					}
					;
					listarecetas.limpiarMedicamentos = function() {
						listarecetas.recetas = [];
						window.localStorage.setItem(REC_STORAGE_KEY, angular
								.toJson([]));
					};
					listarecetas.add = function(receta) {
						listarecetas.recetas.push(receta);
						window.localStorage.setItem(REC_STORAGE_KEY, angular
								.toJson(listarecetas.recetas));

					};
					// limpiarMedicamentos();
					listarecetas.addReceta = function(scope) {
						var medicamento = scope.receta_tmp;
						
						var med_tmp = {
							idreceta : 0,
							fecha : medicamento.fecha,
							aviso : '',
							observaciones : medicamento.observaciones,
							imagen : medicamento.imagen_tmp
						};

						var idusuario = window.localStorage
								.getItem("idusuario");
						var idempresa = $('#idempresa').val();
						
						$ionicLoading
								.show({
									template : "  <ion-spinner></ion-spinner><br />Enviando Documento...<br/> Por favor, espere"
						});
						
						var params = {};
						params.op = "guardar_receta";
						params.idusuario = idusuario;
						params.idempresa = idempresa;
						params.observaciones = med_tmp.observaciones;
						var pathimg = scope.urlForImage_simple("medicamento_tmp.jpg");
						var options = {
							fileKey : "receta",
							fileName : pathimg.split('/').pop(),
							mimeType : "image/jpg",
							chunkedMode : true,
							params : params
						};
						
						$cordovaFileTransfer
								.upload(base_url + "/modulos/documentos/app/documentos.php", pathimg, options)
								.then(
										function(result) {
											// Success!
											var respuesta = JSON.parse(result.response);
											if (respuesta.resultado == 1) {
												$ionicLoading
														.show({
															template : "<i class='ion-checkmark-circled'></i> Documento Guardado"
														});
												$timeout(function() {
													$ionicLoading.hide();
												}, 500);

												med_tmp.idreceta = respuesta.idDocumento;
												var newName = respuesta.nombreFichero;
												
												med_tmp.imagen = newName;
												listarecetas.guardarImagenReceta(med_tmp);
												scope.refrescar_formu();
											} else {
												$ionicLoading
														.show({
															template : "<i class='ion-wifi'></i> " + respuesta.motivo
														});
												$timeout(function() {
													$ionicLoading.hide();
												}, 2500);
											}

										},
										function(err) {
											// Error
											$ionicLoading
													.show({
														template : "<i class='ion-wifi'></i> Problemas de Red...<br> Íntentelo de nuevo más tarde"
													});
											$timeout(function() {
												$ionicLoading.hide();
											}, 2500);

										}, function(progress) {
											// constant progress updates
										});

					};
					listarecetas.guardarImagenReceta = function(med_tmp) {
						$cordovaFile.checkFile(cordova.file.dataDirectory,"medicamento_tmp.jpg")
								.then(function(success) {
											$cordovaFile.copyFile(cordova.file.dataDirectory,"medicamento_tmp.jpg",
															cordova.file.dataDirectory, med_tmp.imagen).then(
																	function(info) {
																		listarecetas.recetas.splice(0,0,med_tmp);
																		window.localStorage.setItem(
																				REC_STORAGE_KEY,
																				angular.toJson(listarecetas.recetas));
															}, function(e) {
																//alert('Error al copiar el fichero');
															});
										}, function(error) {
											//alert('Error al chequear el fichero');
										});

					}
					listarecetas.borrarImagenReceta = function(imagen) {
						$cordovaFile.checkFile(cordova.file.dataDirectory,
								imagen).then(
								function(success) {

									$cordovaFile.removeFile(
											cordova.file.dataDirectory, imagen)
											.then(function(success) { // success
											}, function(error) {
												// error
											});
								}, function(error) {
									// No existe
								});

					}
					listarecetas.deleteMedicamentobyIndex = function(index) {
						// Hay que borrar la imagen si la tiene guardada!!!!
						listarecetas.recetas.splice(index, 1);
						window.localStorage.setItem(REC_STORAGE_KEY, angular
								.toJson(listarecetas.recetas));
					}
					listarecetas.deleteReceta = function(medicamento) {
						var idusuario = window.localStorage
								.getItem("idusuario");
						var idempresa = $('#idempresa').val();
						var datos = 'op=eliminar_receta&idempresa=' + idempresa
								+ '&idusuario=' + idusuario + '&idreceta='
								+ medicamento.idreceta;
						$ionicLoading
								.show({
									template : "  <ion-spinner></ion-spinner><br />Eliminando receta..."
								});
						$http(
								{
									method : 'POST',
									url : base_url_serv + '/modulos/documentos/app/documentos.php',
									data : datos,
									timeout : 8000,
									headers : {
										'Content-Type' : 'application/x-www-form-urlencoded'
									}
								})
								.success(
										function(data, status, headers, config) {
											$ionicLoading
													.show({
														template : "  <i class='ion-checkmark-circled'></i> Eliminado"
													});
											$timeout(function() {
												$ionicLoading.hide();
											}, 500);
											
											if (data.resultado == 1) {
												var urltotal = medicamento.imagen;
												var name = urltotal
														.substr(urltotal
																.lastIndexOf('/') + 1);
												listarecetas.recetas
														.splice(
																listarecetas.recetas
																		.indexOf(medicamento),
																1);
												window.localStorage
														.setItem(
																REC_STORAGE_KEY,
																angular
																		.toJson(listarecetas.recetas));
												listarecetas
														.borrarImagenReceta(name);
											} 
											else 
											{
												//alert("Ha dado " + data.motivo);
											}

										})
								.error(
										function(data, status, headers, config) {
											$ionicLoading
													.show({
														template : "<i class='ion-wifi'></i> Problemas de Red...<br> Íntentelo de nuevo más tarde"
													});
											$timeout(function() {
												$ionicLoading.hide();
											}, 2500);
										});

					}

					return listarecetas;
				})
		// Recetas
		.factory(
				'ImageService',
				function($cordovaCamera, $q, $cordovaFile) {

					function optionsForType(type) {
						var source;
						switch (type) {
						case 0:
							source = Camera.PictureSourceType.CAMERA;
							break;
						case 1:
							source = Camera.PictureSourceType.PHOTOLIBRARY;
							break;
						}
						return {
							destinationType : Camera.DestinationType.FILE_URI,
							sourceType : source,
							allowEdit : false,
							encodingType : Camera.EncodingType.JPEG,
							popoverOptions : CameraPopoverOptions,
							quality : 75,
							targetWidth : 800,
							targetHeight : 600,
							correctOrientation : true,
							saveToPhotoAlbum : false
						};
					}

					function deleteMedia(imagen) {
						$cordovaFile
								.checkFile(cordova.file.dataDirectory, imagen)
								.then(
										function(success) {
											// success
											$cordovaFile
													.removeFile(
															cordova.file.dataDirectory,
															"medicamento_tmp.jpg")
													.then(
															function(success) {
																// success
																$cordovaFile
																		.copyFile(
																				namePath,
																				name,
																				cordova.file.dataDirectory,
																				newName)
																		.then(
																				function(
																						info) {

																					resolve();
																				},
																				function(
																						e) {

																					reject();
																				});
															}, function(error) {
																// error
															});
										},
										function(error) {
											// No existe
											$cordovaFile.copyFile(namePath,
													name,
													cordova.file.dataDirectory,
													newName).then(
													function(info) {

														resolve();
													}, function(e) {

														reject();
													});
										});

					}

					function saveMedia(type) {
						return $q(function(resolve, reject) {
							var options = optionsForType(type);
							he_entrado_en_camara = 1;
							$cordovaCamera.getPicture(options)
									.then(
											function(imageUrl) {
												var name = imageUrl
														.substr(imageUrl
																.lastIndexOf('/') + 1);
												var namePath = imageUrl
														.substr(
																0,
																imageUrl
																		.lastIndexOf('/') + 1);
												var newName = "medicamento_tmp.jpg";
												var nombrefinal = name;
												if (name.indexOf('?') != -1)
													nombrefinal = name
															.substr(
																	0,
																	name
																			.lastIndexOf('?')); // En
																								// android
																								// cuando
																								// es
																								// de
																								// PHOTOLIBRARY
																								// devuelve
																								// ?123123123

												$cordovaFile
														.checkFile(
																cordova.file.dataDirectory,
																"medicamento_tmp.jpg")
														.then(
																function(success) {
																	// success
																	$cordovaFile
																			.removeFile(
																					cordova.file.dataDirectory,
																					"medicamento_tmp.jpg")
																			.then(
																					function(success) {
																						// success
																						$cordovaFile
																								.copyFile(
																										namePath,
																										nombrefinal,
																										cordova.file.dataDirectory,
																										newName)
																								.then(
																										function(
																												info) {

																											resolve();
																										},
																										function(
																												e) {

																											reject();
																										});
																					},
																					function(
																							error) {
																						// error
																					});
																},
																function(error) {
																	// No existe
																	$cordovaFile
																			.copyFile(
																					namePath,
																					nombrefinal,
																					cordova.file.dataDirectory,
																					newName)
																			.then(
																					function(
																							info) {

																						resolve();
																					},
																					function(
																							e) {

																						reject();
																					});
																});

											});
						})
					}

					return {
						handleMediaDialog : saveMedia,
						handleMediaremove : deleteMedia

					}
				});
