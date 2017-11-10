/**
 * @file task.js
 * @author hj
 * @date 2016-11-24
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./task.css');
require('../contact/contact.css');

/* 加载页面 */
import listPage from './vue/list.vue';
import detailPage from './vue/detail.vue';
import addPage from './vue/add.vue';
import editPage from './vue/edit.vue';
import selectPage from './vue/select.vue';
import missionPage from './vue/mission.vue';
import missionDetailPage from './vue/missionDetail.vue';
import personPage from './vue/person.vue';
import customerPage from './vue/customer.vue';
import chancePage from './vue/chance.vue';
import contactPage from './vue/contact.vue';

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
  '/addPage': {
    component: addPage
  },
  'nativeAdd/:fromNative': {
    component: addPage
  },
  'nativeAdd/:fromNative/:scheduleId': {
    component: addPage
  },
  '/addPage/:localKey': {
    component: addPage
  },
  '/editPage/:id': {
    component: editPage
  },
  '/detailPage': {
    component: detailPage
  },
  '/nativeDetail/:nativeId': {
    component: detailPage
  },
  '/detailPage/:localKey': {
    component: detailPage
  },
  '/missionPage/:id': {
    component: missionPage
  },
  '/missionDetailPage/:executorId': {
    component: missionDetailPage
  },
  '/selectPage/:param': {
    component: selectPage
  },
  '/customerPage/:param': {
    component: customerPage
  },
  '/chancePage/:param': {
    component: chancePage
  },
  '/contactPage/:param': {
    component: contactPage
  },
  '/personPage/:param': {
    component: personPage
  },
  '/notes/:id': {
    component: notesListPage
  },
  '/addNotes/:id': {
    component: notesAddPage
  },
  '/employee-select/:fun': {
    component: empPage,
    subRoutes: {
      '/': {component: empDepPage},
      '/dept-list': {component: empDepPage},
      '/person-list': {component: empParsonPage}
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
