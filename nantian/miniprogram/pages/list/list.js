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
    // 数据库用户-城市表
    userCity: null,

    // 天气数据数组,存储城市对象
    // 改变本地数据会导致全局数据改变
    dataList: [],
    
  },

  /**
   * 通过"setData()"同步全局数据到本地页面中
   */
  sync: function() {
    // 拷贝全局数据的引用到本地
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

    this.loadCloudData();

    var _this = this;
    setInterval(function () {
      _this.sync();
      console.log("轮播请求1秒触发一次");
    }, 3000);    //代表1秒钟发送一次请求
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
    this.setData({
      index: e.currentTarget.dataset.index,
      Mstart: e.changedTouches[0].pageX
    });
  },
  touchmove: function (e) {
    //列表项数组
    let dataList = this.data.dataList;
    //手指在屏幕上移动的距离
    //移动距离 = 触摸的位置 - 移动后的触摸位置
    let move = this.data.Mstart - e.changedTouches[0].pageX;
    // 这里就使用到我们之前记录的索引index
    //比如你滑动第一个列表项index就是0，第二个列表项就是1，···
    //通过index我们就可以很准确的获得当前触发的元素，当然我们需要在事前为数组list的每一项元素添加x属性
    dataList[this.data.index].x = move > 0 ? -move : 0;
    this.setData({
      dataList: dataList
    });
  },
  touchend: function (e) {
    let dataList = this.data.dataList;
    let move = this.data.Mstart - e.changedTouches[0].pageX;
    dataList[this.data.index].x = move > 100 ? -180 : 0;
    this.setData({
      dataList: dataList
    });
  },

})
