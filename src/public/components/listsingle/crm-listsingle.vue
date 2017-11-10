<template>
  <!--编辑页面列表  不带图标  -->
  <li class="mui-table-view-cell crm-listSingle">
    <a :class="[list.href && list.href !=0 && list.href!='not' ? 'mui-navigate-right' : '']" @click="tapLink">
        <span>
            <span>{{list.name}}<sup v-if="list.ok||list.isB">*</sup></span>
		</span>
      <div v-if="list.href" v-text="list.value"></div>
      <input type="{{list.inputType||'text'}}" v-else v-model="list.value" @focus="inputBlock" @input="change()"
             @blur="noInputBlock"/>
      <span class="crm-close mui-icon" @click="clear()" v-if="show && list.value"> </span>
    </a>
  </li>
</template>
<style lang="less" rel="stylesheet/less">
  @import '../../css/module.css';
</style>
<script>
  var nativeApi = require('nativeApi');
  export default{
    props: {
      list: {
        type: Object
      }
    },
    data: function () {
      return {
        show: false
      };
    },
    methods: {
      tapLink: function () {
        var field = this.list;
        var picker = null;

        /* 时间选择 */
        if (field.inputType === 'date') { /* 年月日选择 */
          picker = new mui.DtPicker({
            'value': field.value || '',
            'beginYear': '1916',
            'endYear': '2018',
            'type': 'date'
          });
          picker.show(function (rs) {
            field.value = rs.text;
            picker.dispose();
          });
        } else if (field.inputType === 'datetime') { /* 年月日时分选择 */
          picker = new mui.DtPicker({
            'value': field.value || '',
            'beginYear': '1916',
            'endYear': '2018',
            'type': ''
          });
          picker.show(function (rs) {
            field.value = rs.text;
            picker.dispose();
          });
        } else if (field.inputType === 'month') { /* 年月选择 */
          picker = new mui.DtPicker({
            'value': field.value || '',
            'beginYear': '1916',
            'endYear': '2018',
            'type': 'month'
          });
          picker.show(function (rs) {
            field.value = rs.text;
            picker.dispose();
          });
        } else if (field.href === '2' && field.href !== 'not') { /* 当前位置 */
          var self = this;
          self.$dispatch('getAdrMsg', field);
        } else if (field.inputType === 'select' && field.href !== 'not') { /* 需要选择的字段 */
          this.$dispatch('formBack', field);
        }
      },
      clear: function () {
        this.list.value = '';
        this.show = false;
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
      }
    },
    ready: function () {

    }
  };
</script>
