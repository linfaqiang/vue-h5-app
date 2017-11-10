<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed;">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveAdd()">保存</a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div class="mui-scroll-wrapper" :style="styleObject">
        <div class="mui-scroll">
          <div class="add_ac">
            <ul>
              <li>
                <input type="text" placeholder="活动主题（必填）" v-model="add.addData.title" v-if="!add.addData.record"
                       @focus="inputFocus('title')">
                <a v-if="add.addData.record" class="record" @tap="playRecord(add.addData.record)"><span><span
                  class="mui-icon mui-icon-voice"></span>{{add.addData.recordSize||'10s'}}</span></a>
                <em class="mui-icon-sound mui-icon" @tap="voice()"></em>
              </li>
              <li>
                <textarea placeholder="活动内容（非必填）" v-model="add.addData.content"
                          @focus="inputFocus('content')"></textarea>
              </li>
            </ul>
          </div>
          <div class="add_form">
            <ul>
              <li class="mui-icon mui-icon-ac-type mui-must arrows" @click="goTo('type', 0, '活动类型')">
                <span :class="{not: !add.addData.type}">{{add.addData.type||"活动类型"}}</span>
              </li>
              <li class="mui-icon mui-icon-start mui-must datetime">
                <a @tap="getDateTime('start')" :class="{not: !add.addData.start}">{{add.addData.start||'开始时间'}}</a><a
                @tap="getDateTime('end')" :class="{not: !add.addData.end}" class="mui-icon mui-icon-end mui-must">{{add.addData.end||'结束时间'}}</a>
              </li>
              <li v-if="false" class="mui-icon mui-icon-fee mui-not-must arrows" @click="goTo('feeType', 0, '费用类型')">
                <span :class="{not: !add.addData.feeType}">{{add.addData.feeType||"费用类型"}}</span>
              </li>
              <li v-if="false" class="mui-icon mui-icon-money mui-not-must">
                <input type="text" placeholder="金额" v-model="add.addData.money" @focus="inputBlock"
                       @input="change('money')" @blur="noInputBlock">
                <em class="crm-close mui-icon" @tap="clear('money')" v-if="show && add.addData.money"></em>
              </li>
            </ul>
            <ul
              v-if="add.addData.customer||add.addData.contact||add.addData.chance||(add.addData.address&&add.addData.address.address)">
              <li v-if="add.addData.customer" class="mui-icon mui-icon-customer mui-not-must">
                <span>{{add.addData.customer}}</span>
                <em class="close mui-icon-delete mui-icon" @tap="clear('customer')"
                    v-if="add.addData.customer && !(add.addData.formOther==1||add.addData.formOther==2)"></em>
              </li>
              <li v-if="add.addData.chance" class="mui-icon mui-icon-chance mui-not-must">
                <span>{{add.addData.chance}}</span>
                <em class="close mui-icon-delete mui-icon" @tap="clear('chance')"
                    v-if="add.addData.chance && add.addData.formOther!=2"></em>
              </li>
              <li v-if="add.addData.contact" class="mui-icon mui-icon-name mui-not-must">
                <span>{{add.addData.contact}}</span>
                <em class="close mui-icon-delete mui-icon" @tap="clear('contact')" v-if="add.addData.contact"></em>
              </li>
              <li v-if="add.addData.address && add.addData.address.address"
                  class="mui-icon mui-icon-address-api mui-not-must">
                <span>{{add.addData.address.address}}</span>
                <em class="close mui-icon-delete mui-icon" @tap="clear('address')"
                    v-if="add.addData.address && add.addData.address.address"></em>
              </li>
            </ul>
            <div class="appendix_li mui-scroll-wrapper mui-segmented-control appendix_add" style="height: 80px;"
                 v-show="add.addData.appendixs && add.addData.appendixs.length>0">
              <div class="mui-scroll" style="height: 66px;">
                <a v-for="appendix in add.addData.appendixs">
                  <img v-if="appendix.type=='image'" :src="appendix.path" data-preview-src="" data-preview-group="1">
                  <img v-if="appendix.type=='sound'" src="../../public/images/sound.png"
                       @tap="playRecord(appendix.path)">
                  <span class="mui-icon mui-icon-appendix-delete delete" @tap="deleteAppendix($index)"></span>
                </a>
              </div>
            </div>
          </div>
          <div style="height: 43px;"></div>
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
<style lang="less" rel="stylesheet/less">
  @import '../../public/css/mui.image.css';
