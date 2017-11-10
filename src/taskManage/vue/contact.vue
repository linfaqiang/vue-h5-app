/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
    </header>
    <div class="mui-content">
      <div id='ac_contact_list' class="mui-indexed-list" :style="listObject">
        <div class="list_search not_type" style="border-bottom: 1px solid #ddd;">
          <span class="mui-icon mui-icon-glass"></span>
          <input type="text" v-model="searchName" placeholder="联系人姓名" @focus="inputFocus()">
          <span class="search" @tap="search()">搜索</span>
        </div>
        <div v-if="contact.contactList.length==0" style="top: 84px;"
             :class="{'list_is_null': contact.contactList.length==0}"></div>
        <div class="mui-indexed-list-bar" v-if="false">
          <a v-for="indexed in contact.arrIndexed">{{indexed}}</a>
        </div>
        <div class="mui-scroll-wrapper" style="margin-top: 84px">
          <div class="mui-scroll con_list">
            <li v-for="list in contact.contactList" data-group="{{list.indexedGroup}}"
                :class="{ 'mui-table-view-divider': list.isGroup, 'mui-indexed-list-group': list.isGroup, 'mui-table-view-cell': !list.isGroup, 'mui-indexed-list-item': !list.isGroup }">
              <a @tap="selectBack($index)" class="mui-icon" :class="{'crm-check': list.selected}">
                <span v-if="list.isGroup">{{list.indexedGroup}}</span>
                <div v-else><p class="name">{{list.linkmanName||list.name}}</p>
                  <p>{{list.title}}</p></div>
              </a>
            </li>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../task-store';
  var nativeApi = require('nativeApi');
  export default {
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '选择联系人'
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
        var self = this;
        var param = self.$route.params.param;
        var arrPram = param.split('_');
        var backData = this.contact.contactList[index];
        store.updateField('contactId', backData.linkmanId || backData.id, arrPram[1]);
        store.updateField('contact', backData.linkmanName || backData.name, arrPram[1]);
        history.go(-1);
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
        store.contact(this.searchName);
      }
    },
    created: function () {
    },
    route: {
      activate: function (transition) {
        this.searchName = '';
        transition.next();
      },
      data: function () {
        var param = this.$route.params.param;
        var type = '';
        if (param.indexOf('_edit') > -1) {
          type = 'edit';
        }
        store.contact('', type);
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
