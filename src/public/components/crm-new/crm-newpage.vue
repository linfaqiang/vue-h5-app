<template>
  <!--新建页面组件模板-->
  <div id="crm-new" @click="closeNew" class="mui-content crm-new">
    <div class="close-icon" @tap="closeSchedule()"></div>
    <div id="crm-new-cont">
      <div class="mui-col-xs-6 new-title" v-text="title"></div>
      <ul class="mui-table-view mui-grid-view mui-grid-9">
        <li class="mui-table-view-cell mui-media  mui-col-sm-3" :class="[ num==2 ? 'mui-col-xs-4' : 'mui-col-xs-4']"
            v-for="item in items">
          <a @click="goTo(item,$event)">
            <span class="new_page_icon mui-icon {{ item.icon }}"></span>
            <div class="mui-media-body" v-text="item.name"></div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import '../../css/module.css';
  @import './crm-new.css';
</style>
<script>
  var {FastClick} = require('fastclick');
  var nativeApi = require('nativeApi');
  export default {
    props: {
      num: Number,
      items: {},
      title: String
    },
    data: function () {
      return {
        isShow: false
      };
    },
    methods: {
      closeNew: function () {
        this.$dispatch('parent-show', false);
      },
      closeSchedule: function () {
        this.$emit('hide-newpage', this.isShow);
      },
      goTo: function (item, e) {
        e.stopPropagation();
        e.preventDefault();
        if (item.type === 'back') {
          this.$dispatch('goTo', item.function);
        } else {
          this.$dispatch('parentHide', false);
          localStorage.setItem('public_' + item.function + '_add', JSON.stringify(item.param));
          var urlPort = item.function + '/index.html#!/addPage/public_' + item.function + '_add';
          if (item.function === 'schedule') {
            if (item.page === 'toAddSchedule') {
              urlPort = 'schedule/index.html#!/scheduleAdd/public_' + item.function + '_add';
            }
          }
          nativeApi.goView({
            'apiJson': {
              'isTrue': true,
              'urlPort': urlPort,
              'function': item.function
            }
          });
        }
      }
    },
    ready: function () {
      FastClick.attach(document.body);
    }
  };
</script>