</style>
<script>
  import store from '../activity-store';
  var nativeApi = require('nativeApi');
  require('mui.previewimage');
  require('mui.zoom');
  export default{
    data: function () {
      return {
        currentHeader: {
          title: '新建活动'
        },
        add: store.state,
        styleObject: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44) + 'px'
        },
        edition: nativeApi.edition,
        show: false
      };
    },
    methods: {
      back: function (index) {
        if (window.initPage) {
          /* 参数需去掉 */
          nativeApi.goNative({
            'apiJson': {
              'fn': 'activity'
            }
          });
        } else {
          history.go(-1);
        }
      },
      saveAdd: function () {
        store.saveAdd(function () {
          mui.alert('销售活动新建成功', '提示', function () {
            if (window.initPage) {
              nativeApi.goNative({
                'apiJson': {
                  'fn': 'activity',
                  'callFun': 'refreshFollow',
                  'param': {}
                }
              });
            } else {
              history.go(-1);
            }
          });
        });
      },
      inputFocus: function (field) {
        var setVal = this.add.addData;
        nativeApi.showKeyboard({
          callback: function (result) {
            setVal[field] = result.result;
          }
        });
      },
      voice: function () {
        var self = this;
        nativeApi.goRecord({
          'apiJson': {
            'uploadUrl': store.APIS.upload_file
          },
          callback: function (result) {
            self.add.addData.recordId = result.fId;
            self.add.addData.record = result.fileUrl;
            self.add.addData.recordSize = result.recordTime || '2`';
            self.add.addData.title = '';
          }
        });
      },
      getDateTime: function (field) {
        var self = this;
        var picker = new mui.DtPicker({
          'value': self.add.addData[field] || ''
        });
        picker.show(function (rs) {
          self.add.addData[field] = rs.text;
          /* 验证 开始时间早于结束时间 */
          var start = self.add.addData['start'] || '';
          var end = self.add.addData['end'] || '';
          start = start.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          end = end.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          if (parseInt(start) > parseInt(end)) {
            if (field === 'end') {
              mui.alert('开始日期不能晚于结束日期', '提示', function () {
                self.add.addData[field] = '';
              });
            } else {
              self.add.addData['end'] = '';
            }
            return;
          }
          picker.dispose();
        });
      },
      clear: function (field) {
        this.add.addData[field] = '';
        if (this.add.addData[field + 'Id']) {
          this.add.addData[field + 'Id'] = '';
        }
        if (field === 'customer') {
          this.add.addData.chanceId = '';
          this.add.addData.chance = '';
          this.add.addData.contact = '';
          this.add.addData.contactId = '';
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
        var appendix = self.add.addData.appendixs || [];
        if (type === 1) {
          /* 拍照、录音 */
          nativeApi[fn]({
            'apiJson': {
              'backType': '2',
              'wDivisor': '1024',
              'hDivisor': '780',
              'uploadUrl': store.APIS.upload_file
            },
            callback: function (result) {
              appendix.push({
                'fId': result.fId,
                'type': fn === 'goPhoto' ? 'image' : 'sound',
                'path': result.fileUrl
              });
              self.add.addData.appendixs = appendix;
            }
          });
        } else if (type === 0) {
          /* 客户、联系人、机会选择 */
          if ((fn === 'customer' && (self.add.addData.formOther === 1 || self.add.addData.formOther === 2)) || (fn === 'chance' && self.add.addData.formOther === 2)) {
            return;
          }
          var selectId = self.add.addData[fn + 'Id'];
          if (typeof store[fn] === 'function') {
            store.state.selectId = selectId;
            if (fn === 'contact') {
              if (!self.add.addData.customerId && !self.add.addData.chanceId) {
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
          /* 当前位置 */
          nativeApi[fn]({
            callback: function (result) {
              if (!self.add.addData.address) {
                self.add.addData.address = {};
              }
              self.add.addData.address.address = result.address;
              self.add.addData.address.province = result.province;
              self.add.addData.address.city = result.city;
              self.add.addData.address.adname = result.district;
              self.add.addData.address.adcode = result.adcode;
              self.add.addData.address.longitude = result.longitude;
              self.add.addData.address.latitude = result.latitude;
            }
          });
        }
      },
      deleteAppendix: function (index) {
        this.add.addData.appendixs.splice(index, 1);
      },
      change: function (field) {
        if (this.add.addData[field].length > 0) {
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
      }
    },
    created: function () {
      var localKey = this.$route.params.localKey;
      if (localKey) {
        window.initPage = 'toAdd';
        window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
        localStorage.removeItem(localKey);
      }
      var fromNative = this.$route.params.fromNative;
      if (fromNative) {
        /* 原生调用 */
        window.initPage = 'toAdd';
        var scheduleId = this.$route.params.scheduleId;
        if (scheduleId) {
          window.initParam = {
            'id': scheduleId
          };
        }
      }
      if (window.initPage === 'toAdd') {
        if (window.initParam && window.initParam.id) {
          /* 日程设为活动 */
          store.addSchedule(window.initParam.id);
        } else {
          store.cleanAdd();
        }
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      mui.previewImage();
    }
  };
</script>
