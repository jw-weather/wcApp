1. 下载微信开发者工具
2. 总共有三个界面：
    pages/list：城市列表界面
    pages/details:某个城市的详情界面
    pages/search：搜索城市的界面
3. 请求天气：
    app.js中有
        全局变量dataList
        天气请求方法requestWeatherByCityName
    通过调用天气请求方法getApp().globalData.requestWeatherByCityName("广州");即可将新增加的城市信息push到dataList后面