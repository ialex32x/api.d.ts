type WXCommonCallback = (res?: any) => void;
type WXMergedAPI =
    WXRenderAPI &
    WXFileAPI &
    WXStorageAPI &
    WXSystemAPI &
    WXDebugAPI &
    WXOpenAPI &
    WXShareAPI &
    WXUserInterfaceAPI &
    WXUndocumentedAPI;

interface WXCanvasFileObject {
    // 属性	类型	         // 默认值	          是否必填	说明	支持版本
    x?: number               //	0	            否	    截取 canvas 的左上角横坐标	
    y?: number               //	0	            否	    截取 canvas 的左上角纵坐标	
    width?: number           //	canvas 的宽度	 否	     截取 canvas 的宽度	
    height?: number          //	canvas 的高度	 否	    截取 canvas 的高度	
    destWidth?: number       //	canvas 的宽度	 否	    目标文件的宽度，会将截取的部分拉伸或压缩至该数值	
    destHeight?: number      //	canvas 的高度	 否	    目标文件的高度，会将截取的部分拉伸或压缩至该数值	
    fileType?: "jpg" | "png" //	png	            否	    目标文件的类型	
    quality?: number         //	1.0	            否	    jpg图片的质量，仅当 fileType 为 jpg 时有效。取值范围为 0.0（最低）- 1.0（最高），不含 0。不在范围内时当作 1.0	
}

/*
通过 Canvas.getContext('2d') 接口可以获取 CanvasRenderingContext2D 对象。CanvasRenderingContext2D 实现了 HTML Canvas 2D Context 定义的大部分属性、方法。通过 Canvas.getContext('webgl') 接口可以获取 WebGLRenderingContext 对象。 WebGLRenderingContext 实现了 WebGL 1.0 定义的所有属性、方法、常量。

2d 接口支持情况
iOS/Android 不支持的 2d 属性和接口

globalCompositeOperation 不支持以下值： source-in source-out destination-atop lighter copy。如果使用，不会报错，但是将得到与预期不符的结果。
isPointInPath
WebGL 接口支持情况
iOS/Android 不支持的 WebGL 接口

pixelStorei 当第一个参数是 gl.UNPACK_COLORSPACE_CONVERSION_WEBGL 时
compressedTexImage2D
compressedTexSubImage2D
除此之外 Android 还不支持 WebGL 接口

getExtension
getSupportedExtensions
*/

interface WX2DRenderingContext {

}

interface WXWebGLRenderingContext {

}

interface WXCanvasObject {
    width: number
    height: number

    // 将当前 Canvas 保存为一个临时文件，并生成相应的临时文件路径。
    // 返回值: canvas 生成的临时文件路径
    toTempFilePath(obj: WXCanvasFileObject & WXCommonObj): string
    toTempFilePathSync(): WXCanvasFileObject

    // 获取画布对象的绘图上下文
    // contextAttributes (webgl 上下文属性，仅当 contextType 为 webgl 时有效)
    getContext(contextType: "2d" | "webgl", contextAttributes: {
        // 属性	类型                   // 默认值   是否必填	说明	支持版本
        antialias?: boolean             // false	否	表示是否抗锯齿	
        preserveDrawingBuffer?: boolean // false	否	表示是否绘图完成后是否保留绘图缓冲区	
        antialiasSamples?: number	    // 2	    否	抗锯齿样本数。最小值为 2，最大不超过系统限制数量，仅 iOS 支持
    }): WX2DRenderingContext | WXWebGLRenderingContext

    // 把画布上的绘制内容以一个 data URI 的格式返回
    toDataURL(): string
}

interface WXRenderAPI {
    // 画布
    createCanvas(): WXCanvasObject
}

// 文档中没有的API
interface WXUndocumentedAPI {
    env: {
        USER_DATA_PATH: string,
    };
}

interface WXCommonObj {
    success?: WXCommonCallback;
    fail?: WXCommonCallback;
    complete?: WXCommonCallback;
}

interface WXEventTarget {
    id: string	//	事件源组件的id
    tagName: string	//	当前组件的类型
    dataset: any	//	事件源组件上由data-开头的自定义属性组成的集合
}

