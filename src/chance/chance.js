/**
 * @file activity.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./chance.css');
require('../activity/activity.css');

/* 加载页面 */
import listPage from './vue/list.vue';
import searchPage from './vue/search.vue';
import searchOtherPage from './vue/searchOther.vue';
import selectPage from './vue/select.vue';
import editPage from './vue/edit.vue';
import customerPage from './vue/customer.vue';
import multiplePage from './vue/multiple.vue';
import detailPage from './vue/detail.vue';
import rivalPage from './vue/rival.vue';
import goodBadPage from './vue/goodBad.vue';
import rivalAddPage from './vue/rivalAdd.vue';
import productAddPage from './vue/productAdd.vue';
import contactAddPage from './vue/contactAdd.vue';
import stagePage from './vue/stage.vue';
import stageEditPage from './vue/stageEdit.vue';
import editStageTaskPage from './vue/editStageTask.vue';
import addPage from './vue/add.vue';
import stageEditPage2 from './vue/stageEditPage.vue';
import stageAdd from './vue/stageAdd.vue';

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
  '/selectPage/:param': {
    component: selectPage
  },
  '/customer/:param': {
    component: customerPage
  },
  '/multiplePage/:param': {
    component: multiplePage
  },
  '/detailPage': {
    component: detailPage
  },
  '/detailPage/:localKey': {
    component: detailPage
  },
  '/rivalPage/:id': {
    component: rivalPage
  },
  '/goodBadPage/:param': {
    component: goodBadPage
  },
  '/rivalAddPage': {
    component: rivalAddPage
  },
  '/productAddPage': {
    component: productAddPage
  },
  '/contactAddPage': {
    component: contactAddPage
  },
  '/stagePage': {
    component: stagePage
  },
  '/stageEditPage/:id': {
    component: stageEditPage
  },
  '/stageEditPage/:id/:type': {
    component: stageEditPage
  },
  '/editStageTaskPage': {
    component: editStageTaskPage
  },
  '/addPage': {
    component: addPage
  },
  'nativeAdd/:fromNative': {
    component: addPage
  },
  '/addPage/:localKey': {
    component: addPage
  },
  '/editPage': {
    component: editPage
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
  },
  '/stageEditPage2': {
    component: stageEditPage2
  },
  '/stageAdd/:id': {
    component: stageAdd
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
