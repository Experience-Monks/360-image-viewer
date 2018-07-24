# Cordova Gyroscope Plugin

> This project is a fork of the old [cordova-plugin-gyroscope](https://github.com/NeoLSN/cordova-plugin-gyroscope) published by *Jason Yang*. Thanks to him, this plugin is working.

## Description

This project's idea is inspired from these two projects.
- [Android Gyroscope](https://github.com/zanderso/cordova-plugin-gyroscope)
- [iOS Gyroscope](https://github.com/jhurliman/cordova-plugin-gyroscope)

This project is merged by those two projects.

## Installation

```bash
cordova plugin add cordova-plugin-device-gyroscope@0.2.2
```

## Usage

This plugin is working like the [Apache Cordova Accelerometer plugin](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device-motion/), the API is the same.

### Get the current gyroscope

```javascript
navigator.gyroscope.getCurrentGyroscope(gyroscopeSuccess, gyroscopeError);
```

### Watch the gyroscope

```javascript
var watchID = navigator.gyroscope.watchGyroscope(gyroscopeSuccess,
                                                        gyroscopeError,
                                                        gyroscopeOptions);
```

### Stop the watch of the gyroscope

```javascript
navigator.gyroscope.clearWatch(watchID);
```

