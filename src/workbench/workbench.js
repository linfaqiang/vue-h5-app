/**
 * @file activity.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('../home/common.css');
require('../home/home.css');
require('./workbench.css');

/* 加载页面 */
import workPage from './vue/work.vue';

import notesListPage from '../public/components/notes/notes.vue';
import notesAddPage from '../public/components/notes/add.vue';

import teamListPage from '../public/components/team/team.vue';
import teamAddPage from '../public/components/team/teamAdd.vue';
import personPage from '../public/components/team/person.vue';

import empPage from '../public/components/employee/index.vue';
import empDepPage from '../public/components/employee/dept-list.vue';
import empParsonPage from '../public/components/employee/person-list.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: workPage
  },
  '/work': {
    component: workPage
  },
  '/notes/:id/:isEdit': {
    component: notesListPage
  },
  '/addNotes/:id': {
    component: notesAddPage
  },
  '/teamPage/:id/:isEdit': {
    component: teamListPage
  },
  '/teamAddPage': {
    component: teamAddPage
  },
  '/personPage': {
    component: personPage
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
