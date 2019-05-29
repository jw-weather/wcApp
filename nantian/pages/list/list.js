// pages/lists/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 天气数据数组,存储城市对象
    // 改变本地数据会导致全局数据改变
    dataList: []
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

  }
})