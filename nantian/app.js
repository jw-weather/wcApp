//app.js
App({

  /**
   * 全局数据
   */
  globalData: {

    userInfo: null,

    // 天气数据数组,存储城市对象
    dataList: [],

    //天气背景
    
    // 创建城市对象
    // 将HTTP请求返回的数据转换为对象
    createCity: function (res) {
      console.log(res);
      var obj = new Object();

      obj.cityid = res.cityid;
      obj.city = res.city;
      obj.update_time = res.update_time;
      
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

      /*
      // 今天每3小时的简略信息
      obj.hours = [
        { tem: res.data[0].hours[0].tem, wea: res.data[0].hours[0].wea },
        { tem: res.data[0].hours[1].tem, wea: res.data[0].hours[1].wea },
        { tem: res.data[0].hours[2].tem, wea: res.data[0].hours[2].wea },
        { tem: res.data[0].hours[3].tem, wea: res.data[0].hours[3].wea },
        { tem: res.data[0].hours[4].tem, wea: res.data[0].hours[4].wea },
        { tem: res.data[0].hours[5].tem, wea: res.data[0].hours[5].wea },
        { tem: res.data[0].hours[6].tem, wea: res.data[0].hours[6].wea },
        { tem: res.data[0].hours[7].tem, wea: res.data[0].hours[7].wea },
      ]
      */

      // 1-6天后的简略信息
      obj.days = [
        { tem1: res.data[1].tem1, tem2: res.data[1].tem2 },
        { tem1: res.data[2].tem1, tem2: res.data[2].tem2 },
        { tem1: res.data[3].tem1, tem2: res.data[3].tem2 },
        { tem1: res.data[4].tem1, tem2: res.data[4].tem2 },
        { tem1: res.data[5].tem1, tem2: res.data[5].tem2 },
        { tem1: res.data[6].tem1, tem2: res.data[6].tem2 }
      ];

      console.log(obj);

      return obj;
    },

    // HTTP请求
    // 根据城市id请求
    requestWeatherByCityId: function (cityId) {
      var _this = this;
      wx.request({
        url: 'https://www.tianqiapi.com/api/?version=v1&cityid=' + cityId,
        data: {},
        method: 'GET',
        header: {},
        success: function (res) {
          _this.dataList.push(
            _this.createCity(res.data)
          );
        }
      });
    },

    // 根据城市名称请求
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
        }
      });
    },
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