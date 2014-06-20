var miDebug = null;
var miDebug2 = null;
(function(){
	'use strict';
	var domocu = angular.module('domocu', ['onsen.directives']);
    domocu.factory('configuracion', function() {
        var all = JSON.parse(window.localStorage.getItem("_config")) || {label:"Home",icon:"home"};
        return {
            get: function  () {
                return all;
            },
            guardar: function  (todoAll) {
                window.localStorage.setItem("_config",JSON.stringify(todoAll));
            }
        }
    });
    domocu.factory('aux', function() {
        return {
            nuevoID: function  () {
                var ID = parseInt(window.localStorage.getItem("currentID")) +1 || 1;
                window.localStorage.setItem("currentID",ID);
                return ID;
            }
        }
    });
    domocu.factory('peticiones', function(aux) {
        var all = JSON.parse(window.localStorage.getItem("_requests")) || 
        {0:{
                label:"Example"
                ,url:""
                ,method:"GET"
                ,color:"purple"
                ,type:""
                ,headers:{}
                ,data:{}
            }
        };

        return {
            get: function() {
                return all;
            }
            ,nuevo: function  (objeto) {
                //all.push(objeto);
                all[aux.nuevoID()] = objeto;
                window.localStorage.setItem("_requests",JSON.stringify(all));
                return all;
            }
            ,guardar: function  (todoAll) {
                window.localStorage.setItem("_requests",JSON.stringify(todoAll));
            }
            ,borrar: function  (key) {
                delete all[key];
                window.localStorage.setItem("_requests",JSON.stringify(all));
                return all;
            }
        }
    });

    domocu.controller("homeController", function($scope, $http, peticiones ) {
        miDebug2 = $scope;
        $scope.requests = peticiones.get();
        $scope.editar = false;
        $scope.actionEditar = function  () {
            $scope.editar = !$scope.editar;
        }
        $scope.click = function  (key) {
            var actual = $scope.requests[key];
            var config = {
                      method: actual.method
                      ,url: actual.url
                      ,headers: actual.headers
                      ,data: actual.data
                    };
            $http(config).success(function (data, status, headers, config) {

            }).error(function (data, status, headers, config) {

            });
        }
    });

    domocu.controller("settingsController", function($scope, peticiones, configuracion ) {
        miDebug = $scope;
        $scope.config = configuracion.get();
        $scope.requests = peticiones.get();
        $scope.nuevoRequest = function  () {
            console.log("nueoRequest");
            $scope.requests = peticiones.nuevo({
                label:""
                ,url:""
                ,method:"GET"
                ,color:"#1284ff"
                ,type:""
                ,headers:{}
                ,data:{}
            });
            //No debería hacer falta, pero por on-right-button-click
            $scope.$apply();
        }
        $scope.borrarRequest = function  (key) {
            $scope.requests = peticiones.borrar(key);
        }
        $scope.$watch("requests",function  () {
            console.log("Guardando:");
            console.log($scope.requests);
            peticiones.guardar($scope.requests);
        },true)
    });
    domocu.controller("padreController", function($scope, configuracion) {
        $scope.config = configuracion.get();
        $scope.$watch("config",function  () {
            configuracion.guardar($scope.config);
        },true);
    });

    

})();
