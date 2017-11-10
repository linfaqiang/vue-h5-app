/**
 * Created by huangjun on 16-4-25.
 * 原生API
 */
import Vue from 'vue';
import resource from 'vue-resource';
Vue.use(resource);

define(function (require, exports, module) {

  function getOSInfo() {
    var os = {};
    var ua = navigator.userAgent;
    var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
    if (wechat) {
      os.wechat = {
        version: wechat[2].replace(/_/g, '.')
      };
    }
    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    if (android) {
      os.android = true;
      os.version = android[2];
      os.isBadAndroid = !(
        /Chrome\/\d/.test(window.navigator.appVersion)
      );
    }
    var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    if (iphone) {
      os.ios = os.iphone = true;
      os.version = iphone[2].replace(/_/g, '.');
    } else if (ipad) {
      os.ios = os.ipad = true;
      os.version = ipad[2].replace(/_/g, '.');
    }
    if (/win|mac/i.test(navigator.platform)) {
      os.ios = false;
      os.android = false;
    }
    var uaWechat = navigator.userAgent.toLowerCase();
    if (uaWechat.match(/MicroMessenger/i) == 'micromessenger') {
      os.ios = false;
      os.android = false;
    }
    return os;
  }

  var os = getOSInfo();

  /**
   * 1.代理请求
   */
  var requestCount = 0;
  function crm_ajax(option) {
    option.type = option.type || 'post';
    var param = option.param;
    var arr = [];
    var flag = option.url.indexOf('.json') == (option.url.length - 5);
    if (option.type.toLowerCase() == 'get') {
      if (param) {
        for (var key in param) {
          arr.push(key + '=' + param[key])
        }
        if (arr.indexOf('isEncrypt=1') === -1) {
          arr.push('isEncrypt=0');
        }
      } else {
        arr.push('isEncrypt=0');
      }
      param = arr.join('&');
      /* 转义 */
      if (param) {
        if (os.ios) {
          param = encodeURI(encodeURI(param));
        } else if (os.android) {
          param = encodeURI(param);
        }
        if (option.url.indexOf('?') > -1) {
          option.url = option.url + '&' + param;
        } else {
          option.url = option.url + '?' + param;
        }
      }
      option.param = '';
    } else {
      if (param) {
        for (var key in param) {
          if (key == 'pageNo' || key == 'pageSize' || key == 'isEncrypt') {
            arr.push(key + '=' + param[key]);
          }
        }
        if (arr.indexOf('isEncrypt=1') === -1) {
          arr.push('isEncrypt=0');
        }
        if (arr.length > 0) {
          param = arr.join('&');
          option.url = option.url + (param ? ('?' + param) : '');
        }
      }
    }
    if (!option.param) {
      option.param = '';
    }
    console.log('接口路径=' + option.url, '接口参数=' + JSON.stringify(option.param));
    loading.show('努力加载中...');
    requestCount++;
    var funcName = 'requestFinish' + requestCount;
    var errorName = 'requestFinishError' + requestCount;
    var postData = {
      'header': {
        'content-Type': 'application/json'
      },
      'reqURL': option.url,
      'reqType': option.type,
      'body': option.param,
      'datas': '',
      'sCallback': funcName,
      'fCallback': errorName
    };
    if (option.isEncode) {
      funcName += 'encode';
    }
    window[funcName] = function (retData) {
      setTimeout(function () {
        loading.hide();
      }, 100);
      /* 请求成功 */
      if ('string' == typeof retData) {
        if (!(os.ios || os.android)) {
          retData = JSON.parse(retData).data || {};
        } else {
          retData = JSON.parse(retData) || {};
        }
      }
      retData.codeNum = retData.code;
      retData.code = parseInt(retData.code);
      /* 暂时修改 retData.isEncoded === 1 */
      if (retData.data && typeof retData.data == "string" && !isNum(retData.data)) {
        console.log('=======base64=======');
        retData.data = JSON.parse(new Base64().decode(retData.data) || '{}');
      }
      console.log('数据返回=' + JSON.stringify(retData));
      option.callback(retData);
    };
    window[errorName] = function (retData) {
      /* 请求失败 */
      setTimeout(function () {
        loading.hide();
      }, 100);
      if (typeof retData == 'string') {
        retData = JSON.parse(retData);
      }
      option.callback(retData);
    };
    postData.nativeDecode = 1;
    if (os.ios && !flag) {
      setTimeout(function () {
        var src = 'reqInterfaceProxy(' + JSON.stringify(postData) + ')';
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', src);
        iframe.setAttribute('style', 'display:none;');
        document.body.appendChild(iframe);
        setTimeout(function () {
          document.body.removeChild(iframe);
        }, 200);
      }, 50);
    } else if (os.android && !flag) {
      kndfunc.reqInterfaceProxy(JSON.stringify(postData));
    } else {
      Vue.http({
        headers: {},
        url: option.url,
        method: option.type,
        emulateJSON: option.emulateJSON || true,
        data: JSON.stringify(option.param)
        /* body */
      }).then(function (retData) {
        if (typeof retData == 'object') {
          retData = JSON.stringify(retData)
        }
        window[funcName](retData);
      }, function (retData) {
        window[errorName](retData);
      });
    }
  }

  function isNum(val) {
    var pattern = '^[0-9]*$';
    if (new RegExp(pattern).test(val)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 2.获取用户信息
   * 参数:无
   */
  function crm_getLoginInfo(param) {
    window['setLoginInfo'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      param.callback(result);
      window['setLoginInfo'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'setLoginInfo';
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      setTimeout(function () {
        var src = 'getLoginInfo(' + jsonParam + ')';
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', src);
        iframe.setAttribute('style', 'display:none;');
        document.body.appendChild(iframe);
        setTimeout(function () {
          document.body.removeChild(iframe);
        }, 200);
      }, 50);
    } else if (os.android) {
      kndfunc.getLoginInfo(jsonParam);
    } else {
      var resultdData = JSON.parse(localStorage.getItem('login_info_test') || '{}');
      if (resultdData && resultdData.loginName) {
        window['setLoginInfo']({
          'userName': resultdData.name,
          'staffId': resultdData.staffId,
          'loginName': resultdData.loginName,
          'imageAddress': resultdData.headPhotoUrl,
          'data': resultdData
        });
      } else {
        var locationHref = location.href;
        if (locationHref.indexOf('login/index.html') == -1) {
          mui.alert('请先登录！', '提示');
        }
      }
    }
  }

  /**
   * 3.拍照
   * 参数 json
   * 'apiJson': {
   *    'backType': '2', //1.表示只返回压缩图（不存本地）;2.表示只返回拍照生成的原图图片路径;3.表示返回压缩图和原图图片路径
   *    'wDivisor': '1024', //宽方向压缩的像素值
   *    'hDivisor': '780', //高方向压缩的像素值
   *    'uploadUrl': APIS.upload_file  //上传接口
   * }.
   * 'callback': function () {}
   * result: {'fId':'上传后附件ID', 'path':'上传后附件路径'}
   */
  function crm_goPhoto(param) {
    window['photoFinish'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      if (result.isUpload) {
        loading.show('正在上传...');
        return;
      }
      loading.hide();
      if (result.status == 'cancel') {
        window['photoFinish'] = null;
        return;
      }
      if (result.status == 1 || (result.code != 200 && param.apiJson.uploadUrl)) {
        mui.alert(result.msg || '上传失败，请重试！', '提示', function () {
        });
        window['photoFinish'] = null;
        return;
      }
      if (!result.fileUrl && (os.ios || os.android)) {
        window['photoFinish'] = null;
        return;
      }
      param.callback(result);
      window['photoFinish'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'photoFinish';
    jsonParam.fCallback = 'photoFinish';
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'goPhoto(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      capturefunc.goPhoto(jsonParam);
    } else {
      uploadFilePC({
        'url': JSON.parse(jsonParam).uploadUrl,
        onSend: function () {
          window['photoFinish']({
            'isUpload': true
          });
        },
        success: function (retData) {
          loading.hide();
          if ('string' == typeof retData) {
            retData = JSON.parse(retData);
          }
          window['photoFinish'](retData);
        },
        error: function () {
          loading.hide();
          mui.alert('上传失败！', '提示', function () {
          });
        }
      });
    }
  }

  /**
   * 4.相册
   * 参数 json
   * 'apiJson': {
   *    'backType': '2', //1.表示只返回压缩图（不存本地）;2.表示只返回拍照生成的原图图片路径;3.表示返回压缩图和原图图片路径
   *    'wDivisor': '1024', //宽方向压缩的像素值
   *    'hDivisor': '780', //高方向压缩的像素值
   *    'uploadUrl': APIS.upload_file  //上传接口
   * }.
   * 'callback': function () {}
   * result: {'fId':'上传后附件ID', 'path':'上传后附件路径'}
   */
  function crm_fromImgLibrary(param) {
    window['photoFinish'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      if (result.isUpload) {
        loading.show('正在上传...');
        return;
      }
      loading.hide();
      if (result.status == 'cancel') {
        window['photoFinish'] = null;
        return;
      }
      if (result.status == 1 || (result.code != 200 && param.apiJson.uploadUrl)) {
        mui.alert(result.msg || '上传失败，请重试！', '提示', function () {
        });
        window['photoFinish'] = null;
        return;
      }
      if (!result.fileUrl && (os.ios || os.android)) {
        window['photoFinish'] = null;
        return;
      }
      param.callback(result);
      window['photoFinish'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'photoFinish';
    jsonParam.fCallback = 'photoFinish';
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'fromImgLibrary(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      capturefunc.fromImgLibrary(jsonParam);
    } else {
      uploadFilePC({
        'url': JSON.parse(jsonParam).uploadUrl,
        onSend: function () {
          window['photoFinish']({
            'isUpload': true
          });
        },
        success: function (retData) {
          loading.hide();
          if ('string' == typeof retData) {
            retData = JSON.parse(retData);
          }
          window['photoFinish'](retData);
        },
        error: function () {
          loading.hide();
          mui.alert('上传失败！', '提示', function () {
          });
        }
      });
    }
  }

  /**
   * 5.录音
   * 参数 json
   * 'apiJson': {
   *    'uploadUrl': APIS.upload_file  //上传接口
   * }.
   * 'callback': function () {}
   * result: {'fId':'上传后附件ID', 'path':'上传后附件路径'}
   */
  function crm_goRecord(param) {
    window['videoFinish'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      if (result.isUpload) {
        loading.show('正在上传...');
        return;
      }
      loading.hide();
      if (result.status == 'cancel') {
        /* 取消，不处理 */
        window['videoFinish'] = null;
        return;
      }
      if (result.status == 1 || (result.code != 200 && param.apiJson.uploadUrl)) {
        mui.alert(result.msg || '上传失败，请重试！', '提示', function () {
        });
        window['videoFinish'] = null;
        return;
      }
      if (!result.fileUrl && (os.ios || os.android)) {
        window['videoFinish'] = null;
        return;
      }
      var recordTime = (parseFloat(result.recordTime)).toFixed(1);
      if (recordTime > 60) {
        var m = parseInt(recordTime / 60);
        var s = parseInt(recordTime % 60);
        recordTime = m + '′' + s + '″';
      } else {
        recordTime = recordTime + '″';
      }
      result.recordTime = recordTime;
      param.callback(result);
      window['videoFinish'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'videoFinish';
    jsonParam.fCallback = 'videoFinish';
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'goRecord(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      recordingfunc.goRecord(jsonParam);
    } else {
      uploadFilePC({
        'url': JSON.parse(jsonParam).uploadUrl,
        onSend: function () {
          window['videoFinish']({
            'isUpload': true
          });
        },
        success: function (retData) {
          loading.hide();
          if ('string' == typeof retData) {
            retData = JSON.parse(retData);
          }
          retData.recordTime = 2;
          window['videoFinish'](retData);
        },
        error: function () {
          loading.hide();
          mui.alert('上传失败！', '提示', function () {
          });
        }
      });
    }
  }

  /**
   * 6.播放录音
   * 支持先下载，然后播放
   * 参数 json
   * 'apiJson': {
   *    'recordPath': '/record/abc.wmv'  //语音路径
   * }
   */
  function crm_openRecord(param) {
    var jsonParam = param.apiJson || {};
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'openRecord(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      recordingfunc.openRecord(jsonParam);
    }
  }

  /**
   * 7.语音录入
   * 参数 null
   * result: {'result': '识别后的内容'}
   */
  function crm_cloundVol(param) {
    window['cloundVolFinish'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      param.callback(result);
      window['cloundVolFinish'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'cloundVolFinish';
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'cloundVol(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      cloundvolfunc.cloundVol(jsonParam);
    }
  }

  /**
   * 8.名片扫描
   * 参数: null
   * result: {'fId':'名片上传后的ID','name':'姓名', 'address':'地址','email':'邮箱','tel':'手机或电话','duty':'职务','company':'公司名称'}
   */
  function crm_bcardScan(param) {
    window['scanFinish'] = function (result) {
      if (os.ios) {
        result = decodeURI(result);
      }
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      if (result.isUpload) {
        loading.show('正在解析...');
        return;
      }
      loading.hide();
      if (result.status == 'cancel') {
        window['scanFinish'] = null;
        return;
      }
      if (result.status == 1 || (result.code != 200 && param.apiJson.uploadUrl)) {
        mui.alert('解析失败，请重试！', '提示', function () {
        });
        window['scanFinish'] = null;
        return;
      }
      param.callback(result);
      window['scanFinish'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'scanFinish';
    jsonParam.fCallback = 'scanFinish';
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'bcardScan(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.bcardScan(jsonParam);
    } else {
      window['scanFinish'](JSON.stringify({
        'code': 200,
        'fId': '1402',
        'fileUrl': 'http://192.168.8.24:8080/uf/2016/06/19/1466325193009_t.png',
        'address': '深圳市南山区高新南一道深圳市南山区高新南一道()深圳市宝安区',
        'email': 'luoi@coracle.com',
        'company': '深圳市前海圆舟科技股份有限公司',
        'mobile': '18954867254',
        'tel': '8675523982505',
        'name': '华晃'
      }));
    }
  }

  /**
   * 9.查询手机通讯录
   * 应用 联系人联系人快捷新建
   * 参数 json
   * 'apiJson': {
   *    'phone': phone,
   *    'name': name //2个参数只能一个有值
   *  },
   *  callback: function () {}
   *  result: [{'name':'','phone':''}]
   */
  function crm_getContacts(param) {
    window['contactsFinish'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      param.callback(result);
      window['contactsBack'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'contactsFinish';
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'getContacts(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.getContacts(jsonParam);
    } else {
      param.callback([
        {
          'name': '肖磊',
          'phone': '132554764646'
        },
        {
          'name': '王兰芳',
          'phone': '13693083972'
        },
        {
          'name': '李四',
          'phone': '13693224881'
        },
        {
          'name': '王五',
          'phone': '15645345654'
        }
      ]);
    }
  }

  /**
   * 10.打开地图，显示经纬度位置与当前位置
   * 支持 导航
   * 一般不用 见api11
   */
  function crm_showMap(param) {
    var jsonParam = param.apiJson || {};
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'showMap(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.showMap(jsonParam);
    }
  }

  /**
   * 11.位置纠偏
   * 参数: json
   * 'apiJson': {
   *    'longitude': '', //经度
   *    'latitude': '', //纬度
   *    'title': '', //显示的名称
   *    'address': '', //显示的地址
   *    'showMap': '' //true为只显示地图可以导航,没有返回值;false为对地址进行修改,有返回值
   * },
   * callback: function () {}
   * result: {'address':'全地址','province':'省份','city':'城市','district':'区县','cityCode':'cityCode','adcode':'adcode','longitude':'经度','latitude':'纬度'}
   */
  function crm_correctLocation(param) {
    window['correctLocationFinish'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      param.callback(result);
      window['contactsBack'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'correctLocationFinish';
    if (!jsonParam.showMap) {
      jsonParam.showMap = false;
    }
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'correctLocation(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.correctLocation(jsonParam);
    } else {
      window['correctLocationFinish']({
        'address': '广东省深圳市福田中心区卓越大厦2202室',
        'province': '广东',
        'city': '深圳',
        'district': '福田区',
        'cityCode': '0755',
        'adcode': '440304',
        'longitude': '114.057782',
        'latitude': '22.543597'
      });
    }
  }

  /**
   * 12.打电话
   * 参数 json
   * 'apiJson': {
   *    'phoneNum': '' //电话号码
   * }
   * result: null
   */
  function crm_openPhone(param) {
    var jsonParam = param.apiJson || {};
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'openPhone(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.openPhone(jsonParam);
    } else {
      console.log('打电话', JSON.parse(jsonParam).phoneNum);
    }
  }

  /**
   * 13.发短信
   * 参数 json
   * 'apiJson': {
   *    'phoneNum': '' //电话号码
   * }
   * result: null
   */
  function crm_opneMsg(param) {
    var jsonParam = param.apiJson || {};
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'opneMsg(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.opneMsg(jsonParam);
    }
  }

  /**
   * 14.发邮件
   * 参数 json
   * 'apiJson': {
   *    'recemail': '', //邮箱
   *    'emailtitle': '', //邮件标题
   *    'emailcontent': '',//邮件内容
   *    'isHtml': '', //是不是有html代码的内容
   *    'attachmentName': '', //图片名称
   *    'attachmentBase64': '' //图片base64
   * }
   * result: null
   */
  function crm_openEmail(param) {
    var jsonParam = param.apiJson || {};
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'openEmail(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.openEmail(jsonParam);
    }
  }

  /**
   * 15.返回前一个webView
   * 参数 json/null
   * 'apiJson': {
   *    'fn': '', //当前功能标示
   *    'callFun': '', //返回到上一个webView时,需要调用的function的名称, 注:安卓需要配合goView中的参数isTrue=true才能实现
   *    'param': {} //上一个参数的参数
   * }
   * result null
   */
  function crm_goNative(param) {
    param = param || {};
    var jsonParam = param.apiJson;
    jsonParam = jsonParam ? JSON.stringify(jsonParam) : '';
    if (os.ios) {
      setTimeout(function () {
        var src = 'goNative(' + jsonParam + ')';
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', src);
        iframe.setAttribute('style', 'display:none;');
        document.body.appendChild(iframe);
        setTimeout(function () {
          document.body.removeChild(iframe);
        }, 200);
      }, 50)
    } else if (os.android) {
      kndfunc.goNative(jsonParam);
    } else {
      jsonParam = JSON.parse(jsonParam || '{}');
      if (jsonParam.callFun && typeof window.parent[jsonParam.callFun] === 'function') {
        window.parent[jsonParam.callFun](jsonParam.param);
      }
      window.parent.closeIframe(jsonParam.fn);
    }
  }

  /**
   * 16.附件上传
   * PC 模拟附件上传
   */
  var frameCount = 0;
  function uploadFilePC(potions) {
    document.querySelector('#uploadPc') && document.querySelector('#uploadPc').remove();
    var frag = document.createDocumentFragment();
    var $form = document.createElement('form');
    $form.setAttribute('id', 'uploadPc');
    $form.setAttribute('action', potions.url);
    $form.setAttribute('method', 'post');
    $form.setAttribute('enctype', 'multipart/form-data');
    $form.style.display = 'none';
    var $input = document.createElement('input');
    $input.setAttribute('id', 'uploadFiles');
    $input.setAttribute('name', 'file');
    $input.setAttribute('type', 'file');
    $form.appendChild($input);
    frag.appendChild($form);
    document.body.appendChild(frag);
    $input.addEventListener('change', function () {
      fileUpload();
    });
    $input.click();
    return;

    function fileUpload() {
      var fileValue = $input.value;
      // var imgExt = fileValue.substring(fileValue.lastIndexOf('.'), fileValue.length);
      var imgSize = document.getElementById('uploadFiles').files[0].size / 1024;
      if (!fileValue) {
        return;
      }
      /* if ('.jpg|.jpeg|.gif|.bmp|.png|'.indexOf(imgExt.toLocaleLowerCase() + '|') == -1) {
       mui.alert('上传图片格式不正确，请重新上传！', '提示', function(){});
       return;
       }*/
      if (!(imgSize > 0 && imgSize <= 2048)) {
        potions.error();
        return;
      }
      var form = $form;
      var id = 'jqFormIO' + frameCount++;
      var $io = document.createElement('iframe');
      $io.setAttribute('id', id);
      $io.setAttribute('name', id);
      $io.style.position = 'absolute';
      $io.style.top = '-1000px';
      $io.style.left = '-1000px';
      var io = $io;
      setTimeout(function () {
        document.body.appendChild($io);
        $io.attachEvent ? $io.attachEvent('onload', cb) : $io.addEventListener('load', cb, false);
        // var encAttr = form.encoding ? 'encoding' : 'enctype';
        var t = $form.getAttribute('target');
        $form.setAttribute('target', id);
        $form.setAttribute('method', 'POST');
        $form.setAttribute('encAttr', 'multipart/form-data');
        $form.setAttribute('action', potions.url);
        potions.onSend();
        form.submit();
        $form.setAttribute('target', t); // reset target
      }, 10);

      function cb() {
        io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);
        var ok = true;
        try {
          var data, doc;
          doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;
          data = doc.body ? doc.body.innerText : null;
          if (potions.dataType === 'json') {
            data = JSON.parse(data) || {};
          }
        } catch (e) {
          ok = false;
        }

        if (ok) {
          if (data) {
            console.log('===上次结果===' + data);
            potions.success(data);
          } else {
            potions.error();
          }
        } else {
          potions.error();
        }
        setTimeout(function () {
          $io.remove();
          $form.remove();
        }, 100);
      }
    }
  }

  /**
   * 17.导出到通讯录
   * 需要导出5个字段到通讯录：姓名、职位、手机、座机、公司
   * 参数 json
   * 'apiJson': {
   *    'id': '',
   *    'name': '', //姓名
   *    'mobile': '', //手机号码
   *    'phone': '', //座机号码
   *    'duty': '', //职务
   *    'customer': '' //公司
   * }
   */
  function crm_insertContact(param) {
    window['insertConFinish'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      param.callback(result);
      window['insertConFinish'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'insertConFinish';
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'insertContact(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.insertContact(jsonParam);
    }
  }

  /**
   * 18.查看附件
   * 参数 json
   * 'apiJson': {
   *    'type': '', //文件格式:IMAGE(图片)/AUDIO(音频)/TEXT(文档)/OFFICE(办公,如pdf/ppt,doc,xls等)/WEBSITE(网页,如:html/jsp/php等)/INSTALL(apk等)/ZIP
   *    'fileName': '',
   *    'fileID': '',
   *    'filePath': ''
   * }
   */
  function crm_openFile(param) {
    var jsonParam = param.apiJson || {};
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'openFile(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      accessoryfunc.openFile(jsonParam);
    }
  }

  /**
   * 19.下载附件
   */
  function crm_goDownload(param) {
    window['downLoadFinish'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      param.callback(result);
      window['downLoadFinish'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'downLoadFinish';
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'goDownload(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.goDownload(jsonParam);
    } else {
      console.log('==========下载==========');
    }
  }

  /**
   * 20.获取当前位置
   * 参数 json
   * callback: function () {}
   * result: 见api11的返回
   */
  function crm_getQDLocationInfo(param) {
    loading.show('地址获取中...');
    window['getQDLocationInfoFinish'] = function (result) {
      loading.hide();
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      if (result.notOpenLocation == 1) {
        mui.alert('定位服务当前可能尚未打开，请设置打开！', '提示');
        window['getQDLocationInfoFinish'] = null;
        return;
      } else if (result.msg) {
        mui.alert(result.msg, '提示');
        window['getQDLocationInfoFinish'] = null;
        return;
      }
      param.callback(result);
      window['getQDLocationInfoFinish'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'getQDLocationInfoFinish';
    jsonParam.fCallback = 'getQDLocationInfoFinish';
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'getQDLocationInfo(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.getQDLocationInfo(jsonParam);
    } else {
      window['getQDLocationInfoFinish']({
        'address': '深圳市南山区高新南一道',
        'province': '广东',
        'city': '深圳',
        'district': '南山区',
        'adcode': '440305',
        'cityCode': '0755',
        'longitude': '113.954465',
        'latitude': '22.544644'
      });
    }
  }

  /**
   * 21.打开新的webView，并跳用新webView中页面上的funtion
   * 参数 json
   * 'apiJson': {
   *    'isTrue': true, //配合api15的参数callFun一起用
   *    'urlPort': '', //路由路径 如:activity/index.html#!/detailPage/customer_activity_detail
   *    'function': '' //功能名称 如:activity
   * }
   */
  function crm_goView(param) {
    var jsonParam = param.apiJson || {};
    jsonParam.param = jsonParam.param || '';
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'goView(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.goView(jsonParam);
    } else {
      var href = window.location.protocol + '//' + window.location.host + '/' + JSON.parse(jsonParam).urlPort;
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', href);
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('id', 'work-content-' + JSON.parse(jsonParam).function);
      iframe.setAttribute('class', 'module');
      iframe.setAttribute('style', 'position:absolute;top:5%;left:5%;height:90%;width:90%;z-index:100;border:0;');
      document.body.appendChild(iframe);
      var opacityDiv = document.createElement('div');
      opacityDiv.setAttribute('id', 'background-opacity-' + JSON.parse(jsonParam).function);
      opacityDiv.setAttribute('style', 'position: absolute;top: 0;eft: 0;width: 100%;height: 100%;background: #000;opacity:0.4;z-index: 99;');
      document.body.appendChild(opacityDiv);
    }
  }

  window["closeIframe"] = function (func) {
    var ele = document.getElementById('work-content-' + func);
    if (ele) {
      document.body.removeChild(ele);
      document.body.removeChild(document.getElementById('background-opacity-' + func));
    }
  };

  /**
   * 22.语音录入到输入框
   * 在虚拟键盘的上访有一个语音录入按钮
   * 参数: json
   * callback: function () {}
   * result: {'result': '语音录入的值'}
   */
  function crm_showKeyboard(param) {
    window['showKeyboardFinish'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      param.callback(result);
      window['showKeyboardFinish'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'showKeyboardFinish';
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'showKeyboard(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.showKeyboard(jsonParam);
    } else {
      console.log('键盘＝＝＝＝＝＝')
    }
  }

  /**
   * 23.隐藏键盘
   * 没有用到
   */
  function crm_hideKeyboard() {
    if (os.ios) {
      var src = 'hideKeyboard()';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.hideKeyboard();
    }
  }

  /**
   * 24.查看通讯录详情
   * 参数 json
   * 'apiJson': {
   *    'userId': '' //员工ID
   * }
   */
  function crm_checkBook(param) {
    var jsonParam = param.apiJson || {};
    jsonParam = JSON.stringify(jsonParam);
    if (os.ios) {
      var src = 'checkBook(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else if (os.android) {
      kndfunc.checkBook(jsonParam);
    } else {
      console.log('通讯录＝＝＝＝＝＝')
    }
  }

  /**
   * 25.返回搜索客户数据 客户地图
   * 参数 json
   * 'apiJson': {
   *   'id': data.id, // 客户ID
   *   'name': data.name,  // 客户名称
   *   'address': data.address,  // 客户地址
   *   'longitude': data.longitude,  // 客户经度
   *   'latitude': data.latitude,  // 客户纬度
   *   'adcode': data.adcode,  // 客户adcode
   *   'cityCode': data.cityCode,  // 客户cityCode
   *   'ownerStaffMobile': data.ownerStaffMobile,  // 客户负责人手机号码
   *   'ownerStaffName': data.ownerStaffName,  // 客户负责人姓名
   *   'canView': data.canView  // 客户 有否有权限
   * },
   * callback: function () {}
   * result : null
   */
  function crm_setCustomerData(param) {
    window['setCustomerDataFinish'] = function () {
      param.callback();
      window['setCustomerDataFinish'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'setCustomerDataFinish';
    jsonParam = JSON.stringify(jsonParam);
    if (os.android) {
      kndfunc.setAccountData(jsonParam);
    } else if (os.ios) {
      var src = 'setAccountData(' + jsonParam + ')';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else {
      console.log('返回搜索后的客户数据' + JSON.stringify(jsonParam));
    }
  }

  /**
   * 26.本地数据库 批量插入 500一页（sqlite只支持一次批量插入500）
   * 参数 json
   * 'apiJson': {
   *    'sql': '' //sql语句,安卓:["insert into contact(dbId, name, mobile) values('', '', '')", "insert into contact(dbId, name, mobile) values('', '', '')"],
   *                      sqlite: 'insert into contact(dbId, name, mobile) values('', '', ''),('', '', '');'
   * },
   * callback: function () {}
   */
  function crm_executeSqls(param) {
    window['executesFinish'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      param.callback(result);
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'executesFinish';
    if (os.android) {
      sqLitefunc.executeSqls(JSON.stringify(jsonParam));
    } else {
      /* ios与pc用sqLite */
      window.$sqlite.db.query(jsonParam.sql, function (result) {
        window['executesFinish'](result);
      });
    }
  }

  /**
   * 27.本地数据库 单调语句运行
   * 参数 json
   * 'apiJson': {
   *    'sql': 'delete from contact' //sql语句
   * },
   * callback: function () {}
   * result : ''
   */
  function crm_execute(param) {
    window['executeFinish'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      param.callback(result);
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'executeFinish';
    if (os.android) {
      sqLitefunc.execute(JSON.stringify(jsonParam));
    } else {
      /* ios与pc用sqLite */
      window.$sqlite.db.query(jsonParam.sql, function (result) {
        window['executeFinish'](result);
      });
    }
  }

  /**
   * 27.本地数据库 查询
   * 参数 json
   * 'apiJson': {
   *    'sql': 'select dbId, name from contact' //sql语句
   * },
   * callback: function () {}
   * result : [{'dbId': '', 'name': ''}]
   */
  function crm_executeQuery(param) {
    window['executeQueryFinish'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      param.callback(result);
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'executeQueryFinish';
    if (os.android) {
      sqLitefunc.executeQuery(JSON.stringify(jsonParam));
    } else {
      /* ios与pc用sqLite */
      window.$sqlite.db.query(jsonParam.sql, function (result) {
        window['executeQueryFinish'](result);
      });
    }
  }

  /**
   * 28.时间控件
   * 参数 json
   * 'apiJson': {
   *    'format': '', //时间格式 如:'yyyy','yyyy-MM','HH:mm','yyyy-MM-dd HH:mm'
   *    'initDTime': '', //默认选中时间
   *    'minInterval': '' //间隔分钟数 , 能被60整除 如:5/10/20
   * }
   */
  function crm_setKndTime(param) {
    window['setKndTimeFinish'] = function (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
      param.callback(result);
      window['setKndTimeFinish'] = null;
    };
    var jsonParam = param.apiJson || {};
    jsonParam.sCallback = 'setKndTimeFinish';
    var endYear = new Date().getFullYear() + 10;
    if (!jsonParam.kndMinTime) {
      jsonParam.kndMinTime = '1900-01-01';
    }
    if (!jsonParam.kndMaxTime) {
      jsonParam.kndMaxTime = endYear + '-12-30';
    }
    jsonParam = JSON.stringify(jsonParam);
    if (os.android) {
      calendarfunc.setKndTime(jsonParam);
    } else if (os.ios) {
      var src = 'setKndTime(' + jsonParam + ')',
        iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('style', 'display:none;');
      document.body.appendChild(iframe);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 200);
    } else {
      jsonParam = JSON.parse(jsonParam);
      var dateType = 'date';
      if (jsonParam.format == 'yyyy') {
        dateType = 'year';
      } else if (jsonParam.format == 'yyyy-MM') {
        dateType = 'month';
      } else if (jsonParam.format == 'HH:mm') {
        dateType = 'time';
      } else if (jsonParam.format == 'yyyy-MM-dd HH:mm') {
        dateType = '';
      }
      var pickerParam = {
        'type': dateType,
        'value': jsonParam.initDTime,
        'beginYear': '1900',
        'endYear': endYear,
      }
      var picker = new mui.DtPicker(pickerParam);
      var self = this;
      picker.show(function (rs) {
        var dateResult = rs.text;
        if (jsonParam.format == 'yyyy') {
          dateResult = new Date(dateResult).getFullYear();
        }
        window['setKndTimeFinish']({
          'result': dateResult
        });
        picker.dispose();
      });
    }
  }


  /**非空判断**/
  function isNotNull(value) {
    if (value == undefined || value == null || value.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 替换特殊字符
   * @param val
   */
  function replaceAllCh(val, type) {
    if (!val) {
      return '';
    }
    if (type) {
      /* val = val.replace(/x0a/g, '\n').replace(/@#$/g, '\\');*/
    } else {
      val = val.replace(/\\/g, '/');
    }
    return val;
  }

  /*
   * 加载中
   *
   * */
  var loading = {
    show: function (title) {
      var oDiv = document.getElementById('loading');
      oDiv.setAttribute('style', 'display: block;');
      var oTitle = document.getElementById('loading_title');
      oTitle.innerText = title;
      document.getElementById('loadingDelete').addEventListener('click', function () {
        loading.hide();
      });
    },
    hide: function () {
      try {
        var oDiv = document.getElementById('loading');
        oDiv.setAttribute('style', 'display: none;');
      } catch (e) {
      }
    }
  };

  /**
   *
   *  Base64 encode / decode
   *
   *  @author haitao.tu
   *  @date   2010-04-26
   *  @email  tuhaitao@foxmail.com
   *
   */
  function Base64() {

    // private property
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
      var output = '';
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      input = _utf8_encode(input);
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output = output +
          _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
          _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
      }
      return output;
    }

    // public method for decoding
    this.decode = function (input) {
      var output = '';
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
      while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      output = _utf8_decode(output);
      return output;
    }

    // private method for UTF-8 encoding
    var _utf8_encode = function (string) {
      string = string.replace(/\r\n/g, '\n');
      var utftext = '';
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }

      }
      return utftext;
    }

    // private method for UTF-8 decoding
    var _utf8_decode = function (utftext) {
      var string = '';
      var i = 0;
      var c = 0;
      var c1 = 0;
      var c2 = 0;
      var c3 = 0;
      while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if ((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
    }
  }

  /*
   * 标准版 1
   * 升级版 0
   * 高级版 0
   * */
  var edition = 0;
  function setFuncList(func) {
    var lists = [];
    var arrLists = [];
    var standard = [[], ['chance', 'cluesManage', 'salesPrice']];
    if (func === 'customer') {
      lists = [
        {
          icon: 'crm-sales-activities',
          name: '活动',
          function: 'activity',
          page: 'toAdd',
          param: {}
        },
        {
          icon: 'crm-icon-task',
          name: '任务',
          function: 'taskManage',
          page: 'toAdd',
          param: {}
        },
        {
          icon: 'crm-sales-opportunities',
          name: '商机',
          page: 'toAdd',
          function: 'chance',
          param: {}
        },
        {
          icon: 'crm-icon-con',
          name: '联系人',
          page: 'toAdd',
          function: 'contact',
          param: {}
        },
        {
          icon: 'crm-icon-clue',
          name: '线索',
          page: 'toAdd',
          function: 'cluesManage',
          param: {}
        }
      ];
    } else if (func === 'chance') {
      lists = [
        {
          icon: 'crm-sales-activities',
          name: '活动',
          function: 'activity',
          page: 'toAdd',
          param: {}
        },
        {
          icon: 'crm-icon-task',
          name: '任务',
          function: 'taskManage',
          page: 'toAdd',
          param: {}
        },
        {
          icon: 'crm-icon-product',
          name: '产品',
          type: 'back',
          function: 'product'
        },
        {
          icon: 'crm-icon-sales',
          name: '报价',
          function: 'salesPrice',
          page: 'toAdd',
          param: {}
        },
        {
          icon: 'crm-icon-rival',
          name: '竞争对手',
          type: 'back',
          function: 'rival'
        },
        {
          icon: 'crm-icon-con',
          name: '联系人',
          type: 'back',
          function: 'contact'
        }
      ];
    } else if (func === 'market') {
      lists = [{
        icon: 'crm-icon-clues',
        name: '线索',
        function: 'cluesManage',
        page: 'toAdd',
        param: {
          'id': ''
        }
      }, {
        icon: 'crm-icon-chance',
        name: '商机',
        function: 'chance',
        page: 'toAdd',
        param: {
          'id': ''
        }
      }, {
        icon: 'crm-task',
        name: '任务',
        function: 'taskManage',
        page: 'toAdd',
        param: {
          'id': '',
          'sourceFun': 'market'
        }
      }, {
        icon: 'crm-clues',
        name: '日程',
        function: 'schedule',
        page: 'toAddSchedule',
        param: {
          'id': ''
        }
      }];
    }
    for (var i = 0; i < lists.length; i++) {
      if (standard[edition].indexOf(lists[i].function) === -1) {
        arrLists.push(lists[i]);
      }
    }
    return arrLists;
  }

  var nativeApi = {
    initAjax: crm_ajax,
    goNative: crm_goNative,
    getLoginInfo: crm_getLoginInfo,
    goPhoto: crm_goPhoto,
    fromImgLibrary: crm_fromImgLibrary,
    goRecord: crm_goRecord,
    openRecord: crm_openRecord,
    cloundVol: crm_cloundVol,
    bcardScan: crm_bcardScan,
    getContacts: crm_getContacts,
    showMap: crm_showMap,
    correctLocation: crm_correctLocation,
    openPhone: crm_openPhone,
    opneMsg: crm_opneMsg,
    openEmail: crm_openEmail,
    insertContact: crm_insertContact,
    openFile: crm_openFile,
    goDownload: crm_goDownload,
    getQDLocationInfo: crm_getQDLocationInfo,
    goView: crm_goView,
    showKeyboard: crm_showKeyboard,
    hideKeyboard: crm_hideKeyboard,
    checkBook: crm_checkBook,
    setCustomerData: crm_setCustomerData,
    loading: loading,
    executeSqls: crm_executeSqls,
    execute: crm_execute,
    executeQuery: crm_executeQuery,
    setKndTime: crm_setKndTime,
    replaceAllCh: replaceAllCh,
    setFuncList: setFuncList,
    edition: edition
  };

  module.exports = nativeApi;

  window.nativeApi = nativeApi;

});
