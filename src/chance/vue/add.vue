/**
* @file 新建商机
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveAdd()">保存</a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div class="mui-scroll-wrapper" :style="styleObject">
        <div class="mui-scroll">
          <div class="add_ac">
            <ul>
              <li>
                <input type="text" placeholder="商机名称（必填）" v-model="addData.chanceName"
                       @focus="inputFocus('chanceName')">
              </li>
              <li>
                <textarea placeholder="备注（非必填）" v-model="addData.description"
                          @focus="inputFocus('description')"></textarea>
              </li>
            </ul>
          </div>
          <div class="add_form">
            <ul>
              <li class="mui-icon mui-icon-customer mui-must" :class="{'arrows': !addData.formOther}"
                  @click="goTo('customer', 0, '客户名称')">
                <span :class="{not: !addData.customer}">{{addData.customer||"客户名称"}}</span>
              </li>
              <!--<li class="mui-icon mui-icon-source mui-must arrows" @tap="goTo('source', 0, '商机来源')">
                  <span :class="{not: !addData.source}">{{addData.source||"商机来源"}}</span>
              </li>-->
              <li class="mui-icon mui-icon-ac-type mui-must arrows" @click="goTo('chanceType', 0, '商机类型')">
                <span :class="{not: !addData.chanceType}">{{addData.chanceType||"商机类型"}}</span>
              </li>
              <li class="mui-icon mui-icon-confirm mui-must arrows" @click="goTo('chanceStage', 0, '商机阶段')">
                <span :class="{not: !addData.chanceStage}">{{addData.chanceStage||"商机阶段"}}</span>
              </li>
              <li class="mui-icon mui-icon-status mui-not-must arrows" @click="goTo('status', 0, '状态')">
                <span :class="{not: !addData.status}">{{addData.status||"状态"}}</span>
              </li>
              <li class="mui-icon mui-icon-rate mui-not-must arrows" @tap="goTo('successRatio', 0, '成功率')">
                <span :class="{not: !addData.successRatio}">{{addData.successRatio||"成功率"}}</span>
              </li>
            </ul>
            <ul>
              <li class="mui-icon mui-icon-forecast-money mui-not-must">
                <input type="tel" placeholder="预测金额" v-model="addData.forecastAmount" @input="change('forecastAmount')"
                       @blur="noInputBlock">
                <em class="crm-close mui-icon" @tap="clear('forecastAmount')"
                    v-if="show && addData.forecastAmount"></em>
              </li>
              <li class="mui-icon mui-icon-forecast-make mui-not-must arrows"
                  @tap="goTo('extimateDealDate', 1, '预计成交日期')">
                <span :class="{not: !addData.extimateDealDate}">{{addData.extimateDealDate||"预计成交日期"}}</span>
              </li>
            </ul>
          </div>
          <div style="height: 10px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet/less'>
  @import '../../public/css/mui.image.css';
</style>
<script>
  import store from '../chance-store';
  var nativeApi = require('nativeApi');
  require('mui.previewimage');
  require('mui.zoom');
  export default{
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '新建商机'
        },
        addData: store.state.addData,
        styleObject: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44) + 'px'
        },
        show: false
      };
    },
    methods: {
      back: function (index) {
        if (window.initPage) {
          nativeApi.goNative({
            'apiJson': {
              'fn': 'chance'
            }
          });
        } else {
          history.go(-1);
        }
      },
      inputFocus: function (field) {
        var setVal = this.addData;
        nativeApi.showKeyboard({
          callback: function (result) {
            setVal[field] = result.result;
          }
        });
      },
      saveAdd: function () {
        store.saveAdd(function () {
          mui.alert('商机新建成功', '提示', function () {
            if (window.initPage) {
              nativeApi.goNative({
                'apiJson': {
                  'fn': 'chance',
                  'callFun': 'refreshChance',
                  'param': ''
                }
              });
            } else {
              store.listRefresh('list');
              history.go(-1);
            }
          });
        });
      },
      voice: function () {
        var self = this;
        nativeApi.cloundVol({
          callback: function (result) {
            self.addData.title = result.result;
          }
        });
      },
      clear: function (field) {
        this.addData[field] = '';
        this.show = false;
      },
      inputBlock: function () {
        this.show = true;
      },
      noInputBlock: function () {
        this.show = false;
      },
      goTo: function (fn, type, show) {
        var self = this;
        if (type === 0) {
          var selectId = self.addData[fn + 'Id'];
          if (fn === 'customer') {
            if (self.addData.formOther) {
              return;
            }
            store.state.selectId = selectId;
            self.$router.go('/customer/' + fn + '_add');
            return;
          }

          if (fn === 'chanceStage') {
            store.selectFn(fn, selectId, show, function () {
              self.$router.go('/selectPage/' + fn + '_add');
            }, store.state.addData.chanceTypeId || 0);
          } else {
            store.selectFn(fn, selectId, show, function () {
              self.$router.go('/selectPage/' + fn + '_add');
            });
          }
        } else if (type === 1) {
          /* 当前位置*/
          var picker = new mui.DtPicker({
            'type': 'date',
            'value': self.addData[fn] || ''
          });
          picker.show(function (rs) {
            self.addData[fn] = rs.text;
            picker.dispose();
          });
        }
      },
      deleteAppendix: function (index) {
        this.addData.appendixs.splice(index, 1);
      },
      change: function (field) {
        if (this.addData[field].length > 0) {
          this.show = true;
        }
      },
      playRecord: function (path) {
        nativeApi.openRecord({
          'apiJson': {
            'recordPath': path
          }
        });
      }
    },
    created: function () {
      var localKey = this.$route.params.localKey;
      if (localKey) {
        window.initPage = 'toAdd';
        window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
        localStorage.removeItem(localKey);
      }
      var fromNative = this.$route.params.fromNative;
      if (fromNative) {
        window.initPage = 'toAdd';
      }
      if (window.initPage) {
        store.cleanAdd();
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      mui.previewImage();
    }
  };
</script>
