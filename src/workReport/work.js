/**
 * @file work.js
 * @author hj
 * @date 2016-11-22
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./work.css');
require('../activity/activity.css');
require('../contact/contact.css');

/* 加载页面 */
import listPage from './vue/list.vue';
import searchPage from './vue/search.vue';
import detailPage from './vue/detail.vue';
import addPage from './vue/add.vue';
import editPage from './vue/edit.vue';
import selectPage from './vue/select.vue';
import commentPage from './vue/comment.vue';
import personPage from './vue/person.vue';

import empPage from '../public/components/employee/index.vue';
import empDepPage from '../public/components/employee/dept-list.vue';
import empParsonPage from '../public/components/employee/person-list.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: listPage
  },
  '/searchPage': {
    component: searchPage
  },
  '/detailPage': {
    component: detailPage
  },
  '/detailPage/:localKey': {
    component: detailPage
  },
  '/addPage': {
    component: addPage
  },
  'nativeAdd/:fromNative': {
    component: addPage
  },
  '/editPage/:id': {
    component: editPage
  },
  '/selectPage/:param': {
    component: selectPage
  },
  '/commentPage': {
    component: commentPage
  },
  '/personPage/:param': {
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
