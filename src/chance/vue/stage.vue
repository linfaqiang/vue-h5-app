/**
* @file 商机阶段
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a v-if="stage.detailData.isColsed !=1" v-show="editShow" class="stage_edit" @tap="toEditStage()">编辑</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1">
        <div class="mui-scroll">
          <div class="stage_detail_li">
            <div class="list" v-for="list in stage.stageList">
              <div class="chance_stage_line_head"></div>
              <div @tap="check($index, list.stageId)" class="stage_name">{{list.stageName}}<span class="right">{{list.finishedCount}}/{{list.taskCount}}</span>
              </div>
              <div id="OA_task_2" class="detail" v-show="list.checked">
                <li v-for="detail in list.detail" class="mui-icon mui-table-view-cell"
                    :class="{'crm-navigate-right-b': stage.detailData.isColsed==0}"
                    @slideleft="slideleftEvent($event,detail,list.stageId)"
                    @click="edit(detail.stageTaskId, detail, list.stageId)">
                  <div class="mui-slider-right mui-disabled">
                    <a class="mui-btn mui-btn-red mui-icon mui-icon-compose crm-stage-edit-btn">编辑</a>
                  </div>
                  <div class="mui-slider-handle mui-table">
                    <a class="mui-navigate-right mui-table-cell">
                      <p class="name mui-icon">{{detail.taskName}}</p>
                      <p class="task_create_time">{{detail.status ? detail.updatedOn : ''}}</p>
                      <span class="status">{{detail.statusText}}</span>
                    </a>
                  </div>
                </li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="pop-out" class="pop-out" :style="mengbObject" @tap="closeSelf()"></div>
    <div id="pop-up" class="pop-up" :style="popObject">
      <div>
        <span class="mui-icon crm-icon-ongoing"></span>
        <p @tap="ongoing(1)">设为进行中</p>
      </div>
      <div>
        <span class="mui-icon crm-icon-finish"></span>
        <p @tap="ongoing(2)">设为已完成</p>
      </div>
      <div>
        <span class="mui-icon crm-icon-finish crm-icon-addSaleTask"></span>
        <p @tap="addSaleTask()">添加到销售任务</p>
      </div>
      <div>
        <span class="mui-icon crm-icon-finish crm-icon-addAchedule"></span>
        <p @tap="addSchedule()">添加到日程</p>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../chance-store';
  var nativeApi = require('nativeApi');
  export default {
    data: function () {
      return {
        currentHeader: {
          title: '销售阶段'
        },
        stage: store.state,
        stageScroll: null,
        editShow: true,
        cutArr: [
          {
            'itemCode': '0',
            'itemName': '我收到的',
            'selected': false,
            'field': 'type',
            'fn': 'getDateList'
          },
          {
            'itemCode': '',
            'itemName': '所有',
            'selected': false,
            'field': 'status',
            'fn': 'getActivityTypeList'
          },
          {
            'itemCode': '',
            'itemName': '紧急程度',
            'selected': false,
            'field': 'priorityLevel',
            'fn': 'getCritica'
          }
        ],
        selectShow: false,
        selectObject: {
          'height': (document.body.offsetHeight - 84) + 'px'
        },
        popObject: {
          top: document.body.offsetHeight + 'px',
          background: '#fff',
          height: '205px'
        },
        mengbObject: {
          top: document.body.offsetHeight + 'px',
          // background: '#f1f1f1',
          height: document.body.offsetHeight + 'px'
        },
        currentData: {}

      };
    },
    route: {
      activate: function (transition) {
        /* this.getUserMsg();*/
        transition.next();
      }
    },
    methods: {
      back: function () {
        var id = this.stage.detailData.id;
        store.getDetail(id);
        setTimeout(function () {
          history.go(-1);
        });
      },
      check: function (index, stageId) {
        var self = this;
        store.stageTask(stageId, function () {
          if (self.stage.stageList[index].checked) {
            self.stage.stageList[index].checked = false;
          } else {
            self.stage.stageList[index].checked = true;
          }
        });
      },
      edit: function (stageTaskId, detail, stageId) {
        if (parseInt(this.stage.detailData.isColsed || '0') === 1) {
          return;
        }
        store.stageEdit(stageTaskId, detail);
        this.$router.go('/stageEditPage/' + stageId);
      },
      editStageTask: function () {
        this.$router.go('/editStageTaskPage');
      },
      closeSelf: function () {
        document.getElementById('pop-out').style.top = document.body.offsetHeight + 'px';
        document.getElementById('pop-up').style.top = document.body.offsetHeight + 'px';
      },
      taskResultIng: function () {
        var id = this.dataList.conList[this.index].id;
        store.taskResultIng(id);
        document.getElementById('pop-out').style.top = document.body.offsetHeight + 'px';
        document.getElementById('pop-up').style.top = document.body.offsetHeight + 'px';
      },
      taskResultEnd: function () {
        var id = this.dataList.conList[this.index].id;
        store.taskResultEnd(id);
        document.getElementById('pop-out').style.top = document.body.offsetHeight + 'px';
        document.getElementById('pop-up').style.top = document.body.offsetHeight + 'px';
      },
      toDelete: function () {
        var id = this.dataList.conList[this.index].id;
        store.toDelete(id, function () {
          store.init();
        });
        document.getElementById('pop-out').style.top = document.body.offsetHeight + 'px';
        document.getElementById('pop-up').style.top = document.body.offsetHeight + 'px';
      },
      toEditStage: function () {
        this.$router.go('/stageEditPage2');
      },
      ongoing: function (status) {
        var self = this;
        var obj = {
          'id': this.currentData.id,
          'stageId': this.currentData.stageId,
          'chanceId': this.currentData.chanceId,
          'stageTaskId': this.currentData.stageTaskId,
          'status': status
        };
        store.changeStatus(obj, function () {
          mui.alert('修改成功', '提示', function () {
            setTimeout(function () {
              self.closeSelf();
            }, 300);
          });
        });
      },
      slideleftEvent: function (e, obj, stageId) {
        document.getElementById('pop-out').style.top = 0;
        document.getElementById('pop-up').style.top = (document.body.offsetHeight - 205) + 'px';
        mui.swipeoutClose(e.target);
        this.currentData = {
          id: obj.id,
          taskName: obj.taskName,
          stageId: stageId,
          chanceId: this.stage.detailData.id,
          stageTaskId: obj.stageTaskId
        };
      },
      addSaleTask: function () {
        var self = this;
        localStorage.setItem('chance_taskManage_add', JSON.stringify({
          'customerId': self.stage.detailData.customerId || '',
          'customerName': self.stage.detailData.customerName || '',
          'chanceId': self.stage.detailData.id || '',
          'chanceName': self.stage.detailData.chanceName || '',
          'taskName': self.currentData.taskName || ''
        }));
        nativeApi.goView({
          'apiJson': {
            'urlPort': 'taskManage/index.html#!/addPage/chance_taskManage_add',
            'function': 'taskManage'
          }
        });
      },
      addSchedule: function () {
        var self = this;
        localStorage.setItem('chance_schedule_addSch', JSON.stringify({
          'customerId': self.stage.detailData.customerId || '',
          'customerName': self.stage.detailData.customerName || '',
          'chanceId': self.stage.detailData.id || '',
          'chanceName': self.stage.detailData.chanceName || '',
          'taskName': self.currentData.taskName || ''
        }));
        nativeApi.goView({
          'apiJson': {
            'urlPort': 'schedule/index.html#!/scheduleAdd/chance_schedule_addSch',
            'function': 'schedule'
          }
        });
      }
    },
    created: function () {
    },
    ready: function () {
      var self = this;
      self.stageScroll = mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
