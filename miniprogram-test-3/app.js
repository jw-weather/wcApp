//app.js
App({

  /**
   * 全局数据
   */
  globalData: {

    userInfo: null,

    // 天气数据数组,存储城市对象
    dataList: [],

    // 创建城市对象
    // 将HTTP请求返回的数据转换为对象
    createCity: function (res) {
      var obj = new Object();

      obj.cityid = res.cityid;
      obj.city = res.city;
      obj.update_time = res.update_time;
      
      // 今天的详细信息
      obj.today = {};

      // 1-6天后的简略信息
      obj.days = [];

      return obj;
    },

    // HTTP请求
    // 根据城市名称请求
    requestWeatherByCityId: function (cityId) {
      wx.request({
        url: 'https://www.tianqiapi.com/api/?version=v1&cityid=' + cityId,
        data: {},
        method: 'GET',
        header: {},
        success: function (res) {
          this.globalData.dataList.push(
            this.globalData.createCity(res)
          );
        }
      });
    },

    // 根据城市id请求
    requestWeatherByCityName: function (cityName) {
      wx.request({
        url: 'https://www.tianqiapi.com/api/?version=v1&city=' + cityName,
        data: {},
        method: 'GET',
        header: {},
        success: function (res) {
          this.globalData.dataList.push(
            this.globalData.createCity(res)
          );
        }
      });
    },
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
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
    })
  }
})