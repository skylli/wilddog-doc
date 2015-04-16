/*
    本JS文件存放全站通用的JS方法
*/

var WD = {

};


//通用函数工具
WD.util = {

    //返回val的字节长度 
    getByteLen: function (val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            if (val[i].match(/[^\x00-\xff]/ig) != null) //全角 
                len += 2;
            else
                len += 1;
        }
        return len;
    },

    //验证应用名称
    checkAppName: function (obj) {
        reg = /^[a-z,A-Z,0-9]+$/;
        return reg.test(obj)
    }

};


//通用UI交互
WD.ui = {
    initUserMenu: function () {
        $(".header-info").hover(function () {
            $(".dropdown-menu").show();
        })
        $(".dropdown-menu").hover(function () {}, function () {
            $(".dropdown-menu").hide();
        });
        
    }

}