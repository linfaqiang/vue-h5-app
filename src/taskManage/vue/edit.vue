/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <button class="mui-btn-blue mui-btn-link mui-pull-right" @tap="save()" v-text="currentHeader.btns"></button>
    </header>
    <div class="mui-scroll-wrapper" :style="styleObject">
      <div class="mui-scroll">
        <section class="tast">
          <div class="tastTop">
            <div v-if="timeList.editData.recordPath" @tap="openRecord(timeList.editData.recordPath)">
              <span class="deleteSoure mui-icon crm-close" @tap="souceClear()"></span>
              <span class="mui-icon mui-icon-voice"></span>
              <span v-text="timeList.editData.recordTime"></span>
            </div>
            <input v-else type="text" v-model="timeList.editData.text" @focus="inputFocus(1)" placeholder="任务(必填)">
            <a @tap="cloundVol()" class="mui-icon mui-icon-sound"></a>
          </div>
          <textarea class="tastText" placeholder="描述(非必输)" v-model="timeList.editData.textareaVal"
                    @focus="inputFocus(2)"></textarea>
        </section>
        <section class="setTime">
          <div class="setTop">
            <div class="time">
              <span class="mui-icon mui-icon-start"></span>
              <p class="titles">开始时间</p>
              <div class="times" :class="{not: !timeList.editData.start}" @tap="getDateTime('start')"
                   v-text="timeList.editData.start||'开始时间'"></div>
            </div>
            <div class="time">
              <span class="mui-icon mui-icon-end"></span>
              <p class="titles">结束时间</p>
              <div class="times" :class="{not: !timeList.editData.end}" @tap="getDateTime('end')"
                   v-text="timeList.editData.end||'结束时间'"></div>
            </div>
          </div>
          <span class="mui-icon crm-icon-rank rankIcon"></span>
          <div class="rank">优先级</div>
          <ul class="rankChoose">
            <li class="chooseRank" v-for="list in chooseArr" :class="[list.select,list.border]" @tap="tapSelect($index)"
                v-text="list.text"></li>
          </ul>
        </section>
        <div class="add_employee_title">执行人</div>
        <div class="add_employee">
          <div class="list mui-scroll-wrapper mui-segmented-control" style="height: 58px;"
               :style="timeList.editData.cssSheet">
            <div class="mui-scroll" style="height: 58px;">
              <ul>
                <li v-for="list in timeList.editData.acceptors">
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
        <p class="selectedP" v-if="timeList.editData.customer">
          <span class="mui-icon mui-icon-cust"></span>
          <span class="text-content"><em v-text="timeList.editData.customer"></em></span>
          <a class="mui-icon mui-icon-delete" @tap="closeCust()"
             v-if="!(timeList.editData.formOther==1 || timeList.editData.formOther==2)"></a>
        </p>
        <p class="selectedP" v-if="timeList.editData.contact">
          <span class="mui-icon mui-icon-name"></span>
          <span class="text-content"><em v-text="timeList.editData.contact"></em></span>
          <a class="mui-icon mui-icon-delete delete-left" @tap="closeContact()"
             v-if="timeList.editData.formOther!=2"></a>
        </p>
        <p class="selectedP" v-if="timeList.editData.chance">
          <span class="mui-icon mui-icon-chance"></span>
          <span class="text-content"><em v-text="timeList.editData.chance"></em></span>
          <a class="mui-icon mui-icon-delete" @tap="closeChance()"></a>
        </p>
        <p class="selectedP" style="height:auto;min-height:50px" v-if="timeList.editData.address">
          <span class="mui-icon mui-icon-address-api"></span>
          <span class="text-content"><em v-text="timeList.editData.address"></em></span>
          <a class="mui-icon mui-icon-delete" @tap="closeFour()"></a>
        </p>
        <div class="appendix_li mui-scroll-wrapper mui-segmented-control appendix_add" style="height: 80px;"
             v-show="timeList.editData.appendixs && timeList.editData.appendixs.length>0">
          <div class="mui-scroll" style="height: 66px;">
            <a v-for="appendix in timeList.editData.appendixs">
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
  var nativeApi = require('nativeApi');
  import CrmIconBtn from '../../public/components/crm-iconBtn/crm-icon.vue';
  require('mui.picker.min');
  require('mui.previewimage');
  require('mui.zoom');
  export default {
    components: {
      'crm-iconbtn': CrmIconBtn
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '编辑任务',
          btns: '保存'
        },
        timeList: store.state,
        select: store.state,
        addData: [],
        cssSheet: {
          width: store.state.editData.cssSheet
        },
        chooseArr: store.state.chooseArr,
        styleObject: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44) + 'px'
        }
      };
    },
    events: {
      'photoResult': function (result) {
        var appendix = this.timeList.editData.appendixs || [];
        appendix.push({
          'fId': result.fId,
          'type': 'image',
          'path': result.fileUrl
        });
        this.timeList.editData.appendixs = appendix;
      },
      'recordResult': function (result) {
        var appendix = this.timeList.editData.appendixs || [];
        appendix.push({
          'fId': result.fId,
          'type': 'sound',
          'path': result.fileUrl
        });
        this.timeList.editData.appendixs = appendix;
      },
      'addressResult': function (result) {
        store.state.editData.address = result.address;
        store.state.editData.addressVO.address = result.address;
        store.state.editData.addressVO.province = result.province;
        store.state.editData.addressVO.city = result.city;
        store.state.editData.addressVO.adname = result.district;
        store.state.editData.addressVO.adcode = result.adcode;
        store.state.editData.addressVO.longitude = result.longitude;
        store.state.editData.addressVO.latitude = result.latitude;
      },
      custResult: function (result) {
        store.state.selectId = this.timeList.editData.customerId;
        this.$router.go('/customerPage/' + result.field + '_edit');
      },
      nameResult: function (result) {
        store.state.selectId = this.timeList.editData.contactId;
        if (!this.timeList.editData.customerId && !this.timeList.editData.chanceId) {
          mui.alert('请先选择客户或者商机', '提示', function () {
          });
          return;
        }
        this.$router.go('/contactPage/' + result.field + '_edit');
      },
      chanceResult: function (result) {
        store.state.selectId = this.timeList.editData.chanceId;
        this.$router.go('/chancePage/' + result.field + '_edit');
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
        }
      },
      souceClear: function () {
        var self = this;
        self.timeList.editData.recordPath = '';
        store.state.editData.audioSubjectFileId = '';
        store.state.addData.recordTime = '';
      },
      save: function () {
        store.saveEdit(function () {
          mui.alert('编辑任务成功', '提示', function () {
            if (window.initPage === 'toEdit') {
              nativeApi.goNative({
                'apiJson': {
                  'fn': 'taskManage'
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
      transferClue: function () {
        var self = this;
        window['taskEditEmp'] = function (lists) {
          self.getSelectEmp(lists);
        };
        this.$router.go('/personPage/editEmp');
      },
      getSelectEmp: function (lists) {
        store.editEmp(lists);
      },
      deleteEmp: function (index) {
        this.timeList.editData.acceptors.splice(index, 1);
        store.setWidth('editData', this.timeList.editData.acceptors);
      },
      closeCust: function () {
        this.timeList.editData.customer = '';
        this.timeList.editData.customerId = '';
      },
      closeContact: function () {
        this.timeList.editData.contact = '';
        this.timeList.editData.contactId = '';
      },
      closeChance: function () {
        this.timeList.editData.chance = '';
        this.timeList.editData.chanceId = '';
      },
      closeFour: function () {
        this.timeList.editData.address = '';
        store.state.editData.addressVO.address = '';
        store.state.editData.addressVO.province = '';
        store.state.editData.addressVO.city = '';
        store.state.editData.addressVO.adname = '';
        store.state.editData.addressVO.adcode = '';
        store.state.editData.addressVO.longitude = '';
        store.state.editData.addressVO.latitude = '';
      },
      getDateTime: function (field) {
        var self = this;
        var picker = new mui.DtPicker({
          'value': self.timeList.editData[field]
        });
        picker.show(function (rs) {
          self.timeList.editData[field] = rs.text;
          /* 验证 开始时间早于结束时间*/
          var start = self.timeList.editData['start'];
          var end = self.timeList.editData['end'];
          start = start.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          end = end.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          if (parseInt(start) > parseInt(end)) {
            if (field === 'end') {
              mui.alert('开始日期不能晚于结束日期', '提示', function () {
                self.timeList.editData['end'] = '';
              });
            } else {
              self.timeList.editData['end'] = '';
            }
            return;
          }
          picker.dispose();
        });
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
        var key = 0;
        for (var i = 0; i < self.chooseArr.length; i++) {
          if (self.chooseArr[i].select === 'active') {
            key = i;
            break;
          }
        }
        self.chooseArr[self.cutEd || key].select = '';
        self.chooseArr[index].select = 'active';
        self.cutEd = index;
        store.state.editData.priorityLevel = self.chooseArr[index].priorityLevel;
      },
      cloundVol: function () {
        var self = this;
        nativeApi.goRecord({
          'apiJson': {
            'uploadUrl': store.APIS.upload_file
          },
          callback: function (result) {
            self.timeList.editData.recordId = result.fId;
            self.timeList.editData.recordTime = result.recordTime;
            self.timeList.editData.recordPath = result.fileUrl;
            self.timeList.editData.text = '';
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
        this.timeList.editData.appendixs.splice(index, 1);
      },
      inputFocus: function (type) {
        var self = this;
        if (type === 1) {
          nativeApi.showKeyboard({
            callback: function (result) {
              self.timeList.editData.text = result.result;
            }
          });
        }
        if (type === 2) {
          nativeApi.showKeyboard({
            callback: function (result) {
              self.timeList.editData.textareaVal = result.result;
            }
          });
        }
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
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
