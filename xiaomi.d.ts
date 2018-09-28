interface XMGameUserInfo {
    uid: string
    nickName: string
    avatar: string // base64
}

interface XMGameResultInfo {
    cost_time: number
    win: 1 | 2 | 3; // 是否通关(1	获胜 2	平局 3	失败)
    score: number;
    info?: any;
}

interface XMGameErrorInfo {
    error_code: number
    error_msg: string
}

interface XMGameAdContent {
    adId: string
    adType: 1 | 2 | 3 // 广告类型码(0 表示激励类图片广告，1表示激励类视频广告，2 表示 banner 类广告)
}

interface XMGameAdResult {
    hasGetAd: boolean // 平台是否成功拉取到了广告 Boolean
    result: boolean // 用户是否完成了广告激励 Boolean
}

type XMGameAdCallback = (res: XMGameAdResult) => void
type XMGameStartCallback = (res: { code: string }) => void

declare namespace XMGame {
    // 当游戏加载完毕，可以进行游戏时候调用
    export function game_start(cb?: XMGameStartCallback)
    // 游戏结束回调
    export function game_over(result: XMGameResultInfo)
    // 游戏中发生异常情况调用
    export function game_error(errInfo: XMGameErrorInfo)
    // 请求展示广告数据
    export function game_show_ad(content: XMGameAdContent, cb: XMGameAdCallback)
    // 获取当前用户信息 (游戏中任何时候均可调用)
    export function get_userinfo(cb: (userinfo: XMGameUserInfo) => void)
}

/*
// 游戏开始

XMGame.game_start(foo)  // 游戏loading蒙层会取消

function foo(result) {
  if (result.code === "3") {
    // 需要调用提前游戏结束的逻辑，这是例子
    XMGame.game_over({
      cost_time: 10000,
      score: 0
    }) 
  }
}

XMGame.get_userinfo(callback) // 获取用户头像和名称等信息

function callback(userInfo) {
  if (userInfo && Object.prototype.toString.call(userInfo) === '[object Object]') {
    console.log(userInfo)
    console.log(userInfo.nickName)
    console.log(userInfo.avatar) // Base64格式
    console.log('获取到了用户数据')
  }
}

// 广告相关得写法

var content = {
  adType: '1', //表示激励类广告
  adId: '' // 渠道号
}

XMGame.game_show_ad(content, function(adData) {
  console.log(adData.result)   // 是否正常观看完了广告
  console.log(adData.hasGetAd) // 是否正常获取到广告
})

// 游戏结束需回传玩游戏时长(ms)和结果
let result = {
  cost_time: 30000,
  score: 212
}
XMGame.game_over(result) // 此时会显示结果蒙层
 */
