<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon-plusempty mui-icon mui-pull-right" @tap="addTeam()"></a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;">
        <div class="mui-scroll">
          <ul id="OA_task_2" class="mui-table-view">
            <li class="mui-table-view-cell chance_team" v-for="list in team.teamAddList" @tap="teamAdd($index)">
              <div class="mui-slider-handle mui-table">
                <div class="mui-table-cell">
                  <img :src="list.headPhotoUrl">
                  <p v-text="list.staffName"></p>
                  <span class="mui-icon crm-navigate-right"></span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from './team-store';
  export default{
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '添加团队成员'
        },
        team: store.state
      };
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      teamAdd: function (index) {
        store.teamAdd(index);
        this.back();
      }
    },
    created: function () {
      store.teamList();
    },
    ready: function () {
      mui.init();
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
