/**********************************
LastEditTime: 2021-01-08 22:46:46
Author: Amero
Description: 
Version: 
FilePath: \Program\Project\app.js
************************************/
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  /**********************************
  description: 通过歌曲的Hash值获取歌曲的具体信息，包含歌曲播放地址等。
  param {*} Hash
  return {*} 返回结构返回的歌曲信息JSON数据
  ************************************/
  GetMusicInfoByHash: function (Hash) {
    return new Promise((reslove, reject) => {
      wx.request({
        url: 'https://m3ws.kugou.com/app/i/getSongInfo.php?cmd=playInfo',
        data: {
          hash: Hash
        },
        method: 'GET',
        success: function (res) {
          reslove(res.data);
        }
      })
    })
  },

  /**********************************
  description: 解析图片地址
  param {*} Src_old 传入待解析的图片地址
  return {*} 返回解析后的图片地址
  ************************************/
  PraseImagesrc: function (Src_old) {
    let ImageSrc_new = Src_old.replace("{size}", "400");
    return ImageSrc_new;
  },
  
  /**********************************
  description: 跳转到播放器页面
  param {*} index    index为点击的歌曲所在歌曲序列中的索引
  return {*}
  ************************************/
  SkipPlayerPage:function (index) {  
    wx.navigateTo({
      url: '../MusicPlayer/MusicPlayer?index='+index
    })
  },
  /**********************************
   * 全局数组说明：
   *     globalMusicListData：推荐界面与歌单详情界面全局数组，包含歌单中具体的歌曲信息
   *     globalMusicPlayerData：小程序全局数组，包含歌曲序列中每一首歌的Hash值，以及id
   *       包含内容：FileHash，id
  ************************************/
  globalData: {
    globalMusicListData:[],
    globalMusicPlayerData:[],
    userInfo: null
  }
})