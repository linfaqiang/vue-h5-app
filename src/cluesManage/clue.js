/**
 * @file clue.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./clue.css');

/* 加载页面 */
import listPage from './vue/list.vue';
import searchPage from './vue/search.vue';
import selectPage from './vue/select.vue';
import detailPage from './vue/detail.vue';
import addPage from './vue/add.vue';
import editPage from './vue/edit.vue';
import addChancePage from './vue/addChance.vue';
import customerPage from './vue/customer.vue';
import followAddPage from './vue/followAdd.vue';
import followDetailPage from './vue/followDetail.vue';
import personPage from './vue/person.vue';

import notesListPage from '../public/components/notes/notes.vue';
import notesAddPage from '../public/components/notes/add.vue';

import empPage from '../public/components/employee/index.vue';
import empDepPage from '../public/components/employee/dept-list.vue';
import empParsonPage from '../public/components/employee/person-list.vue';

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
  '/select': {
    component: selectPage
  },
  '/my-search': {
    component: searchPage
  },
  '/personPage': {
    component: personPage
  },
  '/edit': {
    component: editPage
  },
  '/addChance/:id': {
    component: addChancePage
  },
  '/customerPage/:param': {
    component: customerPage
  },
  '/add-clue': {
    component: addPage
  },
  '/addPage/:localKey': {
    component: addPage
  },
  'nativeAdd/:fromNative': {
    component: addPage
  },
  '/selectPage/:param': {
    component: selectPage
  },
  'followAddPage': {
    component: followAddPage
  },
  '/followRecDetail/:id': {
    component: followDetailPage
  },
  '/notes/:id/:isEdit': {
    component: notesListPage
  },
  '/addNotes/:id': {
    component: notesAddPage
  },
  '/employee-select/:fun': {
    component: Vue.extend(empPage),
    subRoutes: {
      '/': {component: Vue.extend(empDepPage)},
      '/dept-list': {component: Vue.extend(empDepPage)},
      '/person-list': {component: Vue.extend(empParsonPage)}
    }
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
