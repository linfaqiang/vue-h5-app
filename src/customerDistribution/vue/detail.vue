<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <h1 class="mui-title" v-text="detail.detailData.shortname||detail.detailData.name"></h1>
    </header>
    <div class="mui-content">
      <div id="theDetail" class="detail_li" :style="{'height': detailHeight + 'px'}">
        <ul>
          <li>
            <label>公司全称</label>
            <div style="padding: 0 55px 0 70px;">{{detail.detailData.name}}</div>
          </li>
          <li>
            <label>单位地址</label>
            <div>{{detail.detailData.address?detail.detailData.address.address:""}}<span
              class="mui-icon mui-icon-address"></span></div>
            <!--@click="correctLocation(detail.detailData.address)"-->
          </li>
          <li>
            <label>行业</label>
            <div>{{detail.detailData.industryName}}</div>
          </li>
          <li>
            <label>公司电话</label>
            <div>{{detail.detailData.telephone}}<span v-if="detail.detailData.telephone" class="mui-icon mui-icon-phone"
                                                      @click="call(detail.detailData.telephone)"></span></div>
          </li>
          <li>
            <label>网址</label>
            <div>{{detail.detailData.url}}</div>
          </li>
          <li>
            <label>电子邮箱</label>
            <div>{{detail.detailData.email}}</div>
          </li>
          <li>
            <label>员工总数</label>
            <div>{{detail.detailData.employeesTotal}}</div>
          </li>
          <li>
            <label>年度收入</label>
            <div>{{detail.detailData.annualIncome}}</div>
          </li>
          <li>
            <label>CEO</label>
            <div>{{detail.detailData.ceoName}}</div>
          </li>
          <li>
            <label>客户等级</label>
            <div>{{detail.detailData.customerLevelName}}</div>
          </li>
          <li>
            <label>责任人</label>
            <div>{{detail.detailData.ownerStaffName}}</div>
          </li>
        </ul>
        <div class="bu_th">
          <span @tap="team(detail.detailData.id)">销售团队</span>
          <!--<span @tap="hierarchy(detail.detailData.id,detail.detailData.name)">客户层级</span>-->
          <span class="remark" @tap="notes(detail.detailData.id)">备注</span>
        </div>
      </div>
      <div class="detail_de">
        <div class="show_hide" @tap="showHide()"><font v-html="buTitle?(buTitle+'<br>'):''"></font><span
          class="mui-icon" :class="{'crm-push-down': isHide, 'crm-push-up': !isHide, 'show_more': isHide}"></span></div>
        <div id="muiSlider" class="mui-slider">
          <div id="itemTab">
            <a class="controlitem" :class="{'active':detail.tabIndex==0}" @tap="itemTab(0)">
              跟进记录
            </a>
            <a v-if="edition!=1" class="controlitem" :class="{'active':detail.tabIndex==1}" @tap="itemTab(1)">
              商机
            </a>
            <a class="controlitem" :class="{'active':detail.tabIndex==2}" @tap="itemTab(2)">
              联系人
            </a>
          </div>
          <div class="mui-slider-group deputy_li">
            <div class="itemTabShow" v-show="detail.tabIndex==0">
              <div :class="{'list_is_null': follow.dataList.length == 0}" style="position: relative;margin: 0;"
                   :style="liCss">
                <div v-show="follow.dataList.length>0">
                  <mui-scroll-refresh bottom="0" top="0" icon="follow">
                    <activity-list-components :lists.sync="follow.dataList"></activity-list-components>
                  </mui-scroll-refresh>
                </div>
              </div>
            </div>
            <div class="itemTabShow" v-show="detail.tabIndex==1">
              <div :class="{'list_is_null': chance.dataList.length == 0}" style="position: relative;margin: 0;"
                   :style="liCss">
                <div v-show="chance.dataList.length>0">
                  <mui-scroll-refresh bottom="0" top="0" icon="chance">
                    <div class="customer_chance">
                      <ul>
                        <li v-for="list in chance.dataList" class="sideline_down" @tap="toChanceDetail(list.id)">
                          <p class="name" v-text="list.chanceName"></p>
                          <p>最后跟进：{{list.trackDate}}<span v-text="'¥'+list.forecastAmount"></span></p>
                          <span class="status" v-text="list.statusText"></span>
                          <span class="mui-icon mui-push-right"></span>
                        </li>
                      </ul>
                    </div>
                  </mui-scroll-refresh>
                </div>
              </div>
            </div>
            <div class="itemTabShow" v-show="detail.tabIndex==2">
              <div :class="{'list_is_null': detail.contactList.length == 0}" :style="liCss">
                <div class="mui-scroll-wrapper">
                  <div class="mui-scroll">
                    <div class="customer_contact_li sideline_down" v-for="list in detail.contactList"
                         @tap="toContactDetail(list.id)">
                      <p class="title">{{list.name}}</p>
                      <p>{{list.title}}</p>
                      <span class="mui-icon mui-push-right"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="distributionBtn" @tap="distributionFn">分配<span class="mui-icon crm-solid-check"></span></div>
    </div>
    <div v-show="isShow">
      <crm-newpage :num="num" :items="listdata" :title="title"></crm-newpage>
    </div>
  </div>
