/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d search_d_h">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-title" v-text="title"></h1>
        <a v-if="!isBlur" class="mui-btn mui-btn-link mui-pull-right icon-text" @tap="addProduct()" v-text="btn"></a>
        <a v-if="isBlur" class="mui-btn mui-btn-link mui-pull-right icon-text" @tap="cancle()" v-text="btn2"></a>
      </div>
    </header>
    <div class="mui-content">
      <div class="list_search not_type" style="z-index: 22">
        <span class="mui-icon mui-icon-glass"></span>
        <input type="text" v-model="searchName" placeholder="报价名称" @focus="inputFocus()">
        <span class="search" @tap="search()">搜索</span>
      </div>
      <mui-scroll-refresh bottom="0" top="84px">
        <div class="product-list" style="margin-top: 0">
          <div class="item_li" v-for="list in listData.dataList">
            <p @tap="selectItem($index)" class="mui-icon" :class="{'crm-check':list.showIcon}">
              <img class="source-img" :src="list.picUrl||'../public/images/default_product.png'">
              <span class="ptName">{{list.productName}}</span>
            </p>
            <div class="detail">
              <p>单价
                <span class="cost" v-if="!list.showIcon">{{list.productPrice}}</span>
                <input v-if="list.showIcon" type="text" v-model="list.productPrice">
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span class="span">数量</span>
                <span v-if="!list.showIcon">1</span>
                <input v-if="list.showIcon" type="number" v-model="list.quantity" min="1">
              </p>
              <p>单位<span>{{list.unit}}</span></p>
              <p>描述<span>{{list.description}}</span></p>
            </div>
          </div>
        </div>
      </mui-scroll-refresh>
    </div>
  </div>
</template>
<script>
  import store from '../price-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        listData: store.scroll.addProductList,
        title: '选择报价行',
        btn: '保存',
        btn2: '取消',
        plh: '产品名称',
        searchName: '',
        isBlur: false,
        isEdit: false
      };
    },
    methods: {
      inputBlock: function () {
        this.isBlur = false;
        this.plh = '产品名称';
      },
      noInputBlock: function () {
        var self = this;
        if (!self.searchName) {
          self.isBlur = false;
          self.plh = '产品名称';
        }
      },
      inputFocus: function () {
        var setVal = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            setVal.searchName = result.result;
          }
        });
      },
      search: function () {
        store.param.addProductList.q = this.searchName;
        store.param.addProductList.pageNo = 0;
        store.addProductList();
      },
      selectItem: function (index) {
        this.listData.dataList[index].showIcon = !this.listData.dataList[index].showIcon;
        this.listData.dataList[index].selected = !this.listData.dataList[index].selected;
      },
      // 点击保存 添加选择的报价行
      addProduct: function () {
        var isEdit = this.isEdit;
        store.productAdd(isEdit);
        history.go(-1);
      },
      goSearchProduct: function () {
        store.product2(this.searchName);
      },
      cancle: function () {
        this.searchName = '';
        store.product2();
      }
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('addProductList', scroll);
      },
      pulldown: function () {
        store.listRefresh('addProductList');
      },
      pullup: function () {
        store.listLoadMore('addProductList');
      }
    },
    route: {
      data: function () {
        var self = this;
        var param = self.$route.params.param;
        var arrPram = param.split('_');
        if (arrPram[1] === 'edit') {
          self.isEdit = true;
        }
        store.param.addProductList = {
          'q': '',
          'pageNo': 1,
          'pageSize': 10
        };
        store.addProductList();
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
