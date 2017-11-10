/**
* @file 客户选择
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d" :class="{'search_d_h_c': isBlur&&type==0, 'search_d_h': isBlur&&type!=0}">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
        <input id="searchInputId" type="text" @input="confirmIn()" placeholder="{{plh}}" @focus="inputFocus()"
               v-model="searchName">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right" @tap="confirm()" :style="seaNaCss">确定</a>
      </div>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div v-if="customer.customerLi.length==0" :class="{'list_is_null': customer.customerLi.length==0&&saveSea}"></div>
      <div v-show="customer.customerLi.length>0">
        <mui-scroll-refresh bottom="0" top="44px">
          <div class="rival_li">
            <ul>
              <li v-for="list in customer.customerLi" class="mui-icon"
                  :class="{selected: list.selected, 'crm-check': list.selected}" @tap="tapLink(list)">
                <p class="name">{{list.name}}</p>
                <p><span class="mui-icon mui-icon-address"></span>{{list.address}}</p>
              </li>
            </ul>
          </div>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../customer-store';
  var nativeApi = require('nativeApi');
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        customer: store.scroll.list,
        plh: '客户名称',
        searchName: '',
        saveSea: '',
        seaNaCss: {
          color: '#a80e16'
        },
        isBlur: true
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
      backNative: function () {
        nativeApi.goNative();
      },
      confirm: function () {
        if (!this.searchName) {
          return;
        }
        var self = this;
        this.saveSea = this.searchName;
        setTimeout(function () {
          store.param.list.q = self.searchName;
          store.param.list.pageNo = 0;
          store.init();
        }, 50);
      },
      inputFocus: function () {
      },
      confirmIn: function () {
        var self = this;
        var searchName = self.searchName;
        if (!searchName) {
          self.saveSea = '';
          self.customer.customerLi = [];
          self.seaNaCss.color = '#a80e16';
        } else {
          self.seaNaCss.color = '#fff';
        }
      },
      tapLink: function (data) {
        var longitude = data.longitude;
        var latitude = data.latitude;
        if (!(longitude && latitude)) {
          mui.alert('该客户没有经纬度！', '提示');
          return;
        }
        nativeApi.setCustomerData({
          'apiJson': {
            'id': data.id,
            'name': data.name,
            'address': data.address,
            'longitude': data.longitude,
            'latitude': data.latitude,
            'adcode': data.adcode,
            'cityCode': data.cityCode,
            'ownerStaffMobile': data.ownerStaffMobile,
            'ownerStaffName': data.ownerStaffName,
            'canView': data.canView
          },
          callback: function () {
            nativeApi.goNative();
          }
        });
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
    }
  };
</script>
