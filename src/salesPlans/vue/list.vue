/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @tap="backNative" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">销售计划</h1>
      <a class="mui-icon-plusempty mui-icon mui-pull-right" @click="toNew"></a>
      <a @tap="selectData" class="mui-icon-search mui-icon mui-pull-right second_a"></a>
    </header>
    <div class="competitor-pager" style="display: none"><span>10/30</span></div>
    <div class="mui-content">
      <div v-if="conList.conList.length==0" :class="{'list_is_null': conList.conList.length==0}"></div>
      <div v-show="conList.conList.length > 0">
        <mui-scroll-refresh v-show="conList.conList.length>0" top="44px" bottom="0">
          <ul class="plans-list">
            <li v-for="list in conList.conList" @tap="goDetail(list)">
              <h5 :class="{'color_red': list.flag}">{{formatDate(list.startDate,list.endDate)}}</h5>
              <p class="mubiao"><span class="pr_10">目标：</span><span class="shiji-wcl p_l10">{{list.targetAmount}}</span>万元
              </p>
              <div class="plans-list-right">
                <p class="color_bule" :class="{'color_red': list.isAttack}">目标完成率:<span class="mubiao-wcl"
                                                                                        v-text="list.finishedRate"></span>
                </p>
                <p class="color_gray">实际：<span class="shiji-wcl p_l10">{{returnAmount(list.finishedAmount)}}</span>万元
                </p>
              </div>
              <span v-if="list.chongtuFlag" class="mui-icon icon-chongtu"></span>
            </li>
          </ul>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../plan-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  import {FastClick} from 'fastclick';
  import {tools} from '../../public/js/tools.js';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        conList: store.scroll.list
      };
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('list', scroll);
      },
      pulldown: function () {
        store.listRefresh('list');
      },
      pullup: function () {
        store.listLoadMore('list');
      }
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      backNative: function () {
        nativeApi.goNative();
      },
      formatDate: function (a, b) {
        var aa = tools.formatDate(a, 'yyyy-mm');
        var bb = tools.formatDate(b, 'yyyy-mm');
        if (aa === bb) {
          return aa;
        } else {
          return aa + '/' + bb;
        }
      },
      returnAmount: function (num) {
        num = (parseFloat(num) / 10000).toFixed(2);
        return num;
      },
      goDetail: function (list) {
        store.clean();
        var self = this;
        store.renderDetail(list.id, function () {
          self.$router.go('/salesPlans-detail/' + list.id);
        });
      },
      selectData: function () {
        this.$router.go('/sales-select');
      },
      percentage: function (a, b) {
        var num = a / b * 100 / 10000;
        return Math.round(num * 100) / 100 + '%';
      },
      toNew: function () {
        store.clean();
        var self = this;
        store.getIfLeader(function () {
          self.$router.go('/salesPlans-add');
        });
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
    },
    ready: function () {
      FastClick.attach(document.body);
      store.init({});
    }
  };
</script>
