/**
* @file
* @author hj
* @date 2016-11-25
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed;">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
      <h1 class="mui-title">{{currentHeader.title}}</h1>
    </header>
    <div class="mui-content" style="padding-top: 44px;">
      <div v-show="login.show" style="text-align: center;padding: 10px;">
        <input type="text" v-model="login.loginData.username" placeholder="账号"><br>
        <input type="password" v-model="login.loginData.password"><br>
        <button @tap="loginFn()">登录</button>
      </div>
      <div v-show="!login.show" style="text-align: center;padding: 10px;">
        <button @tap="logoutFn()">退出</button>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../login-store';
  import {FastClick} from 'fastclick';
  export default {
    components: {},
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '登录'
        },
        login: store.state
      };
    },
    methods: {
      loginFn: function () {
        store.login();
      },
      logoutFn: function () {
        store.logout();
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      FastClick.attach(document.body);
    }
  };
</script>