interface WXEventTouch {
    identifier: number	//	触摸点的标识符
    pageX: number
    pageY: number	//	距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴
    clientX: number
    clientY: number	//	距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴	
}

interface WXEventCanvasTouch {
    identifier: number	//	触摸点的标识符	
    x: number
    y: number	//	距离 Canvas 左上角的距离，Canvas 的左上角为原点 ，横向为X轴，纵向为Y轴	
}

interface WXBaseEvent {
    type: string		//	事件类型
    timeStamp: number 	//	事件生成时的时间戳
    target: WXEventTarget			//	触发事件的组件的一些属性值集合
    currentTarget: WXEventTarget	//	当前组件的一些属性值集合	
}

interface WXCustomEvent extends WXBaseEvent {
    detail: any	// 额外的信息
}

interface WXTouchEvent extends WXBaseEvent {
    touches: Array<WXEventTouch | WXEventCanvasTouch>	//	触摸事件，当前停留在屏幕中的触摸点信息的数组
    changedTouches: Array<WXEventTouch | WXEventCanvasTouch>	//	触摸事件，当前变化的触摸点信息的数组	
}

interface WXSaveFileObj {
    tempFilePath: string
    filePath?: string
    success?: (res: { savedFilePath: string }) => void
    fail?: WXCommonCallback
    complete?: WXCommonCallback
}

interface WXFileItem {
    filePath: string
    size: number
    createTime: number
}

interface WXZipFileInfo extends WXCommonObj {
    zipFilePath: string  //		是	源文件路径，只可以是 zip 压缩文件	
    targetPath: string  //		是	目标目录路径	
}

type WXFileEncoding = "ascii" | "base64" | "binary" | "hex" | "ucs2" | "ucs-2" | "utf16le" | "utf-16le" | "utf-8" | "utf8" | "latin1";

interface WXFileSystemManager {
    // 保存临时文件到本地。此接口会移动临时文件，因此调用成功后，tempFilePath 将不可用。
    saveFile(obj: WXSaveFileObj)

    // tempFilePath 临时存储文件路径
    // filePath 要存储的文件路径
    // return 存储后的文件路径 (文档错误??)
    saveFileSync(tempFilePath: string, filePath: string): string

    // 获取该小程序下已保存的本地缓存文件列表
    getSavedFileList(obj: {
        success?: (res: { fileList: WXFileItem[] }) => void,
        fail?: WXCommonCallback,
        complete?: WXCommonCallback,
    })

    // 判断文件/目录是否存在
    access(obj: { path: string } & WXCommonObj): void;

    // return errMsg
    // 判断文件/目录是否存在
    accessSync(path: string): string;

    // 写文件 (基础库 1.9.9 开始支持)
    writeFile(res: {
        filePath: string,
        data: string | ArrayBuffer,
        encoding?: WXFileEncoding,
    } & WXCommonObj)
    writeFileSync(filePath: string, data: string | ArrayBuffer, encoding?: WXFileEncoding): string

    // 基础库 1.9.9 开始支持
    readFile(res: {
        filePath: string,
        encoding?: WXFileEncoding,
        success?: (res: { data: string | ArrayBuffer }) => void,
        fail?: (res: { errMsg: string }) => void,
        complete?: WXCommonCallback,
    })
    // filePath: 要读取的文件的路径
    // encoding: 指定读取文件的字符编码，如果不传 encoding， 则以 ArrayBuffer 格式读取文件的二进制内容
    // 基础库 1.9.9 开始支持
    readFileSync(filePath: string, encoding?: WXFileEncoding): string | ArrayBuffer

    // 解压
    unzip(obj: WXZipFileInfo)

    // 删除文件
    unlink(obj: {
        filePath: string
    } & WXCommonObj)

    unlinkSync(filePath: string): string

    copyFile(obj: {
        srcPath: string     // 源文件路径，只可以是普通文件
        destPath: string    // 目标文件路径
    } & WXCommonObj)

    copyFile(srcPath: string, destPath: string): string

