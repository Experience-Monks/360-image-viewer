cordova.define("cordova-plugin-gyroscope.gyroscope", function(require, exports, module) { // Copyright (c) 2014, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

/**
 * This class provides access to device gyroscope data.
 * @constructor
 */
var argscheck = require('cordova/argscheck'),
    utils = require("cordova/utils"),
    exec = require("cordova/exec"),
    Orientation = require('./Orientation');

// Is the gyroscope sensor running?
var running = false;

// Keeps reference to watch calls.
var timers = {};

// Array of listeners; used to keep track of when we should call start and stop.
var listeners = [];
var eventTimerId = null;

// Last returned speed object from native
var speed = null;

// Tells native to start.
function start() {
    exec(function(a) {
        var tempListeners = listeners.slice(0);
        speed = new Orientation(a.x, a.y, a.z, a.timestamp);
        for (var i = 0, l = tempListeners.length; i < l; i++) {
            tempListeners[i].win(speed);
        }
    }, function(e) {
        var tempListeners = listeners.slice(0);
        for (var i = 0, l = tempListeners.length; i < l; i++) {
            tempListeners[i].fail(e);
        }
    }, "Gyroscope", "start", []);
    running = true;
}

// Tells native to stop.
function stop() {
    exec(null, null, "Gyroscope", "stop", []);
    running = false;
}

// Adds a callback pair to the listeners array
function createCallbackPair(win, fail) {
    return {win:win, fail:fail};
}

// Removes a win/fail listener pair from the listeners array
function removeListeners(l) {
    var idx = listeners.indexOf(l);
    if (idx > -1) {
        listeners.splice(idx, 1);
        if (listeners.length === 0) {
            stop();
        }
    }
}

var gyroscope = {
    /**
     * Asynchronously acquires the current speed.
     *
     * @param {Function} successCallback    The function to call when the speed data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the speed data. (OPTIONAL)
     * @param {GyroscopeOptions} options    The options for getting the gyroscope data such as frequency. (OPTIONAL)
     */
    getCurrent: function(successCallback, errorCallback, options) {
        argscheck.checkArgs('fFO', 'gyroscope.getCurrent', arguments);

        var p;
        var win = function(a) {
            removeListeners(p);
            successCallback(a);
        };
        var fail = function(e) {
            removeListeners(p);
            errorCallback && errorCallback(e);
        };

        p = createCallbackPair(win, fail);
        listeners.push(p);

        if (!running) {
            start();
        }
    },

    /**
     * Asynchronously acquires the speed repeatedly at a given interval.
     *
     * @param {Function} successCallback    The function to call each time the speed data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the speed data. (OPTIONAL)
     * @param {GyroscopeOptions} options    The options for getting the gyroscope data such as frequency. (OPTIONAL)
     * @return String                       The watch id that must be passed to #clearWatch to stop watching.
     */
    watch: function(successCallback, errorCallback, options) {
        argscheck.checkArgs('fFO', 'gyroscope.watch', arguments);
        // Default interval (10 sec)
        var frequency = (options && options.frequency && typeof options.frequency == 'number') ? options.frequency : 10000;

        // Keep reference to watch id, and report speed readings as often as defined in frequency
        var id = utils.createUUID();

        var p = createCallbackPair(function(){}, function(e) {
            removeListeners(p);
            errorCallback && errorCallback(e);
        });
        listeners.push(p);

        timers[id] = {
            timer:window.setInterval(function() {
                if (speed) {
                    successCallback(speed);
                }
            }, frequency),
            listeners:p
        };

        if (running) {
            // If we're already running then immediately invoke the success callback
            // but only if we have retrieved a value, sample code does not check for null ...
            if (speed) {
                successCallback(speed);
            }
        } else {
            start();
        }

        if (cordova.platformId === "browser" && !eventTimerId) {
            // Start firing devicemotion events if we haven't already
            var devicegyroEvent = new Event('devicegyro');
            eventTimerId = window.setInterval(function() {
                window.dispatchEvent(devicegyroEvent);
            }, 200);
        }

        return id;
    },

    /**
     * Clears the specified gyroscope watch.
     *
     * @param {String} id       The id of the watch returned from #watch.
     */
    clearWatch: function(id) {
        // Stop javascript timer & remove from timer list
        if (id && timers[id]) {
            window.clearInterval(timers[id].timer);
            removeListeners(timers[id].listeners);
            delete timers[id];

            if (eventTimerId && Object.keys(timers).length === 0) {
                // No more watchers, so stop firing 'devicemotion' events
                window.clearInterval(eventTimerId);
                eventTimerId = null;
            }
        }
    }
};
module.exports = gyroscope;

});
