/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
    </header>
    <div v-if="contList.conList.length==0" :class="{'list_is_null': contList.conList.length==0}" style="margin-top: 44px;"></div>
    <div class="mui-content" v-show="contList.conList.length>0" id="noPadding">
      <div v-if="!imageData.imgData || imageData.imgData.length==0" class="not_img">
        <img src="../../public/images/default_product.png">
      </div>
      <div v-if="!imageData.imgData || imageData.imgData.length==1" class="not_img">
        <img :src="imageData.imgData[0]">
      </div>
      <div id="slider" class="mui-slider marketManageSlider" v-if="imageData.imgData && imageData.imgData.length>1">
        <div class="mui-slider-group mui-slider-loop">
          <!-- 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播) -->
          <div class="mui-slider-item mui-slider-item-duplicate">
            <a href="#">
              <img :src="imageData.imgData[3]" onerror="this.src='../public/images/default_product.png'">
            </a>
          </div>
          <!-- 第一张 -->
          <div class="mui-slider-item" v-for="path in imageData.imgData">
            <a>
              <img :src="path" onerror="this.src='../public/images/default_product.png'">
            </a>
          </div>
          <!-- 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播) -->
          <div class="mui-slider-item mui-slider-item-duplicate">
            <a href="#">
              <img :src="imageData.imgData[0]" onerror="this.src='../public/images/default_product.png'">
            </a>
          </div>
        </div>
        <div v-if="imageData.imgData && imageData.imgData.length>0" class="mui-slider-indicator">
          <div v-for="path in imageData.imgData" :class="{'mui-active': $index==0}" class="mui-indicator"></div>
        </div>
      </div>
      <mui-scroll-refresh bottom="0" top="194px">
        <ul class="mui-table-view">
          <li class="mui-table-view-cell mui-media" v-for="list in contList.conList" @tap="tapLink($index)">
            <a href="javascript:;">
              <img class="mui-media-object mui-pull-left" :src='list.picUrl'
                   onerror="this.src='../public/images/default_product.png'">
              <div class="mui-media-body">
                <span>{{list.subject}}</span>
                <p class='mui-ellipsis'>{{list.createdOn}}</p>
              </div>
            </a>
          </li>
        </ul>
      </mui-scroll-refresh>
    </div>
  </div>
</template>
<script>
  import store from '../market-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '市场资讯',
          name: '编辑头像',
          href: ' ',
          btns: '保存'
        },
        contList: store.scroll.list,
        imageData: store.state
      };
    },
    methods: {
      backNative: function () {
        nativeApi.goNative();
      },
      back: function () {
        mui.back();
      },
      tapLink: function (index) {
        var manageId = this.contList.conList[index].id;
        this.$router.go('/choose/' + manageId);
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
      store.listRefresh('list');
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
    ready: function () {
      setTimeout(function () {
        var slider = mui('#slider');
        slider.slider({
          interval: 3000
        });
      }, 100);
    }
  };
</script>
