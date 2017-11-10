/**
* @file 阶段任务更新
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="stage_edit" @tap="saveStageList">保存</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1">
        <div class="mui-scroll">
          <div class="stage_detail_li content-list">
            <div class="list" v-for="list in stage.stageList">
              <div class="chance_stage_line_head"></div>
              <div @tap="check($index, list.stageId)" class="stage_name">{{list.stageName}}<span
                @tap.stop="addTask(list.stageId)" class="right addTask"><span class="addFh">+</span>任务</span></div>
              <div id="OA_task_2" class="detail" v-show="list.checked">
                <li v-for="detail in list.detail" @slideleft="slidelefts" style="padding-left: 0px"
                    class="mui-icon mui-table-view-cell" :class="{'crm-navigate-right-b': stage.detailData.isColsed==0}"
                    @click="edit(list.stageId, detail)">
                  <div class="mui-slider-right mui-disabled">
                    <a class="mui-btn mui-btn-red crm-stage-del-btn"
                       @click.stop="deleteStageTask(list.stageId,detail.stageTaskId,detail.status)">删除</a>
                  </div>
                  <div class="mui-slider-handle mui-table">
                    <a class="mui-navigate-right mui-table-cell">
                      <div class="icon-stage-left">
                        <div @click.stop="move_up_down(list.stageId, list.detail, detail.stageTaskId, $index, 'up')"
                             v-if="getMm(list.detail.length, $index,'up')" class="mui-icon move_up"></div>
                        <div @click.stop="move_up_down(list.stageId, list.detail, detail.stageTaskId, $index, 'down')"
                             v-if="getMm(list.detail.length,$index,'down')" class="mui-icon move_down"></div>
                      </div>
                      <p class="name1 mui-icon">{{detail.taskName}}</p>
                      <p class="task_create_time">{{detail.status ? detail.updatedOn : ''}}</p>
                      <!--<span class="status">{{detail.statusText}}</span>-->
                    </a>
                  </div>
                </li>
              </div>
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
        editContents: false,
        moveList: []
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
      edit: function (stageId, detail) {
        if (this.stage.detailData.isColsed === 1) {
          return;
        }
        store.stageEdit(stageId, detail);
        this.$router.go('/stageEditPage/' + stageId + '/edit');
      },
      addTask: function (id) {
        store.cleanStageTask();
        this.$router.go('/stageAdd/' + id);
      },
      move_up_down: function (num, list, id, index, type) {
        var listList = this.stage.stageList;
        if (type === 'down') {
          this.moveList[id] = {
            'sortIndex': list[index + 1].sortIndex,
            'id': id
          };
          this.moveList[list[index + 1].stageTaskId] = {
            'sortIndex': list[index].sortIndex,
            'id': list[index + 1].stageTaskId
          };
          for (var i = 0; i < listList.length; i++) {
            if (listList[i].stageId === num) {
              var newList = listList[i].detail;
              var newItem = list[index];
              var thisIndex = list[index].sortIndex;
              var nextIndex = list[index + 1].sortIndex;
              newList[index] = list[index + 1];
              newList[index].sortIndex = thisIndex;
              newList[index + 1] = newItem;
              newList[index + 1].sortIndex = nextIndex;
              listList[i].detail = [];
              listList[i].detail = newList;
            }
          }
        } else {
          this.moveList[id] = {
            'sortIndex': list[index - 1].sortIndex,
            'id': id
          };

          this.moveList[list[index - 1].stageTaskId] = {
            'sortIndex': list[index].sortIndex,
            'id': list[index - 1].stageTaskId
          };

          for (var j = 0; j < listList.length; j++) {
            if (listList[j].stageId === num) {
              var newList2 = listList[j].detail;
              var newItem2 = list[index];
              var thisIndex2 = list[index].sortIndex;
              var nextIndex2 = list[index - 1].sortIndex;
              newList2[index] = list[index - 1];
              newList2[index].sortIndex = thisIndex2;
              newList2[index - 1] = newItem2;
              newList2[index - 1].sortIndex = nextIndex2;
              listList[j].detail = [];
              listList[j].detail = newList2;
            }
          }
        }
      },
      getMm: function (length, index, type) {
        if (type === 'up') {
          if (length === 1) {
            return false;
          } else {
            if (index === 0) {
              return false;
            } else {
              return true;
            }
          }
        } else {
          if (length === 1) {
            return false;
          } else {
            if (index === length - 1) {
              return false;
            } else {
              return true;
            }
          }
        }
      },
      saveStageList: function () {
        var stageLists = [];
        for (var attr in this.moveList) {
          stageLists.push(this.moveList[attr]);
        }
        store.saveStageList(stageLists, function () {
          mui.alert('保存成功', '提示', function () {
            setTimeout(function () {
              history.go(-1);
            }, 300);
          });
        });
      },
      deleteStageTask: function (stageId, stageTaskId, status) {
        if (status) {
          mui.alert('进行中或者已完成的任务不能删除', '提示');
          mui.swipeoutClose(this.slideObj);
          return;
        }
        store.deleteStageTask(stageId, stageTaskId, function () {
          mui.alert('删除成功', '提示');
        });
      },
      slidelefts: function (e) {
        this.slideObj = e.target;
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
