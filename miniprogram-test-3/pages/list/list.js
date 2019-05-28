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

  // 删除城市
  deleteCity: function(e) {
    var nowidx = e.currentTarget.dataset.index; // 获取data-index属性的值
    var oldDataList = this.data.dataList;
    oldDataList.splice(nowidx, 1);  // 删除
    this.setData({
      dataList: oldDataList
    })
  },

  // 跳去搜索界面
  search: function () {
    wx.redirectTo({
      url: '../search/search'
    })
  },

  //跳去详情界面
  weatherDetail: function () {
    wx.redirectTo({
      url: '../particular/particular',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().globalData.requestWeatherByCityName("北京");

    // 拷贝全局数据的引用到本地
    // 注意是引用传递，而不是值传递
    this.setData({
      dataList: getApp().globalData.dataList
    })
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