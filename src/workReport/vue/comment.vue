/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed;">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @click="saveComment()">保存</a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content" style="padding-top: 44px;">
      <div class="mui-scroll-wrapper" style="background: #f1f1f1;top: 44px;">
        <div class="mui-scroll">
          <textarea class="comment_text" v-model="commentText" placeholder="请输入评论，必填，限200字" maxlength="200"
                    @input="wordsInput()" @focus="inputFocus()"></textarea>
          <span class="words">{{words}}/200</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../work-store';
  var nativeApi = require('nativeApi');
  export default {
    data: function () {
      return {
        currentHeader: {
          title: '新建评论'
        },
        commentText: '',
        words: 0
      };
    },
    methods: {
      inputFocus: function () {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.commentText = result.result;
          }
        });
      },
      saveComment: function () {
        this.commentText = this.commentText.replace(/^[\s]+|[\s]+$/g, ''); // 去掉全角半角空格
        if (!this.commentText || this.commentText.length === 0) {
          mui.alert('回复内容不能为空！', '提示', function () {
          });
          return;
        }
        store.commentFn(this.commentText, function () {
          mui.alert('评论成功！', '提示', function () {
            history.go(-1);
            store.detail(store.state.workDetail.id);
          });
        });
      },
      wordsInput: function () {
        this.words = this.commentText.length;
      }
    },
    route: {
      data: function () {
        this.commentText = '';
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
