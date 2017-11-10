/**
 * @file clue.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./distribute.css');

/* 加载页面 */
import listPage from './vue/list.vue';
import searchPage from './vue/search.vue';
import detailPage from './vue/detail.vue';
import personDeptPage from './vue/personDept.vue';

import notesListPage from '../public/components/notes/notes.vue';
import notesAddPage from '../public/components/notes/add.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: listPage
  },
  '/detailPage/:id/:isShowDistribute': {
    component: detailPage
  },
  '/searchPage': {
    component: searchPage
  },
  '/personDeptPage': {
    component: personDeptPage
  },
  '/notes/:id': {
    component: notesListPage
  },
  '/addNotes/:id': {
    component: notesAddPage
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
