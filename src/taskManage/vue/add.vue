/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <button class="mui-btn-blue mui-btn-link mui-pull-right" @tap="save()" v-text="currentHeader.btns"></button>
    </header>
    <div class="mui-scroll-wrapper" :style="styleObject">
      <div class="mui-scroll">
        <section class="tast">
          <div class="tastTop">
            <div v-if="add.addData.recordPath" @tap="openRecord(add.addData.recordPath)">
              <span class="deleteSoure mui-icon crm-close" @tap="souceClear()"></span>
              <span class="mui-icon mui-icon-voice"></span>
              <span>{{add.addData.recordTime}}"</span>
            </div>
            <input v-else type="text" v-model="add.addData.text" @focus="inputFocus(1)" placeholder="任务(必填)">
            <a @tap="cloundVol()" class="mui-icon mui-icon-sound"></a>
          </div>
          <textarea class="tastText" v-model="add.addData.textareaVal" placeholder="备注(非必填)"
                    @focus="inputFocus(2)"></textarea>
        </section>
        <section class="setTimes">
          <div class="setTops">
            <div class="time">
              <span class="mui-icon mui-icon-start"></span>
              <div class="times" :class="{not: !add.addData.start}" @tap="getDateTime('start')"
                   v-text="add.addData.start||'开始时间'"></div>
            </div>
            <div class="time">
              <span class="mui-icon mui-icon-end"></span>
              <div class="times" :class="{not: !add.addData.end}" @tap="getDateTime('end')"
                   v-text="add.addData.end||'结束时间'">
              </div>
            </div>
          </div>
          <span class="mui-icon crm-icon-rank rankIcon marginL"></span>
          <div class="rank">优先级</div>
          <ul class="rankChoose">
            <li class="chooseRank" v-for="list in chooseArr" :class="[list.select,list.border]" @tap="tapSelect($index)"
                v-text="list.text"></li>
          </ul>
        </section>
        <div class="add_employee_title">执行人</div>
        <div class="add_employee">
          <div class="list mui-scroll-wrapper mui-segmented-control" :style="add.addData.cssSheet">
            <div class="mui-scroll" style="height: 58px;">
              <ul>
                <li v-for="list in add.addData.acceptors">
                  <img :src="list.headPhotoUrl||'../public/images/default_contact.png'" data-preview-src=""
                       data-preview-group="1">
                  <span v-text="list.name"></span>
                  <span class="delete mui-icon crm-close" @tap="deleteEmp($index)"></span>
                </li>
              </ul>
            </div>
          </div>
          <div class="add_emp_bu">
            <div class="mui-icon mui-icon-plusempty" @tap="transferClue()"></div>
          </div>
        </div>
        <p class="selectedP" v-if="add.addData.customer">
          <span class="mui-icon mui-icon-cust"></span>
          <span class="text-content"><em v-text="add.addData.customer"></em></span>
          <a class="mui-icon mui-icon-delete" @tap="closeCust()"
             v-if="!(add.addData.formOther==1 || add.addData.formOther==2)"></a>
        </p>
        <p class="selectedP" v-if="add.addData.contact">
          <span class="mui-icon mui-icon-name"></span>
          <span class="text-content"><em v-text="add.addData.contact"></em></span>
          <a class="mui-icon mui-icon-delete delete-left" @tap="closeContact()"></a>
        </p>
        <p class="selectedP" v-if="add.addData.chance">
          <span class="mui-icon mui-icon-chance"></span>
          <span class="text-content"><em v-text="add.addData.chance"></em></span>
          <a class="mui-icon mui-icon-delete" @tap="closeChance()" v-if="add.addData.formOther!=2"></a>
        </p>
        <p class="selectedP" style="height:auto;min-height:50px" v-if="add.addData.address">
          <span class="mui-icon mui-icon-address-api"></span>
          <span class="text-content"><em v-text="add.addData.address"></em></span>
          <a class="mui-icon mui-icon-delete" @tap="closeFour()"></a>
        </p>
        <div class="appendix_li mui-scroll-wrapper mui-segmented-control appendix_add" style="height: 80px;"
             v-show="add.addData.appendixs && add.addData.appendixs.length>0">
          <div class="mui-scroll" style="height: 66px;">
            <a v-for="appendix in add.addData.appendixs">
              <img v-if="appendix.type=='image'" :src="appendix.path" data-preview-src="" data-preview-group="1">
              <img v-if="appendix.type=='sound'" src="../../public/images/sound.png" @tap="playRecord(appendix.path)">
              <span class="mui-icon mui-icon-appendix-delete delete" @tap="deleteAppendix($index)"></span>
            </a>
          </div>
        </div>
        <div style="height: 50px"></div>
      </div>
    </div>
    <crm-iconbtn></crm-iconbtn>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../public/css/mui.picker.min.css';
  @import '../../public/css/mui.image.css';
