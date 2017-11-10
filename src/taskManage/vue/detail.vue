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
      <a v-show="type.typeNum=='1'" class="mui-icon-compose mui-icon mui-pull-right" @tap="addAct()"></a>
    </header>
    <div class="mui-content customer-detail">
      <ul class="crm-detail" id="crm-detail">
        <li v-for="list in testList" v-if="!list.showHide">
          <div class="crm-detail-left" v-text="list.name"></div>
          <div class="crm-detail-right">
            <a v-if="list.icon">
              <span v-else :style="{color:list.activeColor}">{{list.value}}</span>
                    <span class="mui-icon" v-if="list.value" :class="list.icon"
                          @tap='callPhoneOrShowMap(list.key,list.value,address.data)'>
                    </span>
            </a>
                <span v-else class="voc-subject">
                     <div v-if="list.vocSubject" @tap="playRecord(list.vocSubject)">
                        <span class="mui-icon mui-icon-voice"></span>
                        <span v-text="list.vocLength"></span>
                    </div>
                    <span v-else v-html="list.value"></span>
                </span>
          </div>
        </li>
        <div class="appendix_li mui-scroll-wrapper mui-segmented-control" style="height: 80px;"
             v-show="detail.data.appendixs && detail.data.appendixs.length>0">
          <div class="mui-scroll" style="height: 66px;">
            <a v-for="appendix in detail.data.appendixs">
              <img v-if="appendix.type=='image'" :src="appendix.path" data-preview-src="" data-preview-group="1">
              <img v-if="appendix.type=='sound'" src="../../public/images/sound.png" @tap="playRecord(appendix.path)">
            </a>
          </div>
        </div>
      </ul>
      <!--tab切换-->
      <div id="slider" class="mui-slider" :style="oBtnStyle">
        <div class="show_hide" @tap="showHide()"><font v-html="buTitle?(buTitle+'<br>'):''"></font><span
          class="mui-icon" :class="{'crm-push-down': isHide, 'crm-push-up': !isHide, 'show_more': isHide}"></span></div>
        <div style="background:#f1f1f1;height: 5px;"></div>
        <div class="mui-slider-group">
          <div id="item2mobile" class="mui-slider-item mui-control-content">
            <div id="scroll2" class="mui-scroll-wrapper" :style="wrapperCss">
              <div class="mui-scroll">
                <div class='inner-header'>
                  执行情况
                </div>
                <div v-for="item in executeList.data" @tap="tapLink($index)" class='crm-zyList'>
                  <ul class="content">
                    <li class="bd-radius"><img class="img-icon"
                                               :src="item.headPhotoUrl||'../public/images/default_contact.png'"></li>
                    <li style="margin-right: 8px">{{item.executorName}}</li>
                    <li>{{item.createdOn}}</li>
                    <li>{{item.statusText}}</li>
                    <li>{{item.resultDesc}}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div @tap="type.btnType==0?toTaskDetail():toDelete()" class="button_two_l">
        <a class="mui-icon" :class="{'crm-icon-mission':type.btnType==0,'mui-icon-dustbin':type.btnType==1}" id='confirmBtn'
           type="button" v-text="type.btnType==0?'执行任务':'删除'"></a>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../public/css/mui.picker.min.css';
  @import '../../public/css/mui.image.css';
