/**
 * @file product.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./product.css');

/* 加载页面 */
import listPage from './vue/list.vue';
import searchPage from './vue/search.vue';
import detailPage from './vue/detail.vue';
import classifyPage from './vue/classify.vue';
import classifyDetailPage from './vue/classifyDetail.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: listPage
  },
  '/detailPage/:productId': {
    component: detailPage
  },
  '/classify': {
    component: classifyPage
  },
  '/classifyDetail/:typeId': {
    component: classifyDetailPage
  },
  '/toSearch': {
    component: searchPage
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
