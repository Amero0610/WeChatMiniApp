/**********************************
LastEditTime: 2021-01-05 21:00:58
Author: Amero
Description: 
Version: 
FilePath: \Program\Project\Main\RecommandMusic\RecommandMusic.js
************************************/
const AppGlobal = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SwiperArray: '',
    Page_MusicList: '',
    Page_ChineseNewMusic: '',
    Page_ForeignNewMusic: '',
    Temp_SwiperSongsData: '',
    Temp_CH_RankData: '',
    Temp_EN_RankData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
       mask: true
    })
    this.SetSwiper();
    this.SetMusicList();
    this.SetChineseNewMusic();
    this.SetForeignNewMusic();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading();

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

  },

  /**********************************
  description: 获取歌曲排行榜信息
  param {*}
  return ：排行榜信息
  ************************************/
  GetMusicRank: function () {
    return new Promise((reslove, reject) => {
      wx.request({
        url: 'https://m3ws.kugou.com/rank/list',
        data: {
          json: 'true'
        },
        method: 'GET', 
        success: function (res) {
          reslove(res.data);
        }
      })
    })
  },

  /**********************************
  description: 获取华语新歌
  param {*}
  return ：新歌信息
  ************************************/
  GetChNewMusic: function () {
    return new Promise((reslove, reject) => {
      wx.request({
        url: 'https://m3ws.kugou.com/',
        data: {
          json: 'true'
        },
        method: 'GET', 
        success: function (res) {
          reslove(res.data);
        }
      })
    })
  },
  /**********************************
  description: 获取欧美新歌
  param {*}
  return ：新歌信息
  ************************************/
  GetEnNewMusic: function () {
    return new Promise((reslove, reject) => {
      wx.request({
        url: 'http://mobilecdnbj.kugou.com/api/v3/rank/newsong?version=9108&plat=0&with_cover=1&pagesize=100&type=2&area_code=1&page=1&with_res_tag=0',
        data: {
          json: 'true'
        },
        method: 'GET',
        success: function (res) {
          reslove(res.data);
        }
      })
    })
  },
  /**********************************
  description: 获取歌单信息
  param {*}
  return ：歌单数据
  ************************************/
  GetMusicList: function () {
    return new Promise((reslove, reject) => {
      wx.request({
        url: 'https://m3ws.kugou.com/plist/index',
        data: {
          json: 'true'
        },
        method: 'GET',
        success: function (res) {
          reslove(res.data);
        }
      })
    })
  },
  /**********************************
  description: 根据排行榜Rankid获取歌曲详情（Hash等）
  param {*} Rankid
  return :返回歌曲详情
  ************************************/
  GetMusicInfoByRankid: function (Rankid) {
    return new Promise((reslove, reject) => {
      wx.request({
        url: 'https://m3ws.kugou.com/rank/info/',
        data: {
          rankid: Rankid,
          page: '1',
          json: 'true'
        },
        method: 'GET',
        success: function (res) {
          reslove(res.data);
        }
      })
    })
  },
  /**********************************
  description: 根据歌单Specialid获取歌单内歌曲信息
  param {*} Specialid
  return ：歌单中包含的歌曲详情（Hash等）
  ************************************/
  GetMusicInfoBySpecialid: function (Specialid) {
    return new Promise((reslove, reject) => {
      wx.request({
        url: 'https://m3ws.kugou.com/plist/list',
        data: {
          specialid: Specialid,
          json: 'true'
        },
        method: 'GET',
        success: function (res) {
          reslove(res.data);
        }
      })
    })
  },
  /**********************************
  description: 根据歌单获取其中歌曲Image路径，用于设定Swiper
  param {*} 
  return ：歌单中歌曲Image路径
  ************************************/
  SetSwiper: function () {
    let that = this;
      that.GetMusicRank().then((MusicRank) => {
        that.GetMusicInfoByRankid(MusicRank.rank.list[1].rankid).then((MusicRankInfo) => {
          for (let i = 0; i < 5; i++) {
            AppGlobal.GetMusicInfoByHash(MusicRankInfo.songs.list[i].hash).then((MusicInfo) => {
              let src = "SwiperArray[" + i + "].src"
              let id = "SwiperArray[" + i + "].id";
              let Musicobject = "SwiperArray[" + i + "].object";
              that.setData({
                [src]: AppGlobal.PraseImagesrc(MusicInfo.album_img),
                [id]: i,
                [Musicobject]: MusicInfo
              });
              let SwiperSongsHash = "Temp_SwiperSongsData[" + i + "].FileHash";
              let SwiperSongsId = "Temp_SwiperSongsData[" + i + "].id";
              that.setData({
                [SwiperSongsHash]: MusicRankInfo.songs.list[i].hash,
                [SwiperSongsId]: i
              })
            })
          }
        })
      })
  },

  /**********************************
  description: 跳转页面MusicListPage （歌单详情列表）
  ************************************/
  SkipListPage: function (event) {
    AppGlobal.globalMusicListData = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../MusicListPage/MusicListPage',
      // success: function (res) {
      //   res.eventChannel.emit('MusicListData', event.currentTarget.dataset.id)
      // }
    })
  },
  /**********************************
  description: 设定页面歌单
  ************************************/
  SetMusicList: function () {
    let that = this;
      that.GetMusicList().then((MusicList) => {
        for (let i = 0; i < 5; i++) {
          that.GetMusicInfoBySpecialid(MusicList.plist.list.info[i].specialid).then((MusicListInfo) => {
            let Page_MusicList = "Page_MusicList[" + i + "].MusicList";
            let id = "Page_MusicList[" + i + "].id";
            let Page_MusicListInfo = "Page_MusicList[" + i + "].MusicListInfo";
            let Page_MusicListImage = "Page_MusicList[" + i + "].MusicListImage";
            let TempImageSrc = AppGlobal.PraseImagesrc(MusicList.plist.list.info[i].imgurl);
            that.setData({
              [Page_MusicList]: MusicList.plist.list.info[i],
              [id]: i,
              [Page_MusicListInfo]: MusicListInfo.list.list,
              [Page_MusicListImage]: TempImageSrc
            });
          })
        }
      })
  },
  /**********************************
  description: 设定页面华语新歌
  ************************************/
  SetChineseNewMusic: function () {
    let that = this;
      that.GetChNewMusic().then((NewMusic) => {
        for (let i = 0; i < 10; i++) {
          AppGlobal.GetMusicInfoByHash(NewMusic.data[i].hash).then((NewMusicInfo) => {
            let SingerName = "Page_ChineseNewMusic[" + i + "].SingerName";
            let SongName = "Page_ChineseNewMusic[" + i + "].SongName";
            let MusicData = "Page_ChineseNewMusic[" + i + "].MusicData";
            let id = "Page_ChineseNewMusic[" + i + "].id";
            that.setData({
              [id]: i,
              [SingerName]: NewMusicInfo.singerName,
              [SongName]: NewMusicInfo.songName,
              [MusicData]: NewMusicInfo
            })
            let Rank_id = "Temp_CH_RankData[" + i + "].id";
            let Rnak_Hash = "Temp_CH_RankData[" + i + "].FileHash";
            that.setData({
              [Rank_id]: i,
              [Rnak_Hash]: NewMusicInfo.hash
            })
          })
        }
      })
  },
  /**********************************
  description: 设定页面欧美新歌
  ************************************/
  SetForeignNewMusic: function () {
    let that = this;
      that.GetEnNewMusic().then((NewMusic) => {
        for (let i = 0; i < 10; i++) {
          AppGlobal.GetMusicInfoByHash(NewMusic.data.info[i].hash).then((NewMusicInfo) => {
            let SingerName = "Page_ForeignNewMusic[" + i + "].SingerName";
            let SongName = "Page_ForeignNewMusic[" + i + "].SongName";
            let MusicData = "Page_ForeignNewMusic[" + i + "].MusicData";
            let id = "Page_ForeignNewMusic[" + i + "].id";
            that.setData({
              [id]: i,
              [SingerName]: NewMusicInfo.singerName,
              [SongName]: NewMusicInfo.songName,
              [MusicData]: NewMusicInfo
            })
            let Rank_id = "Temp_EN_RankData[" + i + "].id";
            let Rnak_Hash = "Temp_EN_RankData[" + i + "].FileHash";
            that.setData({
              [Rank_id]: i,
              [Rnak_Hash]: NewMusicInfo.hash
            })
          })
        }
      })
  },
  /**********************************
  description: 点击Swiper控件事件处理函数
               跳转播放器页面
  ************************************/
  Btn_Swiper: function (e) {
    AppGlobal.globalMusicPlayerData = this.data.Temp_SwiperSongsData;
    wx.navigateTo({
      url: '../MusicPlayer/MusicPlayer?index=' + e.currentTarget.dataset.id
    })
  },
  /**********************************
  description: 点击华语新歌跳转到播放器页面，将全局歌单数组修改为华语新歌的数组
  ************************************/
  Rank_CH_SkipPlayer: function (event) {
    let TempSkipIndex = event.currentTarget.dataset.id.id
    AppGlobal.globalMusicPlayerData = this.data.Temp_CH_RankData;
    AppGlobal.SkipPlayerPage(TempSkipIndex);
  },
  /**********************************
  description: 点击华语新歌跳转到播放器页面，将全局歌单数组修改为欧美新歌的数组
  ************************************/
  Rank_En_SkipPlayer: function (event) {
    let TempSkipIndex = event.currentTarget.dataset.id.id
    AppGlobal.globalMusicPlayerData = this.data.Temp_EN_RankData;
    AppGlobal.SkipPlayerPage(TempSkipIndex);
  }
})