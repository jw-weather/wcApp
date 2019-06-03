var formatTime = date => {
  let hour = date.getHours()
  let minute = date.getMinutes()
  return [hour, minute].map(formatNumber).join(':')
}

var formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var getImageNum = function (str) {
  var imag = 3;
  console.log(str)

  if (str.indexOf("转") != -1) {
    imag = getImageNum(str.split("转")[0])
  }
  else {
    if ((str).indexOf("雨") != -1) {
      imag = 0
    }
    else if ((str).indexOf("云") != -1) {
      imag = 1
    }
    else if ((str).indexOf("晴") != -1) {
      imag = 2
    }
  }
  return imag;
}

var getImage = function (num) {
  var imageList = [
    "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559540019985&di=839f7e3a53a0e9fa2d8d76d5548f045f&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Fback_pic%2F05%2F03%2F00%2F205956038334158.jpg%2521%2Ffwfh%2F804x1071%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue%2Fwatermark%2Ftext%2FOTDorr7orqE%3D%2Ffont%2Fsimkai%2Falign%2Fsoutheast%2Fopacity%2F20%2Fsize%2F50",//下雨
    "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1222675407,128984385&fm=26&gp=0.jpg",//多云
    'http://m.qpic.cn/psb?/V13K8NhN1oaFa5/XFrs0HbUFhyUUszxkwGq46j9ng7rQ4AJKtGSFqXE0kU!/b/dL4AAAAAAAAA&bo=NAJoBAAAAAADB3g!&rf=viewer_4'//晴天
  ];
  return imageList[num];
}

App({

  /**
   * 全局数据
   */
  globalData: {

    openId: null,

    userInfo: null,

    // 加载云端次数
    loadTime: 0,

    // 请求状态
    request_status: null,

    // 天气数据数组,存储城市对象
    dataList: [],

    // 创建城市对象
    // 将HTTP请求返回的数据转换为对象
    createCity: function (res) {
      var obj = new Object();

      obj.cityid = res.cityid;
      obj.city = res.city;
      obj.update_time = res.update_time; // 该天气数据更新时间
      obj.request_time = formatTime(new Date()); // 请求该天气数据时间

      // 今天的详细信息
      obj.today = {
        tem: res.data[0].tem, // 当前气温
        tem1: res.data[0].tem1, // 最高气温
        tem2: res.data[0].tem2, // 最低气温
        wea: res.data[0].wea, //天气
        air: res.data[0].air, // 空气指数
        humidity: res.data[0].humidity, // 湿度
        win: res.data[0].win[0],// 风
      };

      obj.img = getImage(getImageNum(res.data[0].wea));

      // 24小时的简略信息（每隔3小时）
      let hours = res.data[0].hours.concat(res.data[1].hours);
      obj.hours = [
        { time: hours[0].day, tem: hours[0].tem, wea: hours[0].wea },
        { time: hours[1].day, tem: hours[1].tem, wea: hours[1].wea },
        { time: hours[2].day, tem: hours[2].tem, wea: hours[2].wea },
        { time: hours[3].day, tem: hours[3].tem, wea: hours[3].wea },
        { time: hours[4].day, tem: hours[4].tem, wea: hours[4].wea },
        { time: hours[5].day, tem: hours[5].tem, wea: hours[5].wea },
        { time: hours[6].day, tem: hours[6].tem, wea: hours[6].wea },
        { time: hours[7].day, tem: hours[7].tem, wea: hours[7].wea },
      ]

      // 1-6天后的简略信息
      obj.days = [
        { wea: res.data[1].wea, tem1: res.data[1].tem1, tem2: res.data[1].tem2 },
        { wea: res.data[2].wea, tem1: res.data[2].tem1, tem2: res.data[2].tem2 },
        { wea: res.data[3].wea, tem1: res.data[3].tem1, tem2: res.data[3].tem2 },
        { wea: res.data[4].wea, tem1: res.data[4].tem1, tem2: res.data[4].tem2 },
        { wea: res.data[5].wea, tem1: res.data[5].tem1, tem2: res.data[5].tem2 },
        { wea: res.data[6].wea, tem1: res.data[6].tem1, tem2: res.data[6].tem2 }
      ];

      console.log(obj);

      return obj;
    },

    // HTTP请求
    // 根据城市名称请求天气，加到dataList末尾
    requestWeatherByCityName: function (cityName) {
      var _this = this;
      wx.request({
        url: 'https://www.tianqiapi.com/api/?version=v1&city=' + cityName,
        data: {},
        method: 'GET',
        header: {},
        success: function (res) {
          _this.dataList.push(
            _this.createCity(res.data)
          );
          _this.request_status = true;
          console.log("添加" + cityName + "天气成功");
        },
        fail: function (res) {
          _this.request_status = false;
        }
      });
    },

    // 根据城市名称更新dataList中某城市的天气
    updateWeatherByCityName: function (cityName) {
      var _this = this;
      wx.request({
        url: 'https://www.tianqiapi.com/api/?version=v1&city=' + cityName,
        data: {},
        method: 'GET',
        header: {},
        success: function (res) {
          for (let i = 0; i < _this.dataList.length; i++) {
            if (_this.dataList[i].city == cityName) {
              _this.dataList[i] = _this.createCity(res.data);
              console.log("更新" + cityName + "天气成功");
            }
          }
          _this.request_status = true;
        },
        fail: function (res) {
          _this.request_status = false;
        }
      });
    }
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 登录
    var code;
    wx.login({
      success: function (res) {
        code = res.code; //返回code
      }
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
  }
})