/**
* @file 新建阶段
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveTo()">保存</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1">
        <div class="mui-scroll">
          <div class="stage_detail_li" style="background: #f1f1f1;">
            <div class="add_ac">
              <ul>
                <li>
                  <input type="text" placeholder="任务名称(必填)" v-model="stageTask.taskName">
                </li>
                <li>
                  <textarea placeholder="备注(非必填)" v-model="stageTask.remark"></textarea>
                </li>
              </ul>
            </div>
            <div class="edit">
              <li>
                <label class="mui-icon success-rate">成功率</label>
                <input class="success-rate-v" type="text" placeholder="0" v-model="stageTask.successRatio">%
              </li>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../chance-store';
  export default{
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '新建阶段任务'
        },
        stage: store.state,
        stageTask: store.state.stageTask
      };
    },
    methods: {
      select: function () {
        var self = this;
        var selectId = self.stage.stageEdit.statusTextId + '';
        store.selectFn('statusText', selectId || '0', '任务状态', function () {
          self.$router.go('/selectPage/statusText_stage');
        });
      },
      saveTo: function () {
        store.saveStageTask({
          'stageId': parseInt(this.$route.params.id),
          'chanceId': parseInt(this.stage.detailData.id),
          'taskName': this.stageTask.taskName,
          'remark': this.stageTask.remark,
          'successRatio': this.stageTask.successRatio
        }, function () {
          mui.alert('新建阶段任务成功!', '提示', function () {
            setTimeout(function () {
              history.go(-1);
            }, 300);
          });
        });
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
