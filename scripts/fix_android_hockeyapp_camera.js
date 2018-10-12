'use strict';

var fs = require('fs');
var xml2js = require('xml2js');


module.exports = function (ctx) {
    if (ctx.opts.platforms.indexOf('android') < 0) {
        return;
    }

    var fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path'),
        deferral = ctx.requireCordovaModule('q').defer();

    var parseString = xml2js.parseString;
    var builder = new xml2js.Builder();
    var manifestPath = ctx.opts.projectRoot + '/platforms/android/app/src/main/AndroidManifest.xml';
    var androidManifest = fs.readFileSync(manifestPath).toString();
    var manifestRoot;

    if (androidManifest) {
        parseString(androidManifest, function(err, manifest) {
            if (err) {
                return console.error(err);
            }

            manifestRoot = manifest['manifest'];
            manifestRoot['$']['xmlns:tools'] = 'http://schemas.android.com/tools';

            if (!manifestRoot['uses-permission']) {
                manifestRoot['uses-permission'] = [];
            }

            var permission = manifestRoot['uses-permission'].find(function(item) {
                return item['$']['android:name'] === 'android.permission.WRITE_EXTERNAL_STORAGE';
            });

            if(permission) {
                permission['$']['tools:node'] = 'replace';
                fs.writeFileSync(manifestPath, builder.buildObject(manifest));
            }
        });
    }
};