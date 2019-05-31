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
    imgs:
      'https://image.baidu.com/search/detail?ct=503316480&z=undefined&tn=baiduimagedetail&ipn=d&word=%E5%A4%A9%E6%B0%94%E9%A2%84%E6%8A%A5%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=undefined&hd=undefined&latest=undefined&copyright=undefined&cs=1805967887,2520026758&os=904266883,2263384884&simid=0,0&pn=12&rn=1&di=75350&ln=945&fr=&fmq=1559272109560_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=undefined&height=undefined&face=undefined&is=0,0&istype=0&ist=&jit=&bdtype=0&spn=0&pi=0&gsm=0&hs=2&objurl=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170820%2F5518e1e364fb44f7baea31ea98d5ac6e.gif&rpstart=0&rpnum=0&adpicid=0&force=undefined'//多云
    ,
    // 创建城市对象
    // 将HTTP请求返回的数据转换为对象
    createCity: function (res) {
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