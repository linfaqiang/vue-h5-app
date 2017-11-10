<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d" :class="{'search_d_h': isBlur}">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <input id="searchInputId" type="text" placeholder="{{plh}}" v-model="searchName.searchName" @focus="inputBlock"
               @blur="noInputBlock">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right icon-text" @tap="confirm()">确定</a>
      </div>
    </header>
    <div class="mui-content">
      <div v-if="customer.dataList.length==0" :class="{'list_is_null': customer.dataList.length==0}"></div>
      <div v-show="customer.dataList.length>0">
        <mui-scroll-refresh bottom="0" top="44px">
          <div class="rival_li">
            <ul>
              <li v-for="list in customer.dataList" class="mui-icon"
                  :class="{selected: list.selected, 'crm-check': list.selected}" @tap="customerSelect($index)">
                <p class="name">{{list.name}}</p>
                <p style="width: 92%">{{list.address}}</p>
                <p>{{list.ownerStaffName}}</p>
              </li>
            </ul>
          </div>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<script>
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  import store from '../customer-store';
  export default{
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        currentHeader: {
          title: '选择父客户'
        },
        isBlur: false,
        plh: '搜索',
        customer: store.scroll.parentCustomer,
        searchName: store.scroll.parentCustomer
      };
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('parentCustomer', scroll);
      },
      pulldown: function () {
        store.listRefresh('parentCustomer');
      },
      pullup: function () {
        store.listLoadMore('parentCustomer');
      }
    },
    methods: {
      back: function () {
        history.go(-1);
      },

      customerSelect: function (index) {
        var self = this;
        var param = self.$route.params.type;
        var backData = this.customer.dataList[index];
        store.state.selectParentId = backData.id;
        if (param === 'add') {
          store.state.addData.customer[5].valueCode = backData.id;
          store.state.addData.customer[5].value = backData.name;
        } else if (param === 'edit') {
          store.state.editData.customer[5].valueCode = backData.id;
          store.state.editData.customer[5].value = backData.name;
        }
        history.go(-1);
      },
      inputBlock: function () {
        this.isBlur = true;
        this.plh = '搜索客户';
      },
      noInputBlock: function () {
        var self = this;
        if (!self.searchName) {
          self.isBlur = false;
          self.plh = '搜索';
        }
      },
      confirm: function () {
        var searchName = this.searchName.searchName;
        store.param.parentCustomer.q = searchName || '';
        store.param.parentCustomer.pageNo = 1;
        store.getParent({});
      }
    },
    created: function () {
    },
    route: {
      data: function () {
        store.param.parentCustomer = {
          'pageNo': 1,
          'pageSize': 10
        };
        store.getParent({});
      }
    },
    ready: function () {
      mui.init();
    }
  };
</script>
