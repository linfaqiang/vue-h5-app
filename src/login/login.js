/**
 * @file login.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载页面 */
import listPage from './vue/list.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: listPage
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