    // 支持版本 >= 2.1.0
    // 在文件结尾追加内容
    appendFile(obj: {
        filePath: string            //		是	要追加内容的文件路径	
        data: string | ArrayBuffer  //		是	要追加的文本或二进制数据	
        encoding?: WXFileEncoding   //	utf8	否	指定写入文件的字符编码
    } & WXCommonObj)

    appendFileSync(filePath: string, data: string | ArrayBuffer, encoding?: WXFileEncoding): string

    // 删除该小程序下已保存的本地缓存文件
    removeSavedFile(obj: {
        filePath: string
    } & WXCommonObj)

    // 获取该小程序下的 本地临时文件 或 本地缓存文件 信息
    getFileInfo(obj: {
        filePath: string
        success?: (res: { size: number }) => void
        fail?: WXCommonCallback
        complete?: WXCommonCallback
    })
}

interface WXFileAPI {
    // 基础库 1.9.9 开始支持
    getFileSystemManager(): WXFileSystemManager;
}

interface WXGetStorageObj {
    key: string
    success?: (res: { data: any }) => void
    fail?: WXCommonCallback
    complete?: WXCommonCallback
}

interface WXGetStorageInfoObj {
    success?: (res: { keys: string[], currentSize: number, limitSize: number }) => void;
    fail?: WXCommonCallback;
    complete?: WXCommonCallback;
}

// 数据缓存
interface WXStorageAPI {
    setStorage(obj: { key: string, data: Object | string } & WXCommonObj);
    setStorageSync(key: string, data: Object | string);

    getStorage(obj: WXGetStorageObj);
    getStorageSync(key: string): any;

    getStorageInfo(obj: WXGetStorageInfoObj);
    getStorageInfoSync(): { keys: string[], currentSize: number, limitSize: number };

    removeStorage(obj: WXGetStorageObj);
    removeStorageSync(key: string);

    clearStorage();
    clearStorageSync();
}

interface WXSystemInfo {
    brand: string           //	手机品牌 >= 1.5.0
    model: string	        // 手机型号	
    pixelRatio: number	    // 设备像素比	
    screenWidth: number	    // 屏幕宽度	>= 1.1.0
    screenHeight: number	// 屏幕高度	>= 1.1.0
    windowWidth: number	    // 可使用窗口宽度	
    windowHeight: number	// 可使用窗口高度	
    statusBarHeight: number	// 状态栏的高度 >= 1.9.0
    language: string	    // 微信设置的语言	
    version: string	        // 微信版本号	
    system: string      	// 操作系统版本	
    platform: string        // 	客户端平台	
    fontSizeSetting: number // 	用户字体大小设置。以“我 - 设置 - 通用 - 字体大小”中的设置为准，单位 px。	>= 1.5.0
    SDKVersion: string	    // 客户端基础库版本	>= 1.1.0
    benchmarkLevel: number  // (仅Android小游戏) 性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好(目前设备最高不到50) >= 1.8.0
}

interface WXOnShowOptions {
    scene: number           // 场景值
    query: any          	// 启动参数
    shareTicket: string     // shareTicket
    // 当场景为由从另一个小程序或公众号或App打开时，返回此字段
    referrerInfo: {
        // 1020	公众号 profile 页相关小程序列表	来源公众号 appId
        // 1035	公众号自定义菜单	来源公众号 appId
        // 1036	App 分享消息卡片	来源应用 appId
        // 1037	小程序打开小程序	来源小程序 appId
        // 1038	从另一个小程序返回	来源小程序 appId
        // 1043	公众号模板消息	来源公众号 appId
        appId: string       // 来源小程序或公众号或App的 appId
        extraData: any      // 来源小程序传过来的数据，scene=1037或1038时支持
    }
}

interface WXSystemAPI {
    // ## 系统信息

    getSystemInfo(obj: { success: (res: WXSystemInfo) => void, fail?: WXCommonCallback, complete?: WXCommonCallback });
    getSystemInfoSync(): WXSystemInfo;

    // ## 系统事件

