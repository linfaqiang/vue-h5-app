/**
* @file 编辑商机
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveEdit()">保存</a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div class="mui-scroll-wrapper" :style="styleObject">
        <div class="mui-scroll">
          <div class="add_ac">
            <ul>
              <li style="border-bottom: 0;">
                <input type="text" placeholder="商机名称（必填）" v-model="edit.editData.chanceName"
                       @focus="inputFocus('chanceName')">
              </li>
              <!--<li>-->
              <!--<textarea placeholder="描述（非必填）" v-model="edit.editData.description" @focus="inputFocus('description')"></textarea>-->
              <!--</li>-->
            </ul>
          </div>
          <div class="edit_page">
            <ul>
              <li>
                <a>
                  <label>客户名称</label>
                  <div>{{edit.editData.customer}}</div>
                </a>
              </li>
              <!--<li>
                   <a class="mui-icon arrows" @tap="goTo('source', 0, '商机来源')">
                       <label>商机来源<span>*</span></label>
                       <div>{{edit.editData.source}}</div>
                   </a>
               </li>-->
              <li>
                <a class="mui-icon">
                  <label>商机类型</label>
                  <div>{{edit.editData.chanceType}}</div>
                </a>
              </li>
              <li>
                <a class="mui-icon arrows" @tap="goTo('chanceStage', 0, '商机阶段')">
                  <label>商机阶段</label>
                  <div>{{edit.editData.chanceStage}}</div>
                </a>
              </li>
              <li>
                <a class="mui-icon arrows" @tap="goTo('status', 0, '状态')">
                  <label>状态</label>
                  <div>{{edit.editData.status}}</div>
                </a>
              </li>
              <li>
                <a class="mui-icon arrows" @tap="goTo('successRatio', 0, '成功率')">
                  <label>成功率</label>
                  <div>{{edit.editData.successRatio}}</div>
                </a>
              </li>
            </ul>
            <ul>
              <li>
                <a class="mui-icon">
                  <label>预测金额</label>
                  <div><input type="tel" v-model="edit.editData.forecastAmount"></div>
                </a>
              </li>
              <li>
                <a class="mui-icon arrows" @tap="goTo('extimateDealDateStr', 1, '预计成交日期')">
                  <label>预计成交日期</label>
                  <div>{{edit.editData.extimateDealDateStr}}</div>
                </a>
              </li>
            </ul>
            <ul>
              <li class="switch">
                <a>
                  <label>商机关闭</label>
                  <div>
                    <div @tap="switchFn()"
                         :class="{'mui-switch':true, 'mui-switch-mini': true, 'mui-active': edit.editData.isColsed==1}">
                      <div class="mui-switch-handle"></div>
                    </div>
                  </div>
                </a>
              </li>
              <li v-if="edit.editData.isColsed==1">
                <a class="mui-icon arrows" @tap="goTo('closeReason', 0, '关闭原因')">
                  <label>关闭原因<span>*</span></label>
                  <div>{{edit.editData.closeReason}}</div>
                </a>
              </li>
              <li v-if="edit.editData.isColsed==1 && edit.editData.closeReasonId=='0'">
                <a class="mui-icon">
                  <label>成交金额<span>*</span></label>
                  <div><input type="tel" v-model="edit.editData.dealAmount"></div>
                </a>
              </li>
              <li v-if="edit.editData.isColsed==1 && edit.editData.closeReasonId=='0'">
                <a class="mui-icon arrows" @tap="goTo('dealDateStr', 1, '成交日期')">
                  <label>成交日期</label>
                  <div>{{edit.editData.dealDateStr}}</div>
                </a>
              </li>
              <li v-if="edit.editData.isColsed==1 && edit.editData.closeReasonId==1">
                <a class="mui-icon">
                  <label>输单金额<span>*</span></label>
                  <div><input type="tel" v-model="edit.editData.loseAmount"></div>
                </a>
              </li>
              <li v-if="edit.editData.isColsed==1 && edit.editData.closeReasonId==1">
                <a class="mui-icon arrows" @tap="goTo('loseDateStr', 1, '输单日期')">
                  <label>输单日期</label>
                  <div>{{edit.editData.loseDateStr}}</div>
                </a>
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
    data: function () {
      return {
        currentHeader: {
          title: '编辑商机'
        },
        edit: store.state,
        styleObject: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44) + 'px'
        },
        switch: false
      };
    },
    methods: {
      back: function (index) {
        history.go(-1);
      },
      inputFocus: function (field) {
        var setVal = this.edit.editData;
        nativeApi.showKeyboard({
          callback: function (result) {
            setVal[field] = result.result;
          }
        });
      },
      saveEdit: function () {
        var self = this;
        store.saveEdit(function (id) {
          mui.alert('商机编辑成功', '提示', function () {
            if (window.initParam) {
              window.isEdit = true;
            } else {
              setTimeout(function () {
                store.getDetail(id, function () {
                  store.listRefresh('list');
                });
              }, 50);
            }
            self.back();
          });
        });
      },
      switchFn: function () {
        if (this.edit.editData.isColsed === 1) {
          this.edit.editData.isColsed = 0;
        } else {
          this.edit.editData.isColsed = 1;
        }
      },
      clear: function (field) {
        var self = this;
        self.edit.editData[field] = '';
        if (self.edit.editData[field + 'Id']) {
          self.edit.editData[field + 'Id'] = '';
        }
        this.show = false;
      },
      inputBlock: function () {
        this.show = true;
      },
      noInputBlock: function () {
        this.show = false;
      },
      change: function (field) {
        if (this.edit.editData[field].length > 0) {
          this.show = true;
        }
      },
      goTo: function (fn, type, show) {
        var self = this;
        if (type === 0) {
          var selectId = self.edit.editData[fn + 'Id'];
          if (fn === 'customer') {
            store.state.selectId = selectId;
            self.$router.go('/customer/' + fn + '_edit');
            return;
          }
          if (fn === 'chanceStage') {
            store.selectFn(fn, selectId, show, function () {
              self.$router.go('/selectPage/' + fn + '_edit');
            }, store.state.editData.chanceTypeId || 0);
          } else {
            store.selectFn(fn, selectId, show, function () {
              self.$router.go('/selectPage/' + fn + '_edit');
            });
          }
        } else if (type === 1) {
          /* 当前位置*/
          var picker = new mui.DtPicker({
            'type': 'date',
            'value': self.edit.editData[fn] || ''
          });
          picker.show(function (rs) {
            self.edit.editData[fn] = rs.text;
            picker.dispose();
          });
        }
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      mui.previewImage();
    }
  };
</script>
