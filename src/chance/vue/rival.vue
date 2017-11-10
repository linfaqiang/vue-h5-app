/**
* @file 竞争对手
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon-plusempty mui-icon mui-pull-right" v-if="rival.detailData.isColsed==0" @tap="addRival()"></a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" :class="{'list_is_null': rival.rivalList.length == 0}"
           style="top: 44px;background: #f1f1f1">
        <div class="mui-scroll">
          <div class="rival_li" v-for="list in rival.rivalList">
            <li>{{list.competitorName}}<span class="mui-icon mui-icon-dustbin" @tap="deleteRival($index)"></span></li>
            <li class="mui-icon crm-navigate-right" @tap="toEdit($index, 'strengths')"><label>优势</label>
              <div>{{decodeH(list.strengths)}}</div>
            </li>
            <li class="mui-icon crm-navigate-right" @tap="toEdit($index, 'weaknesses')"><label>劣势</label>
              <div>{{decodeH(list.weaknesses)}}</div>
            </li>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../chance-store';
  var nativeApi = require('nativeApi');
  export default{
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '竞争对手'
        },
        rival: store.state
      };
    },
    methods: {
      deleteRival: function (index) {
        var btnArray = ['否', '是'];
        mui.confirm('是否确认删除？', '提示', btnArray, function (e) {
          if (parseInt(e.index || '0') === 1) {
            store.deleteRival(index);
          }
        });
      },
      addRival: function () {
        this.$router.go('/rivalAddPage');
      },
      decodeH: function (val) {
        return val ? nativeApi.replaceAllCh(val, 1) : '';
      },
      toEdit: function (index, field) {
        var param = 'index=' + index + '&field=' + field;
        store.editGoodBad(param);
        this.$router.go('/goodBadPage/' + param);
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
