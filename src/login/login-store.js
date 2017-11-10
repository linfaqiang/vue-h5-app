/**
 * @file  数据中转站
 * @author  hj
 */
// 引入数据请求API
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');

export default {
  state: {
    loginData: {
      username: 'test',
      password: '123456'
    },
    show: true
  },
  login: function () {
    var self = this;
    nativeApi.initAjax({
      'type': 'get',
      'url': APIS.api_login,
      'param': self.state.loginData,
      callback: function (result) {
        if (result && result.code === 200) {
          localStorage.setItem('login_info_test', JSON.stringify(result.data));
          // self.state.show = false;

          // login admin
          nativeApi.initAjax({
            'type': 'post',
            'url': APIS.admin_login + '?username=' + self.state.loginData.username + '&password=' + self.state.loginData.password + '&remember=true',
            callback: function (result) {
              if (result && result.status === true) {
                self.state.show = false;
              } else {
                mui.alert('登录失败' || result.msg, '提示');
              }
            }
          });// end login admin
        } else {
          mui.alert('登录失败' || result.msg, '提示');
        }
      }
    });
  },
  logout: function () {
    var self = this;
    nativeApi.initAjax({
      'type': 'get',
      'url': APIS.logout,
      'param': '',
      callback: function (result) {
        if (result && result.code === 200) {
          localStorage.removeItem('login_info');
          self.state.show = true;
        } else {
          mui.alert('登录失败' || result.msg, '提示');
        }
      }
    });
  }
};
