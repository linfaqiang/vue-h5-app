/**
* @file 联系人详情
* @author hj
* @date 2016-11-17
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon-compose mui-icon mui-pull-right" @tap="edit(detailData.conDetail.id)"></a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="con_detail">
            <div class="head">
              <img :src="detailData.conDetail.headPhotoUrl||'../public/images/default_contact.png'" data-preview-src=""
                   data-preview-group="1">
              <a href="#editHead" class="mui-icon mui-icon-edit-head"></a>
              <div>
                <p class="name">{{detailData.conDetail.name}}</p>
                <p>{{detailData.conDetail.mobile}}<span @tap="call(detailData.conDetail.mobile)"
                                                        class="mui-icon mui-icon-mobile"><span></span></span><span
                  @tap="msm(detailData.conDetail.mobile)" class="mui-icon mui-icon-msm"></span></p>
                <p>{{detailData.conDetail.department}}<span
                  v-if="detailData.conDetail.department && detailData.conDetail.title">-</span></span><span
                  v-show="detailData.conDetail.title">{{detailData.conDetail.title}}</span></p>
                <p>{{detailData.conDetail.customer||detailData.conDetail.clue||detailData.conDetail.competitor}}</p>
                <div class="button_phone">
                  <a class="call"></a>
                  <a class="msm"></a>
                </div>
              </div>
            </div>
            <div class="content">
              <ul>
                <li>
                  <label>座机</label>
                  <div>{{detailData.conDetail.telephone}}<span v-show="detailData.conDetail.telephone"
                                                               @tap="call(detailData.conDetail.telephone)"
                                                               class="mui-icon mui-icon-phone color_red"></span></div>
                </li>
                <!--<li>
                    <label>公司地址</label>
                    <div>{{detailData.conDetail.address}}</div>
                </li>-->
                <li>
                  <label>生日</label>
                  <div>{{detailData.conDetail.birthday}}</div>
                </li>
                <li>
                  <label>QQ</label>
                  <div>{{detailData.conDetail.qq}}</div>
                </li>
                <li>
                  <label>微信</label>
                  <div>{{detailData.conDetail.wechat}}</div>
                </li>
                <li>
                  <label>邮箱</label>
                  <div>{{detailData.conDetail.email}}<span v-show="detailData.conDetail.email"
                                                           @tap="email(detailData.conDetail.email)"
                                                           class="mui-icon mui-icon-mail color_red"></span></div>
                </li>
              </ul>
              <a class="go_notes" @tap="toNotes(detailData.conDetail.id)">备注</a>
            </div>
          </div>
        </div>
      </div>
      <footer v-if="detailData.conDetail.isChance" class="rest_bn_delete" @tap="removeContactByChance()"><span
        class="mui-icon mui-icon-remove"></span>移出该商机
      </footer>
      <div id="editHead" class="mui-popover mui-popover-action mui-popover-bottom">
        <ul class="mui-table-view">
          <li class="mui-table-view-cell">
            <a href="#editHead" @tap="photo('goPhoto')">拍照</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="#editHead" @tap="photo('fromImgLibrary')">本地相册</a>
          </li>
        </ul>
        <ul class="mui-table-view">
          <li class="mui-table-view-cell mui-cancel">
            <a href="#editHead"><b>取消</b></a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../public/css/mui.image.css';
</style>
<script>
  import store from '../contact-store';
  var nativeApi = require('nativeApi');
  require('mui.previewimage');
  require('mui.zoom');
  export default {
    data: function () {
      return {
        currentHeader: {
          title: '联系人详情',
          btns: [{
            pos: 'left',
            icon: 'mui-icon-left-nav',
            text: '',
            show: true
          }]
        },
        detailData: store.state
      };
    },
    methods: {
      back: function (index) {
        if (window.initPage) {
          if (window.isEdit) {
            nativeApi.goNative({
              'apiJson': {
                'fn': 'contact',
                'callFun': 'refreshContact',
                'param': ''
              }
            });
          } else {
            nativeApi.goNative({
              'apiJson': {
                'fn': 'contact'
              }
            });
          }
        } else {
          history.go(-1);
        }
      },
      toNotes: function (id) {
        this.$router.go('/notes/contact_' + id);
      },
      email: function (mail) {
        if (!mail) {
          return;
        }
        nativeApi.openEmail({
          'apiJson': {
            'recemail': mail,
            'emailtitle': '',
            'emailcontent': '',
            'isHtml': '',
            'attachmentName': '',
            'attachmentBase64': ''
          }
        });
      },
      call: function (val) {
        nativeApi.openPhone({
          'apiJson': {
            'phoneNum': val
          }
        });
      },
      msm: function (val) {
        nativeApi.opneMsg({
          'apiJson': {
            'to': val,
            'message': ''
          }
        });
      },
      edit: function () {
        var self = this;
        store.toEdit(function () {
          self.$router.go('/editPage/' + self.detailData.conDetail.id);
        });
      },
      photo: function (fn) {
        nativeApi[fn]({
          'apiJson': {
            'uploadUrl': store.APIS.upload_file,
            'backType': '2',
            'wDivisor': '1024',
            'hDivisor': '780'
          },
          callback: function (result) {
            store.saveHeadPhoto(result);
          }
        });
      },
      removeContactByChance: function () {
        var btnArray = ['否', '是'];
        mui.confirm('是否将联系人移出该商机？', '提示', btnArray, function (e) {
          if (e.index === 1) {
            store.removeContact(function () {
              nativeApi.goNative({
                'apiJson': {
                  'fn': 'contact',
                  'callFun': 'refreshChance',
                  'param': ''
                }
              });
            });
          }
        });
      }
    },
    created: function () {
      var localKey = this.$route.params.localKey;
      if (localKey) {
        window.initPage = 'toDetail';
        window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
        localStorage.removeItem(localKey);
      }
      if (window.initParam) {
        if (window.initParam.type && window.initParam.type !== 'customer' && window.initParam.type !== 'chance') {
          store.showDetail(window.initParam);
        } else {
          store.detail(window.initParam.id);
        }
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      mui.previewImage();
    }
  };
</script>
