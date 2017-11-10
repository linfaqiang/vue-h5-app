/**
 * @file sign.js
 * @author hj
 * @date 2016-11-10
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./sign.css');

/* 加载页面 */
import listPage from './vue/list.vue';

import empPage from '../public/components/employee/index.vue';
import empDepPage from '../public/components/employee/dept-list.vue';
import empParsonPage from '../public/components/employee/person-list.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: listPage
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
