// Main/MusicListPage/MusicListPage.js
const AppGlobal = getApp();
let MusicList_extend = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    MusicListTitle: '',
    MusicListInfo: '',
    MusicListImage: '',
    Page_MusicList: '',
    PlayAllMusicData: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    MusicList_extend = AppGlobal.globalMusicListData;
    wx.showLoading({
      title: "正在加载。。。",
      mask: true,
    });
    this.SetPageListInfo();
    this.SetPageMusicList();
    this.SaveListInfo();

  },
  /**********************************
  description: 预先根据全局数据的格式，预先设定一个数组“PlayAllMusicData”
  param {*} 
  return {*}
  ************************************/
  SaveListInfo: function () {
    let that = this;
    for (let i = 0; i < MusicList_extend.MusicListInfo.info.length; i++) {
      let Hash = "PlayAllMusicData[" + i + "].FileHash";
      let id = "PlayAllMusicData[" + i + "].id";
      that.setData({
        [id]: i,
        [Hash]: MusicList_extend.MusicListInfo.info[i].hash
      })
    }
  },
  PlayAllMusic: function () {
    AppGlobal.globalMusicPlayerData = this.data.PlayAllMusicData;
    AppGlobal.SkipPlayerPage(0);
  },
  /**********************************
  description: 根据不同index跳转到播放器页面
  param {*} index  0:播放全部 1：点击某一歌曲
  return {*}
  ************************************/
  SkipPlayerPage: function (index) {
    wx.navigateTo({
      url: '../MusicPlayer/MusicPlayer?index=' + index,
    })
  },
  PlayListMusic: function (event) {
    AppGlobal.globalMusicPlayerData = this.data.PlayAllMusicData;
    let Skipindex = event.currentTarget.dataset.id.id;
    AppGlobal.SkipPlayerPage(Skipindex);
  },


  /**********************************
  description: 设定页面中的数据，歌单名，歌单图片，歌单描述
  param {*}
  return {*}
  ************************************/
  SetPageListInfo: function () {
    let that = this;
    that.setData({
      MusicListTitle: MusicList_extend.MusicList.specialname,
      MusicListImage: MusicList_extend.MusicListImage,
      MusicListInfo: MusicList_extend.MusicList.intro
    })
  },
  /**********************************
  description: 设定歌单详情页面中的数组
  param {*}
  return {*}
  ************************************/
  SetPageMusicList: function () {
    let that = this;
    for (let i = 0; i < MusicList_extend.MusicListInfo.info.length; i++) {
      AppGlobal.GetMusicInfoByHash(MusicList_extend.MusicListInfo.info[i].hash).then((MusicData) => {
        let id = "Page_MusicList[" + i + "].id";
        let ListMusicHash = "Page_MusicList[" + i + "].Hash";
        let ListMusicImage = "Page_MusicList[" + i + "].ImageSrc";
        let ListMusicSongName = "Page_MusicList[" + i + "].SongName";
        let ListMusicSingerName = "Page_MusicList[" + i + "].SingerName";
        let ListMusciError = "Page_MusicList[" + i + "].Error";
        if (MusicData.album_img == '') {
          MusicData.album_img = '../../Image/MusicDefault.png';
        }
        let TempImageSrc = AppGlobal.PraseImagesrc(MusicData.album_img);
        that.setData({
          [id]: i,
          [ListMusicHash]: MusicData.hash,
          [ListMusicImage]: TempImageSrc,
          [ListMusicSongName]: MusicData.songName,
          [ListMusicSingerName]: MusicData.singerName,
          [ListMusciError]: MusicData.error
        })
      })
    }
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

  }
})