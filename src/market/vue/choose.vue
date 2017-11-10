/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="backTo()"></a>
      <a class="mui-icon mui-icon-plusempty mui-pull-right" @click="showNewpage(2)"></a>
    </header>
    <div class="mui-content">
      <div v-if="!imageData.images || imageData.images.length==0" class="not_img">
        <img src="../../public/images/cbd.jpg">
      </div>
      <div v-if="imageData.images && imageData.images.length==1" class="not_img">
        <img :src="imageData.images[0]" onerror="this.src='../public/images/cbd.jpg'">
      </div>
      <div id="slider{{imageData.deNum}}" class="mui-slider" v-if="imageData.images && imageData.images.length>1"
           style="height:150px">
        <div class="mui-slider-group mui-slider-loop">
          <!-- 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播) -->
          <div class="mui-slider-item mui-slider-item-duplicate">
            <a>
              <img :src="imageData.images[imageData.images.length-1]">
            </a>
          </div>
          <!-- 第一张 -->
          <div class="mui-slider-item" v-for="path in imageData.images">
            <a>
              <img :src="path">
            </a>
          </div>
          <!-- 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播) -->
          <div class="mui-slider-item- mui-slider-item-duplicate">
            <a>
              <img :src="imageData.images[0]">
            </a>
          </div>
        </div>
        <div v-if="imageData.images && imageData.images.length>0" class="mui-slider-indicator">
          <div v-for="path in imageData.images" :class="{'mui-active': $index==0}" class="mui-indicator"></div>
        </div>
      </div>
      <div class="mui-scroll-wrapper" style="background: #fff"
           :style="{'top': imageData.images.length==0?44:194 + 'px'}">
        <div class="mui-scroll">
          <crm-detail :test-list="testList" :address="addressData"></crm-detail>
        </div>
      </div>
    </div>

    <div v-show="isShow">
      <crm-newpage :num="num" :items="listdata" :title="title" :address="addressData"></crm-newpage>
    </div>
  </div>
</template>
<script>
  import store from '../market-store';
  import crmDetail from '../../public/components/crm-detail/crm-detail.vue';
  import crmNewPage from '../../public/components/crm-new/crm-newpage.vue';
  import {FastClick} from 'fastclick';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'crm-detail': crmDetail,
      'crm-newpage': crmNewPage
    },
    data: function () {
      return {
        isB: false,
        isShow: false,
        num: 2,
        title: '创建一个新的...',
        currentHeader: {
          title: '市场活动',
          btns: [{
            pos: 'left',
            icon: 'mui-icon-left-nav',
            text: '',
            show: true
          }]
        },
        imageData: store.state,
        testList: store.state.choose.testList,
        addressData: store.state.addressData,
        listdata: nativeApi.setFuncList('market')
      };
    },
    methods: {
      backTo: function () {
        history.go(-1);
      },
      showNewpage: function (num) {
        // num  2 显示两列   3 显示3列
        this.num = num;
        this.isShow = true;
        var marketId = this.$route.params.marketId;
        for (var i = 0; i < this.listdata.length; i++) {
          this.listdata[i].param.id = marketId;
        }
      }
    },
    events: {
      'parent-show': function (show) {
        this.isShow = show;
      },
      parentHide: function () {
        this.isShow = false;
      },
      updateAddress: function (param) {
        /* 活动名称*/
        param.title = store.state.choose.testList[0].value;
        param.showMap = true;
        nativeApi.correctLocation({
          'apiJson': param,
          callback: function (result) {
            /* 客户 显示地图*/
          }
        });
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      FastClick.attach(document.body);
    },
    route: {
      activate: function (transition) {
        // 是否显示转移按钮
        var self = this;
        setTimeout(function () {
          var slider = mui('#slider' + self.imageData.deNum);
          slider.slider({
            interval: 3000
          });
        }, 500);
        var marketId = this.$route.params.marketId;
        store.choose(marketId);
        transition.next();
      }
    },
    created: function () {
    }
  };
</script>
