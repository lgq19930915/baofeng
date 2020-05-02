var Right = document.getElementById("right");
var oP = Right.getElementsByTagName("p")[0];
var oIn = Right.getElementsByTagName("input");
var oBtn = Right.getElementsByTagName("button")[0];
document.cookie = "userName = zhangxia123;expires = 30";
document.cookie = "passWorld = 123456;expires = 30";
var Gou = document.getElementById("gou");
var Cha1 = document.getElementById("cha1");
var Cha2 = document.getElementById("cha2");
oBtn.onclick = function () {
  // 判断是否输入了用户名和密码
  if (oIn[0].value == "" || oIn[1].value == "") {
    alert("请输入用户名和密码");
    return;
  } else if (!/^1[3-9]\d{9}$/.test(oIn[0].value)) {
    alert("请输入正确的手机号");
    return;
  } else if (
    !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/.test(oIn[1].value)
  ) {
    alert("请输入合法的密码");
    return;
  }
  //   发起请求
  let data = $("#loginForm").serialize();
  $.ajax({
    type: "POST",
    url: "https://localhost:3000/login",
    data,
    dataType: "json",
    success: function (response) {
      let {
        code,
        msg
      } = response;
      if (code == 200) {
        window.location.href = "./index.html";
      } else {
        alert(msg);
      }
    }
  });
  // var cookies = document.cookie;
  // var arr1 = cookies.split("; ");
  // var obj = {};
  // for (var i = 0; i < arr1.length; i++) {
  //     var arr2 = arr1[i].split("=");
  //     obj[arr2[0]] = arr2[1];
  // }
  // if (obj["userName"] == oIn[0].value && obj["passWorld"] == oIn[1].value) {
  //     alert("输入正确");
  // } else {
  //     oP.innerHTML = "账号密码有误";
  // }
};
Cha1.onclick = function () {
  var previous = this.previousElementSibling || this.previousSibling;
  previous.value = "";
};
Cha2.onclick = function () {
  var previous = this.previousElementSibling || this.previousSibling;
  previous.value = "";
};
var flag = true;
Gou.onclick = function () {
  if (flag) {
    this.style.backgroundPosition = "0px -66px";
  } else {
    this.style.backgroundPosition = "-20px -66px";
  }
  flag = !flag;
};