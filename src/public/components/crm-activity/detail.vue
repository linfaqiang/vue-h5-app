/**
* @file 活动详情
* @author 黄俊
* @date 2016-11-09
*/
<template>
  <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
    <div class="mui-scroll">
      <div class="activity_detail">
        <div class="title">
          <span v-if="detail.subject">{{detail.subject}}</span>
          <span @tap="playRecord(detail.audioSubjectFileUrl)" v-if="detail.audioSubjectFileUrl" class="record"><span
            class="mui-icon mui-icon-voice"></span>{{detail.audioSubjectFileLength}}</span>
        </div>
        <div class="content">
          <ul>
            <li>
              <label>活动类型</label>
              <div>{{detail.typeText}}</div>
            </li>
            <li>
              <label>起始时间</label>
              <div>{{detail.startTime}}</div>
            </li>
            <li>
              <label>结束时间</label>
              <div>{{detail.endTime}}</div>
            </li>
            <li>
              <label>地址</label>
              <div>{{detail.address?detail.address.address:""}}</div>
            </li>
            <li>
              <label>客户</label>
              <div>{{detail.customerName}}</div>
            </li>
            <li v-if="edition!=1">
              <label>商机</label>
              <div>{{detail.chanceName}}</div>
            </li>
            <li>
              <label>联系人</label>
              <div>{{detail.linkman}}</div>
            </li>
            <li>
              <label>活动内容</label>
              <div>{{detail.content}}</div>
            </li>
          </ul>
        </div>
        <div class="appendix_li mui-scroll-wrapper mui-segmented-control" style="height: 80px;"
             v-show="detail.appendixs && detail.appendixs.length>0">
          <div class="mui-scroll" style="height: 66px;">
            <a v-for="appendix in detail.appendixs">
              <img v-if="appendix.type=='image'" :src="appendix.path" data-preview-src="" data-preview-group="1">
              <img v-if="appendix.type=='sound'" src="../../images/sound.png" @tap="playRecord(appendix.path)">
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import '../../css/module.css';
</style>
<script>
  var nativeApi = require('nativeApi');
  export default {
    props: {
      'detail': {},
      'edition': 0
    },
    methods: {
      playRecord: function (pathUrl) {
        /* 播放录音 */
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
      }
    },
    ready: function () {
      var deceleration = mui.os.ios ? 0.003 : 0.0009;
      mui('.mui-scroll-wrapper').scroll({
        bounce: false,
        indicators: true, // 是否显示滚动条
        deceleration: deceleration
      });
    }
  };
</script>