</style>
<script>
  import {APIS} from 'configPort';
  import store from '../task-store';
  import CrmDetail from '../../public/components/crm-detail/crm-detail.vue';
  require('mui.picker.min');
  require('mui.previewimage');
  require('mui.zoom');
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'crm-detail': CrmDetail
    },
    data: function () {
      return {
        name: '',
        currentHeader: {
          title: '任务详情'
        },
        testList: store.state.getClueDetail.data.testList,
        ClueTransfer: store.state.ClueTransfer,
        executeList: store.state.executeList,
        type: store.state,
        btnType: store.state.btnType,
        detail: store.state.actDatas,
        detData: store.state.detData,
        isHide: true,
        buTitle: '',
        oBtnStyle: {
          top: '110px',
          height: (document.documentElement.clientHeight - 44 - 110) + 'px'
        },
        wrapperCss: {
          height: (document.documentElement.clientHeight - 44 - 110 - 30 - 10) + 'px',
          'padding-bottom': '20px'
        }
      };
    },
    methods: {
      back: function (index) {
        if (APIS.is_weixin) {
          history.go(-1);
        }
        if (window.initPage) {
          if (window.isEdit) {
            nativeApi.goNative({
              'apiJson': {
                'fn': 'taskManage',
                'callFun': 'refreshFollow',
                'param': ''
              }
            });
          } else {
            nativeApi.goNative({
              'apiJson': {
                'fn': 'taskManage'
              }
            });
          }
        } else {
          history.go(-1);
        }
      },
      tapLink: function (index) {
        var executorId = this.executeList.data[index].id;
        this.$router.go('/missionDetailPage/' + executorId);
      },
      addAct: function (id) {
        var self = this;
        store.toEdit(function () {
          self.$router.go('/editPage/' + id);
        });
      },
      showHide: function () {
        var self = this;
        if (self.isHide) {
          self.isHide = false;
          self.buTitle = '收起';
          var toHeight = document.getElementById('crm-detail').offsetHeight + 35;
          this.oBtnStyle.top = toHeight + 'px';
          this.wrapperCss.height = (document.documentElement.clientHeight - 44 - toHeight - 30 - 10) + 'px';
        } else {
          self.isHide = true;
          self.buTitle = '';
          this.oBtnStyle.top = '110px';
          this.wrapperCss.height = (document.documentElement.clientHeight - 44 - 110 - 30 - 10) + 'px';
        }
      },
      followRecDetail: function (index) {
        this.$router.go('/followRecDetail/1');
      },
      toNotes: function () {
        this.$router.go('/notes/task_' + this.detData.id);
      },
      toTaskDetail: function () {
        nativeApi.getLoginInfo({
          callback: function (result) {
            store.state.mission.userName = result.userName;
          }
        });
        store.state.mission.statuText = this.executeList.data[0].statusText || '未开始';
        if (store.state.mission.statuText === '分配任务' || store.state.mission.statuText === '未开始') {
          store.state.mission.status = '0';
        }
        if (store.state.mission.statuText === '进行中') {
          store.state.mission.status = '1';
        }
        if (store.state.mission.statuText === '已完成') {
          store.state.mission.status = '2';
        }
        store.state.mission.resultDesc = '';
        this.$router.go('/missionPage/' + this.detData.id);
      },
      toDelete: function () {
        store.toDelete('', function () {
          mui.alert('任务删除成功！', '提示', function () {
            if (window.initPage) {
              nativeApi.goNative({
                'apiJson': {
                  'fn': 'taskManage'
                }
              });
            } else {
              store.listRefresh('list');
              history.go(-1);
            }
          });
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
      }
    },
    route: {
      data: function () {
        this.name = '';
        this.isHide = true;
        this.buTitle = '';
        this.oBtnStyle.top = '110px';
        this.wrapperCss.height = (document.documentElement.clientHeight - 44 - 110 - 30 - 10) + 'px';
      }
    },
    created: function () {
      var localKey = this.$route.params.localKey;
      if (localKey) {
        window.initPage = 'toDetail';
        window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
        localStorage.removeItem(localKey);
      }
      var nativeId = this.$route.params.nativeId;
      if (nativeId) {
        /* 原生调用 */
        window.initPage = 'toDetail';
        window.initParam = {
          'id': nativeId
        };
      }
      if (window.initPage) {
        store.getCustomerDedail(window.initParam.id);
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll({
        indicators: true
      });
      mui('.mui-scroll-wrapper').scroll();
      mui.previewImage();
    }
  };
</script>
