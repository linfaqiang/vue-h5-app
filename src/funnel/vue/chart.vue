/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @tap="backNative()" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{title}}</h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="TypeOf()">类型</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="main_con">
            <div class="loudou">
              <div id="funnelMain" style="width: 100%;height:200px;"></div>
              <span class="unit">单位：元</span>
              <div class="list_stage">
              </div>
            </div>
            <div class="loudou-table">
              <table>
                <colgroup>
                  <col width="30%"/>
                  <col width="30%"/>
                  <col width=""/>
                </colgroup>
                <thead>
                <tr>
                  <th>阶段</th>
                  <th>数量</th>
                  <th>预计额</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="list in funnel.lists">
                  <td v-text="list.stageName"></td>
                  <td v-text="list.stageCount||0"></td>
                  <td class="color_red" v-text="list.stageAmount||0"></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../funnel-store';
  var nativeApi = require('nativeApi');
  export default {
    data: function () {
      return {
        title: '销售漏斗',
        funnel: store.state,
        selectDate: store.state.selectDate
      };
    },
    methods: {
      backNative: function () {
        nativeApi.goNative();
      },
      TypeOf: function () {
        store.selectFn('chance', this.selectDate.chanceTypeId, '商机类型');
        this.$router.go('/select-p/chanceTypeId_edit');
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      store.init();
    }
  };
</script>
