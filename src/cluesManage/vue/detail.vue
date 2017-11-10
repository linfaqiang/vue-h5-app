/* *
* @file
* @author hj
* @date 2016-11-22
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav detail-header">
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <a v-if="status!=3" class="mui-icon crm-plus mui-pull-right" @click="showNewpage(2)"></a>
    </header>

    <div class="mui-content customer-detail">
      <crm-detail :test-list="testList" :href="'/edit'" :address="addressData">
        <span v-if="status!=3" slot="one" class="mui-icon crm-edit" @tap="tapGo()"> </span>
        <div slot="two" class="c-button">
          <button type="button" class="mui-btn" @tap="toNotes(clueId)">
            备注
          </button>
        </div>
      </crm-detail>
      <!--tab切换-->
      <div id="slider" class="mui-slider" @slide="muiTabSlide" :style="{'top': slideTop}">
        <div class="crm-detail1" @tap="active"><span :class="[name=='' ? 'no-str' : '']">{{name}}<br
          v-if="name!=''"><span class="mui-icon" :class="[isB ? 'crm-push-up' : 'crm-push-down']"></span></span></div>

        <div id="sliderSegmentedControl"
             class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
          <a class="mui-control-item mui-control-item-e mui-active" href="#item1mobile">
            跟进记录
          </a>
          <a class="mui-control-item mui-control-item-e " href="#item2mobile" @tap="selectList('clueTransfers')">
            转移记录
          </a>
          <a class="mui-control-item mui-control-item-e " href="#item3mobile" @tap="selectList('contacts')">
            联系人
          </a>
        </div>
        <!--<div id="sliderProgressBar" class="mui-slider-progress-bar mui-col-xs-4"></div>-->
        <div class="mui-slider-group deputy_li">
          <div id="item1mobile" class="mui-slider-item mui-control-content mui-active">
            <div id="scroll1" class="mui-scroll-wrapper" :style="deputyCss">
              <div class="mui-scroll mui-scroll-e">
                <div class="activity_list">
                  <ul v-for="list in dataList.data">
                    <li class="group"><span class="title">{{list.date || "&nbsp;"}}</span><span class="line"></span>
                    </li>
                    <li v-for="item in list.list" @tap="followRecDetail(item.id)" class="content">
                      <p>{{item.time || "&nbsp;"}}</p>
                      <p class="block">{{replaceContent(item.createdName)}}</p>
                      <p class="block">{{replaceContent(item.subject)}}</p>
                      <p><span class="mui-icon mui-icon-address"></span>{{item.address}}</p>
                      <span class="point"></span>
                      <div v-if="$index < (list.list.length-1)" class="line_left"></div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div id="item2mobile" class="mui-slider-item mui-control-content">
            <div id="scroll2" class="mui-scroll-wrapper" :style="deputyCss">
              <div class="mui-scroll mui-scroll-e">
                <div class='crm-zyList'>
                  <ul class="content">
                    <li class="mui-icon bd-radius-first"></li>
                    <li class="zwcl">{{showS.showStuas.text}}</li>
                  </ul>
                </div>
                <div v-for="item in ClueTransfer.data" @tap="" class='crm-zyList'>
                  <ul class="content">
                    <li class="bd-radius"><img class="img-icon"
                                               :src="item.headPhotoUrl || '../public/images/default_contact.png'"></li>
                    <li>{{item.createdOn}}&nbsp;&nbsp;{{item.operatorName}}</li>
                    <li>{{item.assignReason}}</li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
          <div id="item3mobile" class="mui-slider-item mui-control-content">
            <div id="scroll3" class="mui-scroll-wrapper" :style="deputyCss">
              <div class="mui-scroll mui-scroll-e">
                <div class="customer_contact_li sideline_down" v-for="list in ClueContacts.data"
                     @tap="toContactDetail(list)">
                  <p class="title">{{list.name}}</p>
                  <p>{{list.title || "&nbsp;"}}</p>
                  <span class="mui-icon mui-push-right"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="status!=3" class="button_two_l">
        <a @tap="transferClue">转移</a>
        <a @tap="addChance()">申请转商机</a>
      </div>
    </div>

    <div v-show="isShow">
      <crm-newpage :num="num" :items="listdata" :title="title"></crm-newpage>
    </div>
  </div>
</template>
<script>
  import store from '../clue-store';
  var nativeApi = require('nativeApi');
  import crmDetail from '../../public/components/crm-detail/crm-detail.vue';
  import crmNewPage from '../../public/components/crm-new/crm-newpage.vue';
  export default {
    components: {
      'crm-detail': crmDetail,
      'crm-newpage': crmNewPage
    },
    data: function () {
      return {
        isB: false,
        isShow: false,
        name: '',
        slideTop: '',
        title: '创建一个新的...',
        currentHeader: {
          title: '线索详情'
        },
        testList: store.state.getClueDetail.data.testList,
        dataList: store.state.getTab1,
        ClueContacts: store.state.getContacts,
        ClueTransfer: store.state.ClueTransfer,
        showS: store.state,
        listdata: [{
          icon: 'crm-sales-activities',
          name: '跟进记录',
          function: 'addFollowRec',
          type: 'back'
        }, {
          icon: 'crm-sales-opportunities',
          name: '联系人',
          function: 'contact',
          page: 'toAdd',
          param: {
            type: 'clue',
            id: store.state.detailData.id,
            name: store.state.detailData.customerName
          }
        }],
        status: 1,
        addressData: store.state.addressData,
        clueId: '',
        chanceData: store.state.chanceData,
        deputyCss: {
          'height': (document.body.clientHeight - 110 - 30 - 44 - 40) + 'px',
          'background': '#fff !important'
        }
      };
    },
    methods: {
      back: function () {
        if (window.initPage) {
          nativeApi.goNative({
            'apiJson': {
              'fn': 'cluesManage'
            }
          });
        }
      },
      replaceContent: function (val) {
        return nativeApi.replaceAllCh(val, 1);
      },
      tapGo: function () {
        var self = this;
        store.setEdit(function () {
          self.$router.go('/edit');
        });
      },
      active: function () {
        this.isB = !this.isB;
        if (this.isB === false) {
          this.name = '';
          this.slideTop = '110px';
          this.deputyCss.height = (document.body.clientHeight - 110 - 30 - 44 - 40) + 'px';
        } else {
          this.name = '收起';
          var toHeight = document.getElementById('crm-detail').offsetHeight + 35;
          this.slideTop = toHeight + 'px';
          this.deputyCss.height = (document.body.clientHeight - toHeight - 30 - 44 - 40) + 'px';
        }
      },
      addChance: function () {
        store.detail();
        this.$router.go('/addChance/' + this.clueId);
      },
      // 线索转移
      transferClue: function () {
        this.$router.go('/personPage');
      },
      muiTabSlide: function (e) {
        if (e.detail.slideNumber === 0) {
        }
        if (e.detail.slideNumber === 1) {
          store.getClueTransfers(this.clueId);
        } else if (e.detail.slideNumber === 2) {
          store.getContactList(this.clueId);
        }
      },
      showNewpage: function (num) {
        //  num  2 显示两列   3 显示3列
        this.num = num;
        this.isShow = true;
      },
      followRecDetail: function (id) {
        this.$router.go('/followRecDetail/' + id);
      },
      toNotes: function (id) {
        var isEdit = true;
        if (this.status === 3) {
          isEdit = false;
        }
        this.$router.go('/notes/clue_' + id + '/' + isEdit);
      },
      toContactDetail: function (data) {
        /* 联系人详情*/
        localStorage.setItem('cluesManage_contact_detail', JSON.stringify({
          'type': 'clue',
          'data': data
        }));
        nativeApi.goView({
          'apiJson': {
            'urlPort': 'contact/index.html#!/detailPage/cluesManage_contact_detail',
            'function': 'contact'
          }
        });
      },
      selectList: function (type) {
        if (!store.state.isCc) {
          return;
        }
        store.state.isCc = false;
        if (type === 'clueTransfers') {
          store.getClueTransfers(this.clueId);
        } else if (type === 'contacts') {
          store.getContactList(this.clueId);
        }
      },
      setValue: function () {
        this.listdata[1].param.id = store.state.detailData.id;
        this.listdata[1].param.name = store.state.detailData.customerName;
        this.clueId = store.state.detailData.id;
        this.status = store.state.detailData.status;
      }
    },
    events: {
      'parent-show': function (show) {
        this.isShow = show;
      },
      updateAddress: function (param) {
        /* 客户名称*/
        param.title = store.state.getClueDetail.data.testList[1].value;
        nativeApi.correctLocation({
          'apiJson': param,
          callback: function (result) {
            /* 客户 位置纠偏*/
            store.updateAddress(result);
          }
        });
      },
      goTo: function (fn) {
        if (fn === 'addFollowRec') {
          this.isShow = false;
          this.$router.go('/followAddPage');
        }
      }
    },
    route: {
      activate: function (transition) {
        var self = this;
        var localKey = this.$route.params.localKey;
        if (localKey) {
          window.initPage = 'toDetail';
          window.initParam = JSON.parse(localStorage.getItem(localKey));
          localStorage.removeItem(localKey);
        }
        if (window.initParam) {
          store.getClueDedail(window.initParam.id, function () {
            self.setValue();
          });
        } else {
          self.setValue();
        }
        /* 还原更多－收起*/
        self.name = '';
        self.slideTop = '110px';
        self.isB = false;
        // 刷新联系人
        window['refreshContact'] = function () {
          self.selectList('contacts');
        };
        transition.next();
      }
    },
    created: function () {
      //  运行 数据中转站的函数
    },
    ready: function () {
      mui('.mui-slider').slider();
      mui('.mui-scroll-wrapper').scroll({
        indicators: true  // 是否显示滚动条
      });
    }
  };
</script>
