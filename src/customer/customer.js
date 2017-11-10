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
import searchPage from './vue/search.vue';
import searchOtherPage from './vue/searchOther.vue';
import detailPage from './vue/detail.vue';
import addPage from './vue/add.vue';
import editPage from './vue/edit.vue';
import selectPage from './vue/select.vue';

import hierarchyPage from './hierarchy/hierarchy.vue';
import hierarchyChancePage from './hierarchy/hierarchy-change.vue';
import hierarchyParentPage from './hierarchy/hierarchy-parent.vue';
import hierarchySearchPage from './hierarchy/hierarchy-search.vue';
import parentCustomerPage from './vue/parentCustomer.vue';

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
    component: listPage
  },
  '/searchPage': {
    component: searchPage
  },
  '/searchOtherPage': {
    component: searchOtherPage
  },
  '/detailPage': {
    component: detailPage
  },
  '/detailPage/:localKey': {
    component: detailPage
  },
  '/nativeDetail/:nativeId': {
    component: detailPage
  },
  '/addPage': {
    component: addPage
  },
  '/nativeAdd/:fromNative': {
    component: addPage
  },
  '/editPage': {
    component: editPage
  },
  '/selectPage/:param': {
    component: selectPage
  },
  '/notes/:id': {
    component: notesListPage
  },
  '/addNotes/:id': {
    component: notesAddPage
  },
  '/teamPage/:id/:type': {
    component: teamListPage
  },
  '/teamAddPage': {
    component: teamAddPage
  },
  '/personPage': {
    component: personPage
  },
  '/hierarchy/:id/:name': {
    component: hierarchyPage
  },
  '/hierarchy-change/:id/:name': {
    component: hierarchyChancePage
  },
  '/hierarchy-search': {
    component: hierarchySearchPage
  },
  '/hierarchy-search/:type': {
    component: hierarchySearchPage
  },
  '/hierarchy-parent': {
    component: hierarchyParentPage
  },
  '/hierarchy-parent/:id/:name/:remark': {
    component: hierarchyParentPage
  },
  '/parentCustomer/:type': {
    component: parentCustomerPage
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
