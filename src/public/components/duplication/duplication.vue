/**
  * @file
  * 排重 提示 (线索\客户)
  * @author hj
  * @date 2016-12-09
  */
<template>
    <div>
      <div class="eliminate_duplication_backdrop"></div>
      <div class="eliminate_duplication">
        <div id="edInner" class="ed_inner">
          <div class="ed_text" v-text="returnCss(duplication)"></div>
        </div>
        <div id="edWrapper" class="mui-scroll-wrapper" :style="edWrapperCss">
          <div class="mui-scroll">
            <div class="ed_content">
              <ul>
                <li v-for="list in duplication.lists" v-if="list.customerName">
                  <p>客户名称：<span v-text="list.customerName"></span></p>
                  <p>责任人：{{list.staffName}}</p>
                  <p>联系电话：{{list.staffMobile}}</p>
                  <span class="mui-icon mui-icon-mobile" @tap="call(list.staffMobile)"></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="ed_buttons" :style="edBtnCss">
          <span v-if="duplication.isTwo" class="left twoBtn" @tap="cancelFn()">取消</span>
          <span v-if="duplication.isTwo" class="twoBtn" @tap="continueFn()">继续</span>
          <span v-if="!duplication.isTwo" class="oneBtn" @tap="cancelFn()">确定</span>
        </div>
      </div>
    </div>
</template>
<style lang='less' rel='stylesheet.less'>
    @import './duplication.css';
</style>
<script>
    var nativeApi = require('nativeApi');
    export default {
      props: {
        duplication: {}
      },
      data: function () {
        return {
          edWrapperCss: {
            top: '',
            height: ''
          },
          edBtnCss: {
            'margin-top': ''
          }
        };
      },
      methods: {
        returnCss: function (data) {
          var self = this;
          setTimeout(function () {
            self.edWrapperCss.top = document.getElementById('edInner').offsetHeight + 'px';
            var length = data.lists.length - 1;
            var height = length * 77;
            if (height > 200) {
              height = 200;
            }
            self.edWrapperCss.height = height + 'px';
            self.edBtnCss['margin-top'] = height + 'px';
            mui('.mui-scroll-wrapper').scroll();
          }, 1);
          return data.showText;
        },
        continueFn: function () {
          this.$dispatch('continueSubmit');
        },
        cancelFn: function () {
          this.$dispatch('cancelHide');
        },
        call: function (mobile) {
          if (mobile) {
            nativeApi.openPhone({
              'apiJson': {
                'phoneNum': mobile
              }
            });
          }
        }
      }
    };
</script>
