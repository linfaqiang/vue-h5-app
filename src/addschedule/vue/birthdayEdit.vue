/* *
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @tap="back" class="mui-icon mui-icon-left-nav mui-pull-left" @touchend="back()"></a>
      <h1 class="mui-title">编辑生日</h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveBirthday">保存</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" :style="styleObject">
        <div class="mui-scroll">
          <div class="add_ac">
            <ul>
              <li>
                <input type="text" placeholder="寿星" v-model="edit.editDetail.title">
              </li>
              <li>
                <textarea @focus="inputFocus" placeholder="内容" v-model="edit.editDetail.myScheduleDesc"></textarea>
              </li>
            </ul>
          </div>
          <div class="add_form">
            <ul>
              <li class="mui-icon mui-icon-ac-type mui-not-must arrows" @click="renderPicker">
                <span :class="{not: !edit.editDetail.startTime}">{{edit.editDetail.startTime ? splitTime(edit.editDetail.startTime):'日期'}}</span>
              </li>
              <li class="mui-icon mui-icon-fee mui-not-must arrows" @click="showRemind(edit.editDetail.remindId)">
                <span>{{edit.editDetail.isAlert ? (edit.editDetail.alertMinutes ? edit.editDetail.remindName : '正点提醒(08:00)') : '无提醒'}}</span>
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
                  <img v-if="appendix.type=='sound'" src="../../public/images/sound.png"
                       @tap="playRecord(appendix.path)">
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
        edit: store.state,
        scheduleRemind: '提前一天',
        edition: nativeApi.edition
      };
    },
    methods: {
      clean: function () {
        this.scheduleRemind = '';
        this.switch = false;
        for (var attr in this.addData) {
          this.addData[attr] = '';
        }
      },
      saveBirthday: function () {
        if (!this.edit.editDetail.title) {
          mui.alert('请输入寿星', '提示');
          return;
        }
        if (!this.edit.editDetail.startTime) {
          mui.alert('请输入日期', '提示');
          return;
        }

        var conId = this.$route.params.id;
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
          'audioSubjectFileId': this.edit.editDetail.recordId,
          'picFileId': picFileIds,
          'audioFileIds': audioFileId,
          'isAlert': this.edit.editDetail.isAlert,
          'alertMinutes': this.edit.editDetail.alertMinutes,

          'customerId': this.edit.editDetail.customerId,
          'chanceId': this.edit.editDetail.chanceId,
          'customerLinkmanId': this.edit.editDetail.contactId,

          'scheduleType': 1,
          'address': this.edit.editDetail.address || {}
        };

        store.saveData(saveData, function () {
          mui.alert('修改生日成功', '提示', function () {
            nativeApi.goNative({
              'apiJson': {
                'fn': 'schedule'
              }
            });
          });
        }, function () {
          mui.alert('修改生日失败！', '提示');
        }, conId);
      },
      back: function () {
        if (window.initPage === 'birthdayEdit') {
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
        store.selectRemind('remindsBir', id, '提醒');
        this.$router.go('/scheduleSelect/edit');
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
          self.edit.editDetail.startTime = rs.text;
          picker.dispose();
        });
      },
      splitTime: function (val) {
        var newVal = val.split(' ');
        if (newVal.length) {
          return newVal[0];
        } else {
          return val;
        }
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
          /* 当前位置*/
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
    route: {
      data: function () {
        var scheduleId = this.$route.params.id;
        if (scheduleId) {
          window.initPage = 'birthdayEdit';
          store.scheduleEdit(scheduleId, 'edit');
        }
      }
    },
    events: {},
    ready: function () {
    }
  };
</script>
