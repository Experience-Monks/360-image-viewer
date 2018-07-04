angular
  .module('deviceGyroscope', [])
  .factory('$deviceGyroscope', ['$q', function($q) {

    return {
      getCurrent: function() {
        var q = $q.defer();

        if (angular.isUndefined(navigator.gyroscope) ||
          !angular.isFunction(navigator.gyroscope.getCurrent)) {
          q.reject('Device do not support watch');
        }

        navigator.gyroscope.getCurrent(function(result) {
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        });

        return q.promise;
      },

      watch: function(options) {
        var q = $q.defer();

        if (angular.isUndefined(navigator.gyroscope) ||
          !angular.isFunction(navigator.gyroscope.watch)) {
          q.reject('Device do not support watchGyroscope');
        }

        var watchID = navigator.gyroscope.watch(function(result) {
          q.notify(result);
        }, function(err) {
          q.reject(err);
        }, options);

        q.promise.cancel = function() {
          navigator.gyroscope.clearWatch(watchID);
        };

        q.promise.clearWatch = function(id) {
          navigator.gyroscope.clearWatch(id || watchID);
        };

        q.promise.watchID = watchID;

        return q.promise;
      },

      clearWatch: function(watchID) {
        return navigator.gyroscope.clearWatch(watchID);
      }
    };
  }]);
