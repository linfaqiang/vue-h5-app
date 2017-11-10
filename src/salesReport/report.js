/**
 * @file report.js
 * @author hj
 * @date 2016-11-22
 */
import Vue from 'vue';
import App from 'src/app';
import Router from 'vue-router';

/* 加载样式 */
require('./report.css');

/* 加载页面 */
import reportPage from './vue/report.vue';
import salesCustomerAnalysis from './vue/customerAnalysis.vue'; /* 重点客户分析 */
import salesChanceTrend from './vue/chanceTrend.vue'; /* 新机会 */
import salesOutstand from './vue/outstandAnalysis.vue'; /* 销售业绩分析 */
import salesTranslation from './vue/translation.vue'; /* 销售转化率 */
import salesRanking from './vue/ranking.vue'; /* 销售排行榜 */
import salesForecast from './vue/forecast.vue'; /* 销售预测 */
import salesSelect from './vue/select.vue'; /* 筛选页面 */
import selectPage from './vue/selectP.vue'; /* 选择页面 */
import personDeptPage from './vue/personDept.vue'; /* 选择人员部门页面 */

Vue.use(Router);

var router = new Router();
router.map({
  '/': {
    component: reportPage
  },
  '/sales-customerAnalysis': {
    component: salesCustomerAnalysis
  },
  '/sales-outstandAnalysis': {
    component: salesOutstand
  },
  '/sales-chanceTrend': {
    component: salesChanceTrend
  },
  '/sales-translation': {
    component: salesTranslation
  },
  '/sales-ranking': {
    component: salesRanking
  },
  '/sales-forecast': {
    component: salesForecast
  },
  '/sales-select': {
    component: salesSelect
  },
  '/sales-select/:type': {
    component: salesSelect
  },
  '/select-p/:param': {
    component: selectPage
  },
  '/personDeptPage/:dataType': {
    component: personDeptPage
  }
});
router.beforeEach(function () {
  window.scrollTo(0, 0);
});
router.redirect({
  '*': '/'
});
router.start(App, 'html');
