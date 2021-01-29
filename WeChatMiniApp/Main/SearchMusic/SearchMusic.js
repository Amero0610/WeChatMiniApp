// Main/SearchMusic/SearchMusic.js
const AppGlobal = getApp();
var storeindex = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txt:[],
    name:'',
    obj:[],
    TempSearchData:[]
  },
  getName(e)
  {
    this.setData({
      name:e.detail.value
    })
  },
  SearchMusic(e){
    let that=this
    wx.request({
      url: 'https://songsearch.kugou.com/song_search_v2?platform=WebFilter',
      data:{
        keyword:that.data.name
      },
      success(res){
        that.setData({
          obj:res.data.data.lists
        })
      }
    })
    let isExist=true
    for(let i=0;i<this.data.txt.length;i++)
    {
      if(this.data.txt[i]==this.data.name)
       isExist=false
    }
    if(isExist)
    {
      let temp = "txt["+storeindex+"]";
      this.setData({
        [temp]:this.data.name
      })
      storeindex++;
    }
    wx.setStorageSync('history', this.data.txt)    

},
SearchMusicot(e)
{
  this.getName(e)
  this.SearchMusic()
},
 
gtnpg(e){
  wx.navigateTo({
    // 传入对应歌曲的id
    url: '../MusicPlayer/MusicPlayer?index='+e.currentTarget.id,
   // url: '../MusicPlayer/MusicPlayer?FileHash='+this.data.obj[e.currentTarget.id].FileHash+'&id='+e.currentTarget.id,
  })
  for(let i = 0;i<this.data.obj.length;i++){
    let Hash = "TempSearchData["+i+"].FileHash";
    let id = "TempSearchData["+i+"].id";
    this.setData({
      [Hash]:this.data.obj[i].FileHash,
      [id]:i
    })
  } 
  AppGlobal.globalMusicPlayerData=this.data.TempSearchData;
},
  setValue(e){
    this.setData({
      name:this.data.txt[e.currentTarget.id]
    })
    this.SearchMusic()
  },
  removeHistory()
  {
    wx.removeStorageSync('history')
    this.setData({
      txt:[],
      name:''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      txt:wx.getStorageSync('history')
    }) 
    storeindex=wx.getStorageSync('history').length
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