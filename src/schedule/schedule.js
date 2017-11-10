/**
 * @file schedule.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';
/* 加载样式 */
require('./schedule.css');

/* 加载页面 */
import newPage from './vue/newPage.vue';
import birthdayAdd from './vue/birthdayAdd.vue';
import birthdayEdit from './vue/birthdayEdit.vue';
import birthdayDetail from './vue/birthdayDetail.vue';
import scheduleAdd from './vue/scheduleAdd.vue';
import scheduleEdit from './vue/scheduleEdit.vue';
import scheduleDetail from './vue/scheduleDetail.vue';
import selectPage from './vue/select.vue';
import scheduleSelectPage from './vue/scheduleSelect.vue';
import customerPage from './vue/customer.vue';
import chancePage from './vue/chance.vue';
import contactPage from './vue/contact.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: newPage
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
  '/contactPage/:param': {
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
