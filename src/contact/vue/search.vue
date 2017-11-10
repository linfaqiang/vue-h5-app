/**
* @file 搜索
* @author hj
* @date 2016-11-17
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d" :class="{'search_d_h_c': isBlur&&type==0, 'search_d_h': isBlur&&type!=0}">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <input id="searchInputId" type="text" @input="confirmIn()" placeholder="{{plh}}" @focus="inputFocus()"
               v-model="searchName">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right" @tap="confirm()" :style="seaNaCss">确定</a>
      </div>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;"
           :class="{'list_is_null': ((dataList.conSeaList.length==0&&type==0) || (dataList.bookList.length==0&&type==1))&&saveSea}">
        <div class="mui-scroll">
          <ul v-if="dataList.conSeaList.length>0" class="mui-table-view con_list">
            <li v-for="list in dataList.conSeaList" class="mui-table-view-cell mui-indexed-list-item">
              <a @tap="tapLink(list.id)">
                <div><p class="name">{{list.name}}<span>{{list.title}}</span></p>
                  <p>{{list.customerName}}</p></div>
              </a>
            </li>
          </ul>
          <ul v-if="dataList.bookList.length>0" class="con_book_list">
            <li v-for="list in dataList.bookList" class="">
              <a>
                <div>{{list.name}}<span @tap="addContact($index)">添加</span></div>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <!--<footer @tap="voiceTo()" class="voiceIn"><span class="mui-icon mui-icon-tube"></span>语音录入</footer>-->
    </div>
  </div>
</template>
<script>
  import store from '../contact-store';
  var nativeApi = require('nativeApi');
  export default {
    components: {},
    data: function () {
      return {
        plh: '搜索',
        searchName: '',
        saveSea: '',
        dataList: store.state,
        seaNaCss: {
          color: '#a80e16'
        },
        type: 0,
        styleObject: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44 - 40) + 'px'
        },
        isBlur: true
      };
    },
    methods: {
      back: function (index) {
        history.go(-1);
      },
      inputBlock: function () {
        this.isBlur = true;
        var self = this;
        var type = parseInt(self.$route.params.type || '0');
        if (type === 0) {
          self.plh = '联系人姓名';
        } else {
          self.plh = '姓名或手机号码';
        }
      },
      inputFocus: function () {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.searchName = result.result;
            if (self.searchName && this.$route.params.type !== 0) {
              self.seaNaCss.color = '#fff';
            }
          }
        });
      },
      noInputBlock: function () {
        var self = this;
        self.searchName = self.saveSea || '';
        if (!self.searchName) {
          self.isBlur = false;
          self.plh = '搜索';
        }
      },
      confirmIn: function () {
        var type = parseInt(this.$route.params.type || '0');
        var searchName = this.searchName;
        var self = this;
        if (type !== 0) {
          if (!searchName) {
            self.saveSea = '';
            self.dataList.bookList = [];
            self.seaNaCss.color = '#a80e16';
          } else {
            self.seaNaCss.color = '#fff';
          }
          return;
        }
        if (!searchName) {
          self.saveSea = '';
          self.dataList.conSeaList = [];
          return;
        }
        self.saveSea = searchName;
        store.search(searchName);
      },
      confirm: function () {
        var searchName = this.searchName;
        var self = this;
        var name = '';
        var phone = '';
        var regExp = new RegExp('[1-9]$');
        if (!searchName) {
          return;
        }
        if (regExp.test(searchName)) {
          if (searchName.length < 4) {
            mui.alert('以手机号码搜索时，手机号码不能小于4位！', '提示', function () {
            });
            return;
          }
          phone = searchName;
        } else {
          name = searchName;
        }
        self.saveSea = searchName;
        nativeApi.getContacts({
          'apiJson': {
            'phone': phone,
            'name': name
          },
          callback: function (result) {
            store.searchBook(result);
          }
        });
      },
      addContact: function (index) {
        this.$router.go('/addPage/3/0');
        var detail = store.state.bookList[index];
        var resultData = {
          'name': detail.name,
          'mobile': detail.phone
        };
        store.clean(resultData);
      },
      voiceTo: function () {
        var self = this;
        nativeApi.cloundVol({
          callback: function (result) {
            var searchName = result.result;
            self.searchName = searchName;
            store.search(searchName);
          }
        });
      },
      tapLink: function (id) {
        var self = this;
        store.detail(id, function () {
          self.$router.go('/detailPage');
        });
      }
    },
    created: function () {
    },
    route: {
      data: function () {
        var type = this.$route.params.type;
        var self = this;
        self.saveSea = '';
        self.searchName = '';
        if (parseInt(type) === 0) {
          self.plh = '联系人姓名';
          self.dataList.bookList = [];
        } else if (parseInt(type) === 1) {
          self.plh = '联系人姓名或手机号码';
          self.dataList.conSeaList = [];
        }
        self.type = parseInt(type);
        setTimeout(function () {
          document.getElementById('searchInputId').focus();
        }, 10);
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
