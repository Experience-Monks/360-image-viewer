Cordova Gyroscope Plugin
========

Description
--------

This project's idea is inspired from these two projects.
- [Android Gyroscope](https://github.com/zanderso/cordova-plugin-gyroscope)
- [iOS Gyroscope](https://github.com/jhurliman/cordova-plugin-gyroscope)

This project is merged by those two projects, and also provided an Angular module
called `deviceGyroscope`.

Installation
--------

```bash
cordova plugin add cordova-plugin-gyroscope@0.1.4
```

Usage
--------

### API

```javascript
var gyroscope = navigator.gyroscope;
gyroscope.getCurrent
gyroscope.watch
gyroscope.clearWatch
```

### For Angular

1. Copy `deviceGyroscope.js` to your project folder.
2. Add `deviceGyroscope` as a module.

```javascript
angular
  .module(
    'app', [
      ... other modules
      'deviceGyroscope'
    ]
  )
```
3. Inject `$deviceGyroscope` in controller. It's return a promise.
```javascript
$deviceGyroscope.getCurrent()
$deviceGyroscope.watch()
$deviceGyroscope.clearWatch()
```
