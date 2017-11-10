/**
* @file 联系人选择页面
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
      <div id='list' class="mui-indexed-list" :style="listObject">
        <div class="list_search not_type" style="border-bottom: 1px solid #ddd;">
          <span class="mui-icon mui-icon-glass"></span>
          <input type="text" v-model="searchName" placeholder="联系人姓名">
          <span class="search" @tap="search()">搜索</span>
        </div>
        <div v-if="contact.contactAddList.length==0" :class="{'list_is_null': contact.contactAddList.length==0}"></div>
        <!--<div class="mui-indexed-list-bar" v-if="contact.contactAddList.length>0">
            <a v-for="indexed in contact.arrIndexed">{{indexed}}</a>
        </div>-->
        <div class="mui-indexed-list-inner" style="margin-top: 40px;">
          <ul class="mui-table-view con_list">
            <li v-for="list in contact.contactAddList" data-group="{{list.indexedGroup}}"
                :class="{ 'mui-table-view-divider': list.isGroup, 'mui-indexed-list-group': list.isGroup, 'mui-table-view-cell': !list.isGroup, 'mui-indexed-list-item': !list.isGroup }">
              <a @tap="selectBack($index)" class="mui-icon" :class="{'crm-check': list.selected}">
                <span v-if="list.isGroup">{{list.indexedGroup}}</span>
                <div v-else><p class="name">{{list.name}}</p>
                  <p>{{list.title}}</p></div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet/less'>
  @import '../../contact/contact.css';
</style>
<script>
  import store from '../chance-store';
  var nativeApi = require('nativeApi');
  export default{
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '联系人'
        },
        contact: store.state,
        listObject: {
          height: (document.body.offsetHeight - 44) + 'px'
        },
        searchName: ''
      };
    },
    methods: {
      selectBack: function (index) {
        var list = this.contact.contactAddList[index];
        if (list.selected) {
          list.selected = false;
        } else {
          list.selected = true;
        }
      },
      inputFocus: function () {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.searchName = result.result;
          }
        });
      },
      saveTo: function () {
        store.saveAddContact(function () {
          mui.alert('联系人添加成功！', '提示', function () {
            history.go(-1);
          });
        });
      },
      search: function () {
        store.contactList(this.searchName);
      }
    },
    created: function () {
      // 运行 数据中转站的函数
      store.contactList();
    },
    ready: function () {
    }
  };
</script>
