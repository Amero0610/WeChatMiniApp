
const AppGlobal = getApp();
let LoginCode = '';
let tempobj = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    num: '',
    Collectnum: '',
    CollectList: '',
    Temp_globalMusicData: []
  },
  getUserInfo: function (e) {
    let info = e.detail.userInfo;
    this.setData({
      isLogin: true,
      userImage: info.avatarUrl,
      userName: info.nickName
    })
    this.getMyFavorites();
  },
  getMyFavorites: function () {
    let info = wx.getStorageInfoSync();
    let key = info.keys;
    let list;
    tempobj = [];
    for (var i = 0; i < key.length; i++) {
      if (key[i] != 'history' && key[i] != 'logs') {
        list = {
          'FileHash': key[i],
          'songName': wx.getStorageSync(key[i])[0],
          'singerName': wx.getStorageSync(key[i])[1],
          'id': i - 1
        };
        console.log("list", list);
        tempobj.push(list);
      }
    }
    this.setData({
      Collectnum: tempobj.length,
      CollectList: tempobj
    })
    for (let i = 0; i < this.data.CollectList.length; i++) {
      let id = "Temp_globalMusicData[" + i + "].id";
      let Hash = "Temp_globalMusicData[" + i + "].FileHash";
      this.setData({
        [id]: i,
        [Hash]: this.data.CollectList[i].FileHash
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
    if (this.data.isLogin == false) {
      wx.showModal({
        title: '登录提示',
        content: '请登录后获取收藏内容',
        showCancel: false,
      });
      wx.stopPullDownRefresh();
    } else {
      wx.showToast({
        title: '刷新列表',
        icon: 'success',
        duration: 500,
        mask: true,
        complete: () => {
          this.getMyFavorites();
          wx.stopPullDownRefresh();
        },
      });
    }
  },
  gtnpg:function(e){
    AppGlobal.globalMusicPlayerData=this.data.Temp_globalMusicData;
    AppGlobal.SkipPlayerPage(e.currentTarget.id);
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