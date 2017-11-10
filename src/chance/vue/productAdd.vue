/**
* @file 添加产品进商机
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveTo()">确定</a>
    </header>
    <div class="mui-content">
      <div class="list_search">
        <span class="mui-icon mui-icon-glass"></span>
        <span class="type" @tap="type()">分类</span>
        <input type="text" v-model="searchName" placeholder="请输入关键字搜索" @focus="inputFocus()">
        <span class="search" @tap="search()">搜索</span>
      </div>
      <div v-if="product.productAddList.length==0" :class="{'list_is_null': product.productAddList.length==0}"></div>
      <div v-show="product.productAddList.length>0">
        <mui-scroll-refresh bottom="0" top="84px">
          <div class="product_multiple_li" v-if="product.productAddList.length>0">
            <ul>
              <li v-for="list in product.productAddList" class="mui-icon mui-table-view-cell"
                  :class="{selected: list.selected, 'crm-multiple-circle': !list.selected, 'crm-multiple-check': list.selected}"
                  @tap="multipleBack($index)">
                <img :src="list.picUrl||'../public/images/default_product.png'">
                <div>
                  <p class="title">{{list.productName}}</p>
                  <p>类别：<span>{{list.productTypeText}}</span></p>
                  <p>{{list.description}}</p>
                </div>
              </li>
            </ul>
          </div>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../chance-store';
  var nativeApi = require('nativeApi');
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh';
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        currentHeader: {
          title: '添加销售产品'
        },
        product: store.scroll.product,
        productT: store.state,
        searchName: ''
      };
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('product', scroll);
      },
      pulldown: function () {
        store.listRefresh('product');
      },
      pullup: function () {
        store.listLoadMore('product');
      }
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      saveTo: function () {
        var self = this;
        store.productAdd(function () {
          mui.alert('产品新增成功！', '提示', function () {
            self.back();
          });
        });
      },
      inputFocus: function () {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.searchName = result.result;
          }
        });
      },
      search: function () {
        store.param.product.q = this.searchName;
        store.param.product.pageNo = 0;
        store.productList();
      },
      type: function () {
        var selectId = this.productT.productType.typeId;
        var self = this;
        store.selectFn('productType', selectId, '产品类别', function () {
          self.$router.go('/selectPage/type_productType');
        });
      },
      multipleBack: function (index) {
        var self = this;
        if (self.product.productAddList[index].selected) {
          self.product.productAddList[index].selected = false;
        } else {
          self.product.productAddList[index].selected = true;
        }
      }
    },
    route: {
      data: function () {
        this.searchName = '';
        store.productList();
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
