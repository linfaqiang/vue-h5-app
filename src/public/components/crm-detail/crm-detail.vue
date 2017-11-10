<template>
  <ul class="crm-detail" id="crm-detail">
    <slot name="one"></slot>
    <li v-for="list in testList">
      <div class="crm-detail-left" v-text="list.name"></div>
      <div class="crm-detail-right">
        <a v-if="list.icon">
          <span :style="{color:list.activeColor}">{{list.value}}</span>
                <span class="mui-icon" v-if="list.value" :class="list.icon"
                      @tap='callPhoneOrShowMap(list.key,list.value,address.data)'>
                </span>
        </a>
        <span v-else v-html="list.value"></span>
      </div>
    </li>
    <slot name="two"></slot>
  </ul>
</template>
<style lang="less" rel="stylesheet/less">
  @import '../../css/module.css';
</style>
<script>
  var nativeApi = require('nativeApi');
  export default {
    props: {
      testList: {
        type: Array
      },
      address: {}
    },
    methods: {
      tapLink: function (index) {
        if (this.testList[index].href) {
          this.$router.go(this.testList[index].href);
        }
      },
      callPhoneOrShowMap: function (key, val, data) {
        var self = this;
        if (key === 'mobile') {
          nativeApi.openPhone({
            'apiJson': {
              'phoneNum': val
            }
          });
        } else if (key === 'email') {
          if (val === '') {
            return;
          }
          nativeApi.openEmail({
            'apiJson': {
              'recemail': val,
              'emailtitle': '',
              'emailcontent': '',
              'isHtml': '',
              'attachmentName': '',
              'attachmentBase64': ''
            }
          });
        } else {
          self.$dispatch('updateAddress', {
            'longitude': data.longitude,
            'latitude': data.latitude,
            'title': '',
            'address': data.address,
            'showMap': false,
            'province': data.province,
            'city': data.city,
            'district': data.district,
            'adcode': data.adcode,
            'cityCode': data.cityCode
          });
        }
      }
    }
  };
</script>
