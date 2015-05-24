var plupload = {};
var moxie = require('./src/moxie');
var upload = require('./src/plupload').initalize(window,moxie);
require('./src/zh_CN').load(upload);
plupload.moxie = moxie;
plupload.upload = upload;
module.exports = plupload;