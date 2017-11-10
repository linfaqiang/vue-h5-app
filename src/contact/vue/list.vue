/* *
* @file 联系人列表
* @author hj
* @date 2016-11-17
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon-plusempty mui-icon mui-pull-right" href="#newContact"></a>
      <a class="mui-icon-search mui-icon mui-pull-right second_a" @tap="search()"></a>
    </header>
    <div class="mui-content">
      <div id="contact_list" class="mui-indexed-list" :class="{'list_is_null': dataList.conList.length == 0}"
           :style="listObject">
        <div class="mui-indexed-list-search mui-input-row mui-search" style="display: none;">
          <input type="search" class="mui-input-clear mui-indexed-list-search-input" placeholder="搜索机场">
        </div>
        <div class="mui-indexed-list-bar">
          <a v-for="indexed in dataList.arrIndexed">{{indexed}}</a>
        </div>
        <div class="mui-indexed-list-alert"></div>
        <div class="mui-indexed-list-inner">
          <div class="mui-indexed-list-empty-alert">没有数据</div>
          <ul class="mui-table-view con_list">
            <li v-for="list in dataList.conList" data-group="{{list.indexedGroup}}"
                :class="{ 'mui-table-view-divider': list.isGroup, 'mui-indexed-list-group': list.isGroup, 'mui-table-view-cell': !list.isGroup, 'mui-indexed-list-item': !list.isGroup }">
              <a @tap="tapLink(list.id)">
                <span v-if="list.isGroup">{{list.indexedGroup}}</span>
                <div v-else><p class="name">{{list.name}}<span>{{list.title}}</span></p>
                  <p>{{list.customerName}}</p></div>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div id="newContact" class="mui-popover mui-popover-action mui-popover-bottom">
        <ul class="mui-table-view">
          <li class="mui-table-view-cell">
            <a href="#newContact" @tap="add()">手工新建</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="#newContact" @tap="toAddScan()">名片扫描</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="#newContact" @tap="channel()">通讯录导入</a>
          </li>
        </ul>
        <ul class="mui-table-view">
          <li class="mui-table-view-cell mui-cancel">
            <a href="#newContact"><b>取消</b></a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../public/css/mui.indexedlist.css';
</style>
<script>
  require('db.sqlite');
  import store from '../contact-store';
  var nativeApi = require('nativeApi');
  import {FastClick} from 'fastclick';
  export default {
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '联系人'
        },
        dataList: store.state,
        listObject: {
          height: (document.body.offsetHeight - 44) + 'px'
        }
      };
    },
    methods: {
      backNative: function () {
        nativeApi.goNative();
      },
      tapLink: function (id) {
        var self = this;
        store.detail(id, function () {
          self.$router.go('/detailPage');
        });
      },
      add: function () {
        store.clean();
        this.$router.go('/addPage/1/0');
      },
      toAddScan: function () {
        var self = this;
        nativeApi.bcardScan({
          'apiJson': {
            'bcardType': 'capture',
            'uploadUrl': store.APIS.upload_file
          },
          callback: function (result) {
            var name = result.name || '';
            var address = result.address || '';
            var email = result.email || '';
            var tel = result.tel || '';
            var mobile = result.mobile || '';
            var duty = result.duty || '';
            var company = result.company || '';
            if (company.indexOf('()') > -1) {
              company = company.substring(0, company.indexOf('()'));
            }
            if (name.indexOf('()') > -1) {
              name = name.substring(0, name.indexOf('()'));
            }
            if (address.indexOf('()') > -1) {
              address = address.substring(0, address.indexOf('()'));
            }
            if (email.indexOf('()') > -1) {
              email = email.substring(0, email.indexOf('()'));
            }
            if (tel.indexOf('()') > -1) {
              tel = tel.split('()');
              if (tel.length > 1) {
                tel = tel[0];
              } else {
                tel = tel[0];
              }
            }
            if (duty.indexOf('()') > -1) {
              duty = duty.substring(0, duty.indexOf('()'));
            }
            var resultData = {
              'company': company,
              'name': name,
              'address': address,
              'email': email,
              'mobile': mobile,
              'duty': duty,
              'telephone': tel,
              'addHeadId': result.fId
            };
            store.clean(resultData);
            self.$router.go('/addPage/1/1');
          }
        });
      },
      search: function () {
        store.cleanSearch();
        this.$router.go('/searchPage/0');
      },
      channel: function () {
        this.$router.go('/searchPage/1');
      },
      setMuiIndexed: function () {
        var self = this;
        if (store.state && store.state.arrIndexed.length > 0) {
          mui.init();
          mui.ready(function () {
            var list = document.getElementById('contact_list');
            // create
            window.indexedList = new mui.IndexedList(list);
          });
        } else {
          setTimeout(function () {
            self.setMuiIndexed();
          }, 50);
        }
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
      store.init();
    },
    ready: function () {
      /* 初始化索引列表*/
      this.setMuiIndexed();
      FastClick.attach(document.body);
    }
  };
</script>
