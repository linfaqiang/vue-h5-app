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
    </header>

    <div class="mui-content customer-detail">
      <div id="af_action_mask"></div>
      <div id="afui"></div>
      <crm-detail :test-list="testList" :href="'/edit'">
        <div slot="two" class="c-button">
          <button type="button" class="mui-btn" @tap="toNotes(priceId)">
            备注
          </button>
        </div>
      </crm-detail>
      <!--tab切换-->
      <div id="slider" class="mui-slider priceApprovalTab" style="top:112px">
        <div class="crm-detail1" @tap="active"><span :class="[name=='' ? 'no-str' : '']">{{name}}<br
          v-if="name!=''"><span class="mui-icon" :class="[isB ? 'crm-push-up' : 'crm-push-down']"></span></span></div>
        <div id="itemTab">
          <a class="controlitem" :class="{'active':detail.tabIndex==0}" @tap="itemTab(0)">
            报价行
          </a>
          <a class="controlitem" :class="{'active':detail.tabIndex==1}" @tap="itemTab(1)">
            审批记录
          </a>
        </div>
        <!-- <div id="sliderProgressBar" class="mui-slider-progress-bar mui-col-xs-6"></div>-->
        <div class="mui-slider-group">
          <div class="itemTabShow" v-show="detail.tabIndex==0">
            <div id="scroll1" class="mui-scroll-wrapper" :style="scrollCss">
              <div class=" mui-scroll mui-scroll-e">
                <product-list-components :lists.sync="detail.productList"></product-list-components>
              </div>
            </div>
          </div>
          <div class="itemTabShow" v-show="detail.tabIndex==1">
            <div id="scroll2" class="mui-scroll-wrapper" :style="scrollCss">
              <div class=" mui-scroll mui-scroll-e">
                <div v-for="item in ClueTransfer.data" @tap="" class='crm-zyList'>
                  <ul class="content">
                    <li class="bd-radius"><img class="img-icon" :src='item.headPhotoUrl'></li>
                    <li>
                      {{item.isApproved ? item.approvalName : item.createdName}}&nbsp;&nbsp;&nbsp;{{item.isApproved ?
                      item.updatedOn:item.createdOn}}
                    </li>
                    <li>{{item.approvedResult == 0 && item.isApproved== 1 ? '已同意,'+item.approvedContent:''}}
                      {{item.approvedResult == 1 && item.isApproved== 1 ? '已拒绝,'+item.approvedContent:''}}
                      {{item.approvedResult =='' && item.isApproved== 0 ? item.approvedContent:''}}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="detail.type==1" class="button_two_l">
        <a @tap="agapprove(0)">拒绝</a>
        <a @tap="agapprove(1)">同意</a>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../price-store';
  import productListPage from '../../public/components/product/list.vue';
  import crmDetail from '../../public/components/crm-detail/crm-detail.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'product-list-components': productListPage,
      'crm-detail': crmDetail
    },
    data: function () {
      return {
        isB: false,
        name: '',
        currentHeader: {
          title: '销售报价详情'
        },
        testList: store.state.getClueDetail.data.testList,
        dataList: store.state.getTab1.data,
        ClueContacts: store.state.getContacts,
        ClueTransfer: store.state.ClueTransfer,
        detail: store.state,
        priceId: '',
        scrollCss: {
          height: (document.body.clientHeight - 112 - 44 - 36 - 40) + 'px'
        }
      };
    },
    methods: {
      back: function () {
        if (window.initPage) {
          nativeApi.goNative({
            'apiJson': {
              'fn': 'priceApproval'
            }
          });
        } else {
          history.go(-1);
        }
      },
      active: function () {
        var oBtn = document.getElementById('slider');
        this.isB = !this.isB;
        if (this.isB === false) {
          this.name = '';
          oBtn.style.top = '110px';
          this.scrollCss.height = (document.body.clientHeight - 112 - 44 - 36 - 40) + 'px';
        } else {
          this.name = '收起';
          var toHeight = document.getElementById('crm-detail').offsetHeight + 35;
          oBtn.style.top = toHeight + 'px';
          this.scrollCss.height = (document.body.clientHeight - toHeight - 44 - 36 - 40) + 'px';
        }
      },
      itemTab: function (index) {
        this.detail.tabIndex = index;
        if (index === 0) {

        } else if (index === 1) {
          var approvalsListParam = {
            'quotationId': this.priceId,
            'pageNo': '1',
            'pageSize': '100'
          };
          store.getApprovalsList(approvalsListParam);
        }
      },
      // 审批动作
      agapprove: function (opt) {
        var self = this;
        var param = {};
        var message = '拒绝';
        if (opt === 1) {
          message = '同意';
        }
        var btnArray = ['取消', '确定'];
        mui.prompt('', '请输入审批意见', message, btnArray, function (e) {
          if (e.index === 1) {
            if (opt === 1) {
              // 同意
              param = {
                'createdBy': self.detail.priceDetail.createdBy,
                'chanceQuotationId': parseInt(self.priceId),
                'approvedResult': 0,
                'approvedContent': e.value
              };
            } else {
              // 拒绝
              param = {
                'createdBy': self.detail.priceDetail.createdBy,
                'chanceQuotationId': parseInt(self.priceId),
                'approvedResult': 1,
                'approvedContent': e.value
              };
            }
            store.priceApproval(param, function () {
              mui.alert('操作成功!');
              history.go(-1);
            });
          }
        });
      },
      toNotes: function (id) {
        this.$router.go('/notes/price_' + id);
      }
    },
    route: {
      // 接受路由变化的参数
      data: function () {
        var localKey = this.$route.params.localKey;
        if (localKey) {
          window.initPage = 'toDetail';
          window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
          localStorage.removeItem(localKey);
        }
        if (window.initPage) {
          store.getPriceDedail(window.initParam.id);
          this.priceId = window.initParam.id;
        } else {
          this.priceId = this.detail.priceDetail.id;
        }
        this.detail.tabIndex = 0;
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-slider').slider();
      mui('.mui-scroll-wrapper').scroll({
        indicators: true

      });
    }
  };
</script>
