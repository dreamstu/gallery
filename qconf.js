module.exports = function(quick){
	quick.initConfig({
		serve:{
			root:'./',
			port:2000,
			rules : function(pathname,ext){//执行wrap条件，用户可覆盖此默认配置
            	return pathname.indexOf('modules/')!=-1 && ext=='js';
	        }
		}
	});
}