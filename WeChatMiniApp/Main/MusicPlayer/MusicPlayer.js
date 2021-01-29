const {
  formatTime
} = require("../../utils/util");

const AppGlobal = getApp();
const myaudio = wx.createInnerAudioContext();
let musicdata;
let Src_old = "";
let Src_new = "";
let collect = "";
let musicmsg = '';
let index;
let i = 0;
let myAnimation = '';
let TempAnimation = '';
let Rotateindex = 1;
let Intervalindex1 = '';
let Intervalindex2 = '';
// let mname="";
Page({


  data: {
    src: 'https://pic.downk.cc/item/5ff18b953ffa7d37b3831f36.jpg',
    psrc: 'https://pic.downk.cc/item/5ff18b953ffa7d37b3831f36.jpg',
    MusicAlbumControl: '',
    Playstatus: 'stop',
    max1: '',
    value1: '',
    DefaultTime: 0,
    DurationTime: 0,
    music_playing: true,
    author: '',
    musicname: '',
    bgimage: '',
    hash: '',
    Collectionstatus: '',
    Collectimg: '../../Image/Collect.png',
    ani: []
  },
  changeProgress(e) {
    myaudio.seek(e.detail.value)
  },

  onLoad: function (e) {
    // 传入的歌曲id

    let Hash = AppGlobal.globalMusicPlayerData[e.index].FileHash;
    index = e.index
    let that = this;
    that.CreateAnimation();
    //创建缓存空间
    if (wx.getStorageInfo().length == 1) {
      musicmsg = []
    } else {
      musicmsg = wx.getStorageSync('musmsg')
    }
    // data为GetMusicInfo返回的歌曲详情数组
    AppGlobal.GetMusicInfoByHash(Hash).then((data) => {
      musicdata = data;
      // 判断歌曲是否未付费歌曲，JudgeIsPay()返回Flase时，即为非付费歌曲
      if (!that.JudgeIsPay()) {
        myaudio.src = musicdata.backup_url[0];
        that.SetPageInfo();
        that.play();
        that.ListenPlay();
        that.JudgeIsCollec();
      }
    });


  },

  onShow() {},
  CreateAnimation: function () {
    let that = this;
    myAnimation = wx.createAnimation();
    TempAnimation = myAnimation;
  },
  ShowAnimation: function () {
    let that = this;
    Intervalindex1 = setInterval(function () {
      TempAnimation.rotate(360).step({
        delay: 0,
        duration: 1000,
        timingFunction: 'linear'
      });
      that.setData({
        ani: myAnimation.export()
      })
    }, 0)
    Intervalindex2 = setInterval(function () {
      TempAnimation.rotate(0).step({
        delay: 0,
        duration: 0,
      });
      that.setData({
        ani: myAnimation.export()
      })
    }, 1000)
  },
  // 监听歌曲的播放
  ListenPlay: function () {
    let that = this;
    myaudio.onTimeUpdate(() => {
      this.setData({
        max1: myaudio.duration,
        value1: myaudio.currentTime,
        DefaultTime: that.FormatMusicTime(myaudio.currentTime),
        DurationTime: that.FormatMusicTime(myaudio.duration)
      })
    })
    myaudio.onCanplay(() => {
      this.setData({
        value1: myaudio.currentTime
      })
    })
  },

  //  设置进度条
  Time1: function (t) {

    if (t >= 60) {
      if (t % 60 < 10)
        this.setData({
          DefaultTime: Math.floor(t / 60) + ':' + '0' + Math.floor(t % 60)
        })
      else
        this.setData({
          DefaultTime: Math.floor(t / 60) + ':' + Math.floor(t % 60)
        })
    }
    if (t < 60) {
      if (t < 10)
        this.setData({
          DefaultTime: '0:' + '0' + Math.floor(t)
        })
      else
        this.setData({
          DefaultTime: '0:' + Math.floor(t)
        })
    }
  },
  FormatMusicTime: function (TempTime) {
    if (TempTime >= 60) {
      if (TempTime % 60 < 10)
        return Math.floor(TempTime / 60) + ':' + '0' + Math.floor(TempTime % 60)
      else
        return Math.floor(TempTime / 60) + ':' + Math.floor(TempTime % 60)
    }
    if (TempTime < 60) {
      if (TempTime < 10)
        return '0:' + '0' + Math.floor(TempTime)
      else
        return '0:' + Math.floor(TempTime)
    }
  },


  //  根据传入的歌曲id ，使用全局歌曲数组globalMusicPlayerData中对应的FileHash值返回歌曲的详细信息
  GetMusicInfo: function (e) {
    console.log(e.index);
    let ehash = AppGlobal.globalMusicPlayerData[e.index].FileHash;
    console.log(e);
    return new Promise((reslove, reject) => {
      wx.request({
        url: 'https://m3ws.kugou.com/app/i/getSongInfo.php?cmd=playInfo',
        data: {
          hash: ehash
        },
        method: 'GET',
        success: function (res) {
          reslove(res.data);

        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    })
  },
  // 歌曲播放
  play: function () {
    myaudio.onEnded((res) => {
      myaudio.offEnded();
      this.nextsong();
    })
    myaudio.play();
    this.setData({
      MusicAlbumControl: '../../Image/PlayerPlay.png',
      Playstatus: 'stop'
    });
  },
  stop: function () {
    myaudio.pause();
    this.setData({
      MusicAlbumControl: '../../Image/PlayerPause.png',
      Playstatus: 'play'
    });
  },


  //  收藏
  collection: function () {
    musicmsg = [musicdata.songName, musicdata.singerName]
    wx.setStorageSync(musicdata.hash, musicmsg)
    this.setData({
      Collectimg: '../../Image/CollectSelected.png',
      Collectionstatus: 'uncollection'
    })
  },
  uncollection: function () {
    wx.removeStorageSync(musicdata.hash)
    this.setData({
      Collectimg: '../../Image/Collect.png',
      Collectionstatus: 'collection'
    })
  },

  // 上一曲
  lastsong: function () {
    index = Number(index) - 1;
    if (index < 0) {
      index = AppGlobal.globalMusicPlayerData.length - 1;
    }
    AppGlobal.GetMusicInfoByHash(AppGlobal.globalMusicPlayerData[index].FileHash).then((MusicInfo) => {
      musicdata = MusicInfo;
      console.log('MusicInfo', MusicInfo)
      myaudio.src = musicdata.backup_url[0];
      this.SetPageInfo();
      this.play();
      this.ListenPlay();
      this.JudgeIsPay();
      this.JudgeIsCollec();
    })
  },
  // 下一曲
  nextsong: function () {
    index = Number(index) + 1;
    if (index > AppGlobal.globalMusicPlayerData.length - 1) {
      index = 0
    }
    AppGlobal.GetMusicInfoByHash(AppGlobal.globalMusicPlayerData[index].FileHash).then((MusicInfo) => {
      musicdata = MusicInfo;
      myaudio.src = musicdata.backup_url[0];
      this.SetPageInfo();
      this.play();
      this.ListenPlay();
      this.JudgeIsPay();
      this.JudgeIsCollec();
    })
  },
  //  显示错误信息（“需要付费”）
  ShowErrorMsg: function () {
    wx.showModal({
      content: '需要付费',
      title: '出现错误',
      showCancel: false,
      success: (result) => {
        if (result.confirm) {
          wx.navigateBack({
            delta: 1,
          })
        }
      }
    })
  },
  // 判断是否需要付费
  JudgeIsPay: function () {
    if (musicdata.error == "需要付费") {
      this.ShowErrorMsg();
      return true;
      // 歌曲无法播放
    } else {
      return false;
    }

  },
  // 判断是否已经收藏
  JudgeIsCollec: function () {
    let Storageinfo = wx.getStorageInfoSync();
    for (let i = 0; i < Storageinfo.keys.length; i++) {
      if (musicdata.hash == Storageinfo.keys[i]) {
        this.setData({
          Collectimg: '../../Image/CollectSelected.png',
          Collectionstatus: 'uncollection'
        });
        i = Storageinfo.keys.length;
      } else {
        this.setData({
          Collectimg: '../../Image/Collect.png',
          Collectionstatus: 'collection'
        })
      }
    }
  },
  //设定页面数据
  SetPageInfo() {
    //  解析图片
    Src_new = AppGlobal.PraseImagesrc(musicdata.album_img);
    if (Src_new == '') {
      Src_new = '../../Image/MusicDefault.png';
    }

    this.setData({
      psrc: Src_new,
      musicname: musicdata.songName,
      author: musicdata.singerName,
    })
  }

})