/* *
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <!--竞争对手详情-->
    <div class="competitor-list">
      <header id="header" class="mui-bar mui-bar-nav">
        <a @tap="back" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-title">竞争对手</h1>
        <a class="mui-icon-plusempty mui-icon mui-pull-right"
           @tap="addContact(detail.detail.id,detail.detail.competitorName)"></a>
      </header>
      <div class="">
        <crm-detail :test-list="testList" :address="addressData">
          <span slot="one" class="mui-icon crm-edit" @click="tapGo"> </span>
          <div slot="two" class="c-button">
            <button type="button" class="mui-btn" @tap="toNotes">
              备注
            </button>
          </div>
        </crm-detail>
      </div>

      <div id="slider" class="mui-slider" @slide="muiTabSlide">
        <div class="crm-detail1" @click="slides">
            <span>{{name}}<br><span class="mui-icon" :class="[isB ? 'crm-push-up' : 'crm-push-down']"></span>
            </span>
        </div>
        <div id="sliderSegmentedControl"
             class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
          <a class="mui-control-item mui-active" href="#item1mobile">
            商机
          </a>
          <a class="mui-control-item" href="#item2mobile">
            销售产品
          </a>
          <a class="mui-control-item" href="#item3mobile">
            联系人
          </a>
        </div>

        <div class="mui-slider-group deputy_li">
          <div id="item1mobile" class="mui-slider-item mui-control-content mui-active">
            <div id="scroll1" :style="deputyCss">
              <div v-if="chanceList.chanceList.length==0"
                   :class="{'list_is_null': chanceList.chanceList.length==0}"></div>
              <mui-scroll-refresh icon="chance" v-show="chanceList.chanceList.length>0">
                <ul class="competitor-detail-1" style="background: #fff">
                  <li class="mui-table-view-cell" v-for="chance in chanceList.chanceList">
                    <h5 class="competitor-detail-h5">{{chance.chanceName}}</h5>
                    <ul class="competitor-detail-2">
                      <li class="mui-table-view-cell mui-collapse">
                        <a href="javascript:void(0)" @tap="renderchanceDetail(chance.id)"
                           class="mui-navigate-right detail-competitor-title">
                          <div class="pr_15">{{chance.customerName}}</div>
                        </a>
                        <div class="mui-collapse-content detail-list-2">
                          <chance-detail v-if="detail.inLists.show" :list="detail.inLists[chance.id]"></chance-detail>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </mui-scroll-refresh>
            </div>
          </div>
          <div id="item2mobile" class="mui-slider-item mui-control-content">
            <ul class="competitor-detail-produce" :style="deputyCss">
              <div v-if="productList.productList.length==0" :class="{'list_is_null': productList.productList.length==0}"
                   style="left: 0px"></div>
              <mui-scroll-refresh icon="product" v-show="productList.productList.length>0">
                <div style="background: #fff">
                  <li v-for="product in productList.productList">
                    <h5>{{product.productName}}</h5>
                    <p>{{product.chanceName}}<span class="mui-icon competitor-money">￥{{product.productPrice}}</span>
                    </p>
                  </li>
                </div>
              </mui-scroll-refresh>
            </ul>
          </div>
          <div id="item3mobile" class="mui-slider-item mui-control-content">
            <div id="scroll3" class="mui-scroll-wrapper" :style="deputyCss">
              <div class="mui-scroll">
                <div v-if="contactList.contactList.length==0"
                     :class="{'list_is_null': contactList.contactList.length==0}" style="margin-top:45px"></div>
                <ul style="padding-left:0;margin: 0;border-bottom: 1px solid #ddd;"
                    v-show="contactList.contactList.length>0">
                  <li class="mui-table-view-cell" @tap="toContact(contact)" v-for="contact in contactList.contactList">
                    <a class="mui-navigate-right">
                      <h5 style="color: #333; font-weight: normal">{{contact.name}}
                        <span class="mui-icon right_arrow_p"></span>
                      </h5>
                      <p>{{contact.title}}</p>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../public/css/module.css';
</style>
<script>
  import store from '../competitor-store';
  import crmDetail from '../../public/components/crm-detail/crm-detail.vue';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  import {FastClick} from 'fastclick';
  var nativeApi = require('nativeApi');
  var chanceDetail = {
    template: '<p v-for="item in list">{{item.productName}}<span class="redColor">￥{{item.productPrice}}</span></p>',
    props: ['list']
  };
  export default {
    components: {
      'chance-detail': chanceDetail,
      'crm-detail': crmDetail,
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        testList: store.state.getCustomerDetail.data.testList,
        name: '',
        isShow: false,
        detail: store.state,
        routeId: '',
        isB: false,
        contactList: store.state,
        addressData: store.state.addressData,
        chanceList: store.scroll.chance,
        productList: store.scroll.product,
        deputyCss: {
          height: (document.body.clientHeight - 112 - 30) + 'px',
          background: '#fff !important'
        }
      };
    },
    methods: {
      callPhone: function (val) {
        nativeApi.openPhone({
          'apiJson': {
            'phoneNum': val
          }
        });
      },
      showMap: function (val) {
        nativeApi.correctLocation({
          'apiJson': {
            'longitude': val.longitude,
            'latitude': val.latitude,
            'title': '测试用',
            'address': val.address,
            'showMap': true
          },
          callback: function (result) {
          }
        });
      },
      back: function () {
        history.go(-1);
      },
      toNotes: function () {
        this.$router.go('/notes/competitor_' + this.detail.detailData.id);
      },
      tapGo: function () {
        store.renderEdit();
        this.$router.go('/competitor-edit/' + this.detail.detailData.id);
      },
      slides: function () {
        var oBtn = document.getElementById('slider');
        this.isB = !this.isB;
        if (this.isB === false) {
          this.name = '';
          oBtn.style.top = '114px';
        } else {
          this.name = '收起';
          var toHeight = document.getElementById('crm-detail').offsetHeight + 40;
          oBtn.style.top = toHeight + 'px';
        }
      },
      // 获取销售机会客户信息
      renderchanceDetail: function (num) {
        if (this.detail.inLists[num].length) {
          return;
        } else {
          this.detail.inLists.show = false;
        }
        var self = this;
        var id = this.detail.detailData.id;
        nativeApi.initAjax({
          url: store.APIS.competitors_detail + id + '/' + num,
          type: 'get',
          param: '',
          callback: function (response) {
            if (response && response.code === 200) {
              self.detail.inLists.show = true;
              self.detail.inLists[num] = response.data;
            }
          }
        });
      },
      toContact: function (obj) {
        /* 联系人详情*/
        localStorage.setItem('competitor_contact_detail', JSON.stringify({
          'type': 'competitor',
          'data': obj
        }));
        nativeApi.goView({
          'apiJson': {
            'urlPort': 'contact/index.html#!/detailPage/competitor_contact_detail',
            'function': 'contact'
          }
        });
      },
      addContact: function (id, name) {
        /* 新建联系人*/
        localStorage.setItem('competitor_contact_add', JSON.stringify({
          'type': 'competitor',
          'id': id,
          'name': name
        }));
        nativeApi.goView({
          'apiJson': {
            'urlPort': 'contact/index.html#!/addPage/competitor_contact_add',
            'function': 'contact'
          }
        });
      },
      muiTabSlide: function (e) {
        if (e.detail.slideNumber === 1) {
          store.renderProduct({});
        } else if (e.detail.slideNumber === 2) {
          store.renderContactList();
        }
      }
    },
    events: {
      'updateAddress': function (param) {
        /* 客户名称*/
        param.title = store.state.getCustomerDetail.data.testList[0].value;
        nativeApi.correctLocation({
          'apiJson': param,
          callback: function (result) {
            /* 客户 位置纠偏*/
            store.updateAddress(result);
          }
        });
      },
      'pullRefreshReady': function (scroll) {
        store.setScroll(scroll.element.getAttribute('icon'), scroll);
      },
      'pulldown': function (scroll) {
        store.listRefresh(scroll.element.getAttribute('icon'));
      },
      'pullup': function (scroll) {
        store.listLoadMore(scroll.element.getAttribute('icon'));
      }
    },
    created: function () {
    },
    route: {
      data: function () {
        this.isB = false;
        this.name = '';
        window['refreshContact'] = function () {
          /* 刷新联系人*/
          store.renderContactList();
        };
      }
    },
    ready: function () {
      FastClick.attach(document.body);
      mui('.mui-slider').slider();
      mui('.mui-scroll-wrapper').scroll({
        indicators: true // 是否显示滚动条
      });
    }
  };
</script>
