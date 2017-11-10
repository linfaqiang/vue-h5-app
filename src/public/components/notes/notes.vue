<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a v-if="isEdit" class="mui-icon-plusempty mui-icon mui-pull-right" href="#newNotes"></a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div :class="{'list_is_null': notes.dataList.length==0}"></div>
      <div v-show="notes.dataList.length>0">
        <mui-scroll-refresh bottom="0px" top="44px">
          <div class="timer_shaft">
            <ul>
              <li v-for="list in notes.dataList" @tap="isEdit?toEditNotes($index):''">
                <p class="time">{{list.createdOn}}</p>
                <p v-if="list.content">{{deCodeH(list.content)}}</p>
                <a class="record" v-if="list.audioFileUrl" @tap="voice(list.audioFileUrl)"><span
                  class="mui-icon mui-icon-voice"></span>{{list.audioFileLength}}</a>
                <a class="images" v-if="list.picFileUrl" v-html="returnHtml(list.picFileUrl)"></a>
                <span class="point"></span>
                <div class="line_l" v-if="(notes.dataList.length-1)!=$index"></div>
              </li>
            </ul>
          </div>
        </mui-scroll-refresh>
      </div>

      <div id="newNotes" class="mui-popover mui-popover-action mui-popover-bottom">
        <ul class="mui-table-view">
          <li class="mui-table-view-cell">
            <a href="#newNotes" @tap="addNotes()">文本</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="#newNotes" @tap="photo('goPhoto')">拍照</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="#newNotes" @tap="photo('fromImgLibrary')">本地相册</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="#newNotes" @tap="record()">录音</a>
          </li>
        </ul>
        <ul class="mui-table-view">
          <li class="mui-table-view-cell mui-cancel">
            <a href="#newNotes"><b>取消</b></a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import './notes.css';
  @import '../../css/mui.image.css';
