/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @tap="backNative" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @click="saveAdd()">保存</a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div class="mui-scroll-wrapper" :style="styleObject">
        <div class="mui-scroll">
          <div class="add_ac">
            <ul>
              <li>
                <input v-if="!addData.record" type="text" placeholder="主题（必填）" v-model="addData.title">
                <a v-if="addData.record" class="record" @tap="playRecord(addData.record)"><span><span
                  class="mui-icon mui-icon-voice"></span>{{addData.recordSize||'10s'}}</span></a>
                <em class="mui-icon-sound mui-icon" @tap="voice()"></em>
              </li>
              <li>
                <textarea @focus="inputFocus" placeholder="内容（非必填）" v-model="addData.content"></textarea>
              </li>
            </ul>
          </div>
          <div class="add_form">
            <ul>
              <li class="mui-icon mui-icon-ac-type mui-not-must">
                <span :class="{'color_gray':scheduleTime}">全天</span>
                <div class="switch-right" @tap="switchFn()"
                     :class="{'mui-switch':true, 'mui-switch-mini': true, 'mui-active': switch}">
                  <div class="mui-switch-handle"></div>
                </div>
              </li>
              <li v-show="!scheduleTime" class="mui-icon mui-icon-start mui-not-must arrows" style="height:50px;" @tap="getDate('allDay')">
                <span>{{addData.allDay}}</span>
              </li>
              <li v-show="scheduleTime" class="mui-icon mui-icon-start mui-not-must datetime">
                <a @tap="getDateTime('start')" :class="{not: !addData.start}">{{addData.start||'开始时间'}}</a><a
                @tap="getDateTime('end')" :class="{not: !addData.end}" class="mui-icon mui-icon-end mui-not-must">{{addData.end||'结束时间'}}</a>
              </li>
              <li class="mui-icon mui-icon-clock mui-not-must arrows" @click="showRemind(addData.remindId)">
                <span>{{addData.isAlert?addData.remindName:'无提醒'}}</span>
              </li>
            </ul>
            <ul v-if="addData.customer||addData.contact||addData.chance||addData.address.address">
              <li v-if="addData.customer" class="mui-icon mui-icon-customer mui-not-must">
                <span>{{addData.customer}}</span>
                <em class="close mui-icon-delete mui-icon" @tap="clear('customer','customerId')"
                    v-if="addData.customer"></em>
              </li>
              <li v-if="addData.contact" class="mui-icon mui-icon-name mui-not-must">
                <span>{{addData.contact}}</span>
                <em class="close mui-icon-delete mui-icon" @tap="clear('contact','contactId')"
                    v-if="addData.contact"></em>
              </li>
              <li v-if="addData.chance" class="mui-icon mui-icon-chance mui-not-must">
                <span>{{addData.chance}}</span>
                <em class="close mui-icon-delete mui-icon" @tap="clear('chance','chanceId')" v-if="addData.chance"></em>
              </li>
              <li v-if="addData.address.address" class="mui-icon mui-icon-address-api mui-not-must">
                <span>{{addData.address.address}}</span>
                <em class="close mui-icon-delete mui-icon" @tap="clear('address')" v-if="addData.address.address"></em>
              </li>
            </ul>
            <div class="appendix_li mui-scroll-wrapper mui-segmented-control appendix_add" style="height: 80px;"
                 v-show="addData.appendixs && addData.appendixs.length>0">
              <div class="mui-scroll" style="height: 66px;">
                <a v-for="appendix in addData.appendixs">
                  <img v-if="appendix.type=='image'" :src="appendix.path" data-preview-src="" data-preview-group="1">
                  <img v-if="appendix.type=='sound'" src="../../public/images/sound.png"
                       @tap="playRecord(appendix.path)">
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
  import {FastClick} from 'fastclick';
  import {tools} from '../../public/js/tools.js';
  var nativeApi = require('nativeApi');
  require('mui.picker.min');
  require('mui.previewimage');
  require('mui.zoom');
  export default {
    data: function () {
      return {
        currentHeader: {
          title: '新建日程'
        },
        styleObject: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44) + 'px'
        },
        addData: store.state.addData,
        switch: false,
        scheduleRemind: '',
        scheduleTime: true,
        edition: nativeApi.edition
      };
    },
    methods: {
      backNative: function () {
        nativeApi.goNative({
          'apiJson': {
            'fn': 'schedule'
          }
        });
      },
      clean: function () {
        this.scheduleRemind = '';
        this.scheduleTime = true;
        this.switch = false;
      },
      back: function (index) {
        history.go(-1);
      },
      showRemind: function (id) {
        store.selectRemind('reminds', id, '提醒');
        this.$router.go('/scheduleSelect/add');
      },
      backBack: function () {
        this.remindShow = false;
      },
      switchFn: function () {
        if (this.switch) {
          this.switch = false;
          this.scheduleTime = true;
          this.formatStartEnd();
        } else {
          this.switch = true;
          this.scheduleTime = false;
          store.state.addData.allDay = tools.formatDate(new Date(), 'yyyy-mm-dd');
          store.state.addData.start = tools.formatDate(new Date(), 'yyyy-mm-dd') + ' 00:00';
          store.state.addData.end = tools.formatDate(new Date(), 'yyyy-mm-dd') + ' 23:59';
        }
      },
      saveAdd: function () {
        if (!this.addData.title && !this.addData.recordId) {
          mui.alert('请输入主题', '提示');
          return;
        }
        if (!this.addData.start) {
          mui.alert('请输入开始时间', '提示');
          return;
        }
        if (!this.addData.end) {
          mui.alert('请输入结束时间', '提示');
          return;
        }
        var appendix = this.addData.appendixs;
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
          'subject': this.addData.title,
          'myScheduleDesc': this.addData.content,
          'startTime': this.addData.start,
          'endTime': this.addData.end,
          'isAllDay': this.scheduleTime ? 0 : 1,
          'audioSubjectFileId': this.addData.recordId || 0,
          'audioSubjectFileLength': this.addData.recordSize,
          'picFileIds': picFileIds,
          'audioFileIds': audioFileId,
          'isAlert': this.addData.isAlert,
          'alertMinutes': this.addData.alertMinutes,
          'customerId': this.addData.customerId || 0,
          'chanceId': this.addData.chanceId || 0,
          'customerLinkmanId': this.addData.contactId || 0,
          'scheduleType': 0,
          'address': this.addData.address || {},
          'sourceId': 0,
          'fromEntityType': ''
        };
        if (window.initParam) {
          /* 市场活动 */
          saveData.sourceId = window.initParam.id;
          saveData.fromEntityType = 'MARKETING_ACTIVITY';
        }
        setTimeout(function () {
          store.saveData(saveData, function () {
            mui.alert('新增日程成功', '提示', function () {
              nativeApi.goNative({
                'apiJson': {
                  'fn': 'schedule'
                }
              });
            });
          }, function () {
            mui.alert('新增日程失败！', '提示');
          });
        }, 50);
      },
      voice: function () {
        var self = this;
        nativeApi.goRecord({
          'apiJson': {
            'uploadUrl': store.APIS.upload_file
          },
          callback: function (result) {
            self.addData.recordId = result.fId;
            self.addData.record = result.fileUrl;
            self.addData.recordSize = result.recordTime || '2`';
            self.addData.title = '';
          }
        });
      },
      getDateTime: function (field) {
        var self = this;
        var picker = new mui.DtPicker({
          'value': self.addData[field] || ''
        });
        picker.show(function (rs) {
          self.addData[field] = rs.text;
          /* 验证 开始时间早于结束时间*/
          var start = self.addData['start'] || '';
          var end = self.addData['end'] || '';
          start = start.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          end = end.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          if (parseInt(start) > parseInt(end)) {
            if (field === 'end') {
              mui.alert('开始日期不能晚于结束日期', '提示', function () {
                self.addData[field] = '';
              });
            } else {
              self.addData['end'] = '';
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
          'value': self.addData[field] || ''
        });
        picker.show(function (rs) {
          self.addData[field] = rs.text;
          self.addData.start = rs.text + ' 00:00';
          self.addData.end = rs.text + ' 23:59';
          picker.dispose();
        });
      },
      clear: function (field, fieldId) {
        if (field === 'address') {
          this.addData[field] = {};
        } else {
          this.addData[field] = '';
          this.addData[fieldId] = '';
          if (field === 'customer') {
            this.addData.chanceId = 0;
            this.addData.chance = '';
            this.addData.contactId = 0;
            this.addData.contact = '';
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
        var appendix = self.addData.appendixs || [];
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
              self.addData.appendixs = appendix;
            }
          });
        } else if (type === 0) {
          var selectId = self.addData[fn + 'Id'];
          if (typeof store[fn] === 'function') {
            store.state.selectId = selectId;
            if (fn === 'contact') {
              if (!self.addData.customerId && !self.addData.chanceId) {
                mui.alert('请先选择客户或者商机', '提示', function () {
                });
                return;
              }
            }
            this.$router.go('/' + fn + 'Page/' + fn + '_add');
            return;
          }
          store.selectFn(fn, selectId, show, function () {
            this.$router.go('/selectPage/' + fn + '_add');
          });
        } else {
          /* 当前位置*/
          nativeApi[fn]({
            callback: function (result) {
              self.addData.address = result;
            }
          });
        }
      },
      deleteAppendix: function (index) {
        this.addData.appendixs.splice(index, 1);
      },
      change: function (field) {
        if (this.addData[field].length > 0) {
          this.show = true;
        }
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
      formatStartEnd: function () {
        var timeStart = new Date();
        var timeEnd = tools.dateAdd('h', 1);
        store.state.addData.start = tools.formatDate(timeStart, 'yyyy-mm-dd HH:nn');
        store.state.addData.end = tools.formatDate(timeEnd, 'yyyy-mm-dd HH:nn');
      },
      inputFocus: function () {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.addData.content = result.result;
          }
        });
      }
    },
    ready: function () {
      var fromNative = this.$route.params.fromNative;
      if (fromNative) {
        window.initPage = 'toAdd';
      }
      var localKey = this.$route.params.localKey;
      if (localKey) {
        window.initPage = 'toAdd';
        window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
      }
      if (window.initParam && window.initParam.taskName) {
        var datas = window.initParam;
        this.addData.customerId = datas.customerId;
        this.addData.customer = datas.customerName;
        this.addData.chanceId = datas.chanceId;
        this.addData.chance = datas.chanceName;
        this.addData.title = datas.taskName;
      }
      FastClick.attach(document.body);
      this.clean();
      this.formatStartEnd();
      mui.previewImage();
    }
  };
</script>
