/* *
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @tap="back" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveEdit()">保存</a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div class="mui-scroll-wrapper" :style="styleObject">
        <div class="mui-scroll">
          <div class="add_ac">
            <ul>
              <li>
                <input v-if="edit.editDetail.title" type="text" placeholder="活动主题（必填）" v-model="edit.editDetail.title">
                <a v-if="edit.editDetail.record" class="record" @tap="playRecord(edit.editDetail.record)"><span><span
                  class="mui-icon mui-icon-voice"></span>{{edit.editDetail.recordSize||'10s'}}</span></a>
                <em class="mui-icon-sound mui-icon" @tap="voice()"></em>
              </li>
              <li>
                <textarea @focus="inputFocus" placeholder="活动内容（非必填）"
                          v-model="edit.editDetail.myScheduleDesc"></textarea>
              </li>
            </ul>
          </div>
          <div class="add_form">
            <ul>
              <li class="mui-icon mui-icon-ac-type mui-not-must">
                <span :class="{'color_gray': !edit.editDetail.isAllDay}">全天</span>
                <div class="switch-right" @tap="switchFn()"
                     :class="{'mui-switch':true, 'mui-switch-mini': true, 'mui-active': edit.editDetail.isAllDay}">
                  <div class="mui-switch-handle"></div>
                </div>
              </li>
              <li v-show="!edit.editDetail.isAllDay" class="mui-icon mui-icon-start mui-not-must datetime">
                <a @tap="getDateTime('startTime')" :class="{not: !edit.editDetail.startTime}">{{edit.editDetail.startTime||'开始时间'}}</a>
                <a @tap="getDateTime('endTime')" :class="{not: !edit.editDetail.endTime}"
                   class="mui-icon mui-icon-end mui-not-must">{{edit.editDetail.endTime||'结束时间'}}</a>
              </li>
              <li v-show="edit.editDetail.isAllDay" class="mui-icon mui-icon-start mui-not-must arrows" style="height:50px;" @tap="getDate('allDay')">
                <span>{{edit.editDetail.allDay}}</span>
              </li>
              <li class="mui-icon mui-icon-fee mui-not-must arrows" @click="showRemind(edit.editDetail.remindId)">
                <span>{{edit.editDetail.isAlert ? (edit.editDetail.alertMinutes ? edit.editDetail.remindName : '正点提醒') : '无提醒'}}</span>
              </li>
            </ul>
            <ul
              v-if="edit.editDetail.customer||edit.editDetail.contact||edit.editDetail.chance||edit.editDetail.address.address">
              <li v-if="edit.editDetail.customer" class="mui-icon mui-icon-customer mui-not-must">
                <span>{{edit.editDetail.customer}}</span>
                <em class="close mui-icon-delete mui-icon" @tap="clear('customer','customerId')"
                    v-if="edit.editDetail.customer"></em>
              </li>
              <li v-if="edit.editDetail.contact" class="mui-icon mui-icon-name mui-not-must">
                <span>{{edit.editDetail.contact}}</span>
                <em class="close mui-icon-delete mui-icon" @tap="clear('contact','contactId')"
                    v-if="edit.editDetail.contact"></em>
              </li>
              <li v-if="edit.editDetail.chance" class="mui-icon mui-icon-chance mui-not-must">
                <span>{{edit.editDetail.chance}}</span>
                <em class="close mui-icon-delete mui-icon" @tap="clear('chance','chanceId')"
                    v-if="edit.editDetail.chance"></em>
              </li>
              <li v-if="edit.editDetail.address.address" class="mui-icon mui-icon-address-api mui-not-must">
                <span>{{edit.editDetail.address.address}}</span>
                <em class="close mui-icon-delete mui-icon" @tap="clear('address')"
                    v-if="edit.editDetail.address.address"></em>
              </li>
            </ul>
            <div class="appendix_li mui-scroll-wrapper mui-segmented-control appendix_add" style="height: 80px;"
                 v-show="edit.editDetail.appendixs && edit.editDetail.appendixs.length>0">
              <div class="mui-scroll" style="height: 66px;">
                <a v-for="appendix in edit.editDetail.appendixs">
                  <img v-if="appendix.type=='image'" :src="appendix.path" data-preview-src="" data-preview-group="1">
                  <img v-if="appendix.type=='sound'" src="../../public/images/sound.png" @tap="playRecord(appendix.path)">
                  <span class="mui-icon mui-icon-appendix-delete delete" @tap="deleteAppendix($index)"></span>
                </a>
              </div>
            </div>
          </div>
          <div style="height: 44px;"></div>
        </div>
      </div>
      <footer class="rest_bn api_act">
        <a class="mui-icon mui-icon-photograph" @tap="goTo('goPhoto', 1)">拍照</a>
        <a class="mui-icon mui-icon-voice" @tap="goTo('goRecord', 1)">语音</a>
        <a class="mui-icon mui-icon-customer" @tap="goTo('customer', 0, '客户')">客户</a>
        <a class="mui-icon mui-icon-chance" @tap="goTo('chance', 0, '商机')" v-if="edition!=1">商机</a>
        <a class="mui-icon mui-icon-name" @tap="goTo('contact', 0, '联系人')">联系人</a>
        <a class="mui-icon mui-icon-address-api" @tap="goTo('getQDLocationInfo', 2)">地址</a>
      </footer>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../public/css/mui.image.css';
  @import '../../public/css/mui.picker.min.css';
</style>
<script>
  import store from '../schedule-store';
  import {tools} from '../../public/js/tools.js';
  var nativeApi = require('nativeApi');
  require('mui.picker.min');
  require('mui.previewimage');
  require('mui.zoom');
  export default {
    data: function () {
      return {
        currentHeader: {
          title: '编辑日程'
        },
        styleObject: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44) + 'px'
        },
        edit: store.state,
        scheduleRemind: '',
        scheduleTime: true,
        edition: nativeApi.edition
      };
    },
    methods: {
      back: function (index) {
        if (window.initPage === 'scheduleEdit') {
          nativeApi.goNative({
            'apiJson': {
              'fn': 'schedule'
            }
          });
        } else {
          history.go(-1);
        }
      },
      showRemind: function (id) {
        store.selectRemind('reminds', id, '提醒');
        this.$router.go('/scheduleSelect/edit');
      },
      backBack: function () {
        this.remindShow = false;
      },
      switchFn: function () {
        if (this.switch) {
          this.switch = false;
          this.edit.editDetail.isAllDay = 1;
          this.edit.editDetail.startTime = store.state.editDetail.startTime;
          this.edit.editDetail.endTime = store.state.editDetail.endTime;
        } else {
          this.switch = true;
          this.edit.editDetail.isAllDay = 0;
          this.edit.editDetail.allDay = tools.formatDate(new Date(), 'yyyy-mm-dd');
          this.edit.editDetail.startTime = tools.formatDate(new Date(), 'yyyy-mm-dd') + ' 00:00';
          this.edit.editDetail.endTime = tools.formatDate(new Date(), 'yyyy-mm-dd') + ' 23:59';
        }
      },
      saveEdit: function () {
        if (!this.edit.editDetail.title && !this.edit.editDetail.recordId) {
          mui.alert('请输入主题', '提示');
          return;
        }

        if (!this.edit.editDetail.startTime) {
          mui.alert('请输入开始时间', '提示');
          return;
        }

        if (!this.edit.editDetail.endTime) {
          mui.alert('请输入结束时间', '提示');
          return;
        }

        var conId = this.edit.editDetail.id;
        var appendix = this.edit.editDetail.appendixs;
        var picFileIds = '';
        var audioFileId = '';
        for (var i = 0; i < appendix.length; i++) {
          if (appendix[i].type === 'image') {
            picFileIds += appendix[i].fId + ',';
          } else if (appendix[i].type === 'sound') {
            audioFileId += appendix[i].fId + ',';
          }
        }
        if (picFileIds.length > 0) {
          picFileIds = picFileIds.substring(0, picFileIds.length - 1);
        }
        if (audioFileId.length > 0) {
          audioFileId = audioFileId.substring(0, audioFileId.length - 1);
        }
        var saveData = {
          'subject': this.edit.editDetail.title,
          'myScheduleDesc': this.edit.editDetail.myScheduleDesc,
          'startTime': this.edit.editDetail.startTime,
          'endTime': this.edit.editDetail.endTime,
          'isAllDay': this.edit.editDetail.isAllDay,
          'audioSubjectFileId': this.edit.editDetail.recordId,
          'audioSubjectFileLength': this.edit.editDetail.recordSize,
          'picFileIds': picFileIds,
          'audioFileIds': audioFileId,
          'isAlert': this.edit.editDetail.isAlert,
          'alertMinutes': this.edit.editDetail.alertMinutes,

          'customerId': this.edit.editDetail.customerId || 0,
          'chanceId': this.edit.editDetail.chanceId || 0,
          'customerLinkmanId': this.edit.editDetail.contactId || 0,

          'scheduleType': 0,
          'address': this.edit.editDetail.address || {}
        };
        store.saveData(saveData, function () {
          mui.alert('修改日程成功', '提示', function () {
            nativeApi.goNative({
              'apiJson': {
                'fn': 'schedule'
              }
            });
          });
        }, function () {
          mui.alert('修改日程失败！', '提示');
        }, conId);
      },
      voice: function () {
        var self = this;
        nativeApi.goRecord({
          'apiJson': {
            'uploadUrl': store.APIS.upload_file
          },
          callback: function (result) {
            self.edit.editDetail.recordId = result.fId;
            self.edit.editDetail.record = result.fileUrl;
            self.edit.editDetail.recordSize = result.recordTime || '2`';
            self.edit.editDetail.title = '';
          }
        });
      },
      getDateTime: function (field) {
        var self = this;
        var picker = new mui.DtPicker({
          'value': self.edit.editDetail[field] || ''
        });
        picker.show(function (rs) {
          self.edit.editDetail[field] = rs.text;
          /*  验证 开始时间早于结束时间*/
          var start = self.edit.editDetail['startTime'] || '';
          var end = self.edit.editDetail['endTime'] || '';
          start = start.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          end = end.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          if (parseInt(start) > parseInt(end)) {
            if (field === 'endTime') {
              mui.alert('开始日期不能晚于结束日期', '提示', function () {
                self.edit.editDetail[field] = '';
              });
            } else {
              self.edit.editDetail['endTime'] = '';
            }
            return;
          }
          picker.dispose();
        });
      },
      getDate: function (field) {
        var self = this;
        var picker = new mui.DtPicker({
          'type': 'date',
          'value': self.edit.editDetail[field] || ''
        });
        picker.show(function (rs) {
          self.edit.editDetail[field] = rs.text;
          self.edit.editDetail.startTime = rs.text + ' 00:00';
          self.edit.editDetail.endTime = rs.text + ' 23:59';
          picker.dispose();
        });
      },
      clear: function (field, fieldId) {
        if (field === 'address') {
          this.edit.editDetail[field] = {};
        } else {
          this.edit.editDetail[field] = '';
          this.edit.editDetail[fieldId] = 0;
          if (field === 'customer') {
            this.edit.editDetail.chanceId = 0;
            this.edit.editDetail.chance = '';
            this.edit.editDetail.contactId = 0;
            this.edit.editDetail.contact = '';
          }
        }
        this.show = false;
      },
      inputBlock: function () {
        this.show = true;
      },
      noInputBlock: function () {
        this.show = false;
      },
      goTo: function (fn, type, show) {
        var self = this;
        var appendix = self.edit.editDetail.appendixs || [];
        if (type === 1) {
          /*  拍照、录音*/
          nativeApi[fn]({
            'apiJson': {
              'backType': '2',
              'wDivisor': '1024',
              'hDivisor': '780',
              'uploadUrl': store.APIS.upload_file
            },
            callback: function (result) {
              var type = 'sound';
              if (fn === 'goPhoto') {
                type = 'image';
              }
              appendix.push({
                'fId': result.fId,
                'type': type,
                'path': result.fileUrl
              });
              self.edit.editDetail.appendixs = appendix;
            }
          });
        } else if (type === 0) {
          /* 客户、联系人、机会选择*/
          var selectId = self.edit.editDetail[fn + 'Id'];

          if (typeof store[fn] === 'function') {
            store.state.selectId = selectId;
            if (fn === 'contact') {
              if (!self.edit.editDetail.customerId && !self.edit.editDetail.chanceId) {
                mui.alert('请先选择客户或者商机', '提示', function () {
                });
                return;
              }
            }
            self.$router.go('/' + fn + 'Page/' + fn + '_edit');
            return;
          }

          store.selectFn(fn, selectId, show, function () {
            self.$router.go('/selectPage/' + fn + '_edit');
          });
        } else {
          /*  当前位置*/
          nativeApi[fn]({
            callback: function (result) {
              self.edit.editDetail.address = result;
            }
          });
        }
      },
      deleteAppendix: function (index) {
        this.edit.editDetail.appendixs.splice(index, 1);
      },
      playRecord: function (pathUrl) {
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
      inputFocus: function () {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.edit.editDetail.myScheduleDesc = result.result;
          }
        });
      }
    },
    ready: function () {
      var scheduleId = this.$route.params.id;
      if (scheduleId) {
        window.initPage = 'scheduleEdit';
        store.scheduleEdit(this.$route.params.id, 'edit');
      }
      mui('.mui-scroll-wrapper').scroll();
      mui.previewImage();
    }
  };
</script>
