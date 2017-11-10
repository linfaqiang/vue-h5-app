/**
 * @file setting.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./feedback.css');
require('./feedback-page.css');

/* 加载页面 */
import settingPage from './vue/setting.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: settingPage
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