</style>
<script>
  import store from '../task-store';
  import {FastClick} from 'fastclick';
  import CrmIconBtn from '../../public/components/crm-iconBtn/crm-icon.vue';
  require('mui.picker.min');
  require('mui.previewimage');
  require('mui.zoom');
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'crm-iconbtn': CrmIconBtn
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '新建任务',
          btns: '保存'
        },
        add: store.state,
        cssSheet: {
          width: store.state.editData.cssSheet
        },
        chooseArr: [
          {
            'text': '无',
            'select': 'active',
            'border': '',
            'priorityLevel': '0'
          },
          {
            'text': '!',
            'select': '',
            'border': '',
            'priorityLevel': '1'
          },
          {
            'text': '!!',
            'select': '',
            'border': '',
            'priorityLevel': '2'
          },
          {
            'text': '!!!',
            'select': '',
            'border': 'noBorder',
            'priorityLevel': '3'
          }
        ],
        styleObject: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.documentElement.clientHeight - 44) + 'px'
        }
      };
    },
    events: {
      'photoResult': function (result) {
        var appendix = this.add.addData.appendixs || [];
        appendix.push({
          'fId': result.fId,
          'type': 'image',
          'path': result.fileUrl
        });
        this.add.addData.appendixs = appendix;
      },
      'recordResult': function (result) {
        var appendix = this.add.addData.appendixs || [];
        appendix.push({
          'fId': result.fId,
          'type': 'sound',
          'path': result.fileUrl
        });
        this.add.addData.appendixs = appendix;
      },
      'addressResult': function (result) {
        store.state.addData.address = result.address;
        store.state.addData.addressVO.address = result.address;
        store.state.addData.addressVO.province = result.province;
        store.state.addData.addressVO.city = result.city;
        store.state.addData.addressVO.adname = result.district;
        store.state.addData.addressVO.adcode = result.adcode;
        store.state.addData.addressVO.longitude = result.longitude;
        store.state.addData.addressVO.latitude = result.latitude;
      },
      custResult: function (result) {
        store.state.selectId = this.add.addData.customerId;
        this.$router.go('/customerPage/' + result.field + '_add');
      },
      nameResult: function (result) {
        store.state.selectId = this.add.addData.contactId;
        if (!this.add.addData.customerId && !this.add.addData.chanceId) {
          mui.alert('请先选择客户或者商机', '提示', function () {
          });
          return;
        }
        this.$router.go('/contactPage/' + result.field + '_add');
      },
      chanceResult: function (result) {
        store.state.selectId = this.add.addData.chanceId;
        this.$router.go('/chancePage/' + result.field + '_add');
      }
    },
    methods: {
      back: function () {
        if (window.initPage) {
          nativeApi.goNative({
            'apiJson': {
              'fn': 'taskManage'
            }
          });
        } else {
          history.go(-1);
        }
      },
      save: function () {
        store.postAddData(function () {
          if (window.initPage) {
            nativeApi.goNative({
              'apiJson': {
                'fn': 'taskManage',
                'callFun': 'refreshTask',
                'param': ''
              }
            });
          } else {
            history.go(-1);
            store.listRefresh('list');
          }
        });
      },
      souceClear: function () {
        var self = this;
        self.add.addData.recordPath = '';
        store.state.addData.recordId = '';
        store.state.addData.recordTime = '';
      },
      transferClue: function () {
        var self = this;
        store.state.addData.saleTeam.push({
          'staffId': window.loginInfo.staffId,
          'isOwner': 1
        });
        window['taskAddEmp'] = function (lists) {
          self.getSelectEmp(lists);
        };
        this.$router.go('/personPage/addEmp');
      },
      getFirstAdr: function () {
        var self = this;
        nativeApi.getQDLocationInfo({
          callback: function (result) {
            self.add.addData.address = result;
            self.onlyAdrMsg = result;
          }
        });
      },
      getSelectEmp: function (lists) {
        store.addEmp(lists);
      },
      deleteEmp: function (index) {
        this.add.addData.acceptors.splice(index, 1);
        store.setWidth('addData', this.add.addData.acceptors);
      },
      closeCust: function () {
        this.add.addData.customer = '';
        this.add.addData.customerId = '';
      },
      closeContact: function () {
        this.add.addData.contact = '';
        this.add.addData.contactId = '';
      },
      closeChance: function () {
        this.add.addData.chance = '';
        this.add.addData.chanceId = '';
      },
      closeFour: function () {
        this.add.addData.address = '';
        store.state.addData.addressVO.address = '';
        store.state.addData.addressVO.province = '';
        store.state.addData.addressVO.city = '';
        store.state.addData.addressVO.adname = '';
        store.state.addData.addressVO.adcode = '';
        store.state.addData.addressVO.longitude = '';
        store.state.addData.addressVO.latitude = '';
      },
      getDateTime: function (field) {
        var picker = new mui.DtPicker({});
        var self = this;
        picker.show(function (rs) {
          self.add.addData[field] = rs.text;
          /* 验证 开始时间早于结束时间*/
          var start = self.add.addData['start'];
          var end = self.add.addData['end'];
          start = start.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          end = end.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          if (parseInt(start) > parseInt(end)) {
            if (field === 'end') {
              mui.alert('开始日期不能晚于结束日期', '提示', function () {
                self.add.addData['end'] = '';
              });
            } else {
              self.add.addData['end'] = '';
            }
          }
          picker.dispose();
        });
      },
      inputFocus: function (type) {
        var self = this;
        if (type === 1) {
          nativeApi.showKeyboard({
            callback: function (result) {
              self.add.addData.text = result.result;
            }
          });
        }
        if (type === 2) {
          nativeApi.showKeyboard({
            callback: function (result) {
              self.add.addData.textareaVal = result.result;
            }
          });
        }
      },
      getToday: function (ty, num) {
        var now = new Date(new Date().getTime() + num || 0);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        if (ty) {
          var hour = now.getHours();
          var minutes = now.getMinutes();
          return year + '-' + ((month < 10) ? ('0' + month) : month) + '-' + ((day < 10) ? ('0' + day) : day) + ' ' + ((hour < 10) ? ('0' + hour) : hour) + ':' + ((minutes < 10) ? ('0' + minutes) : minutes);
        } else {
          return year + '-' + ((month < 10) ? ('0' + month) : month) + '-' + ((day < 10) ? ('0' + day) : day);
        }
      },
      tapSelect: function (index) {
        var self = this;
        self.chooseArr[self.cutEd || 0].select = '';
        self.chooseArr[index].select = 'active';
        self.cutEd = index;
        store.state.addData.priorityLevel = self.chooseArr[index].priorityLevel;
      },
      cloundVol: function () {
        var self = this;
        nativeApi.goRecord({
          'apiJson': {
            'uploadUrl': store.APIS.upload_file
          },
          callback: function (result) {
            self.add.addData.recordId = result.fId;
            self.add.addData.recordTime = result.recordTime;
            self.add.addData.recordPath = result.fileUrl;
            self.add.addData.text = '';
          }
        });
      },
      openRecord: function (pathUrl) {
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
      deleteAppendix: function (index) {
        this.add.addData.appendixs.splice(index, 1);
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
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
        store.cleanAdd();
        if (window.initParam && window.initParam.id) {
          if (window.initParam.sourceFun === 'market') {
            this.add.addData.sourceId = window.initParam.id;
            this.add.addData.source = '市场活动';
            this.add.addData.fromEntityType = 'MARKETING_ACTIVITY';
          } else {
            /* 日程设为任务*/
            store.addSchedule(window.initParam.id);
          }
        }
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      mui.previewImage();
      FastClick.attach(document.body);
    }
  };
</script>
