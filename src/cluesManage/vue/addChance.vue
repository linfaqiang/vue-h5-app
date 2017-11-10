/**
* @file
* @author hj
* @date 2016-11-22
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
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
                <input type="text" placeholder="机会名称(必填)" v-model="chanceData.chanceData.chance.chanceName">
                <!--<em class="mui-icon-sound mui-icon" @tap="voice()"></em>-->
              </li>
              <li style="border-bottom:1px solid #ddd">
                <textarea placeholder="备注(非必填)" v-model="chanceData.chanceData.customer.remark"></textarea>
              </li>
              <li class="chance-con" @tap="goTo('chanceType', 0, '商机类型')" style="border-bottom:1px solid #ddd">
                <a class="mui-icon mui-navigate-right">
                  <div class="div-e" :class="{not: !chanceData.chanceData.chanceType}">
                    {{chanceData.chanceData.chanceType || '商机类型'}}
                  </div>
                </a>
              </li>
              <li class="chance-con" @tap="goTo('chanceStage', 0, '商机阶段')">
                <a class="mui-icon mui-navigate-right">
                  <div class="div-e" :class="{not: !chanceData.chanceData.chanceStage}">
                    {{chanceData.chanceData.chanceStage || '商机阶段'}}
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <div class="add_form add_chance_form">
            <ul>
              <li class="mui-icon mui-icon-customer mui-not-must" @tap="goTo('customer', 0, '客户名称')">
                <a class="mui-icon mui-navigate-right">
                  <div class="div-e" :class="{not: !chanceData.chanceData.chanceStage}">
                    {{chanceData.chanceData.customer.name || '客户名称（必填）'}}
                  </div>
                </a>
              </li>
              <li>
                <a class="mui-navigate-right" @tap="getLocationInfo()">
                  <div class="div-e" :class="{not: !chanceData.chanceData.address.address}">
                    {{chanceData.chanceData.address.address || "地址"}}
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showHide">
      <mui-duplication :duplication="duplicationData"></mui-duplication>
    </div>
  </div>
</template>
<script>
  import store from '../clue-store';
  var nativeApi = require('nativeApi');
  import duplication from '../../public/components/duplication/duplication.vue';
  export default {
    components: {
      'mui-duplication': duplication
    },
    data: function () {
      return {
        currentHeader: {
          title: '转商机'
        },
        chanceData: store.state,
        styleObject: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44) + 'px'
        },
        show: false,
        clueId: '',
        duplicationData: {},
        showHide: false
      };
    },
    events: {
      continueSubmit: function () {
        store.saveAdd(this.clueId, 1);
        this.showHide = false;
      },
      cancelHide: function () {
        this.showHide = false;
      }
    },
    methods: {
      back: function (index) {
        history.go(-1);
      },
      goTo: function (fn, type, show) {
        var self = this;
        if (type === 0) {
          var selectId = self.chanceData.chanceData[fn + 'Id'];
          if (fn === 'chanceStage' && !self.chanceData.chanceData.chanceTypeId) {
            mui.alert('请选择商机类型！', '提示');
            return;
          }
          if (fn === 'customer') {
            store.state.selectId = self.chanceData.chanceData.customer.id;
            self.$router.go('/customerPage/' + fn + '_add');
            return;
          }
          store.selectFn(fn, selectId, show, function () {
            self.$router.go('/selectPage/' + fn + '_add');
          });
        }
      },
      saveAdd: function () {
        var self = this;
        if (!this.chanceData.chanceData.chance.chanceName) {
          mui.alert('机会名称不能为空！', '提示', function () {
          });
          return;
        } else if (!store.state.chanceData['chanceType']) {
          mui.alert('请选择商机类型！', '提示', function () {
          });
          return;
        }
        store.saveAddChance(self.clueId, function (hasRepeat, lists) {
          if (hasRepeat === 'none') {
            mui.alert('商机新建成功', '提示', function () {
              if (window.initPage) {
                nativeApi.goNative({
                  'apiJson': {
                    'fn': 'cluesManage'
                  }
                });
              } else {
                history.go(-2);
              }
            });
          } else if (hasRepeat === 'customerOther') {
            /* 客户名称一样 且客户不属于自己 提示不能创建 */
            self.showHide = true;
            self.duplicationData = {
              'lists': lists,
              'isTwo': 0,
              'showText': '客户名称重复，并且不属于您，不能转成商机！'
            };
          } else if (hasRepeat === 'shortnameOther') {
            /* 客户简称一样 且客户不属于自己 需提示是否创建 */
            self.showHide = true;
            self.duplicationData = {
              'lists': lists,
              'isTwo': 1,
              'showText': '客户信息可能存在，共有' + (lists.length - 1) + '条匹配信息，是否继续创建！'
            };
          } else if (hasRepeat === 'outOfMaxCount') {
            /* 个人客户数超出上限 */
            mui.alert('客户数量超出最大客户数的限制，请联系管理员！', '提示');
          }
        });
      },
      getLocationInfo: function () {
        var self = this;
        /* 当前位置*/
        nativeApi['getQDLocationInfo']({
          callback: function (result) {
            self.chanceData.chanceData.address = result;
          }
        });
      },
      voice: function () {
        var self = this;
        nativeApi.cloundVol({
          callback: function (result) {
            self.editData.actData.title = result.result;
          }
        });
      }
    },
    created: function () {
    },
    route: {
      activate: function (transition) {
        var clueId = this.$route.params.id;
        this.clueId = clueId;
        transition.next();
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      mui.previewImage();
    }
  };
</script>
