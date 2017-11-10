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
      <a v-if="(detailData.data.status==0 || detailData.data.status==3) && statusActive.s" class="mui-icon mui-pull-right crm-icon-priceEdit"
         @tap="editPrice"></a>
    </header>

    <div class="mui-content customer-detail">
      <crm-detail :test-list="testList" :href="'/edit'">
        <div slot="two" class="c-button">
          <button type="button" class="mui-btn" @tap="toNotes(detailData.data.id)">
            备注
          </button>
        </div>
      </crm-detail>
      <!--tab切换-->
      <div id="slider" class="mui-slider" @slide="muiTabSlide" style="top:112px">
        <div class="crm-detail1" @tap="active"><span :class="[name=='' ? 'no-str' : '']">{{name}}<br
          v-if="name!=''"><span class="mui-icon" :class="[isB ? 'crm-push-up' : 'crm-push-down']"></span></span></div>
        <div id="sliderSegmentedControl"
             class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
          <a class="mui-control-item mui-control-item-e mui-active" href="#item1mobile">
            报价行
          </a>
          <a class="mui-control-item mui-control-item-e" href="#item2mobile">
            审批记录
          </a>
        </div>
        <div class="mui-slider-group">
          <div id="item1mobile" class="mui-slider-item mui-control-content mui-active">
            <div id="scroll1" class="mui-scroll-wrapper" :style="scrollCss">
              <div class="mui-scroll mui-scroll-e">
                <product-list-components :lists.sync="priceDetail.productList"></product-list-components>
              </div>
            </div>
          </div>
          <div id="item2mobile" class="mui-slider-item mui-control-content">
            <div id="scroll2" class="mui-scroll-wrapper" :style="scrollCss" :class="{'list_is_null': ClueTransfer.data.length==0}">
              <div class="mui-scroll mui-scroll-e">
                <div v-for="item in ClueTransfer.data" @tap="" class='crm-zyList'>
                  <ul class="content">
                    <li class="bd-radius"><img class="img-icon" :src='item.headPhotoUrl'
                                               onerror="this.src='../public/images/default_contact.png'"></li>
                    <li>{{item.isApproved ? item.approvalName : item.createdName}}&nbsp;&nbsp;&nbsp;{{item.createdOn}}
                    </li>
                    <li>{{item.approvedContent}}</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../price-store';
  import CrmDetail from '../../public/components/crm-detail/crm-detail.vue';
  import productList from '../../public/components/product/list.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'crm-detail': CrmDetail,
      'product-list-components': productList
    },
    data: function () {
      return {
        isB: false,
        name: '',
        currentHeader: {
          title: '销售报价详情'
        },
        detailData: store.state.priceDetail,
        testList: store.state.getClueDetail.data.testList,
        dataList: store.state.getTab1.data,
        ClueContacts: store.state.getContacts,
        ClueTransfer: store.state.ClueTransfer,
        priceDetail: store.state,
        statusActive: store.state.statusActive,
        scrollCss: {
          height: (document.body.clientHeight - 112 - 44 - 36 - 40) + 'px'
        }
      };
    },
    methods: {
      back: function () {
        if (window.initPage) {
          var apiJson = {};
          if (window.isEdit) {
            apiJson = {
              'apiJson': {
                'fn': 'salesPrice',
                'callFun': 'refreshSalesPrice'
              }
            };
          } else {
            apiJson = {
              'apiJson': {
                'fn': 'salesPrice'
              }
            };
          }
          nativeApi.goNative(apiJson);
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
      muiTabSlide: function (e) {
        var self = this;
        if (e.detail.slideNumber === 1) {
          // 报价审批记录列表参数
          var approvalsListParam = {
            'quotationId': self.detailData.data.id,
            'pageNo': '1',
            'pageSize': '500'
          };
          store.getClueTransfers(approvalsListParam);
        }
        if (e.detail.slideNumber === 2) {

        }
      },
      toNotes: function (id) {
        this.$router.go('/notes/price_' + id);
      },
      editPrice: function (id) {
        // 编辑报价
        this.$router.go('/editPrice/' + id);
      }
    },
    created: function () {
      // 运行 数据中转站的函数
      var localKey = this.$route.params.localKey;
      if (localKey) {
        window.initPage = 'toDetail';
        window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
        localStorage.removeItem(localKey);
      }
      if (window.initParam) {
        store.getCustomerDedail(window.initParam.id);
      }
    },
    ready: function () {
      mui('.mui-slider').slider();
      mui('.mui-scroll-wrapper').scroll({
        indicators: true
      });
    }
  };
</script>
