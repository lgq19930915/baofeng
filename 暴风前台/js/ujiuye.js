var ujiuye = (function () {
    /* 
     *获取标签样式
     *@param {Object} elem : 标签
     *@param {String} attr : 属性名
     */
    function getStyle(elem, attr) { //标签:elem  属性：attr
        if (elem.currentStyle) {
            var w = elem.currentStyle[attr];
        } else {
            var w = getComputedStyle(elem)[attr];
        }
        return w;
    }

    /* 
     *运动函数
     *@param {Object} elem : 标签
     *@param {String} attr : 属性名
     *@param {Number} step : 步长
     *@param {Number} target : 目标值
     */
    function move(elem, attr, step, target) {
        step = (getStyle(elem, attr) == "auto" ? 0 : parseInt(getStyle(elem, attr))) < target ? step : -step;
        clearInterval(elem.timer);
        elem.timer = setInterval(function () {
            //1、在当前基础上 + 10;
            var left = (getStyle(elem, attr) == "auto" ? 0 : parseInt(getStyle(elem, attr))) + step;
            //3、停止定时器
            if ((left >= target && step > 0) || (left <= target && step < 0)) { //必须右
                left = target;
                clearInterval(elem.timer);
            }
            //2、让div移动。设置left
            elem.style[attr] = left + "px";
        },
            30);
    }



    /* 
     *补0
     *@param {Number} time : 数字
     */
    function toTwo(time) {
        return time.toString().length < 2 ? "0" + time : time
    }


    /* 
     *倒计时
     *@param {Number} y : 年
     *@param {Number} m : 月
     *@param {Number} d : 号
     *@param {Number} h : 小时
     *@param {Number} mi : 分钟
     *@param {Number} s : 秒
     */
    function countdown(y, m, d, h, mi, s) {
        var cur = new Date();
        var fu = new Date(y, m - 1, d, h === undefined ? 0 : h, mi === undefined ? 0 : mi, s === undefined ? 0 :
            s); //
        var time = parseInt((fu - cur) / 1000); //毫秒数
        var t = parseInt(time / 86400);
        var h = parseInt(time % 86400 / 3600);
        var m = parseInt(time % 3600 / 60);
        var s = time % 60;

        return [t, h, m, s];
    }


    /* 
     *缓冲运动
     *@param {Object} elem : 标签
     *@param {Object}} obj : 运动属性
     *@param {Function} callback : 回调函数
     */
    function bufferMove(elem, obj, callback) {
        clearInterval(elem.timer);
        elem.timer = setInterval(function () {
            //假设全部都到了目标点
            var tag = true;
            for (var attr in obj) { //obj[attr]
                //2.获取当前值
                if (attr == "opacity") {
                    var cur = parseInt(getStyle(elem, attr) * 100);
                } else {
                    var cur = parseInt(getStyle(elem, attr));
                }

                //3.步长
                var speed = (obj[attr] - cur) / 10;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

                //4.停止定时器
                if (cur != obj[attr]) {
                    tag = false;
                }

                //1.运动div
                if (attr == "opacity") {
                    elem.style[attr] = (cur + speed) / 100;
                    elem.style.filter = "alpha(opacity=" + (cur + speed) + ")";
                } else {
                    elem.style[attr] = cur + speed + "px";
                }
            }
            if (tag) {
                clearInterval(elem.timer);
                callback && callback(); //如果第一个为假，没有传回调，第二个判断就不会执行
                //如果第一个为真，再去判断第二个条件
            }
        }, 30);
    }



    /* 
     *存储cookie
     *@param {String} key : 名字
     *@param {String} value : 值
     *@param {Number} time : 时间
     */
    function setCookie(key, value, time) {
        var oDate = new Date();
        oDate.setDate(oDate.getDate() + time);
        document.cookie = key + "=" + value + ";expires=" + oDate;
    }

    /* 
     *获取cookie
     *@param {String} key : 名字
     */
    function getCookie(key) {
        //获取cookie，分成一组一组
        var cookies = document.cookie.split("; ");
        var obj = {};

        //添加到对象中
        for (var i = 0; i < cookies.length; i++) {
            var arr = cookies[i].split("=");
            obj[arr[0]] = arr[1];
        }
        return obj[key]
    }

    /* 
     *删除cookie
     *@param {String} key : 名字
     */
    function removeCookie(key) {
        setCookie(key, 1, -10);
    }
    /* 
     *ajax请求后台数据
     *@param {Object} req : 请求数据
     */
    function ajax(req) {
        //1.创建请求对象
        var xhr = new XMLHttpRequest();

        //2.建立连接  get--post
        if (req.type.toUpperCase() === "GET") {
            req.url = req.data ? req.url + "?" + req.data : req.url;
            xhr.open("get", req.url, true);
            xhr.send();
        } else {
            xhr.open("post", req.url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(req.data);
        }

        //4.监听结果
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    req.success(JSON.parse(xhr.responseText));
                }
            }
        }

    }
    /* 
     *根据数据拼接成字符串
     *@param {Array} resArr : 数据
     */
    function showMove(resArr) {
        var str = "";
        for (var i = 0; i < resArr.length; i++) {
            str += '<li><a href="#"><img src="' + resArr[i].img + '" alt=""></a><div class="move_title"><p><a href="#">' + resArr[i].title + '</a></p><em>' + resArr[i].detail + '</em></div>';
            //vip
            switch (resArr[i].vip) {
                case 1:
                    str += '<span class="move_type move_type1"></span>';
                    break;
                case 2:
                    str += '<span class="move_type move_type2"></span>';
                    break;
                case 3:
                    str += '<span class="move_type move_type3"></span>';
                    break;
            }

            switch (resArr[i].definition) {
                case 1:
                    str += '<span class="move_bg"></span><span class="move_definition">标清</span>';
                    break;
                case 2:
                    str += '<span class="move_bg"></span><span class="move_definition">高清</span>';
                    break;
                case 3:
                    str += '<span class="move_bg"></span><span class="move_definition">超清</span>';
                    break;
            }

            str += '<span class="move_grade">' + resArr[i].score.slice(0, 1) + '.<i>' + resArr[i].score.slice(2, 3) + '</i></span></li>';
        }
        return str;
    }

    return {
        //方法名    方法
        "getStyle": getStyle,
        "removeCookie": removeCookie,
        "getCookie": getCookie,
        "setCookie": setCookie,
        "bufferMove": bufferMove,
        "countdown": countdown,
        "toTwo": toTwo,
        "move": move,
        "ajax": ajax,
        "showMove": showMove
    }
})();