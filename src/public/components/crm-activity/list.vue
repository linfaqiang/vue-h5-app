/**
* @file 活动列表
* @author 黄俊
* @date 2016-11-09
*/
<template>
  <div class="activity_list" v-if="lists.length > 0">
    <ul v-for="list in lists">
      <li class="group"><span class="title">{{list.date}}</span><span class="line"></span></li>
      <li v-for="item in list.list" @tap="tapLink(item.id)" class="content">
        <p>{{item.time}}</p>
        <p class="block" v-if="!isMe(item.createdBy)" v-text="item.createdName"></p>
        <p class="block">
          <span v-text="item.subject" v-if="item.subject"></span>
          <span @tap="playRecord" pathUrl="{{item.audioSubjectFileUrl}}" v-if="item.audioSubjectFileUrl" class="record"><span
            class="mui-icon mui-icon-voice"></span>{{item.audioSubjectFileLength}}</span>
        </p>
        <p><span class="mui-icon mui-icon-address"></span>{{item.address}}</p>
        <span class="point"></span>
        <div v-if="$index < (list.list.length-1)" class="line_left"></div>
      </li>
    </ul>
  </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import '../../css/module.css';
</style>
<script>
  var nativeApi = require('nativeApi');
  export default{
    props: {
      lists: {}
    },
    methods: {
      isMe: function (createdBy) {
        var flag = createdBy === window.loginInfo.staffId;
        return flag;
      },
      tapLink: function (id) {
        this.$dispatch('toDetail', id);
      },
      playRecord: function (event) {
        event.stopPropagation();
        var pathUrl = event.target.getAttribute('pathUrl');
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
    }
  };
</script>
