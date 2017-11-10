/**
* @file 商机详情
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <h1 class="mui-title" v-text="detail.detailData.chanceName"></h1>
      <a class="mui-icon-plusempty mui-icon mui-pull-right" v-if="detail.detailData.isColsed==0" @click="addAll()"></a>
    </header>
    <div class="mui-content">
      <div class="stage_li">
        <p class="title">销售阶段</p>
        <span class="bu_stage" @tap="stage()">详情<span class="mui-icon crm-navigate-right"></span></span>
        <div class="mui-scroll-wrapper mui-segmented-control" style="height: 72px;">
          <div class="mui-scroll" style="height: 50px;">
            <a v-for="lis in detail.detailData.saleStageList">
              <div class="date"
                   :class="{'present': detail.detailData.isColsed=='0'&&lis.stageId==detail.detailData.chanceStageId,'close': (detail.detailData.closeReason=='1'||detail.detailData.closeReason=='2')&&lis.stageId==detail.detailData.chanceStageId}">
                {{dateMonth(lis.startedOn)}}
              </div>
              <div class="icon">
                <span class="left line" :class="{'l_grey': !lis.startedOn}" v-if="$index!=0"></span>
                <span class="point mui-icon"
                      :class="{'close': (detail.detailData.closeReason=='1'||detail.detailData.closeReason=='2')&&lis.stageId==detail.detailData.chanceStageId, 'finish': detail.detailData.closeReason=='0'&&lis.stageId==detail.detailData.chanceStageId,'p_grey': !lis.startedOn, 'present': lis.stageId==detail.detailData.chanceStageId}"><span></span></span>
                <span class="right line"
                      :class="{'l_grey': lis.stageId==detail.detailData.chanceStageId||!lis.startedOn}"
                      v-if="$index!=(detail.detailData.saleStageList.length-1)"></span>
              </div>
              <div class="name"
                   :class="{grey: !lis.startedOn, 'present': detail.detailData.isColsed=='0'&&lis.stageId==detail.detailData.chanceStageId,'close': (detail.detailData.closeReason=='1'||detail.detailData.closeReason=='2')&&lis.stageId==detail.detailData.chanceStageId}">
                {{lis.stageName}}
              </div>
            </a>
          </div>
        </div>
      </div>
      <div id="the_detail_li" class="detail_li" :style="detailHei">
        <ul>
          <li>
            <label>客户名称</label>
            <div style="padding: 0 55px 0 88px;">{{detail.detailData.customerName}}</div>
          </li>
          <li
            v-if="detail.detailData.isColsed==0 || (detail.detailData.closeReason!=0&&detail.detailData.closeReason!=1)">
            <label>预测金额</label>
            <div class="amount">¥{{detail.detailData.forecastAmount}}</div>
          </li>
          <li v-if="detail.detailData.isColsed==1 && detail.detailData.closeReason==0">
            <label>成交金额</label>
            <div class="amount">¥{{detail.detailData.dealAmount}}</div>
          </li>
          <li v-if="detail.detailData.isColsed==1 && detail.detailData.closeReason==1">
            <label>丢单金额</label>
            <div class="amount">¥{{detail.detailData.loseAmount}}</div>
          </li>
          <li>
            <label>状态</label>
            <div>{{detail.detailData.statusText}}</div>
          </li>
          <li>
            <label>类型</label>
            <div>{{detail.detailData.typeText||"标准项目"}}</div>
          </li>
          <li v-if="detail.detailData.isColsed==0">
            <label>成功率</label>
            <div>{{detail.detailData.successRatio}}%</div>
          </li>
          <li
            v-if="detail.detailData.isColsed==0||(detail.detailData.closeReason!=0&&detail.detailData.closeReason!=1)">
            <label>预计成交日期</label>
            <div>{{substring(detail.detailData.extimateDealDate)}}</div>
          </li>
          <li v-if="detail.detailData.isColsed==1 && detail.detailData.closeReason==0">
            <label>成交日期</label>
            <div>{{substring(detail.detailData.dealDate)}}</div>
          </li>
          <li v-if="detail.detailData.isColsed==1 && detail.detailData.closeReason==1">
            <label>关闭日期</label>
            <div>{{substring(detail.detailData.loseDate)}}</div>
          </li>
        </ul>
        <span class="edit mui-icon crm-edit" @tap="edit()" v-if="detail.detailData.isColsed=='0'"></span>
        <div class="bu_th">
          <span @tap="team(detail.detailData.id)">销售团队</span>
          <span @tap="rival(detail.detailData.id)">竞争对手</span>
          <span class="remark" @tap="notes(detail.detailData.id)">备注</span>
        </div>
      </div>
      <div class="detail_de">
        <div class="show_hide" @tap="showHide()"><font v-html="buTitle?(buTitle+'<br>'):''"></font><span
          class="mui-icon" :class="{'crm-push-down': isHide, 'crm-push-up': !isHide, 'show_more': isHide}"></span></div>
        <div id="muiSlider" class="mui-slider">
          <div style="height: 38px;"
               class="tab_li mui-scroll-wrapper mui-segmented-control mui-segmented-control-inverted">
            <div id="tab_item_scroll" class="mui-scroll" style="height: 38px;" :style="cosCss">
              <a class="mui-control-item" @tap="linkTab(0)" :class="{'mui-active': itemIndex==0}" href="#item1mobile">
                跟进记录<span></span>
              </a>
              <a class="mui-control-item" @tap="linkTab(1)" :class="{'mui-active': itemIndex==1}" href="#item2mobile">
                销售任务<span></span>
              </a>
              <a class="mui-control-item" @tap="linkTab(2)" :class="{'mui-active': itemIndex==2}" href="#item3mobile">
                销售产品<span></span>
              </a>
              <a class="mui-control-item" @tap="linkTab(3)" :class="{'mui-active': itemIndex==3}" href="#item4mobile">
                销售报价<span></span>
              </a>
              <a class="mui-control-item" @tap="linkTab(4)" :class="{'mui-active': itemIndex==4}" href="#item5mobile">
                联系人<span></span>
              </a>
              <div class="mui-slider-progress-bar mui-col-xs-4"></div>
            </div>
          </div>
          <div class="mui-slider-group deputy_li" id="deputyLi">
            <div id="item1mobile" class="mui-slider-item mui-control-content mui-active">
              <div :class="{'list_is_null': follow.followLi.length == 0}" style="position: relative;margin: 0;"
                   :style="liCss">
                <div v-show="follow.followLi.length>0">
                  <mui-scroll-refresh bottom="0" top="0">
                    <activity-list-components :lists.sync="follow.followLi"></activity-list-components>
                  </mui-scroll-refresh>
                </div>
              </div>
            </div>
            <div id="item2mobile" class="mui-slider-item mui-control-content">
              <div class="mui-scroll-wrapper" :class="{'list_is_null': detail.taskList.length == 0}" style="margin: 0;"
                   :style="liCss">
                <div class="mui-scroll">
                  <div class="chance_task_li mui-icon crm-navigate-right" v-for="list in detail.taskList"
                       @tap="toTaskDetail(list.id)">
                    <div v-if="!list.subject">
                      <span class="mui-icon mui-icon-voice"></span>
                      <span v-text="list.audioSubjectFileLength"></span>
                    </div>
                    <p v-else>{{list.subject}}</p>
                    <p>最后跟进：{{list.createdOn}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div id="item3mobile" class="mui-slider-item mui-control-content">
              <div class="mui-scroll-wrapper" :class="{'list_is_null': detail.productList.length == 0}"
                   style="margin: 0;" :style="liCss">
                <div class="mui-scroll">
                  <product-list-components :lists.sync="detail.productList"></product-list-components>
                </div>
              </div>
            </div>
            <div id="item4mobile" class="mui-slider-item mui-control-content">
              <div class="mui-scroll-wrapper" :class="{'list_is_null': detail.salesPriceList.length == 0}"
                   style="margin: 0;" :style="liCss">
                <div class="mui-scroll">
                  <div class="chance_sales_li mui-icon crm-navigate-right" v-for="list in detail.salesPriceList"
                       @tap="salesPriceDetail(list.id)">
                    <p class="title">{{list.quotationName}}</p>
                    <p><span class="mui-icon mui-icon-start">{{list.createdOn}}</span><span
                      class="cost mui-icon mui-icon-amount">{{list.amount}}</span></p>
                    <span class="status" :class="{reject: list.status==3}">{{list.statusText}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div id="item5mobile" class="mui-slider-item mui-control-content">
              <div class="mui-scroll-wrapper" :class="{'list_is_null': detail.contactList.length == 0}" :style="liCss">
                <div class="mui-scroll">
                  <div class="chance_contact_li mui-icon crm-navigate-right" v-for="list in detail.contactList"
                       @tap="toContactDetail(list.linkmanId)">
                    <p class="title" v-html="list.linkmanName + '<span>' + list.title + '</span>'"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isShow">
      <crm-newpage :num="num" :items="listdata" :title="title"></crm-newpage>
    </div>
  </div>
</template>
<script>
  var nativeApi = require('nativeApi');
  import store from '../chance-store';
  var arrObj = ['follow', 'task', 'product', 'salesPrice', 'contact'];
  import activityList from '../../public/components/crm-activity/list.vue';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  import newPage from '../../public/components/crm-new/crm-newpage.vue';
  import productList from '../../public/components/product/list.vue';
  export default{
    components: {
      'activity-list-components': activityList,
      'product-list-components': productList,
      'crm-newpage': newPage,
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        currentHeader: {
          title: '商机详情'
        },
        detail: store.state,
        follow: store.scroll.follow,
        isHide: true,
        buTitle: '',
        liCss: {
          height: (document.body.offsetHeight - 304) + 'px'
        },
        itemIndex: 0,
        title: '创建一个新的...',
        isShow: false,
        num: 3,
        cosCss: {},
        listdata: nativeApi.setFuncList('chance'),
        isRefresh: true,
        detailHei: {
          height: '66px'
        }
      };
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('follow', scroll);
      },
      pulldown: function () {
        store.listRefresh('follow');
      },
      pullup: function () {
        store.listLoadMore('follow');
      },
      toRival: function (data) {
        /* 竞争对手*/
        var self = this;
        store.chance_product_rival(data, function () {
          self.$router.go('/rivalPage/' + '1');
        });
      },
      goTo: function (fn) {
        var self = this;
        switch (fn) {
          case 'product':
            self.$router.go('/productAddPage');
            break;
          case 'rival':
            self.$router.go('/rivalAddPage');
            break;
          case 'contact':
            store.contactList('', function () {
              self.$router.go('/contactAddPage');
            });
            break;
          default :
            ;
        }
        this.isShow = false;
      },
      'parent-show': function () {
        this.isShow = false;
      },
      parentHide: function () {
        this.isShow = false;
      },
      'toDetail': function (id) {
        /* 销售活动详情*/
        localStorage.setItem('chance_activity_detail', JSON.stringify({
          'type': 'chance',
          'id': id
        }));
        nativeApi.goView({
          'apiJson': {
            'isTrue': true,
            'urlPort': 'activity/index.html#!/detailPage/chance_activity_detail',
            'function': 'activity'
          }
        });
      },
      editSaveProduct: function (param) {
        /* 编辑产婆数量、单价*/
        store.editSaveProduct(param);
      },
      deleteSaveProduct: function (id) {
        store.deleteSaveProduct(id);
      }
    },
    methods: {
      back: function (index) {
        if (window.initPage) {
          if (window.isEdit) {
            nativeApi.goNative({
              'apiJson': {
                'fn': 'chance',
                'callFun': 'refreshChance',
                'param': ''
              }
            });
          } else {
            nativeApi.goNative({
              'apiJson': {
                'fn': 'chance'
              }
            });
          }
        } else {
          history.go(-1);
        }
      },
      dateMonth: function (val) {
        if (!val) {
          return '';
        }
        var returnVal = '';
        try {
          var valDate = val.substring(0, 10) || '';
          var arrDate = valDate.split('-');
          returnVal = arrDate[1] + '月' + arrDate[2] + '日';
        } catch (e) {
          return '';
        }
        return returnVal;
      },
      substring: function (val) {
        return val ? val.substring(0, 10) : '';
      },
      edit: function () {
        var self = this;
        store.setEdit(function () {
          self.$router.go('/editPage');
        });
      },
      addAll: function () {
        this.isShow = true;
        var list = this.listdata;
        var self = this;
        for (var i = 0; i < list.length; i++) {
          if (list[i].param) {
            list[i].param = {
              'customerId': self.detail.detailData.customerId || '',
              'customerName': self.detail.detailData.customerName || '',
              'chanceId': self.detail.detailData.id || '',
              'chanceName': self.detail.detailData.chanceName || ''
            };
          }
        }
      },
      stage: function () {
        var self = this;
        store.stage(function () {
          self.$router.go('/stagePage');
        });
      },
      rival: function (id) {
        /* 竞争对手*/
        var self = this;
        store.rival(function () {
          self.$router.go('/rivalPage/' + id);
        });
      },
      showHide: function () {
        var self = this;
        if (self.isHide) {
          self.isHide = false;
          self.buTitle = '收起';
          var hei = document.getElementById('the_detail_li').scrollHeight + 5;
          self.detailHei.height = hei + 'px';
          self.liCss['height'] = (document.body.offsetHeight - 238 - hei) + 'px';
        } else {
          self.isHide = true;
          self.buTitle = '';
          self.detailHei.height = '66px';
          self.liCss['height'] = (document.body.offsetHeight - 304) + 'px';
        }
      },
      linkTab: function (index) {
        /* 刷新*/
        store[arrObj[index]]();
        this.isRefresh = false;
      },
      notes: function (id) {
        var isEdit = false;
        if (parseInt(this.detail.detailData.isColsed || '0') === 0) {
          isEdit = true;
        }
        this.$router.go('/notes/chance_' + id + '/' + isEdit);
      },
      team: function (id) {
        var isEdit = false;
        if (parseInt(this.detail.detailData.isColsed || '0') === 0) {
          isEdit = true;
        }
        this.$router.go('/teamPage/' + id + '/' + isEdit);
      },
      toTaskDetail: function (id) {
        /* 任务详情*/
        localStorage.setItem('chance_taskManage_detail', JSON.stringify({
          'type': 'chance',
          'id': id
        }));
        nativeApi.goView({
          'apiJson': {
            'isTrue': true,
            'urlPort': 'taskManage/index.html#!/detailPage/chance_taskManage_detail',
            'function': 'taskManage'
          }
        });
      },
      salesPriceDetail: function (id) {
        /* 销售报价详情*/
        localStorage.setItem('chance_salesPrice_detail', JSON.stringify({
          'type': 'chance',
          'id': id
        }));
        nativeApi.goView({
          'apiJson': {
            'isTrue': true,
            'urlPort': 'salesPrice/index.html#!/detailPage/chance_salesPrice_detail',
            'function': 'salesPrice'
          }
        });
      },
      toContactDetail: function (id) {
        /* 联系人详情*/
        var self = this;
        localStorage.setItem('chance_contact_detail', JSON.stringify({
          'type': 'chance',
          'id': id,
          'chanceId': self.detail.detailData.id
        }));
        nativeApi.goView({
          'apiJson': {
            'isTrue': true,
            'urlPort': 'contact/index.html#!/detailPage/chance_contact_detail',
            'function': 'contact'
          }
        });
      }
    },
    created: function () {
      var localKey = this.$route.params.localKey;
      if (localKey) {
        window.initPage = 'toDetail';
        window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
        localStorage.removeItem(localKey);
      }
      if (window.initParam) {
        var id = window.initParam.id;
        store.getDetail(id);
      }
    },
    route: {
      data: function () {
        var self = this;
        self.isHide = true;
        self.buTitle = '';
        self.detailHei.height = '66px';
        self.liCss['height'] = (document.body.offsetHeight - 304) + 'px';
        window['refreshFollow'] = function () {
          /* 刷新跟进记录*/
          store.listRefresh('follow');
        };
        window['refreshTask'] = function () {
          /* 刷新任务*/
          store.task();
        };
        window['refreshSalesPrice'] = function () {
          /* 刷新报价*/
          store.salesPrice();
        };
        window['refreshContact'] = function () {
          /* 刷新联系人*/
          store.contact();
        };
      }
    },
    ready: function () {
      var self = this;
      mui('.mui-slider').slider();
      mui('.mui-scroll-wrapper').scroll({
        indicators: true
      });
      var width = document.getElementById('tab_item_scroll').offsetWidth - document.body.offsetWidth;
      document.getElementById('muiSlider').addEventListener('slide', function (e) {
        self.itemIndex = e.detail.slideNumber;
        var lastWidth = width - (4 - self.itemIndex) * 88;
        if (lastWidth > 0) {
          self.cosCss = {
            transform: 'translate3d(-' + lastWidth + 'px, 0px, 0px) translateZ(0px)'
          };
        } else if (self.itemIndex === 0) {
          self.cosCss = {
            transform: 'translate3d(0px, 0px, 0px) translateZ(0px)'
          };
        }
        /* 无则刷新*/
        if (self.detail[arrObj[self.itemIndex] + 'List'].length === 0 && self.isRefresh) {
          store[arrObj[self.itemIndex]]();
        }
        self.isRefresh = true;
      });
    }
  };
</script>