    // 监听全局错误事件
    onError(callback: (res: {
        message: string
        stack: string
    }) => void)
    offError(callback: Function)

    // ## 生命周期

    // 退出当前小游戏
    exitMiniProgram(obj?: WXCommonObj)
    getLaunchOptionsSync(): WXOnShowOptions & {
        isSticky: boolean       // 当前小游戏是否被显示在聊天顶部
    }
    // 监听小游戏隐藏到后台事件。锁屏、按 HOME 键退到桌面、显示在聊天顶部等操作会触发此事件。
    onHide(callback: Function)
    // 取消监听小游戏隐藏到后台事件。锁屏、按 HOME 键退到桌面、显示在聊天顶部等操作会触发此事件。
    offHide(callback: Function)
    // 监听小游戏回到前台的事件
    onShow(callback: (res: WXOnShowOptions) => void)
    // 取消监听小游戏回到前台的事件
    offShow(callback: Function)
}

interface WXDebugAPI {
    // 设置是否打开调试开关，此开关对正式版也能生效。
    // 支持版本 >= 1.4.0
    // Tips: 在正式版打开调试还有一种方法，就是先在开发版或体验版打开调试，再切到正式版就能看到vConsole。
    setEnableDebug(obj: {
        enableDebug: boolean // 是否打开调试	
    } & WXCommonObj)
}

interface WXUserInfoButtonStyle {
    left: number      //		是	左上角横坐标	
    top: number      //		是	左上角纵坐标	
    width: number      //		是	宽度	
    height: number      //		是	高度	
    backgroundColor: string      //		是	背景颜色	
    borderColor: string      //		是	边框颜色	
    borderWidth: number      //		是	边框宽度	
    borderRadius: number      //		是	边框圆角	
    textAlign: "left" | "center" | "right"      //		是	文本的水平居中方式	
    fontSize: number      //		是	字号	
    lineHeight: number      //		是	文本的行高    
}

interface WXUserInfoButton {
    show()
    hide()
    destroy()
    onTap(cb: Function)
    offTap(cb: Function)
}

interface WXUserInfoObject {
    nickName: string;	// 	用户昵称
    avatarUrl: string	//	用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表132*132正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
    gender: string 		//	用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
    city: string 		//	用户所在城市
    province: string	//	用户所在省份
    country: string		//	用户所在国家
    language: string	//	用户的语言，简体中文为zh_CN
}

interface WXUserInterfaceAPI {
    showModal(obj: {
        title: string
        content: string
        showCancel?: boolean // true
        cancelText: string
        cancelColor?: string // 文字颜色，必须是 16 进制格式的颜色字符串
        confirmText: string
        confirmColor?: string
        success?: (res: {
            confirm: boolean // 为 true 时，表示用户点击了确定按钮
            cancel: boolean // 为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭）
        }) => void
        fail?: () => void
        complete?: () => void
    })
}

type WXScopeValue = "scope.userInfo" | "scope.userLocation" | "scope.address" | "scope.invoiceTitle" | "scope.werun" | "scope.record" | "scope.writePhotosAlbum" | "scope.camera"

interface WXShareAPI {
    // 支持版本 >= 1.1.0
    // 显示当前页面的转发按钮
    showShareMenu(obj: {
        // 是否使用带 shareTicket 的转发详情	(默认 false)
        withShareTicket?: boolean,
    } & WXCommonObj)

    // 支持版本 >= 1.1.0
    // 隐藏转发按钮
    hideShareMenu(obj: WXCommonObj)

    // 获取更多转发信息
    // 通过 wx.updateShareMenu 接口可修改转发属性。如果设置 withShareTicket 为 true ，会有以下效果
    // 选择联系人的时候只能选择一个目标，不能多选
    // 消息被转发出去之后，在会话窗口中无法被长按二次转发
    // 消息转发的目标如果是一个群聊，则
    // 会在转发成功的时候获得一个 shareTicket
    // 每次用户从这个消息卡片进入的时候，也会获得一个 shareTicket，通过调用 wx.getShareInfo() 接口传入 shareTicket 可以获取群相关信息
    // 修改这个属性后，同时对主动转发和被动转发生效。

