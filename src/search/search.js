/**
 * @file search.js
 * @author hj
 * @date 2016-11-17
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./search.css');

/* 加载页面 */
import indexPage from './vue/index.vue';
import singlePage from './vue/single.vue';
import otherPage from './vue/other.vue';
import singleOtherPage from './vue/singleOther.vue';
import customerPage from './vue/customer.vue';
import chancePage from './vue/chance.vue';
import cluePage from './vue/clue.vue';
import personPage from './vue/person.vue';

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: indexPage
  },
  '/singlePage/:sea': {
    component: singlePage
  },
  'otherPage/:sea': {
    component: otherPage
  },
  'singleOtherPage/:sea': {
    component: singleOtherPage
  },
  'customerPage/:sea': {
    component: customerPage
  },
  'chancePage/:sea': {
    component: chancePage
  },
  'cluePage/:sea': {
    component: cluePage
  },
  'personPage/:sea': {
    component: personPage
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
