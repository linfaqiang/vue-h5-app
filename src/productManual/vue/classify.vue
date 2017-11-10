/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="classify mui-bar mui-bar-nav myc_search_header">
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
    </header>
    <div class="mui-content">
      <div class="mui-content mui-scroll-wrapper" :style="styleObject">
        <div class="mui-scroll">
          <ul id="classify" class="mui-table-view">
            <li class="mui-table-view-cell" v-for="list in listData.listData" @tap="classifyGo($index)">
              <a class="mui-navigate-right" v-text="list.name"></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../product-store';
  export default {
    components: {},
    data: function () {
      return {
        show: false,
        currentHeader: {
          title: '产品分类',
          name: '线索名称或简称',
          value: ''
        },
        listData: store.state
      };
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      classifyGo: function (index) {
        store.updateClassifyTitle(this.listData.listData[index].name);
        var typeId = this.listData.listData[index].id;
        this.$router.go('/classifyDetail/' + typeId);
      }
    },
    created: function () {
      store.classify();
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