    // 支持版本 >= 1.2.0
    // 更新转发属性
    updateShareMenu(obj: {
        // 是否使用带 shareTicket 的转发
        withShareTicket: boolean,
    } & WXCommonObj)

    // 主动拉起转发，进入选择通讯录界面。
    shareAppMessage(obj: {
        title?: string,     // 转发标题，不传则默认使用当前小游戏的昵称。
        imageUrl?: string,  // 转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径。显示图片长宽比是 5:4
        query?: string,     // 查询字符串，从这条转发消息进入后，可通过 wx.getLaunchInfoSync() 或 wx.onShow() 获取启动参数中的 query。必须是 key1=val1&key2=val2 的格式。
    } & WXCommonObj)

    // 监听监听用户点击右上角菜单的“转发”按钮时触发的事件
    onShareAppMessage(cb: (res: {
        title: string,
        imageUrl: string,
        query: string,
    }) => void)

    // 取消监听监听用户点击右上角菜单的“转发”按钮时触发的事件
    offShareAppMessage(cb: Function)
}

interface WXOpenAPI {
    login(obj: {
        timeout?: number,
        success?: (res: { errMsg: string, code: string }) => void,
        fail?: WXCommonCallback,
        complete?: WXCommonCallback
    });

    checkSession(obj: {
        success?: WXCommonCallback,
        fail?: WXCommonCallback,
        complete?: WXCommonCallback,
    });

	/*
		scope.userInfo	wx.getUserInfo	用户信息
		scope.userLocation	wx.getLocation, wx.chooseLocation, wx.openLocation	地理位置
		scope.address	wx.chooseAddress	通讯地址
		scope.invoiceTitle	wx.chooseInvoiceTitle	发票抬头
		scope.werun	wx.getWeRunData	微信运动步数
		scope.record	wx.startRecord	录音功能
		scope.writePhotosAlbum	wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	保存到相册
		scope.camera	<camera />	摄像头	  
	 */
    authorize(obj: {
        scope: WXScopeValue,	// 必填	需要获取权限的scope，详见 scope 列表
        success?: (errMsg: string) => void,	// 选填	接口调用成功的回调函数
        fail?: () => void,	// 选填	接口调用失败的回调函数
        complete?: () => void,	// 选填	接口调用结束的回调函数（调用成功、失败都会执行）		
    })

    createUserInfoButton(obj: {
        type: "text" | "image"
        text: string
        image: string
        style: WXUserInfoButtonStyle
        withCredentials: boolean
        lang?: "en" | "zh_CN" | "zh_TW"
    }): WXUserInfoButton

    getUserInfo(obj: {
		/*
		注：当 withCredentials 为 true 时，要求此前有调用过 wx.login 且登录态尚未过期，
		此时返回的数据会包含 encryptedData, iv 等敏感信息；当 withCredentials 为 false 时，
		不要求有登录态，返回的数据不包含 encryptedData, iv 等敏感信息。
		** 是否带上登录态信息	1.1.0
		 */
        withCredentials?: boolean,
        // 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。默认为en。	1.3.0
        lang?: string,
        // 超时时间，单位 ms	1.9.90
        timeout?: number,
        success?: (res: {
            userInfo: WXUserInfoObject,
            rawData: string,
            signature: string,
            encryptedData: string,
            iv: string,
            [propName: string]: any
        }) => void,
        fail?: () => void,
        complete?: () => void,
    });

    // 基础库 1.2.0 开始支持
    getSetting(obj: { success?: (res: { authSetting: { [propName: string]: boolean } }) => void, fail?: () => void, complete?: () => void })
}

interface WXAppLaunchObj {
    path: string	    // 打开小程序的路径
    query: any		    // 打开小程序的query
    scene: number       // 打开小程序的场景值
    shareTicket: string // shareTicket，详见 获取更多转发信息
    referrerInfo: any   // 当场景为由从另一个小程序或公众号或App打开时，返回此字段
}

declare let wx: WXMergedAPI;

declare module "WXAPI" {
    export let wx: WXMergedAPI;
}
