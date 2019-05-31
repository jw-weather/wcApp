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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database();
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });
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

  },

})