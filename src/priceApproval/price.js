/**
 * @file price.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./price.css');

/* 加载页面 */
import listPage from './vue/list.vue';
import searchPage from './vue/search.vue';
import detailPage from './vue/detail.vue';

import notesListPage from '../public/components/notes/notes.vue';
import notesAddPage from '../public/components/notes/add.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: listPage
  },
  '/searchOtherPage': {
    component: searchPage
  },
  '/detailPage': {
    component: detailPage
  },
  '/detailPage/:localKey': {
    component: detailPage
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
