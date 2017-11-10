/**
 * @file customer.js
 * @author hj
 * @date 2016-11-14
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./customer.css');

/* 加载页面 */
import listPage from './vue/list.vue';
import searchOtherPage from './vue/searchOther.vue';
import detailPage from './vue/detail.vue';
import personDeptPage from './vue/personDept.vue';

import notesListPage from '../public/components/notes/notes.vue';

import teamListPage from '../public/components/team/team.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: listPage
  },
  '/searchOtherPage': {
    component: searchOtherPage
  },
  '/detailPage/:id': {
    component: detailPage
  },
  '/personDeptPage': {
    component: personDeptPage
  },
  '/notes/:id/:isEdit': {
    component: notesListPage
  },
  '/teamPage/:id/:type/:isEdit': {
    component: teamListPage
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
