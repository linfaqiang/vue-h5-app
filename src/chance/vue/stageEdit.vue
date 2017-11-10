/**
* @file 编辑阶段
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="backTo()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveTo()">保存</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1">
        <div class="mui-scroll">
          <div class="stage_detail_li" style="background: #f1f1f1;" v-if="editStatus">
            <div class="title" style="background: #fff">
              <p class="name">{{stage.detailData.chanceName}}</p>
              <p class="cus">{{stage.detailData.customerName}}</p>
            </div>
            <div class="edit">
              <li>
                <label>任务名称</label>
                <div>{{stage.stageEdit.taskName}}</div>
              </li>
              <li class="mui-icon crm-navigate-right" @tap="select()">
                <label>状态</label>
                <div>{{stage.stageEdit.statusText}}</div>
              </li>
              <li>
                <label>成功率</label>
                <div>{{stage.stageEdit.successRatio}}</div>
              </li>
            </div>
          </div>
          <div class="stage_detail_li" style="background: #f1f1f1;" v-if="editContents">
            <div class="add_ac">
              <ul>
                <li>
                  <input type="text" placeholder="任务名称(必填)" v-model="stage.stageEdit.taskName">
                </li>
                <li>
                  <textarea placeholder="备注(非必填)" v-model="stage.stageEdit.remark"></textarea>
                </li>
              </ul>
            </div>
            <div class="edit">
              <li>
                <label class="mui-icon success-rate">成功率</label>
                <input class="success-rate-v" type="text" placeholder="0" v-model="stage.stageEdit.successRatio">%
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
  export default {
    data: function () {
      return {
        currentHeader: {
          title: '阶段任务更新'
        },
        stage: store.state,
        editStatus: false,
        editContents: false
      };
    },
    route: {
      activate: function (transition) {
        if (this.$route.params.type) {
          this.editContents = true;
          this.editStatus = false;
        } else {
          this.editStatus = true;
          this.editContents = false;
        }
        transition.next();
      }
    },
    methods: {
      backTo: function () {
        history.go(-1);
      },
      select: function () {
        var self = this;
        var selectId = self.stage.stageEdit.statusTextId + '';
        store.selectFn('statusText', selectId || '0', '任务状态', function () {
          self.$router.go('/selectPage/statusText_stage');
        });
      },
      saveTo: function () {
        if (this.$route.params.type) {
          store.saveStageTask({
            'stageId': parseInt(this.$route.params.id),
            'edit': 1,
            'id': parseInt(this.stage.stageEdit.stageTaskId),
            'taskName': this.stage.stageEdit.taskName,
            'remark': this.stage.stageEdit.remark,
            'successRatio': parseInt(this.stage.stageEdit.successRatio)
          }, function () {
            mui.alert('阶段任务更新成功', '提示', function () {
              setTimeout(function () {
                history.go(-1);
              }, 300);
            });
          });
        } else {
          var obj = {
            'id': this.stage.stageEdit.id,
            'stageId': this.$route.params.id,
            'chanceId': this.stage.detailData.id,
            'stageTaskId': this.stage.stageEdit.stageTaskId,
            'status': parseInt(this.stage.stageEdit.statusTextId)
          };
          store.changeStatus(obj, function () {
            mui.alert('阶段任务状态更新成功', '提示', function () {
              setTimeout(function () {
                history.go(-1);
              }, 300);
            });
          });
        }
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
