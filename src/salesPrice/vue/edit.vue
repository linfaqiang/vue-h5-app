/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <!--<a class="mui-btn mui-btn-link mui-pull-right icon-text" @tap="saveEdit()">保存</a>-->
      <a class="mui-btn mui-btn-link mui-pull-right icon-text" href="#newNotes">保存</a>
    </header>
    <div class="the_add" style="margin-top: 44px">
      <ul class="mui-table-view liafter">
        <crm-list-single :list="list" v-for=" list in editData.editPrice.data"></crm-list-single>
      </ul>
    </div>
    <ul style="padding:0px; background:#fff;border-bottom: 1px solid #cbcbcb">
      <li class="mui-table-view-cell crm-listIcon">
        <a class="" @tap="goToAddProdcut()">
          <span class="mui-icon mui-icon-addbjh redColor"> </span>
          <div class="addpriceline">添加产品行报价</div>
        </a>
      </li>
    </ul>
    <div style="position: relative;height: 400px;margin-top: -17px">
      <div class="mui-scroll-wrapper" style="top: 0px;background: #f1f1f1;padding-bottom: 200px">
        <div class="mui-scroll">
          <product-list-components :lists.sync="editData.editProductList"></product-list-components>
        </div>
      </div>
    </div>
    <div id="newNotes" class="mui-popover mui-popover-action mui-popover-bottom" style="z-index: 999">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <a href="#newNotes" @tap="saveEdit(0)">保存</a>
          <!--<a href="#newNotes" @tap="saveAdd(0)">保存</a>-->
        </li>
        <li class="mui-table-view-cell">
          <a href="#newNotes" @tap="saveEdit(1)">保存并提交</a>
        </li>
      </ul>
      <ul class="mui-table-view">
        <li class="mui-table-view-cell mui-cancel">
          <a href="#newNotes"><b>取消</b></a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import store from '../price-store';
  import crmListSingle from '../../public/components/listsingle/crm-listsingle.vue';
  import productList from '../../public/components/product/list.vue';
  export default {
    components: {
      'crm-list-single': crmListSingle,
      'product-list-components': productList
    },
    data: function () {
      return {
        currentHeader: {
          title: '编辑报价'
        },
        editData: store.state,
        switch: false
      };
    },
    events: {
      formBack: function (param) {
        store.selectFn(param.field, param.valueCode, param.name);
        this.$router.go('/selectPage/' + param.field + '_edit');
      },
      deleteSaveProduct: function (id) {
        // 删除产品  不做数据库物理删除
        var self = this;
        var proList = self.editData.editProductList;
        var selectIds = store.state.selectProductId;
        var index = selectIds.indexOf(id);
        selectIds.splice(index, 1);
        store.state.selectProductId = selectIds;
        var tempSelect = [];
        for (var i = 0; i < proList.length; i++) {
          if (proList[i].id !== id) {
            tempSelect.push(proList[i]);
          }
        }
        console.log(JSON.stringify(proList));
        self.editData.selectProducts = tempSelect;
        self.editData.editProductList = tempSelect; // 编辑页面使用的数据源
      }
    },
    methods: {
      back: function (index) {
        history.go(-1);
      },
      switchFn: function () {
        if (this.switch) {
          this.switch = false;
        } else {
          this.switch = true;
        }
      },
      saveEdit: function (status) {
        var self = this;
        store.editPrice(status, function (msg) {
          mui.alert('报价编辑成功', '提示', function () {
            status = parseInt(status || 0);
            if (status === 1) {
              store.state.statusActive.s = false;
            }
            store.getCustomerDedail(self.editData.priceDetail.data.id, function () {
              if (!window.initParam) {
                store.listRefresh('list');
              } else {
                window.isEdit = true;
              }
            });
            history.go(-1);
          });
        });
      },
      goToAddProdcut: function () {
        store.state.selectProductId = [];
        var editArr = store.state.editProductList;
        if (editArr.length > 0) {
          for (var i = 0; i < editArr.length; i++) {
            store.state.selectProductId.push(editArr[i].id);
          }
        } else {
          store.state.selectProductId = [];
        }
        this.$router.go('/addProduct/product_edit');
      }
    },
    route: {
      activate: function () {
        store.getPriceEdit();
      }
    },
    created: function () {

    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
