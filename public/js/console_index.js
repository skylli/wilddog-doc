/*
    本JS文件存控制面板专用的JS方法
*/

WD.dashboard = {
    //初始化
    init: function () {

        //"添加应用"卡片的悬停效果
        $(".cards-creat").hover(function () {
            $(".cards-creat").addClass("cards-creat-cursor");
        });
        $(".cards-creat").hover(function () {}, function () {
            if ($("#app-name").val() == "" && $("#app-url").val() == "") {
                $(".cards-creat").removeClass("cards-creat-cursor");
                $(".cards-form-input").blur();
                $("#app-name-tipserror").hide();
                $("#app-url-tipserror").hide();
                $("#whole-url").hide();
            }
        });

        //应用卡片的悬停效果
        $(".cards-normal-be-covered").each(function () {
            var cardID = $(this).attr("id");
            $(this).hover(function () {
                $("#" + cardID + " .user-mask").fadeIn(10);
            });
            $(this).hover(function () {}, function () {
                $("#" + cardID + " .user-mask").fadeOut(10);
            });
        });
        
        //添加说明效果
        $(".cards-normal-be-covered").each(function () {
            var cardID = $(this).attr("id");
            $("#" + cardID + " .user-add").hover(function () {
                $("#" + cardID + " .user-add-exp-tip").fadeIn(100);
            }, function () {
                $("#" + cardID + " .user-add-exp-tip").fadeOut(100);
            });
            $("#" + cardID + " .pen").hover(function () {
                $("#" + cardID + " .pen-exp-tip").fadeIn(100);
            }, function () {
                $("#" + cardID + " .pen-exp-tip").fadeOut(100);
            });
            $("#" + cardID + " .trash-1").hover(function () {
                $("#" + cardID + " .trash-1-exp-tip").fadeIn(100);
            }, function () {
                $("#" + cardID + " .trash-1-exp-tip").fadeOut(100);
            });
        });







        //添加应用卡片 - 激活、取消激活状态
        $(".cards-creat-btn").click(function () {

            //检查应用名称
            if ($("#app-name").val() == "") {
                $("#app-name-tipserror").text("请输入应用名称.");
                $("#app-name-tipserror").show();
                $("#app-name").addClass("border-error");
                //return false;
            } else if (WD.util.getByteLen($("#app-name").val()) > 20) { //检查应用名称是否超过20个字符
                $("#app-name-tipserror").text("应用名称，最长不能超过20个字符.");
                $("#app-name-tipserror").show();
                $("#app-name").addClass("border-error");
                //return false;
            } else {
                $("#app-name-tipserror").text("");
                $("#app-name-tipserror").hide();
                $("#app-name").removeClass("border-error");
            }

            //检查应用URL
            if ($("#app-url").val() == "") {
                $("#app-url-tipserror").text("请输入应用的URL.");
                $("#app-url-tipserror").show();
                $("#app-url").addClass("border-error");
                //return false;
            } else if (!WD.util.checkAppName($("#app-url").val())) { //检查URL是否使用[a-z], [0-9]。
                $("#app-url-tipserror").text("应用URL,请使用[a-z],[0-9].");
                $("#app-url-tipserror").show();
                $("#app-url").addClass("border-error");
                //return false;
            } else {
                $("#app-url-tipserror").text("");
                $("#app-url-tipserror").hide();
                $("#app-url").removeClass("border-error");
            }

            //出现3秒Loading
            $("#create-app-loading").show();

            //与服务器通信
            return false;
        });


        //添加app_url输入时的事件
        if (/msie/i.test(navigator.userAgent)) {
            //IE监听文本框且赋一个函数，函数名后不能带括号 
            document.getElementById('app-url').onpropertychange = WD.dashboard.reviewURL;
        } else {
            //谷歌浏览器利用添加事件函数为文本框添加事件并赋事件要执行的方法，同样方法名后不能加括号 
            document.getElementById('app-url').addEventListener("input", WD.dashboard.reviewURL);
        };




        //        //快速入门的滑动门效果
        $(".getting-started").addClass("getting-started-active");
        setTimeout('$(".getting-started").removeClass("getting-started-active");', 3000);
        
        
        
        //wilddog二维码弹出效果
        $(".link-icon-weixin").hover(function () {
            $("#weixin-code").show();
        });
        $(".link-icon-weixin").hover(function () {}, function () {
            $("#weixin-code").hide();
        });
        
        
        
        
        
        

    },
    


    reviewURL: function () {
        if ($("#app-url").val() != "") {
            $("#whole-url").show();
            $("#whole-url").html("http://<span>" + $("#app-url").val() + "</span>.wilddog.com");
        } else {
            $("#whole-url").html("");
            $("#whole-url").hide();
        }
    },

    //删除应用弹窗
    openDeleteAppWindow: function (divID) {
        $(".del-app-form").show();
        $(".del-app-form-success").hide();
        $('[data-remodal-id=' + divID + ']').remodal().open();

    },
    deleteApp: function () {
        $(".del-app-form").hide();
        $(".del-app-form-success").show();
    },

    //修改应用弹窗
    openModifyAppWindow: function (divID) {
        $(".mod-app-form").show();
        $(".mod-app-form-success").hide();
        $('[data-remodal-id=' + divID + ']').remodal().open();

    },
    modifyApp: function () {
        $(".mod-app-form").hide();
        $(".mod-app-form-success").show();
    },

    //添加开发者弹窗
    openDeveloperWindow: function (divID) {
        $(".man-app-form").show();
        $(".man-app-form-success").hide();
        $(".addDeveloperLayer").show();
        $(".developerListLayer").hide();
        $('[data-remodal-id=' + divID + ']').remodal().open();

    },
    addDeveloper: function () {
        $(".man-app-form").hide();
        $(".man-app-form-success").show();
    },
    switchDeveloperTab: function (val) {
        $(".man-app-form").show();
        $(".man-app-form-success").hide();
        if (val == "add") {
            $(".man-app-add-develop").removeClass("man-app-add-develop1");
            $(".man-app-develop-items").removeClass("man-app-develop-items1");
            $(".developerListLayer").hide();
            $(".addDeveloperLayer").show();
        } else if (val == "list") {
            $(".man-app-add-develop").addClass("man-app-add-develop1");
            $(".man-app-develop-items").addClass("man-app-develop-items1");
            $(".addDeveloperLayer").hide();
            $(".developerListLayer").show();

        }
    }
    
};