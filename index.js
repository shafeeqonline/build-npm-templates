"use strict";

var fs = require('fs');
var path = require("path");
var ncp = require('ncp').ncp;

function buildNpmTemplates(options) {
  // Configure your plugin with options...
  var nodepath = path.join(__dirname, '../');
  var tenants = options.split(",");
  fs.readdir(nodepath, function(err, items) {
    items.forEach(function(npmcomponent, index){
      tenants.forEach(function(tenantname){
        if(npmcomponent.indexOf(tenantname+'-') > -1){
          var templatepath = path.join(nodepath + '/' + npmcomponent + '/template/');
          var tenantfolder = path.join(__dirname,'../../build/', tenantname);
          if (!fs.existsSync(tenantfolder)){
              fs.mkdirSync(tenantfolder);
          }
          var componentname = npmcomponent.split('-')[1];
          var destdir = path.join(__dirname,'../../build/', tenantname, '/', componentname);
          if (!fs.existsSync(destdir)){
              fs.mkdirSync(destdir);
          }
          ncp(templatepath, destdir, function (err) {
           if (err) {
             return console.error(err);
           }
          });
        }
      })
    })
  });
}

buildNpmTemplates.prototype.apply = function(compiler, options) {

};

module.exports = buildNpmTemplates;
