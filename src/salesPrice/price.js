/**
 * @file price.js
 * @author hj
 * @date 2016-11-24
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./price.css');
require('../activity/activity.css');

/* 加载页面 */
import listPage from './vue/list.vue';
import searchPage from './vue/search.vue';
import searchOtherPage from './vue/searchOther.vue';
import detailPage from './vue/detail.vue';
import addPage from './vue/add.vue';
import editPage from './vue/edit.vue';
import selectPage from './vue/select.vue';
import customerPage from './vue/customer.vue';
import chancePage from './vue/chance.vue';
import productListPage from './vue/productList.vue';

import notesListPage from '../public/components/notes/notes.vue';
import notesAddPage from '../public/components/notes/add.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: listPage
  },
  '/searchPage': {
    component: searchPage
  },
  '/searchOtherPage': {
    component: searchOtherPage
  },
  '/selectPage/:param': {
    component: selectPage
  },
  '/selectPage/:param/:id': {
    component: selectPage
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
  '/addPage': {
    component: addPage
  },
  '/addPage/:localKey': {
    component: addPage
  },
  '/addProduct/:param': {
    component: productListPage
  },
  '/editPrice/:id': {
    component: editPage
  },
  '/customerPage/:param': {
    component: customerPage
  },
  '/chancePage/:param': {
    component: chancePage
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
