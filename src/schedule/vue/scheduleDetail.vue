/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @tap="backNative" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">日程详情</h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="goEdit(lists.editData.myScheduleId)">编辑</a>
    </header>
    <div class="activity_detail" style="padding-top: 44px">
      <div class="title">
        <span v-if="lists.editData.subject">{{lists.editData.subject}}</span>
        <span @tap="playRecord(lists.editData.audioSubjectFileUrl)" v-if="lists.editData.audioSubjectFileUrl"
              class="record"><span
          class="mui-icon mui-icon-voice"></span>{{lists.editData.audioSubjectFileLength}}</span>
      </div>
      <div class="content">
        <ul>
          <li>
            <label class="detail-name">内容</label>
            <div>{{lists.editData.myScheduleDesc}}</div>
          </li>
          <li>
            <label class="detail-name">起始时间</label>
            <div>{{lists.editData.startTime}}</div>
          </li>
          <li>
            <label class="detail-name">结束时间</label>
            <div>{{lists.editData.endTime}}</div>
          </li>
          <li>
            <label class="detail-name">地址</label>
            <div>{{lists.editData.address.address}}</div>
          </li>
          <li>
            <label class="detail-name">提醒</label>
            <div>{{lists.editData.isAlert ? (lists.editData.alertMinutes ? lists.editData.remindName : '正点提醒') :
              '无提醒'}}
            </div>
          </li>
          <li>
            <label class="detail-name">客户名称</label>
            <div>{{lists.editData.customerName}}</div>
          </li>
          <li>
            <label class="detail-name">联系人</label>
            <div>{{lists.editData.linkman}}</div>
          </li>
          <li v-if="edition!=1">
            <label class="detail-name">商机</label>
            <div>{{lists.editData.chanceName}}</div>
          </li>
        </ul>
      </div>
      <div class="appendix_li mui-scroll-wrapper mui-segmented-control" style="height: 80px;"
           v-show="lists.editData.appendixs && lists.editData.appendixs.length>0">
        <div class="mui-scroll" style="height: 66px;">
          <a v-for="appendix in lists.editData.appendixs">
            <img v-if="appendix.type=='image'" :src="appendix.path" data-preview-src="" data-preview-group="1">
            <img v-if="appendix.type=='sound'" src="../../public/images/sound.png" @tap="playRecord(appendix.path)">
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../public/css/module.css';
  @import '../../public/css/mui.image.css';
</style>
<script>
  import {APIS} from 'configPort';
  import store from '../schedule-store';
  var nativeApi = require('nativeApi');
  require('mui.previewimage');
  require('mui.zoom');
  export default {
    data: function () {
      return {
        lists: store.state,
        edition: nativeApi.edition
      };
    },
    methods: {
      backNative: function () {
        if (APIS.is_weixin) {
          history.go(-1);
        }
        nativeApi.goNative({
          'apiJson': {
            'fn': 'schedule'
          }
        });
      },
      playRecord: function (pathUrl) {
        /* 播放录音*/
        nativeApi.goDownload({
          'apiJson': {
            'endBack': '3',
            'file': {
              'name': pathUrl.substring(pathUrl.lastIndexOf('/') + 1, pathUrl.length),
              'sha': pathUrl.substring(pathUrl.lastIndexOf('/') + 1, pathUrl.lastIndexOf('.')),
              'size': '',
              'status': '1',
              'type': pathUrl.substring(pathUrl.lastIndexOf('.') + 1, pathUrl.length),
              'url': pathUrl
            },
            'type': 'AUDIO'
          },
          callback: function (result) {
          }
        });
      },
      goEdit: function (id) {
        var self = this;
        store.scheduleEdit(this.$route.params.id, 'edit', function () {
          self.$router.go('/scheduleEdit');
        });
      }
    },
    ready: function () {
      store.scheduleEdit(this.$route.params.id);
    }
  };
</script>
