var mainCtrlFn = function($scope, mainFactory) {  // controller function
    $scope.permissionsArr = ['admin', 'moderator', 'user'];

    mainFactory.getDataFromServer(function(data) {
        $scope.maindata = data;
    });

    $scope.editUserName = function(idNumb, i, name) { // function get data from DOM View

        mainFactory.updateUser(JSON.stringify({
            idNumb: idNumb,
            type: 'update',
            username: name
        }), function(res) {
            if(res.data == 'success') {
                $scope.maindata[i].username = name;
                $scope.maindata[i].editName = false;
            } else {
                $scope.maindata[i].editName = false;
            }
        })
    };

    $scope.editUserPermission = function(idNumb, i, perm) { // function get data from DOM View

        mainFactory.updateUser(JSON.stringify({
            idNumb: idNumb,
            type: 'update',
            permissions: perm
        }), function(res) {
            if(res.data == 'success') {
                $scope.maindata[i].permissions = perm;
                $scope.maindata[i].editPermission = false;
            } else {
                $scope.maindata[i].editPermission = false;
            }
        })
    };

    $scope.deleteUser = function(a, idNumb) { // function get data from DOM View

        mainFactory.delete(JSON.stringify({
            type: 'delete',
            idNumb: idNumb
        }), function(res) {
            if(res.data == 'success') {
                $scope.maindata.splice(a, 1);
            }
        })
    };

    $scope.addUser = function() {
        mainFactory.newUser(function(res){
            var newSt = res.data;
            newSt.editPermission = true;
            newSt.editName = true;
            console.log(newSt);
            $scope.maindata.push(newSt)
        })
    }

};

var mainFactoryFn = function($http) { // factory function

    var service = {};

    service.getDataFromServer = function(then) {
        $http({
            method: 'GET',
            url: '/users'
        }).then(function(res){
            then(res.data)
        });

    };

    service.updateUser = function(str, then) {
        $http({
            method: 'GET',
            url: '/users?data=' + str
        }).then(function(res){
            then(res)
        })
    };

    service.delete = function(str, then) {
        $http({
            method: 'GET',
            url: '/users?data=' + str
        }).then(function(res){
            then(res)
        })
    };

    service.newUser = function(then) {
        $http({
            method: 'GET',
            url: '/users?data=' + JSON.stringify({type: 'add'})
        }).then(function(res){
            then(res)
        })
    };

    return service
};

// assembly angular modules:

var app = angular.module('mainApp', []);

app.controller('mainCtrl', ['$scope', 'mainFactory', mainCtrlFn]);

app.factory('mainFactory', ['$http', mainFactoryFn]);