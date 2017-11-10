/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @tap="back" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{formatDates(detail.detailData.startDate,detail.detailData.endDate)}}销售计划</h1>
      <a class="mui-icon-compose mui-icon mui-pull-right" @click="toEdit" v-if="!detail.detailUpDetail.id"></a>
    </header>
    <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1">
      <div class="mui-scroll">
        <div class="plans-detail">
          <div>
            <h3>{{detail.detailData.ownerObjName}}</h3>
            <div class="plans-detail-con">
              <ul>
                <li>
                  <p class="color_gray"><span class="mui-icon icon-mubiao color_yellow"></span>销售目标金额</p>
                  <p class="sale-mony">{{detail.detailData.targetAmount}}万元</p>
                </li>
                <li>
                  <p class="color_gray"><span class="mui-icon icon-jihua color_green"></span>销售计划金额</p>
                  <p class="sale-mony">{{detail.detailData.planAmount}}万元</p>
                </li>
                <li>
                  <p class="color_gray"><span class="mui-icon icon-sjje color_red"></span>实际销售金额</p>
                  <p class="color_red sale-mony">{{returnAmount(detail.detailData.finishedAmount)}}万元</p>
                </li>
              </ul>
              <div class="columns">
                <div class="columns-l">
                  <p class="columns-v">{{detail.detailData.finishedRate}}</p>
                  <span class="columns-p"><span class="bg_yellow"
                                                :style="getHeight(detail.detailData.finishedAmount/10000/detail.detailData.targetAmount*100)"></span></span>
                  <p class="columns-title">目标完成率</p>
                </div>
                <div class="columns-r">
                  <p class="columns-v">{{detail.detailData.planFinishedRate}}</p>
                  <span class="columns-p"><span class="bg_green"
                                                :style="getHeight(detail.detailData.finishedAmount/10000/detail.detailData.planAmount*100)"></span></span>
                  <p class="columns-title">计划完成率</p>
                </div>
              </div>
            </div>
          </div>
          <div class="plans-detail-b">
            <span class="color_gray">备注</span>
            <p>{{detail.detailData.remark}}</p>
          </div>
        </div>
        <div class="plans-new">
          <div class="slideUl" style="width: 100%" v-if="detail.detailData.list && detail.detailData.list.length > 0">
            <ul style="border-bottom: 0">
              <li class="fenpei">
                            <span class="fenpei-l">未分配
                                <span class="right-value" v-text="detail.detailData.undistributed"></span>
                                <span style="font-size: 14px" class="color_red">万元</span>
                            </span>
                <span class="xian"></span>
                            <span class="fenpei-l">已分配
                                <span class="right-value" v-text="detail.detailData.assignAmount"></span>
                                <span style="font-size: 14px" class="color_red">万元</span>
                            </span>
              </li>
            </ul>
            <ul style="border-top:0">
              <li class="public-li" v-for="list in detail.detailData.list" @tap="toDownDetail(list.id)"
                  style="height: 50px;">
                <span class="big-font">{{list.dept||list.owner}}</span>
                        <span class="f_r">
                            <span class="right-value">{{list.targetAmount}}</span>
                            <span class="f_14 color_red">万元</span>
                        </span>
                <span class="mui-icon mui-push-right"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../plan-store';
  import {tools} from '../../public/js/tools.js';
  var nativeApi = require('nativeApi');
  export default {
    data: function () {    // 组件的数据格式
      return {
        detail: store.state,
        name: '收起',
        isShow: false,
        scrollObj: null
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
            'longitude': val.long,
            'latitude': val.lat,
            'title': '测试用',
            'address': '',
            'showMap': true
          },
          callback: function (result) {
          }
        });
      },
      back: function () {
        var self = this;
        if (store.state.detailUpDetail.id) {
          store.state.detailData = store.state.detailUpDetail;
          store.state.detailUpDetail = {};
          setTimeout(function () {
            self.scrollObj.scrollTo(0, 0, 0);
          }, 10);
        } else {
          history.go(-1);
        }
      },
      getHeight: function (val) {
        return 'height:' + val + '%';
      },
      slides: function () {
        var oBtn = document.getElementById('slider');
        this.isShow = !this.isShow;
        if (this.isShow) {
          this.name = '更多详细信息';
          oBtn.style.top = '112px';
        } else {
          this.name = '收起';
          oBtn.style.top = '196px';
        }
      },
      percentage: function (a, b) {
        if (b === 0) {
          return '0%';
        } else {
          var num = a / b * 100 / 10000;
          return Math.round(num * 100) / 100 + '%';
        }
      },
      returnAmount: function (num) {
        num = (parseFloat(num) / 10000).toFixed(2);
        return num;
      },
      goDetails: function (id) {
        var self = this;
        store.renderDepth(this.detail.startDate, this.detail.endDate, this.detail.assignList, function () {
          self.$router.go('/salesPlans-details/' + id);
        });
      },
      formatDates: function (a, b) {
        var aa = tools.formatDate(a, 'yyyy-mm');
        var bb = tools.formatDate(b, 'yyyy-mm');
        if (aa === bb) {
          return aa;
        } else {
          return aa + '/' + bb;
        }
      },
      toEdit: function () {
        var self = this;
        store.getIfLeader(function () {
          store.setEdit(function () {
            self.$router.go('/salesPlans-edit');
          });
        });
      },
      toDownDetail: function (id) {
        store.renderDetail(id);
        var self = this;
        setTimeout(function () {
          self.scrollObj.scrollTo(0, 0, 0);
        }, 10);
      }
    },
    route: {
      data: function () {
        var list = store.state.detailData;
        if (list.isAttack) {
          mui.alert('不允许重复计划,计划冲突请即刻合并', '提示', function () {
            store.mergePlan(list.attackFlag);
          });
        }
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-slider').slider();
      this.scrollObj = mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
