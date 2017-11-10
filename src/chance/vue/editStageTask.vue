/**
  * @file 编辑阶段任务
  * @author hj
  * @date 2016-11-15
  */
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="editStageTask()">编辑</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1">
        <div class="mui-scroll">
          <div class="stage_detail_li">
            <div class="title">
              <p class="name">=======商机名称=======</p>
              <p class="cus">--------客户名称-------</p>
            </div>
            <div id="listDiv">
              <li v-for="list in stage.stageTaskList" index="{{$index}}" style="list-style: none;line-height: 44px;padding: 0 0 0 15px;border-bottom: 1px solid #ddd;">
                <p style="margin: 0;">{{list.name}}</p>
              </li>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
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
