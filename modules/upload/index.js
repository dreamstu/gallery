var pl = require('plupload');
var qnSdk = require('./src/qn.sdk').initalize(pl);
var upload = function(opts){
	this.qiniu = opts.qiniu || false;
	this.exts = opts.exts || ['*'];
	this.callback = opts.callback;
 	this.uploader = qnSdk.uploader({
        runtimes: 'html5,flash,html4',//上传模式,依次退化
        browse_button: 'pickfiles',//上传选择的点选按钮，**必需**
        container: opts.container,//上传区域DOM ID，默认是browser_button的父元素
        drop_element: opts.container,//拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        max_file_size: '100mb',//最大文件体积限制
        flash_swf_url: 'src/Moxie.swf',//引入flash,相对路径
        // max_retries: 3,                   //上传失败最大重试次数
        dragdrop: true,//开启可拖曳上传
        chunk_size: '4mb',//分块上传时，每片的体积
        //uptoken_url: opts.qiniu.uptoken_url,//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        uptoken:opts.qiniu.uptoken,//若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
        // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
        domain: opts.qiniu.domain,
        // downtoken_url: '/downtoken',
        // unique_names: true,
        // save_key: true,
        // x_vars: {
        //     'id': '1234',
        //     'time': function(up, file) {
        //         var time = (new Date()).getTime();
        //         // do something with 'time'
        //         return time;
        //     },
        // },
        auto_start: true,//选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
            'FilesAdded': function(up, files) {
                //$('table').show();
                //$('#success').hide();
                pl.upload.each(files, function(file) {
                    // 文件添加进队列后,处理相关的事情
                    //var progress = new FileProgress(file, 'fsUploadProgress');
                    //progress.setStatus("等待...");
                    console.log('请稍等');
                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前,处理相关的事情
                //var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = pl.upload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    //progress.setChunkProgess(chunk_size);
                    console.log('chunk_size:',chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时,处理相关的事情
                //var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = pl.upload.parseSize(this.getOption('chunk_size'));
                //progress.setProgress(file.percent + "%", up.total.bytesPerSec, chunk_size);
                console.log(file.percent + "%",up.total.bytesPerSec,chunk_size);

            },
            'UploadComplete': function() {
                //队列文件处理完毕后,处理相关的事情
                //$('#success').show();
                console.log('success');
            },
            'FileUploaded': function(up, file, info) {
                // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                // var domain = up.getOption('domain');
                // var res = parseJSON(info);
                // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
                //var progress = new FileProgress(file, 'fsUploadProgress');
                //progress.setComplete(up, info);
                console.log('uploaed',up, info);
                var res = JSON.parse(info);
                var domain = up.getOption('domain');
                url = domain + encodeURI(res.key);
                var link = domain + res.key + '?imageView2/1/w/100/h/100';
                console.log(link);
                var img = document.createElement('img');
                img.src = link;
                var body = document.querySelector('body');
                body.appendChild(img);
            },
            'Error': function(up, err, errTip) {
                //上传出错时,处理相关的事情
                //$('table').show();
                //var progress = new FileProgress(err.file, 'fsUploadProgress');
                //progress.setError();
                //progress.setStatus(errTip);
                console.log('error',errTip);
            }
             ,
             'Key': function(up, file) {
            //     // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            //     // 该配置必须要在 unique_names: false , save_key: false 时才生效
            //     var key = "";
            //     // do something with key
            //     return key
            console.log(up,file.type);
                    return new Date().getTime()+file.name.slice(file.name.lastIndexOf('.'));
             }
        }
    });
};

module.exports = upload;
