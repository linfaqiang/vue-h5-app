/**
* @file 新建更新记录
* @author hj
* @date 2016-11-21
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="goBack"></a>
      <a class="mui-icon-addrec mui-pull-right" @tap="saveFollowRec">确定</a>
    </header>

    <div class="mui-content">
      <div class="out-warpper">
        <textarea id="" placeholder="请输入跟进记录" v-model="recordDetail.data.trackContent" class="rec-content"
                  @focus="inputFocus()"></textarea>
        <ul style="padding:0px; background:#fff;">
          <li class="mui-table-view-cell crm-listIcon">
            <div class="rec-content-line"></div>
            <a class="address-rec">
              <span class="mui-icon crm-addr"></span>
              <p class="time-text">{{recordDetail.data.address.address || "无法获取当前位置"}}</p>
            </a>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  .out-warpper {
    background-color: #fff;
    width: 100%;
  }

  .out-warpper .rec-content {
    padding: 15px;
    min-height: 120px;
    font-size: 14px;
    color: #333;
  }

  .out-warpper .time-text {
    padding-left: 20px;
    margin-top: -20px;
  }

  .out-warpper ul .mui-table-view-cell:after {
    background-color: #fff !important;
  }

  .out-warpper .mui-table-view-cell {
    padding: 8px 15px;
  }

  .out-warpper .rec-content-line {
    border-top: 1px solid #CBCBCB;
    width: 100%;
    margin: 0 auto;
    margin-bottom: 8px;
  }

  .out-warpper .mui-table-view-cell {
    padding-right: 15px !important;
  }

  .out-warpper ul li:last-child {
    border-bottom: 1px solid #CBCBCB;
  }

  .mui-icon-ly:before {
    content: "\E302";
    position: relative;
    top: -1px;
  }

  .mui-icon-addrec {
    font-size: 14px;
    position: relative;
    z-index: 20;
    padding-top: 12px;
    padding-bottom: 10px;
  }

  .out-warpper textarea {
    line-height: 21px;
    width: 100%;
    height: 40px;
    margin-bottom: 15px;
    padding: 10px 15px;
    -webkit-user-select: text;
    border: none;
    border-radius: 0;
    outline: 0;
    background-color: #fff;
    -webkit-appearance: none;
  }

  .out-warpper .mui-table-view-cell > a:not(.mui-btn) {
    position: relative;
    display: block;
    overflow: hidden;
    margin: -5px -15px;
    padding: inherit;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: inherit;
  }

  .crm-addr {
    color: #d61518;
  }
</style>
<script>
  import store from '../clue-store';
  var nativeApi = require('nativeApi');
  export default {
    components: {},
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '新建跟进记录',
          name: '',
          href: ' ',
          btns: '保存'
        },
        listObject: {
          height: (document.body.offsetHeight - 44) + 'px'
        },
        recordDetail: store.state.recordDetail
      };
    },
    methods: {
      saveFollowRec: function () {
        if (!this.recordDetail.data.trackContent) {
          mui.alert('请输入跟进内容！', '提示');
          return;
        }
        store.saveRecord(function () {
          mui.alert('保存成功!', '提示', function () {
            store.getDedailTab1();
            history.go(-1);
          });
        });
      },
      inputFocus: function () {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.recordDetail.data.trackContent = result.result;
          }
        });
      },
      goBack: function () {
        history.go(-1);
      }
    },
    route: {
      data: function () {
        var self = this;
        // 获取当前位置
        nativeApi['getQDLocationInfo']({
          callback: function (result) {
            self.recordDetail.data.address = result;
          }
        });
        self.recordDetail.data.trackContent = '';
      }
    },
    created: function () {},
    ready: function () {
      mui.init();
    }
  };
</script>
