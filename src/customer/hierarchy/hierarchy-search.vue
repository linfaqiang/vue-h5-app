<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d" :class="{'search_d_h': isBlur}">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <input id="searchInputId" type="text" placeholder="{{plh}}" v-model="searchName.searchName"  @focus="inputBlock" @blur="noInputBlock">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right icon-text" @tap="confirm()">确定</a>
      </div>

    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div  :style="styleObject">
        <mui-scroll-refresh>
          <ul class="mui-table-view con_list">
            <li v-for="list in searchList.dataList" style="height:auto; padding-top:5px; padding-bottom:10px" class="mui-table-view-cell mui-indexed-list-item">
              <a @tap="tapLink(list)">
                <div>
                  <p class="name">{{list.name}}</p>
                  <p>{{list.address}}</p>
                  <p>责任人{{list.ownerStaffName}}</p>
                </div>
              </a>
              <span class="mui-icon crm-check" v-if="list.checked"></span>
            </li>
          </ul>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<script>
  import store from './hierarchy-store.js';
  import storeOut from '../customer-store.js';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  export default{
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        searchName: store.scroll.search,
        searchList: store.scroll.search,
        isBlur: false,
        plh: '搜索',
        styleObject: {
          position: 'relative',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44) + 'px'
        }
      };
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('search', scroll);
      },
      pulldown: function () {
        store.listRefresh('search');
      },
      pullup: function () {
        store.listLoadMore('search');
      }
    },
    methods: {
      back: function () {
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
        if (this.$route.params.type) {
          store.state.searchType = 'childred';
          store.param.search.urls = 'getNotSubsidiaryCustomer/' + storeOut.state.detailData.id;
        } else {
          store.state.searchType = 'parent';
          store.param.search.urls = 'getNotSubsidiaryCustomer/' + storeOut.state.detailData.id;
        }

        store.param.search.q = searchName || '';
        store.param.search.pageNo = 1;

        store.search({});
      },

      tapLink: function (list) {
        var self = this;
        var obj = {};
        if (list.checked) {
          return;
        }
        if (this.$route.params.type) {
          obj = {
            id: list.id,
            name: list.name,
            parentId: store.state.current.currentId
          };

          store.setCustomers(obj, function () {
            list.checked = !list.checked;
            store.init(store.state.current.currentId);
          });
        } else {
          obj = {
            id: store.state.current.currentId,
            name: store.state.current.currentName,
            parentId: list.id
          };
          store.setCustomers(obj, function () {
            for (var i = 0; i < self.searchList.dataList.length; i++) {
              if (list.id === self.searchList.dataList[i].id) {
                self.searchList.dataList[i].checked = true;
              } else {
                self.searchList.dataList[i].checked = false;
              }
            }
            store.init(store.state.current.currentId);
          });
        }
      }
    },
    route: {
      activate: function (transition) {
        transition.next();
        this.confirm();
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
