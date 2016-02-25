"use strict";

var fs = require('fs');
var path = require("path");
var ncp = require('ncp').ncp;

function buildNpmTemplates(options) {
  // Configure your plugin with options...
  this.createFolders = function(buildfolder){
    var buildfolder = path.join(buildfolder, '../templates');
    var createbuild = path.join(process.cwd(), buildfolder);
    function mkdir(path, root) {
                    var dirs = path.split('/'), dir = dirs.shift(), root = (root || '') + dir + '/';
                    try { fs.mkdirSync(root); }
                    catch (e) {
                        //dir wasn't made, something went wrong
                        if(!fs.statSync(root).isDirectory()) throw new Error(e);
                    }
                    return !dirs.length || mkdir(dirs.join('/'), root);
                }
    if(process.platform == "win32" || process.platform == "win64"){
    mkdir(process.cwd() + buildfolder.replace(/\\/g,"/"));
    var tenantParts = buildfolder.split("\\");
    }
    else{
      mkdir(createbuild);
      var tenantParts = buildfolder.split("/");
    }
    var appName =  tenantParts[tenantParts.length - 2];
    var nodepath = path.join(process.cwd(), '/node_modules');
    var options = options ? options : appName ;
    if(options){
      var tenants = options.split(",");
      fs.readdir(nodepath, function(err, items) {
        items.forEach(function(npmcomponent, index){
          tenants.forEach(function(tenantname){
            if(npmcomponent.indexOf(tenantname+'-component-') > -1){
              var templatepath = path.join(nodepath + '/' + npmcomponent + '/template/');
              var componentname = npmcomponent.split('-')[2];
              var destdir = path.join(process.cwd(), buildfolder, '/', componentname);
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
      fs.readdir(path.join(process.cwd(), "app/", appName , "/components/"), function(err, items) {
        items.forEach(function(npmcomponent, index){
          tenants.forEach(function(tenantname){
            if(npmcomponent.indexOf(tenantname+'-component-') > -1){
              var templatepath = path.join(process.cwd(), "app/", appName , "/components/", npmcomponent + '/template/');
              var componentname = npmcomponent.split('-')[2];
              var destdir = path.join(process.cwd(), buildfolder, '/', componentname);
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
  };
}

buildNpmTemplates.prototype.apply = function(compiler, options) {
  var commonpath = path.resolve(compiler.options.output.publicPath,process.cwd());
  var createfolder = compiler.options.output.publicPath.replace(commonpath,'');
  this.createFolders(createfolder);
};

module.exports = buildNpmTemplates;
