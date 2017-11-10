/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="classify mui-bar mui-bar-nav myc_search_header">
      <h1 class="mui-title" v-text="classify.classifyTitle"></h1>
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
    </header>
    <div class="mui-content">
      <mui-scroll-refresh bottom="0" top="44px">
        <!--数据列表-->
        <ul class="mui-table-view mui-table-view-chevron">
          <li class="mui-table-view-cell mui-media" v-for="list in conList.conList" @tap="tapLink($index)">
            <a class="mui-navigate-right">
              <img class="mui-media-object mui-pull-left" :src="list.picUrl"
                   onerror="this.src='../public/images/default_product.png'">
              <div class="mui-media-body">
                <p v-text="list.productName"></p>
                <span class='mui-ellipsis'>类别:{{list.productTypeText}}</span>
                <span class="price mui-icon mui-icon-amount">{{list.productPrice}}元</span>
              </div>
            </a>
          </li>
        </ul>
      </mui-scroll-refresh>
    </div>
  </div>
</template>
<script>
  import store from '../product-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        show: false,
        currentHeader: {
          title: '',
          name: '线索名称或简称',
          value: ''
        },
        conList: store.scroll.lists,
        classify: store.state
      };
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      tapLink: function (index) {
        var productId = this.conList.conList[index].id;
        var self = this;
        store.getDedail(productId, function () {
          self.$router.go('/detailPage/' + productId);
        });
      }
    },
    route: {
      activate: function (transition) {
        store.param.lists.productTypeId = this.$route.params.typeId;
        store.listRefresh('lists');
        transition.next();
      }
    },
    created: function () {
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('lists', scroll);
      },
      pulldown: function () {
        store.listRefresh('lists');
      },
      pullup: function () {
        store.listLoadMore('lists');
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
