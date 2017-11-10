<template>
  <!--新建页面列表  带图标  -->
  <li class="mui-table-view-cell crm-listIcon" v-if="!list.isHide || hide">
    <a :class="[(list.href && list.href!='not') ? 'mui-navigate-right' : '']" @click="tapLink()">
      <span :class="[list.icon , list.isB ? 'redColor': '']" class="mui-icon"> </span>
      <div v-if="list.href" :class="{not: !list.value}" v-text="list.value||list.name"></div>
      <input type="{{list.inputType||'text'}}" v-else placeholder="{{list.name}}" v-model=" list.value "
             @focus="inputBlock" @input="change()" @blur="noInputBlock"/>
      <span class="crm-close mui-icon" @click="clear()" v-if="show && list.value"> </span>
    </a>
  </li>
  <!--list.href 判断是否有跳转    isB 判断是否是必填字段-->
</template>
<style lang="less" rel="stylesheet/less">
  @import '../../css/module.css';
  @import '../../css/mui.picker.min.css';
</style>
<script>
  require('mui.picker.min');
  var nativeApi = require('nativeApi');
  export default{
    props: {
      list: {
        type: Object
      },
      hide: ''
    },
    data: function () {
      return {
        show: false
      };
    },
    methods: {
      tapLink: function () {
        var self = this;
        var field = this.list;
        var picker = null;
        /* 时间选择 */
        if (field.inputType === 'date') {
          /* 年月日选择 */
          picker = new mui.DtPicker({
            'value': field.value || '',
            'beginYear': '1916',
            'endYear': '2016',
            'type': 'date'
          });
          picker.show(function (rs) {
            field.value = rs.text;
            picker.dispose();
          });
        } else if (field.inputType === 'datetime') {
          /* 年月日时分选择 */
          picker = new mui.DtPicker({
            'value': field.value || '',
            'beginYear': '1916',
            'endYear': '2016',
            'type': ''
          });
          picker.show(function (rs) {
            field.value = rs.text;
            picker.dispose();
          });
        } else if (field.inputType === 'month') {
          /* 年月选择 */
          picker = new mui.DtPicker({
            'value': field.value || '',
            'beginYear': '1916',
            'endYear': '2016',
            'type': 'month'
          });
          picker.show(function (rs) {
            field.value = rs.text;
            picker.dispose();
          });
        } else if ((field.href === '2') && (field.href !== 'not')) {
          /* 当前位置 */
          self.$dispatch('getAdrMsg', field);
        } else if ((field.inputType === 'select') && (field.href !== 'not')) {
          /* 需要选择的字段 */
          this.$dispatch('formBack', field);
        }
      },
      clear: function () {
        this.list.value = '';
        this.show = false;
        // 清除绑定的输入框
        if (this.list.changeback) {
          this.$dispatch('clearback');
        }
      },
      inputBlock: function () {
        this.show = true;
        var list = this.list;
        nativeApi.showKeyboard({
          callback: function (result) {
            list.value = result.result;
          }
        });
      },
      noInputBlock: function () {
        var self = this;
        setTimeout(function () {
          self.show = false;
        }, 10);
      },
      change: function () {
        if (this.list.value.length > 0) {
          this.show = true;
        }
        // 如果输入后有回调,比如自动识别功能
        if (this.list.changeback) {
          this.throttle(this.inputsEven, this.list.value, window);
        }
        if (this.list.field === 'name') {
          /* 客户名称 生成简称 */
          this.$dispatch('setShortName', this.list.value);
        }
      },
      // 输入后的回调函数
      inputsEven: function (val) {
        this.$dispatch('change', val);
      },
      // 回调函数节流,比如输入客户名称后需要自动识别简称填到'简称'里面,但不需要每输入一个字符就识别一次
      throttle: function (method, val, context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function () {
          method.call(context, val);
        }, 300);
      }
    },
    ready: function () {
    }
  };
</script>