</style>
<script>
  import scrollRefresh from '../mui-scroll-refresh/mui-scroll-refresh.vue';
  require('mui.previewimage');
  require('mui.zoom');
  import store from './notes-store';
  var nativeApi = require('nativeApi');
  export default{
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        currentHeader: {
          title: '备注信息'
        },
        notes: store.scroll.list,
        remark: store.state,
        isEdit: true
      };
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('list', scroll);
      },
      pulldown: function () {
        store.listRefresh('list');
      },
      pullup: function () {
        store.listLoadMore('list');
      }
    },
    methods: {
      back: function (index) {
        history.go(-1);
      },
      voice: function (pathUrl) {
        nativeApi.goDownload({
          'apiJson': {
            'endBack': '3',
            'file': {
              'name': pathUrl.substring(pathUrl.lastIndexOf('/') + 1, pathUrl.length),
              'sha': pathUrl.substring(pathUrl.lastIndexOf('/') + 1, pathUrl.lastIndexOf('.')),
              'size': '',
              'status': '1',
              'type': pathUrl.substring(pathUrl.lastIndexOf('.') + 1, pathUrl.length),
              'url': pathUrl
            },
            'type': 'AUDIO'
          },
          callback: function (result) {
          }
        });
      },
      deCodeH: function (val) {
        return val ? nativeApi.replaceAllCh(val, 1) : '';
      },
      photo: function (fn) {
        var self = this;
        nativeApi[fn]({
          'apiJson': {
            'backType': '2',
            'wDivisor': '1024',
            'hDivisor': '780',
            'uploadUrl': store.APIS.upload_file
          },
          callback: function (result) {
            store.addNotes({
              'remarkType': self.remark.entityType,
              'entityId': self.remark.entityId,
              'picFileIds': result.fId
            });
          }
        });
      },
      record: function () {
        var self = this;
        nativeApi.goRecord({
          'apiJson': {
            'uploadUrl': store.APIS.upload_file
          },
          callback: function (result) {
            store.addNotes({
              'remarkType': self.remark.entityType,
              'entityId': self.remark.entityId,
              'audioFileId': result.fId,
              'audioFileLength': result.recordTime
            });
          }
        });
      },
      addNotes: function () {
        store.cleanNotes();
        var id = '0';
        this.$route.router.go('/addNotes/' + id);
      },
      toEditNotes: function (index) {
        var dataJson = this.notes.dataList[index];
        if (!dataJson.content) {
          return;
        }
        store.cleanNotes(dataJson.content);
        var id = dataJson.id;
        this.$route.router.go('/addNotes/' + id);
      },
      returnHtml: function (urlArr) {
        var html = '';
        for (var i = 0; i < urlArr.length; i++) {
          var pathUrl = urlArr[i].fileUrl;
          var suffix = pathUrl.substring(pathUrl.lastIndexOf('.') + 1, pathUrl.length).toLocaleLowerCase();
          var fileSize = urlArr[i].fileSize;
          if (fileSize >= 1024 * 1024 * 1024) {
            /* G */
            fileSize = (fileSize / 1024 / 1024 / 1024).toFixed(1) + 'G';
          } else if (fileSize >= 1024 * 1024 && fileSize <= 1024 * 1024 * 1024) {
            /* M */
            fileSize = (fileSize / 1024 / 1024).toFixed(1) + 'M';
          } else if (fileSize >= 1024 && fileSize <= 1024 * 1024) {
            /* K */
            fileSize = (fileSize / 1024).toFixed(1) + 'K';
          } else {
            fileSize = 0;
          }
          if ('.jpg|.jpeg|.gif|.bmp|.png|'.indexOf(suffix + '|') > -1) {
            html += '<img src="' + pathUrl + '" data-preview-src="" data-preview-group="2">';
          } else {
            var icon = 'crm-icon-unkonw';
            if ('.doc|.xls|.ppt|.pptx|.pdf|.docx|.xlsx|'.indexOf(suffix + '|')) {
              icon = 'crm-icon-' + suffix;
            }
            html += '<div class="appendix" onclick="checkAppendix(\'' + pathUrl + '\')"><span class="mui-icon ' + icon + '"></span><span>' + fileSize + '</span><p>' + urlArr[i].originName + '</p></div>';
          }
        }
        return html;
      }
    },
    route: {
      data: function (transition) {
        window['checkAppendix'] = function (pathUrl) {
          var suffix = pathUrl.substring(pathUrl.lastIndexOf('.') + 1, pathUrl.length).toLocaleLowerCase();
          var suffixType = '';
          if (mui.os.ios || mui.os.android) {
            if ('.jpg|.jpeg|.gif|.bmp|.png|'.indexOf(suffix + '|') > -1) {
              /* 图片 */
              suffixType = 'IMAGE';
            } else if ('.mp4|.mov|'.indexOf(suffix + '|') > -1) {
              /* 视频 */
              suffixType = 'VEDIO';
            } else if ('.amr|.wav|'.indexOf(suffix + '|') > -1) {
              /* 音频 */
              suffixType = 'AUDIO';
            } else if ('.txt|'.indexOf(suffix + '|') > -1) {
              /* 文本 */
              suffixType = 'TEXT';
            } else if ('.doc|.xls|.ppt|.pptx|.pdf|.docx|.xlsx|'.indexOf(suffix + '|') > -1) {
              /* 办公 */
              suffixType = 'OFFICE';
            } else if ('.html|.jsp|.php|.asp|'.indexOf(suffix + '|') > -1) {
              /* 网页 */
              suffixType = 'WEBSITE';
            } else {
              mui.alert('对不起，app不支持该附件类型！', '提示');
              return;
            }
          }
          nativeApi.goDownload({
            'apiJson': {
              'endBack': '2',
              'file': {
                'name': pathUrl.substring(pathUrl.lastIndexOf('/') + 1, pathUrl.length),
                'sha': pathUrl.substring(pathUrl.lastIndexOf('/') + 1, pathUrl.lastIndexOf('.')),
                'size': '',
                'status': '1',
                'type': pathUrl.substring(pathUrl.lastIndexOf('.') + 1, pathUrl.length),
                'url': pathUrl
              },
              'type': suffixType
            },
            callback: function (result) {
            }
          });
        };
        // 备注是否可编辑
        // this.isEdit = this.$route.params.isEdit === 'false' ? false : true; // 原先的代码
        this.isEdit = this.$route.params.isEdit === 'true';
        /* 请求列表 */
        var param = this.$route.params.id;
        var arr = param.split('_');
        if (this.remark.entityId !== arr[1]) {
          this.remark.entityId = arr[1];
          this.remark.entityType = arr[0];
          store.listRefresh('list');
          transition.next();
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
