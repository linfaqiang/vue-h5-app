/**
 * @file home.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./common.css');
require('./home.css');
require('./workbench.css');
require('../addschedule/addschedule.css');

/* 加载页面 */
import homePage from './vue/home.vue';
import workPage from './vue/work.vue';
import accountPage from './vue/account.vue';

import newPage from '../addschedule/vue/newPage.vue';

import birthdayAdd from '../addschedule/vue/birthdayAdd.vue';
import birthdayEdit from '../addschedule/vue/birthdayEdit.vue';
import birthdayDetail from '../addschedule/vue/birthdayDetail.vue';
import scheduleAdd from '../addschedule/vue/scheduleAdd.vue';
import scheduleEdit from '../addschedule/vue/scheduleEdit.vue';
import scheduleDetail from '../addschedule/vue/scheduleDetail.vue';
import selectPage from '../addschedule/vue/select.vue';
import scheduleSelectPage from '../addschedule/vue/scheduleSelect.vue';
import customerPage from '../addschedule/vue/customer.vue';
import chancePage from '../addschedule/vue/chance.vue';
import contactPage from '../addschedule/vue/contact.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: homePage
  },
  '/work': {
    component: workPage
  },
  '/newPage': {
    component: newPage
  },
  '/account': {
    component: accountPage
  },
  '/birthdayAdd': {
    component: birthdayAdd
  },
  '/birthdayEdit': {
    component: birthdayEdit
  },
  '/birthdayEdit/:id': {
    component: birthdayEdit
  },
  '/birthdayDetail/:id': {
    component: birthdayDetail
  },
  '/scheduleAdd': {
    component: scheduleAdd
  },
  '/nativeAdd/:fromNative': {
    component: scheduleAdd
  },
  '/scheduleAdd/:localKey': {
    component: scheduleAdd
  },
  'scheduleEdit': {
    component: scheduleEdit
  },
  '/scheduleEdit/:id': {
    component: scheduleEdit
  },
  '/scheduleDetail/:id': {
    component: scheduleDetail
  },
  '/customerPage/:param': {
    component: customerPage
  },
  '/chancePage/:param': {
    component: chancePage
  },
  '/contactPage': {
    component: contactPage
  },
  '/selectPage/:param': {
    component: selectPage
  },
  '/scheduleSelect/:param': {
    component: scheduleSelectPage
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
