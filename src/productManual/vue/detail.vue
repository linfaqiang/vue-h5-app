/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>

    <header id="header" class="mui-bar mui-bar-nav">
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-content">
      <div v-if="!imageData.images || imageData.images.length==0" class="not_img">
        <img src="../../public/images/pic_cpxq_no02.png">
      </div>
      <div v-if="imageData.images && imageData.images.length==1" class="not_img">
        <img :src="imageData.images[0]" onerror="this.src='../public/images/pic_cpxq_no02.png'">
      </div>
      <div id="slider" class="mui-slider" v-if="imageData.images && imageData.images.length>1">
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
          <div class="mui-slider-item mui-slider-item-duplicate">
            <a>
              <img :src="imageData.images[0]">
            </a>
          </div>
        </div>
        <div v-if="imageData.images && imageData.images.length>0" class="mui-slider-indicator">
          <div v-for="path in imageData.images" :class="{'mui-active': $index==0}" class="mui-indicator"></div>
        </div>
      </div>
      <div class="cTop">
        <span v-text="testList.testList.productName"></span>
        <span>¥{{testList.testList.productPrice}}元</span>
        <span class="mui-icon" :class="isFollow.data" @tap="changeColor()"></span>
      </div>
      <div class="mui-scroll-wrapper" style="top: 331px;">
        <div class="mui-scroll">
          <ul class="cBottom">
            <li>
              <span class="left">类别</span>
              <span class="right" v-text="testList.testList.productTypeText"></span>
            </li>
            <li>
              <span class="left">公司</span>
              <span class="right" v-text="testList.testList.organizationText"></span>
            </li>
            <li>
              <span class="left">描述</span>
              <span class="right" v-text="testList.testList.description"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../product-store';
  export default {
    components: {},
    data: function () {
      return {
        isB: false,
        isShowTransBtn: true,
        name: '',
        currentHeader: {
          title: '产品详情'
        },
        imageData: store.state,
        testList: store.state,
        isFollow: store.state.isFollow
      };
    },
    methods: {
      followRecDetail: function (index) {
        this.$router.go('/followRecDetail/1');
      },
      changeColor: function () {
        var self = this;
        if (this.isFollow.data === 'crm-icon-collect') {
          store.toFollow(function () {
            self.isFollow.data = 'crm-icon-collects';
            if (self.imageData.show) {
              store.follows();
            }
          });
        } else {
          store.deleteFollow(function () {
            self.isFollow.data = 'crm-icon-collect';
            if (self.imageData.show) {
              store.listRefresh('follows');
            }
          });
        }
      }
    },
    route: {
      activate: function (transition) {
        setTimeout(function () {
          var slider = mui('#slider');
          slider.slider({
            interval: 3000
          });
        }, 500);
        transition.next();
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
