//app.js
App({

  /**
   * 全局数据
   */
  globalData: {

    openId: null,

    userInfo: null,

    // 加载云端次数
    loadTime: 0,

    // 天气数据数组,存储城市对象
    dataList: [],

    //天气背景
    imageList:[
      "http://img1.imgtn.bdimg.com/it/u=1431664057,2740831878&fm=11&gp=0.jpg",//下雨
      "http://img0.imgtn.bdimg.com/it/u=515056602,896209476&fm=11&gp=0.jpg"//多云
    ],
    // 创建城市对象
    // 将HTTP请求返回的数据转换为对象
    createCity: function (res) {
      var obj = new Object();

      obj.cityid = res.cityid;
      obj.city = res.city;
      obj.update_time = res.update_time;
      obj.get_time = new Date();
      
      // 今天的详细信息
      obj.today = {
        tem: res.data[0].tem, // 当前气温
        tem1: res.data[0].tem1, // 最高气温
        tem2: res.data[0].tem2, // 最低气温
        wea: res.data[0].wea, //天气
        air: res.data[0].air, // 空气指数
        humidity: res.data[0].humidity, // 湿度
        win: res.data[0].win[0] // 风
      };

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
          console.log("添加" + cityName + "天气成功");
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
          for(let i = 0 ; i < _this.dataList.length; i++) {
            if (_this.dataList[i].city == cityName) {
              _this.dataList[i] = _this.createCity(res.data);
              console.log("更新" + cityName + "天气成功");
            }
          }
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