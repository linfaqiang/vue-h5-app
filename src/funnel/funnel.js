/**
 * @file funnel.js
 * @author hj
 * @date 2016-11-23
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./funnel.css');

/* 加载页面 */
import chartPage from './vue/chart.vue';
import selectPage from './vue/select.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: chartPage
  },
  '/select-p/:param': {
    component: selectPage
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
