/* *
* @file 线索分配详情
* @author hj
* @date 2016-11-22
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="goBack()"></a>
    </header>
    <div class="mui-content customer-detail">
      <crm-detail :test-list="testList" :href="'/edit'" :address="addressData">
        <div slot="two" class="c-button">
          <button type="button" class="mui-btn" @tap="toNotes(clueId)">
            备注
          </button>
        </div>
      </crm-detail>
      <!--tab切换-->
      <div id="slider" class="mui-slider" @slide="muiTabSlide">
        <div class="crm-detail1" @tap="active"><span :class="[name=='' ? 'no-str' : '']">{{name}}<br
          v-if="name!=''"><span class="mui-icon" :class="[isB ? 'crm-push-up' : 'crm-push-down']"></span></span></div>
        <div id="sliderSegmentedControl"
             class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
          <a class="mui-control-item mui-control-item-e mui-active" href="#item1mobile">
            跟进记录
          </a>
          <a class="mui-control-item mui-control-item-e" href="#item2mobile" @tap="selectList('clueTransfers')">
            转移记录
          </a>
          <a class="mui-control-item mui-control-item-e" href="#item3mobile" @tap="selectList('contacts')">
            联系人
          </a>
        </div>
        <div class="mui-slider-group deputy_li">
          <div id="item1mobile" class="mui-slider-item mui-control-content mui-active">
            <div id="scroll1" class="mui-scroll-wrapper" :class="{'list_is_null': dataList.data.length==0}" :style="deputyCss">
              <div class="mui-scroll mui-scroll-e">
                <div class="activity_list">
                  <ul v-for="list in dataList.data">
                    <li class="group"><span class="title">{{list.date || "&nbsp;"}}</span><span class="line"></span>
                    </li>
                    <li v-for="item in list.list" class="content">
                      <p>{{item.time || "&nbsp;"}}</p>
                      <p class="block">{{item.followManName}}</p>
                      <p class="block">{{item.trackContent}}</p>
                      <p>{{item.address.address}}</p>
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
                    <li class="zwcl">暂未处理</li>
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
                <div class='crm-zyList' style="margin-top: -10px">
                  <ul>
                    <li v-for="item in ClueContacts.data" @tap="toContactDetail(item)" class="mui-table-view-cell">
                      <a class="mui-navigate-right">
                        <p class="lxr-name">{{item.name}}</p>
                        <p class="lxr-bm-zw">{{item.title || "&nbsp;"}}</p>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="isShowTransBtn" @tap="transferClue" class="button_two_l">
        <a>分配</a>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../clue-store';
  var nativeApi = require('nativeApi');
  import crmDetail from '../../public/components/crm-detail/crm-detail.vue';
  export default {
    components: {
      'crm-detail': crmDetail
    },
    data: function () {
      return {
        isB: false,
        isShowTransBtn: true, // 是否显示转移按钮
        name: '',
        currentHeader: {
          title: '线索详情'
        },
        testList: store.state.getClueDetail.data.testList,
        dataList: store.state.getTab1.data,
        ClueContacts: store.state.getContacts,
        ClueTransfer: store.state.ClueTransfer,
        detailData: store.state.detailData,
        addressData: store.state.addressData,
        clueId: ''
      };
    },
    methods: {
      goBack: function () {
        this.$router.go('/');
      },
      tapLink: function (id) {
        this.$router.go('/detailPage/' + id);
      },
      active: function () {
        var oBtn = document.getElementById('slider');
        this.isB = !this.isB;
        if (this.isB === false) {
          this.name = '';
          oBtn.style.top = '110px';
        } else {
          this.name = '收起';
          var toHeight = document.getElementById('crm-detail').offsetHeight + 35;
          oBtn.style.top = toHeight + 'px';
        }
      },
      transferClue: function () {
        // 获取分配 部门或人员列表
        var self = this;
        store.getDistributeList(function () {
          self.$router.go('/personDeptPage');
        });
      },
      muiTabSlide: function (e) {
        if (e.detail.slideNumber === 0) {
        }
        if (e.detail.slideNumber === 1) {
          store.getClueTransfers(this.clueId);
        } else if (e.detail.slideNumber === 2) {
          store.getContacts(this.clueId);
        }
      },
      toNotes: function (id) {
        this.$router.go('/notes/clue_' + id);
      },
      toContactDetail: function (data) {
        /* 联系人详情*/
        localStorage.setItem('cluesDistribution_contact_detail', JSON.stringify({
          'type': 'clue',
          'data': data
        }));
        nativeApi.goView({
          'apiJson': {
            'urlPort': 'contact/index.html#!/detailPage/cluesDistribution_contact_detail',
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
          store.getContacts(this.clueId);
        }
      }
    },
    route: {
      data: function () {
        var self = this;
        window['refreshContact'] = function () {
          /* 刷新联系人*/
          self.selectList('contacts');
        };
      },
      activate: function (transition) {
        // 是否显示转移按钮\
        var isShowDistribute = this.$router._currentRoute.params.isShowDistribute;
        this.isShowTransBtn = true;
        if (isShowDistribute === 'false') {
          this.isShowTransBtn = false;
        }
        this.clueId = this.$route.params.id; // 线索id
        store.getClueDedail(this.clueId);
        transition.next();
      }
    },
    events: {
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
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-slider').slider();
      mui('.mui-scroll-wrapper').scroll({
        indicators: true  // 是否显示滚动条
      });
    }
  };
</script>
