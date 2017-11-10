/**
 * @file home.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./calendar.css');

/* 加载页面 */
import calendarPage from './vue/list.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: calendarPage
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
