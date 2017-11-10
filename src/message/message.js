/**
 * @file message.js
 * @author hj
 * @date 2016-11-17
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./message.css');

/* 加载页面 */
import listPage from './vue/list.vue';
import detailPage from './vue/detail.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: listPage
  },
  '/detailPage/:id': {
    component: detailPage
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
