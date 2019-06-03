// pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    index: 0,
    update_time: "",
    cityName: "",
    weather: "",
    tem_now: "",
    today: "",
    today_tem1: "",
    today_tem2: "",
    oneDay: "",
    oneDay_wea: "",
    oneDay_tem1: "",
    oneDay_tem2: "",
    twoDay: "",
    twoDay_wea: "",
    twoDay_tem1: "",
    twoDay_tem2: "",
    threeDay: "",
    threeDay_wea: "",
    threeDay_tem1: "",
    threeDay_tem2: "",
    fourDay: "",
    fourDay_wea: "",
    fourDay_tem1: "",
    fourDay_tem2: "",
    fiveDay: "",
    fiveDay_wea: "",
    fiveDay_tem1: "",
    fiveDay_tem2: "",
    sixDay: "",
    sixDay_wea: "",
    sixDay_tem1: "",
    sixDay_tem2: "",
    period1: "",
    period2: "",
    period3: "",
    period4: "",
    period5: "",
    period6: "",
    period7: "",
    period8: "",
    wea1: "",
    wea2: "",
    wea3: "",
    wea4: "",
    wea5: "",
    wea6: "",
    wea7: "",
    wea8: "",
    tem1: "",
    tem2: "",
    tem3: "",
    tem4: "",
    tem5: "",
    tem6: "",
    tem7: "",
    tem8: "",
    air: "",
    humidity: "",
    win: "",
    img: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index: options.index // 城市下标
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
    var date = new Date();
    var t = date.getDay();
    var today = getDayString(t);
    this.setData({
      dataList: getApp().globalData.dataList
    })
    this.setData({
      update_time: this.data.dataList[this.data.index].update_time,
      cityName: this.data.dataList[this.data.index].city,
      weather: this.data.dataList[this.data.index].today.wea,
      tem_now: this.data.dataList[this.data.index].today.tem,
      today: today,
      today_tem1: this.data.dataList[this.data.index].today.tem1,
      today_tem2: this.data.dataList[this.data.index].today.tem2,
      oneDay: getDayString((t + 1) % 7),
      oneDay_wea: this.data.dataList[this.data.index].days[0].wea,
      oneDay_tem1: this.data.dataList[this.data.index].days[0].tem1,
      oneDay_tem2: this.data.dataList[this.data.index].days[0].tem2,
      twoDay: getDayString((t + 2) % 7),
      twoDay_wea: this.data.dataList[this.data.index].days[1].wea,
      twoDay_tem1: this.data.dataList[this.data.index].days[1].tem1,
      twoDay_tem2: this.data.dataList[this.data.index].days[1].tem2,
      threeDay: getDayString((t + 3) % 7),
      threeDay_wea: this.data.dataList[this.data.index].days[2].wea,
      threeDay_tem1: this.data.dataList[this.data.index].days[2].tem1,
      threeDay_tem2: this.data.dataList[this.data.index].days[2].tem2,
      fourDay: getDayString((t + 4) % 7),
      fourDay_wea: this.data.dataList[this.data.index].days[3].wea,
      fourDay_tem1: this.data.dataList[this.data.index].days[3].tem1,
      fourDay_tem2: this.data.dataList[this.data.index].days[3].tem2,
      fiveDay: getDayString((t + 5) % 7),
      fiveDay_wea: this.data.dataList[this.data.index].days[4].wea,
      fiveDay_tem1: this.data.dataList[this.data.index].days[4].tem1,
      fiveDay_tem2: this.data.dataList[this.data.index].days[4].tem2,
      sixDay: getDayString((t + 6) % 7),
      sixDay_wea: this.data.dataList[this.data.index].days[5].wea,
      sixDay_tem1: this.data.dataList[this.data.index].days[5].tem1,
      sixDay_tem2: this.data.dataList[this.data.index].days[5].tem2,
      period1: this.data.dataList[this.data.index].hours[0].time,
      period2: this.data.dataList[this.data.index].hours[1].time,
      period3: this.data.dataList[this.data.index].hours[2].time,
      period4: this.data.dataList[this.data.index].hours[3].time,
      period5: this.data.dataList[this.data.index].hours[4].time,
      period6: this.data.dataList[this.data.index].hours[5].time,
      period7: this.data.dataList[this.data.index].hours[6].time,
      period8: this.data.dataList[this.data.index].hours[7].time,
      wea1: this.data.dataList[this.data.index].hours[0].wea,
      wea2: this.data.dataList[this.data.index].hours[1].wea,
      wea3: this.data.dataList[this.data.index].hours[2].wea,
      wea4: this.data.dataList[this.data.index].hours[3].wea,
      wea5: this.data.dataList[this.data.index].hours[4].wea,
      wea6: this.data.dataList[this.data.index].hours[5].wea,
      wea7: this.data.dataList[this.data.index].hours[6].wea,
      wea8: this.data.dataList[this.data.index].hours[7].wea,
      tem1: this.data.dataList[this.data.index].hours[0].tem,
      tem2: this.data.dataList[this.data.index].hours[1].tem,
      tem3: this.data.dataList[this.data.index].hours[2].tem,
      tem4: this.data.dataList[this.data.index].hours[3].tem,
      tem5: this.data.dataList[this.data.index].hours[4].tem,
      tem6: this.data.dataList[this.data.index].hours[5].tem,
      tem7: this.data.dataList[this.data.index].hours[6].tem,
      tem8: this.data.dataList[this.data.index].hours[7].tem,
      air: this.data.dataList[this.data.index].today.air,
      humidity: this.data.dataList[this.data.index].today.humidity,
      win: this.data.dataList[this.data.index].today.win,
      img: this.data.dataList[this.data.index].img
    })
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

function getDayString(t) {
  var day = "";
  switch (t) {
    case 0: day = "星期日"; break;
    case 1: day = "星期一"; break;
    case 2: day = "星期二"; break;
    case 3: day = "星期三"; break;
    case 4: day = "星期四"; break;
    case 5: day = "星期五"; break;
    case 6: day = "星期六"; break;
    default: "今天"; break;
  }
  return day;
}