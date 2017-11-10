/**
 * @file plan.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./plan.css');

/* 加载页面 */
import listPage from './vue/list.vue';
import addPage from './vue/add.vue';
import editPage from './vue/edit.vue';
import searchPage from './vue/search.vue';
import detailPage from './vue/detail.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: listPage
  },
  '/salesPlans-add': {
    component: addPage
  },
  '/salesPlans-edit': {
    component: editPage
  },
  '/sales-select': {
    component: searchPage
  },
  '/salesPlans-detail/:id': {
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
