/* *
* @file 生日日程 新建
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @tap="backNative" class="mui-icon mui-icon-left-nav mui-pull-left" @touchend="back()"></a>
      <h1 class="mui-title">新建生日</h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @click="saveBirthday()">保存</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" :style="styleObject">
        <div class="mui-scroll">
          <div class="add_ac">
            <ul>
              <li>
                <input type="text" placeholder="寿星" v-model="addData.title">
              </li>
              <li>
                <textarea @focus="inputFocus" placeholder="备注" v-model="addData.content"></textarea>
              </li>
            </ul>
          </div>
          <div class="add_form">
            <ul>
              <li class="mui-icon mui-icon-ac-type mui-not-must arrows" @click="renderPicker">
                <span :class="{not: !addData.start}">{{addData.start?addData.start:'日期'}}</span>
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
                  <img v-if="appendix.type=='sound'" src="../../public/images/sound.png" @tap="playRecord(appendix.path)">
                  <span class="mui-icon mui-icon-appendix-delete delete" @tap="deleteAppendix($index)"></span>
                </a>
              </div>
            </div>
          </div>
          <div style="height:10px;"></div>
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
  import store from '../addschedule-store';
  var nativeApi = require('nativeApi');
  import {tools} from '../../public/js/tools.js';
  require('mui.picker.min');
  require('mui.previewimage');
  require('mui.zoom');
  export default {
    data: function () {
      return {
        remindShow: false,
        styleObject: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44 - 44) + 'px'
        },
        addData: store.state.addData,
        scheduleRemind: '',
        edition: nativeApi.edition
      };
    },
    methods: {
      back: function () {
        history.go(-1);
        console.log(111);
      },
      saveBirthday: function () {
        if (!this.addData.title) {
          mui.alert('请输入寿星', '提示');
          return;
        }
        if (!this.addData.start) {
          mui.alert('请输入日期', '提示');
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
          'audioSubjectFileId': this.addData.recordId || 0,
          'picFileIds': picFileIds,
          'audioFileIds': audioFileId,
          'isAlert': this.addData.isAlert,
          'alertMinutes': this.addData.alertMinutes,
          'customerId': this.addData.customerId || 0,
          'chanceId': this.addData.chanceId || 0,
          'customerLinkmanId': this.addData.contactId || 0,
          'scheduleType': 1,
          'isALllDay': 1,
          'address': this.addData.address || {}
        };

        store.saveData(saveData, function () {
          mui.alert('新增生日成功', '提示', function () {
            nativeApi.goNative({
              'apiJson': {
                'fn': 'schedule'
              }
            });
          });
        }, function () {
          mui.alert('新增生日失败！', '提示');
        });
      },
      backNative: function () {
        nativeApi.goNative({
          'apiJson': {
            'fn': 'schedule'
          }
        });
      },
      clean: function () {
        this.scheduleRemind = '';
        this.switch = false;
        for (var attr in this.addData) {
          this.addData[attr] = '';
        }
      },
      showRemind: function (id) {
        store.selectRemind('remindsBir', id, '提醒');
        this.$router.go('/scheduleSelect/add');
      },
      backBack: function () {
        this.remindShow = false;
      },
      renderPicker: function (e) {
        var self = this;
        var options = {
          'type': 'date',
          'beginYear': '1900'
        };
        var picker = new mui.DtPicker(options);
        picker.show(function (rs) {
          self.addData.start = rs.text;
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
          /* 拍照、录音*/
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
          /* 客户、联系人、机会选择*/
          if (window.initParam && (fn === 'customer' || fn === 'chance')) {
            return;
          }
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
            self.$router.go('/' + fn + 'Page/' + fn + '_add');
            return;
          }
          store.selectFn(fn, selectId, show, function () {
            self.$router.go('/selectPage/' + fn + '_add');
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
      inputFocus: function () {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.addData.content = result.result;
          }
        });
      }
    },
    events: {},
    ready: function () {
      this.clean();
      this.addData.time = tools.formatDate(new Date(), 'yyyy-mm-dd');
    }
  };
</script>
