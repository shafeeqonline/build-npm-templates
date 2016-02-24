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
    mkdir(createbuild);
    var nodepath = path.join(process.cwd(), '/node_modules');
    var tenants = options.split(",");
    fs.readdir(nodepath, function(err, items) {
      items.forEach(function(npmcomponent, index){
        tenants.forEach(function(tenantname){
          // console.log(npmcomponent)
          if(npmcomponent.indexOf(tenantname+'-component-') > -1){
            var templatepath = path.join(nodepath + '/' + npmcomponent + '/template/');
            var tenantfolder = path.join(process.cwd(), buildfolder, '/' ,tenantname);
            if (!fs.existsSync(tenantfolder)){
                fs.mkdirSync(tenantfolder);
            }
            var componentname = npmcomponent.split('-')[2];
            var destdir = path.join(process.cwd(), buildfolder, tenantname, '/', componentname);
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
  };
}

buildNpmTemplates.prototype.apply = function(compiler, options) {
  var commonpath = path.resolve(compiler.options.output.publicPath,process.cwd());
  var createfolder = compiler.options.output.publicPath.replace(commonpath,'');
  this.createFolders(createfolder);
};

module.exports = buildNpmTemplates;
