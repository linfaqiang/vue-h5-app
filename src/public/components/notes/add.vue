<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveNotes()">保存</a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="add_notes">
          <textarea placeholder="请输入备注" v-model="noteData" @focus="inputFocus()"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from './notes-store';
  var nativeApi = require('nativeApi');
  export default {
    data: function () {
      return {
        currentHeader: {
          title: '新建备注'
        },
        noteData: '',
        remark: store.state,
        isEdit: false
      };
    },
    methods: {
      back: function (index) {
        history.go(-1);
      },
      voiceTo: function () {
        var self = this;
        nativeApi.cloundVol({
          callback: function (result) {
            self.textNotes = result.result;
          }
        });
      },
      inputFocus: function () {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.noteData = result.result;
          }
        });
      },
      saveNotes: function () {
        var remarkId = this.$route.params.id;
        var self = this;
        this.noteData = this.noteData.replace(/^[\s]+|[\s]+$/g, ''); // 去掉全角半角空格
        if (!this.noteData || this.noteData.length === 0) {
          mui.alert('备注内容不能为空！', '提示', function () {
          });
          return;
        }
        var noteData = nativeApi.replaceAllCh(self.noteData);
        if (!self.isEdit) {
          store.addNotes({
            'remarkType': self.remark.entityType,
            'entityId': self.remark.entityId,
            'content': noteData
          }, function () {
            mui.alert('备注新建成功！', '提示', function () {
              history.go(-1);
            });
          });
        } else {
          store.editNotes({
            'id': remarkId,
            'content': noteData
          }, function () {
            mui.alert('备注编辑成功！', '提示', function () {
              history.go(-1);
            });
          });
        }
      }
    },
    created: function () {
    },
    route: {
      data: function (transition) {
        var id = this.$route.params.id;
        var self = this;
        if (parseInt(id) === 0) {
          self.isEdit = false;
          self.currentHeader.title = '新建备注';
          self.noteData = '';
        } else {
          self.isEdit = true;
          self.currentHeader.title = '编辑备注';
          self.noteData = store.state.textNotes;
        }
        transition.next();
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
