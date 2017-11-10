<style>
  @import 'public/css/mui.css';
  @import 'public/css/app.css';
</style>
<script>
  import nativeApi from 'nativeApi';
  require('mui');
  window.loginInfo = {};
  nativeApi.getLoginInfo({
    callback: function (result) {
      window.loginInfo = result;
    }
  });
  export default {};
</script>