</template>
<script>
  import store from '../customer-store';
  var arrObj = ['follow', 'task', 'product', 'salesPrice', 'contact'];
  var nativeApi = require('nativeApi');
  import activityList from '../../public/components/crm-activity/list.vue';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  import newPage from '../../public/components/crm-new/crm-newpage.vue';
  export default{
    components: {
      'activity-list-components': activityList,
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
        chance: store.scroll.chance,
        isHide: true,
        buTitle: '',
        liCss: {
          height: (document.body.offsetHeight - 60 - 36 - 40 - 44 - 44) + 'px'
        },
        itemIndex: 0,
        title: '创建一个新的...',
        isShow: false,
        num: 1,
        cosCss: {},
        listdata: [
          {
            icon: 'crm-sales-activities',
            name: '活动',
            function: 'activity',
            page: 'toAdd',
            param: {}
          },
          {
            icon: 'crm-icon-task',
            name: '任务',
            function: 'taskManage',
            page: 'toAdd',
            param: {}
          },
          {
            icon: 'crm-sales-opportunities',
            name: '商机',
            page: 'toAdd',
            function: 'chance',
            param: {}
          },
          {
            icon: 'crm-icon-con',
            name: '联系人',
            page: 'toAdd',
            function: 'contact',
            param: {}
          }
        ],
        edition: nativeApi.edition,
        isRefresh: true,
        detailHeight: 60
      };
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll(scroll.element.getAttribute('icon'), scroll);
      },
      pulldown: function (scroll) {
        store.listRefresh(scroll.element.getAttribute('icon'));
      },
      pullup: function (scroll) {
        store.listLoadMore(scroll.element.getAttribute('icon'));
      },
      'parent-show': function () {
        this.isShow = false;
      },
      parentHide: function () {
        this.isShow = false;
      },
      'toDetail': function (id) {
        localStorage.setItem('customer_activity_detail', JSON.stringify({
          'type': 'customer',
          'id': id
        }));
        nativeApi.goView({
          'apiJson': {
            'isTrue': true,
            'urlPort': 'activity/index.html#!/detailPage/customer_activity_detail',
            'function': 'activity'
          }
        });
      }
    },
    methods: {
      back: function (index) {
        if (window.initPage) {
          nativeApi.goNative();
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
      addAll: function () {
        this.isShow = true;
        var self = this;
        var list = self.listdata;
        for (var i = 0; i < list.length; i++) {
          list[i].param = {
            'type': 'customer',
            'customerId': self.detail.detailData.id || '',
            'customerName': self.detail.detailData.name || ''
          };
        }
      },
      showHide: function () {
        var self = this;
        if (self.isHide) {
          self.isHide = false;
          self.buTitle = '收起';
          self.detailHeight = document.getElementById('theDetail').scrollHeight;
        } else {
          self.isHide = true;
          self.buTitle = '';
          self.detailHeight = 60;
        }
        self.liCss['height'] = (document.body.offsetHeight - self.detailHeight - 36 - 40 - 44 - 44) + 'px';
      },
      linkTab: function (index) {
        /* 刷新*/
        store[arrObj[index]]();
        this.isRefresh = false;
      },
      notes: function (id) {
        this.$router.go('/notes/customer_' + id + '/false');
      },
      team: function (id) {
        this.$router.go('/teamPage/' + id + '/1/false');
      },
      hierarchy: function (id, name) {
        this.$router.go('/hierarchy/' + id + '/' + name);
      },
      correctLocation: function (param) {
        param.title = this.detail.detailData.name;
        param.showMap = false;
        nativeApi.correctLocation({
          'apiJson': param,
          callback: function (result) {
            /* 位置纠偏*/
            store.updateAddress(result);
          }
        });
      },
      call: function (phone) {
        nativeApi.openPhone({
          'apiJson': {
            'phoneNum': phone
          }
        });
      },
      itemTab: function (index) {
        this.detail.tabIndex = index;
        if (index === 0) {
          store.listRefresh('follow');
        } else if (index === 1) {
          store.listRefresh('chance');
        } else if (index === 2) {
          store.contact();
        }
      },
      muiTabSlide: function (e) {
        var num = e.detail.slideNumber;
        if (num === 0) {
          /* 跟进记录 翻页*/
          store.listRefresh('follow');
        } else if (num === 1) {
          /* 商机 翻页*/
          store.listRefresh('chance');
        } else if (num === 2) {
          /* 联系人*/
          store.contact();
        }
      },
      toChanceDetail: function (id) {
        /* 商机详情*/
        var self = this;
        localStorage.setItem('customer_chance_detail', JSON.stringify({
          'type': 'customer',
          'id': id,
          'customerId': self.detail.detailData.id
        }));
        nativeApi.goView({
          'apiJson': {
            'isTrue': true,
            'urlPort': 'chance/index.html#!/detailPage/customer_chance_detail',
            'function': 'chance'
          }
        });
      },
      toContactDetail: function (id) {
        /* 联系人详情*/
        var self = this;
        localStorage.setItem('customer_contact_detail', JSON.stringify({
          'type': 'customer',
          'id': id,
          'customerId': self.detail.detailData.id
        }));
        nativeApi.goView({
          'apiJson': {
            'isTrue': true,
            'urlPort': 'contact/index.html#!/detailPage/customer_contact_detail',
            'function': 'contact'
          }
        });
      },
      distributionFn: function () {
        var self = this;
        store.getDistributeList('', function () {
          self.$router.go('/personDeptPage');
        });
      }
    },
    created: function () {
      if (window.initPage) {
        store.getDetail(window.initParam.id);
      }
    },
    route: {
      data: function () {
        this.detail.tabIndex = 0;
        this.isHide = true;
        this.buTitle = '';
        this.detailHeight = 60;
        this.liCss['height'] = (document.body.offsetHeight - this.detailHeight - 36 - 40 - 44 - 44) + 'px';
        window['refreshFollow'] = function () {
          /* 刷新跟进记录*/
          store.listRefresh('follow');
        };
        window['refreshChance'] = function () {
          /* 刷新报价*/
          store.listRefresh('chance');
        };
        window['refreshContact'] = function () {
          /* 刷新联系人*/
          store.contact();
        };
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
