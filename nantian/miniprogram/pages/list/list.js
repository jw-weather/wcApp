// pages/lists/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startX: 0, //开始坐标
    startY: 0,
   
  
    // 改变本地数据会导致全局数据改变
    dataList: [],
  },

  /**
   * 通过"setData()"同步全局数据到本地页面中
   */
  sync: function() {// 拷贝全局数据的引用到本地
    // 引用传递，不是值传递
    this.setData({
      dataList: getApp().globalData.dataList
    })
  },

  /**
   * 删除城市
   */
  deleteCity: function(e) {
    var nowidx = e.currentTarget.dataset.index; // 获取data-index属性的值
    var oldDataList = this.data.dataList;
    oldDataList.splice(nowidx, 1);  // 删除
    this.setData({
      dataList: oldDataList
    })
  },

  /**
   * 跳转至搜索界面
   */
  search: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },

  /**
   * 跳转至详情界面
   */
  details: function (e) {
    var nowidx = e.currentTarget.dataset.index; // 获取data-index属性的值
    wx.navigateTo({
      url: '../details/details?index=' + nowidx, // 传递城市下标
    })
  },

  loadCloudData: function() {
    console.log("尝试连接云端......");
    const db = wx.cloud.database();
    console.log(db);
    db.collection('user_city').where({
      _openid: getApp().globalData.openId
    }).get({
      success: function (res) {
        // res.data 是包含以上定义的两条记录的数组
        var cityList = res.data[0].cities;

        for (let city of cityList) {
          console.log("从云端加载城市：" + city + "成功");
          getApp().globalData.requestWeatherByCityName(city);
        }
      }
    });
  },

  updateCloudData: function() {
    // 增加用户收藏的城市
    const db = wx.cloud.database();
    const userCity = db.collection('user_city');
    var cityList = [];
    for (let i = 0; i < this.data.dataList.length; i++) {
      cityList.push(this.data.dataList[i].city);
    }

    // 插入/更新数据
    db.collection('user_city').where({
      _openid: getApp().globalData.openId
    }).get({
      success: function (res) {
        console.log(res);
        if (res.data.length == 0) {
          userCity.add({
            data: {
              cities: cityList
            },
            success: function (res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              console.log(res);
              console.log("云端增加用户收藏城市成功");
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              });
            }
          });
        } else {
          userCity.doc(res.data[0]._id).update({
            data: {
              cities: cityList
            },
            success: function (res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              console.log(res);
              console.log("云端更新用户收藏城市成功");
              wx.showToast({
                title: '收藏城市成功',
                icon: 'success',
                duration: 2000
              });
            }
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 只有第一次加载页面时才同步云端
    if (getApp().globalData.loadTime == 0) {
      this.loadCloudData();
      getApp().globalData.loadTime += 1;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    let timeout = 3000; // 3秒
    let interval = 500; // 0.5秒

    // timeout秒内每0.5秒同步一次全局数据，以防网络请求延时
    for (var time = interval; time <= timeout; time += interval) {
      setTimeout(function () {
        _this.sync();
      }, time)
    }

    // timeout秒后仍未请求成功，提示网络异常
    setTimeout(function() {
      if (getApp().globalData.request_status == false) {
        getApp().globalData.request_status = true;
        wx.showToast({
          title: '网络连接异常',
          icon: 'none',
          duration: 2000
        })
      }
    }, timeout)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("pull down");
    this.updateCloudData();
    getApp().globalData.updateAllCities();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000);

    setTimeout(function () {
      if (getApp().globalData.request_status == false) {
        getApp().globalData.request_status = true;
        wx.showToast({
          title: '网络连接异常',
          icon: 'none',
          duration: 2000
        })
      }
    }, 2000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.dataList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      dataList: this.data.dataList
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.dataList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      dataList: that.data.dataList
    })
  },

  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除事件
  del: function (e) {
    var nowidx = e.currentTarget.dataset.index; // 获取data-index属性的值
    var oldDataList = this.data.dataList;
    oldDataList.splice(nowidx, 1);
    this.setData({
      dataList: oldDataList
    })
  }
})