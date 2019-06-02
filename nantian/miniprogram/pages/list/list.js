// pages/lists/list.js
let formatTime = date => {
  let hour = date.getHours()
  let minute = date.getMinutes()
  return [hour, minute].map(formatNumber).join(':')
}
let formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startX: 0, //开始坐标
    startY: 0,
    
    // 数据库用户-城市表
    userCity: null,
    imagList: [
      "http://img1.imgtn.bdimg.com/it/u=1431664057,2740831878&fm=11&gp=0.jpg",//下雨
      "http://img0.imgtn.bdimg.com/it/u=515056602,896209476&fm=11&gp=0.jpg"//多云

    ],
    // 天气数据数组,存储城市对象
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
    console.log("loading cloud ...");
    const db = wx.cloud.database();
    db.collection('user_city').where({
      _openid: getApp().globalData.openId
    }).get({
      success: function (res) {
        console.log("haha");
        // res.data 是包含以上定义的两条记录的数组
        var cityList = res.data[0].cities;

        for (let city of cityList) {
          console.log(city);
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
          console.log("不存在数据");
          userCity.add({
            data: {
              cities: cityList
            },
            success: function (res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              console.log(res)
            }
          });
        } else {
          console.log("已存在数据");
          userCity.doc(res.data[0]._id).update({
            data: {
              cities: cityList
            },
            success: function (res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              console.log(res);
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
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });

    // 只有第一次加载页面时才同步云端
    if (getApp().globalData.loadTime == 0) {
      this.loadCloudData();
      getApp().globalData.loadTime += 1;
    }

    var _this = this;
    setInterval(function () {
      _this.sync();
      console.log("2秒同步一次全局数据和本地数据");
    }, 2000);
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
    this.sync();
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
    this.updateCloudData();
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
