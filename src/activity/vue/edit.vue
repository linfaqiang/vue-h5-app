<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed;">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
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
                <input v-if="!edit.editData.record" type="text" placeholder="活动主题（必填）" v-model="edit.editData.title"
                       @focus="inputFocus('title')">
                <a v-if="edit.editData.record" class="record" @tap="playRecord(edit.editData.record)"><span><span
                  class="mui-icon mui-icon-voice"></span>{{edit.editData.recordSize}}</span></a>
                <em class="mui-icon-sound mui-icon" @tap="voice()"></em>
              </li>
              <li>
                <textarea placeholder="活动内容（非必填）" v-model="edit.editData.content"
                          @focus="inputFocus('content')"></textarea>
              </li>
            </ul>
          </div>
          <div class="edit_page">
            <ul>
              <li>
                <a class="mui-icon arrows" @click="goTo('type', 0, '获取类型')">
                  <label>活动类型</label>
                  <div class="act">{{edit.editData.type}}</div>
                </a>
              </li>
              <li class="datetime">
                <p class="ti"><span @tap="getDateTime('start')">开始时间</span><span @tap="getDateTime('end')" class="end">结束时间</span>
                </p>
                <p>
                  <a>{{edit.editData.start}}</a>
                  <span class="mui-icon mui-icon-end mui-not-must"></span>
                  <a>{{edit.editData.end}}</a>
                </p>
              </li>
            </ul>
            <ul
              v-if="edit.editData.customer||edit.editData.contact||edit.editData.chance||(edit.editData.address && edit.editData.address.address)||edit.editData.appendixs && edit.editData.appendixs.length>0">
              <li v-if="edit.editData.customer">
                <a>
                  <label>客户名称</label>
                  <div class="act">{{edit.editData.customer}}</div>
                  <em class="close mui-icon-delete mui-icon" @tap="clear('customer')"
                      v-if="!(edit.editData.formOther==1 || edit.editData.formOther==2)"></em>
                </a>
              </li>
              <li v-if="edit.editData.chance">
                <a>
                  <label>机会</label>
                  <div class="act">{{edit.editData.chance}}</div>
                  <em class="close mui-icon-delete mui-icon" @tap="clear('chance')"
                      v-if="edit.editData.formOther!=2"></em>
                </a>
              </li>
              <li v-if="edit.editData.contact">
                <a>
                  <label>联系人</label>
                  <div class="act">{{edit.editData.contact}}</div>
                  <em class="close mui-icon-delete mui-icon" @tap="clear('contact')" v-if="edit.editData.contact"></em>
                </a>
              </li>
              <li v-if="edit.editData.address && edit.editData.address.address">
                <a>
                  <label>地址</label>
                  <div class="act">{{edit.editData.address?edit.editData.address.address:''}}</div>
                  <em class="close mui-icon-delete mui-icon" @tap="clear('address')"
                      v-if="edit.editData.address.address"></em>
                </a>
              </li>
            </ul>
            <div class="appendix_li mui-scroll-wrapper mui-segmented-control appendix_add" style="height: 88px;"
                 v-show="edit.editData.appendixs && edit.editData.appendixs && edit.editData.appendixs.length>0">
              <div class="mui-scroll" style="height: 66px;">
                <a v-for="appendix in edit.editData.appendixs">
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
<style>
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
          title: '编辑销售活动'
        },
        edit: store.state,
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
        if (window.initPage === 'toEdit') {
          nativeApi.goNative({
            'apiJson': {
              'fn': 'activity'
            }
          });
        } else {
          history.go(-1);
        }
      },
      saveEdit: function () {
        store.saveEdit(function () {
          mui.alert('编辑销售活动成功', '提示', function () {
            if (window.initPage === 'toEdit') {
              nativeApi.goNative({
                'apiJson': {
                  'fn': 'activity'
                }
              });
            } else {
              if (window.initPage === 'toDetail') {
                window.isEdit = true;
              }
              history.go(-1);
            }
          });
        });
      },
      inputFocus: function (field) {
        var setVal = this.edit.editData;
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
            self.edit.editData.recordId = result.fId;
            self.edit.editData.record = result.fileUrl;
            self.edit.editData.recordSize = result.recordTime;
            self.edit.editData.title = '';
          }
        });
      },
      getDateTime: function (field) {
        var self = this;
        var picker = new mui.DtPicker({
          'value': self.edit.editData[field] || ''
        });
        picker.show(function (rs) {
          self.edit.editData[field] = rs.text;
          /* 验证 开始时间早于结束时间 */
          var start = self.edit.editData['start'] || '';
          var end = self.edit.editData['end'] || '';
          start = start.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          end = end.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          if (parseInt(start) > parseInt(end)) {
            if (field === 'end') {
              mui.alert('开始日期不能晚于结束日期', '提示', function () {
                self.edit.editData[field] = '';
              });
            } else {
              self.edit.editData['end'] = '';
            }
            return;
          }
          picker.dispose();
        });
      },
      clear: function (field) {
        var self = this;
        if (field === 'customer') {
          self.edit.editData.chanceId = '';
          self.edit.editData.chance = '';
          self.edit.editData.contactId = '';
          self.edit.editData.contact = '';
        }
        self.edit.editData[field] = '';
        if (self.edit.editData[field + 'Id']) {
          self.edit.editData[field + 'Id'] = '';
        }
        this.show = false;
      },
      inputBlock: function () {
        this.show = true;
      },
      noInputBlock: function () {
        this.show = false;
      },
      change: function (field) {
        if (this.edit.editData[field].length > 0) {
          this.show = true;
        }
      },
      deleteAppendix: function (index) {
        this.edit.editData.appendixs.splice(index, 1);
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
      goTo: function (fn, type, show) {
        var self = this;
        var appendix = self.edit.editData.appendixs || [];
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
              self.edit.editData.appendixs = appendix;
            }
          });
        } else if (type === 0) {
          /* 客户、联系人、机会选择 */
          if ((fn === 'customer' && (self.edit.editData.formOther === 1 || self.edit.editData.formOther === 2)) || (fn === 'chance' && self.edit.editData.formOther === 2)) {
            return;
          }
          var selectId = self.edit.editData[fn + 'Id'];
          if (typeof store[fn] === 'function') {
            store.state.selectId = selectId;
            if (fn === 'contact') {
              if (!self.edit.editData.customerId && !self.edit.editData.chanceId) {
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
          /* 当前位置 */
          nativeApi[fn]({
            callback: function (result) {
              if (!self.edit.editData.address) {
                self.edit.editData.address = {};
              }
              self.edit.editData.address.address = result.address;
              self.edit.editData.address.province = result.province;
              self.edit.editData.address.city = result.city;
              self.edit.editData.address.adname = result.district;
              self.edit.editData.address.adcode = result.adcode;
              self.edit.editData.address.longitude = result.longitude;
              self.edit.editData.address.latitude = result.latitude;
            }
          });
        }
      }
    },
    created: function () {
      // 运行 数据中转站的函数
      var localKey = this.$route.params.localKey;
      if (localKey) {
        window.initPage = 'toEdit';
        window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
        localStorage.removeItem(localKey);
      }
      var dataId = this.$route.params.dataId;
      if (dataId) {
        window.initPage = 'toEdit';
        window.initParam = {
          'id': dataId
        };
      }
      if (window.initPage === 'toEdit') {
        store.editDetail(window.initParam.id);
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      mui.previewImage();
    }
  };
</script>
