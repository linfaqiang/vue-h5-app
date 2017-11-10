/**
 * @file activity.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./contact.css');

/* 加载页面 */
import listPage from './vue/list.vue';
import detailPage from './vue/detail.vue';
import searchPage from './vue/search.vue';
import addPage from './vue/add.vue';
import editPage from './vue/edit.vue';
import customerPage from './vue/customer.vue';
import selectPage from './vue/select.vue';

import notesListPage from '../public/components/notes/notes.vue';
import notesAddPage from '../public/components/notes/add.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: listPage
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
  },
  '/searchPage/:type': {
    component: searchPage
  },
  '/addPage/:key/:scan': {
    component: addPage
  },
  '/addPage/:localKey': {
    component: addPage
  },
  '/nativeAdd/:fromNative': {
    component: addPage
  },
  '/editPage/:id': {
    component: editPage
  },
  '/selectPage/:param': {
    component: selectPage
  },
  '/customerPage/:param': {
    component: customerPage
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
