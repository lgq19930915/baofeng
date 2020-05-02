var Right = document.getElementById("right");
var oIn = Right.getElementsByTagName("input");
var Tishi = Right.getElementsByTagName("p")[0];
var Qiangdu = document.getElementById("qiangdu");
var Shuaxin = document.getElementById("shuaxin");
var Tianma = document.getElementById("tianma");
var Gou = document.getElementById("gou");
var Btn = Right.getElementsByTagName("button")[0];
var x, y;
oIn[0].onblur = function () {
  x = true;
  var re = /^1[3-9]\d{9}$/;
  if (re.test(this.value) == false) {
    Tishi.innerHTML = "请填写正确的手机号";
    x = false;
  } else {
    Tishi.innerHTML = "";
  }
};
//
oIn[1].onblur = function () {
  x = true;
  //  保证密码的长度在6-10位之间，且密码需要同时有字母和数字
  var re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/;
  if (re.test(this.value) == false) {
    Tishi.innerHTML = "密码不合法";
    x = false;
  } else {
    Tishi.innerHTML = "";
  }
};
oIn[1].oninput = function () {
  //9位数字  或  9位字母   9位符号   弱
  //6-32 数字+字母      数字+符号   字母+符号  中
  //6-32  数字+字母+符号  强
  var re1 = /(^[0-9]{9}$)|(^[a-zA-Z]{9}$)|(^[^a-zA-Z0-9]{9}$)/;
  var re2 = /((?=.*\d.*)(?=.*[a-zA-Z].*)^[0-9a-zA-Z]{6,32}$)|((?=.*\d.*)(?=.*[^a-zA-Z0-9].*)^[^a-zA-Z]{6,32}$)|((?=.*[a-zA-Z].*)(?=.*[^a-zA-Z0-9].*)^[^0-9]{6,32}$)/;
  var re3 = /(?=.*\d.*)(?=.*[a-zA-Z].*)(?=.*[^a-zA-Z0-9].*)^([0-9a-zA-Z]|[^0-9a-zA-Z]){6,32}$/;
  if (re1.test(this.value)) {
    Qiangdu.style.backgroundPositionX = "-70px";
  } else if (re2.test(this.value)) {
    Qiangdu.style.backgroundPositionX = "-100px";
  } else if (re3.test(this.value)) {
    Qiangdu.style.backgroundPositionX = "-130px";
  } else {
    Qiangdu.style.backgroundPositionX = "-40px";
  }
};

// 刷新验证码
Shuaxin.onclick = function () {
  //   Tishi.innerHTML = "";
  //   oIn[2].value = "";
  //   var str = "";
  //   for (var i = 0; i < 4; i++) {
  //     str += Math.floor(Math.random() * 9);
  //   }
  //   Tianma.innerHTML = str;
  $("#tianma img").attr(
    "src",
    `https://localhost:3000/register/code?id=${Math.random()}`
  );
};
// oIn[2].onblur = function() {
//   y = true;
//   if (this.value != Tianma.innerHTML) {
//     Tishi.innerHTML = "验证码错误";
//     y = false;
//   } else {
//     Tishi.innerHTML = "";
//   }
// };
var flag = true;
Gou.onclick = function () {
  if (flag) {
    this.style.backgroundPositionX = "0px";
  } else {
    this.style.backgroundPositionX = "-20px";
  }
  flag = !flag;
};
Btn.onclick = function () {
  if (x && oIn[1].value != "") {
    // alert("注册成功");
    submitReg(); //验证成功后提交注册
  } else {
    alert("请填写完整");
  }
};
// 提交注册
function submitReg() {
  //   $("#regForm").serialize(); //mobile=17745797252&password=asdf123&code=1813;表单的序列号是jquery提供的功能，可以把form表单中具有name属性的表单获取到

  /*
    0: {name: "mobile", value: "17745797252"}
    1: {name: "password", value: "asdf"}
    2: {name: "code", value: "4041"}
  */
  let formData = $("#regForm").serializeArray();
  let data = {};
  formData.forEach(fd => {
    data[fd.name] = fd.value; //对象属性名表达式
  });
  $.ajax({
    type: "POST",
    url: "https://localhost:3000/register",
    data, //对象属性名简写
    dataType: "json",
    xhrFields: {
      withCredentials: true
    },
    success: function (response) {
      let {
        code,
        msg
      } = response;
      if (code == 200) {
        // 注册成功,跳转到登录
        console.log(code);

        window.location.href = "./login.html";
      } else {
        // 注册失败
        alert(msg);
      }
    }
  });
}