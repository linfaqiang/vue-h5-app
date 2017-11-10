<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon-plusempty mui-icon mui-pull-right" v-if="team.isEdit" @tap="addTeam()"></a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" :style="liCss">
        <div class="mui-scroll">
          <div class="main_owner">主要责任人<span v-text="team.mainOwner.staffName"></span></div>
          <ul id="OA_task_2" class="mui-table-view" style="margin-top: 10px;" v-if="team.teamList.length>1">
            <li class="mui-table-view-cell chance_team" v-for="list in team.teamList" index="{{$index}}"
                v-if="team.mainOwner.id!=list.id">
              <div class="mui-slider-right mui-disabled">
                <a class="mui-btn mui-btn-red">编辑</a>
              </div>
              <div class="mui-slider-handle mui-table">
                <div class="mui-table-cell">
                  <img :src="list.headPhotoUrl||'../public/images/default_contact.png'"
                       onerror="this.src='../public/images/default_contact.png'">
                  <p v-text="list.staffName"></p>
                  <span class="mui-icon mui-icon-mobile" @tap="call(list.mobile)"></span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="back_drop" @tap="cancel()" :style="team.editJson.backCss" v-if="team.editJson.showOperation"></div>
    <div class="edit_team" :style="team.editJson.operaCss" v-show="!team.editJson.hideDe">
      <a v-if="team.isEdit" class="mui-icon mui-icon-name" @tap="setMain()">设为主要责任人</a>
      <a v-if="team.isEdit" class="mui-icon mui-icon-dustbin" @tap="deleteTeam()">删除成员</a>
      <a v-if="!team.isEdit" class="mui-icon mui-icon-chance" @tap="cancel()">商机已关闭，不能编辑！</a>
    </div>
  </div>
</template>
<script>
  import store from './team-store';
  var nativeApi = require('nativeApi');
  export default {
    data: function () {
      return {
        currentHeader: {
          title: '销售团队'
        },
        team: store.state,
        liCss: {
          top: '44px'
        }
      };
    },
    methods: {
      back: function (index) {
        history.go(-1);
      },
      addTeam: function () {
        /* 选人员 */
        this.$router.go('/personPage');
      },
      cancel: function () {
        var self = this;
        self.team.editJson.backCss.opacity = 0;
        self.team.editJson.showOperation = false;
        self.team.editJson.operaCss = {
          bottom: '-196px',
          opacity: 1
        };
      },
      setMain: function () {
        store.setMain();
        this.cancel();
      },
      call: function (phone) {
        nativeApi.openPhone({
          'apiJson': {
            'phoneNum': phone
          }
        });
      },
      deleteTeam: function () {
        store.deleteTeam();
        this.cancel();
      }
    },
    created: function () {
    },
    route: {
      data: function () {
        var isEdit = !(this.$route.params.isEdit === 'false');
        store.setEdit(isEdit);
        var id = this.$route.params.id;
        var type = this.$route.params.type ? this.$route.params.type : '';
        store.team(id, type);
      }
    },
    ready: function () {
      mui.init();
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
