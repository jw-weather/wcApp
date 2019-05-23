// pages/lists/lists.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{
      city:"南京",
      temp:"23°C",
      time:(new Date()).toString(),
      useInfo:true

    }
  },
  //这个函数是跳去搜索界面的
  go:function(){
    wx.navigateTo({
      url: '../search/search'
    })

  },
  //这个函数是挑去详情界面的
  par:function(){
    wx.navigateTo({
      url: '../particular/particular',
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