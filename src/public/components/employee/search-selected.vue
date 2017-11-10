<template>
  <div>
    <div class="search-box">
      <div class="top-bar-wrapper"
           :style="{width:select.hWidth.width+'px'}">
        <div class="top-bar-scroll">
          <ul class="selected-list" :style="{width:(select.personSelectList.length*50)+'px'}">
            <li v-for="p in select.personSelectList">
              <img :src="p.headPhotoUrl||'../public/images/default_contact.png'"
                   onerror="this.src='../public/images/default_contact.png'"><span>{{p.NAME||p.name}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="search-flex" :style="{'left': (select.hWidth.width||10)+'px'}">
        <input type="search" class="search-input" @input="search()" v-model="searchVal" placeholder="搜索">
        <span class="mui-icon mui-icon-search"></span>
      </div>
    </div>
    <div class="emp_search_list" v-show="searchVal" :style="seaListCss">
      <div class="mui-scroll-wrapper" :class="{'list_is_null': select.searchList.length==0}">
        <div class="mui-scroll">
          <ul class="mui-table-view dept-list">
            <li v-for="list in select.searchList" v-if="list.type=='dept'" class="mui-table-view-cell">
            <span @tap="selectIndex($index)" class="mui-icon"
                  :class="{'crm-circle': !list.selected,'crm-solid-check': list.selected,'selected': list.selected}"></span>
              <a @tap="selectIndex($index)"><span class="up_dep">{{list.upDept}}</span><span>{{list.name}}</span><span
                class="mui-icon mui-icon-arrowright arrow"></span></a>
            </li>
          </ul>
          <ul class="mui-table-view">
            <li v-for="list in select.searchList" v-if="list.type=='staff'"
                class="mui-media mui-checkbox-crm mui-left mui-table-view-cell">
              <input name="checkbox" type="checkbox" v-model="list.selected">
              <a v-if="list.name" @tap="selectIndex($index)">
                <img class="mui-media-object mui-pull-left" :src="list.headPhotoUrl||'../public/images/default_contact.png'"
                     onerror="this.src='../public/images/default_contact.png'">
                <div class="mui-media-body">
                  {{list.name}}
                  <p class='mui-ellipsis' v-text="list.title||''"></p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // 公共的数据
  var nativeApi = require('nativeApi');
  import store from './em-store';
  export default {
    data: function () {
      return {
        scroller: null,
        searchVal: '',
        select: store.state,
        seaListCss: {
          height: (document.body.offsetHeight - 130) + 'px'
        }
      };
    },
    methods: {
      search: function () {
        var self = this;
        var searchVal = self.searchVal;
        store.search(searchVal);
      },
      inputFocus: function () {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.searchVal = result.result;
            self.methods.search();
          }
        });
      },
      selectIndex: function (index) {
        var self = this;
        var selectData = this.select.searchList[index];
        if (!selectData.selected) {
          if (selectData.type === 'staff') {
            store.addEmp(selectData);
          } else if (selectData.type === 'dept') {
            store.addDeptEmp(selectData.id, function () {
              store.setDeptSelect(selectData.id);
            });
          }
          self.searchVal = '';
        } else {
          selectData.selected = false;
          store.deleteEmp(selectData.id);
          self.searchVal = '';
        }
      }
    },
    events: {},
    created: function () {
    },
    ready: function () {
      this.scroller = mui('.search-box .top-bar-wrapper').scroll({
        scrollY: false,
        scrollX: true,
        indicators: true
      });
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
