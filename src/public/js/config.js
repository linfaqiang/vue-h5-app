/**
 * @file app全局通用配置文件
 * @author huangjun
 * @desc  如果无特殊情况,不得另起配置文件
 */
var serviceList = [
    'http://192.168.1.105:8180/api/', // 开发环境地址
    'http://192.168.8.20:9081/api/', // 新测试环境地址
    'http://192.168.14.2:8081/api/', /*龚京静*/
    'http://192.168.14.58:8080/api/', /*姚概  3 */
    'http://192.168.14.120:8080/api/', /*周宝 4*/
    'http://192.168.13.57:8081/api/', /*黄朝圣 5 */
    'http://test.coracle.com:8386/api/', /*20环境外网地址6*/
    'http://192.168.8.27:8081/api/', /*UAT环境内网网地址7*/
    'http://app.kingnode.com:10111/api/', /*UAT环境外网地址8*/
    'http://mi.coracle.com:10001/api/', /*生产环境环境外网地址 9*/
    'http://192.16.8.127:8081/api/', /*临时 10*/
];
var serviceAdminList = [
  'http://192.168.1.105:8180/admin/', // 开发环境地址
];
var service = serviceList[0];
var serviceAdmin = serviceAdminList[0];
var APIS = {};
APIS.is_weixin = true;
/**
 * 后台地址
 * @type {string}
 */
APIS.admin = serviceAdmin;
APIS.api = service;

/**
 * 获取模块列表
 * @type {string}
 */
APIS.device_register = serviceAdmin + 'api/v1/device/register';

/**
 * 获取当前用户的常用功能
 * @type {string}
 */
APIS.my_general_functions = service + "v1/profiles/my_general_functions";

/**
 * 登录接口
 * @type {string}
 */

APIS.admin_login = serviceAdmin + "api/login";
APIS.api_login = service + "v1/login";

/**
 * 退出接口
 * @type {string}
 */
APIS.logout = service + "v1/logout";

/**
 * 是否是leader
 * @type {string}
 */
APIS.is_leader = service + "v1/staffs/get-is-leader";

/**
 * 数据字典
 */
APIS.data_wordbook = service + "v1/dicts/";

/**
 * 消息列表
 * @type {string}
 */
APIS.message_list = service + "v1/messages";

/**
 * 首页右上角消息数量显示
 * @type {string}
 */
APIS.message_noread_count = service + 'v1/messages/noread/count';

/**
 * 首页侧滑中的未处理数据
 * @type {string}
 */
APIS.message_unread = service + 'v1/messages/unread';

/**
 * 公告详情
 * @type {string}
 */
APIS.message_notice_detail = service + "v1/messages/findNoticeInfo";

/**
 * 所有员工
 * @type {string}
 */
APIS.person_list = service + "v1/staffs";

/**
 * 备注列表
 * @type {string}
 */
APIS.notes_list = service + "v1/remarks/{type}/{id}";

/**
 * 备注 新建、编辑
 * @type {string}
 */
APIS.notes_add = service + "v1/remarks";

/**
 * 附件上传
 */
APIS.upload_file = service + "v1/upload";

/**
 * 权限下的部门与员工
 * @type {string}
 */
APIS.leader_dept_emp = service + "v1/staffs/get-all-dept-staff";

/**
 * 权限下的部门
 * @type {string}
 */
APIS.dept_list = service + "v1/staffs/subordinates_dept";

/**
 * 部门下员工
 * @type {string}
 */
APIS.dept_emp_list = service + "v1/departments/{id}/staffs";

/**
 * 权限下所有员工
 * @type {string}
 */
APIS.staff_sub_list = service + "v1/staffs/subs";

/**
 * 获取当前用户所属部门的所有领导
 * @type {string}
 */
APIS.get_lead = service + "v1/staffs/get-all-leader";

/**
 * 客户、线索、竞争对手联系人详情
 * @type {string}
 */
APIS.contact_detail = service + "v1/linkMan";

/**
 * @name  测试列表带图标和不带图标的
 * @api   /api/v2/employee/login
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.test = service + 'crm-listsingle/crm-listJson.json';

/**
 * @name  测试收缩展开列表
 * @api   /api/v2/employee/login
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.test = service + 'crm-detail/crm-detail.json';
/**
 * @name  测试时间轴
 * @api   /api/v2/employee/login
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.timeList = service + 'crm-timeList/crm-timeList.json';
/**
 * @name  测试市场活动
 * @api   /api/v2/employee/login
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.market = service + 'crm-market/crm-activity.json';
/**
 * @name  测试市场活动详情
 * @api   /api/v2/employee/login
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.choose = service + 'crm-market/choose.json';
/**
 * @name  测试市场管理
 * @api   /api/v2/employee/login
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.manage = service + 'crm-marketManage/crm-manage.json';
/**
 * @name  测试市场管理详情
 * @api   /api/v2/employee/login
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.details = service + 'crm-marketManage/details.json';
/**
 * @name  测试市场管理详情
 * @api   /api/v2/employee/login
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.analysis = service + 'crm-marketAnalysis/crm-analysis.json';

/**
 * @name  测试市场活动
 * @api   /api/v2/employee/login
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.newtast = service + 'crm-newTast/crm-newTast.json';


/**
 * @name  tab选项卡
 * @api   /api/v2/employee/login
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.tab = service + 'crm-tab/crm-tabStore.json';
/**
 * @name  新建
 * @api   /api/v2/employee/login
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.newPage = service + 'crm-new/crm-newStore.json';

/**
 * @name  新建客户   欢欢
 * @api
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.newCustomer = service + 'crm-tab/crm-tabStore.json';
/**
 * @name 客户销售团队
 */
APIS.customer_team = service + 'v1/customers/{id}/sale_teams';

/**
 * 客户销售团队 新建
 * @type {string}
 */
APIS.customer_team_add = service + "v1/customer_sale_teams";

/**
 * 客户销售团队 新建 删除
 * @type {string}
 */
APIS.customer_team_delete = service + "v1/customer_sale_teams/{id}";

/**
 * 客户销售团队 新建 设置祝联系人
 * @type {string}
 */
APIS.customer_team_main = service + "v1/customer_sale_teams/{id}";

/**
 * 客户地图搜索
 * @type {string}
 */
APIS.customer_map = service + "v1/customers/map";

/**
 * @name  我的客户   欢欢
 * @api
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.customer = service + 'v1/customers/search';

/**
 * @name  客户等级   欢欢
 * @api
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.customerSource = service + 'customer/customer-source.json';

/**
 * @name  客户详情   欢欢
 * @api
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.customerDetail = service + 'v1/customers/';

/**
 * 位置纠偏
 * @type {string}
 */
APIS.customer_update_address = service + "v1/address";

/**
 * 客户联系人接口 get
 * @type {string}
 */
APIS.customer_contact = service + "v1/customers/{id}/linkman";

/**
 * 客户 跟进记录
 * @type {string}
 */
APIS.customer_follow = service + "v1/customers/{id}/tracks";

/**
 * @name  线索   lism
 */
//APIS.clueDetail = service + 'cluesDistribution/clue-detail.json';
APIS.clue = service + 'v1/clues';

/**
 * @name  线索分配部门 or 员工list   lism
 */
APIS.detpOrStaffList = service + 'v1/staffs/';

/**
 * @name  获取部门员工    lism
 */
APIS.detpStaffs = service + 'v1/departments/';

/**
 * @name  线索管理列表   lism
 */
APIS.myClue = service + 'v1/clues/staff';

/**
 * @name  新增线索跟进记录   lism
 */
APIS.clueTracks = service + 'v1/clue_tracks';

/**
 * @name  客户分配列表   欢欢
 * @api
 * @param {String} userName
 * @param {String} password
 * @example {userName:'huangjun',password:'111111'}
 * @method POST
 * @Content-Type application/json
 */
APIS.distribution = service + 'v1/customers/leader';

/**
 * 线索联系人 新建、编辑
 * @type {string}
 */
APIS.clue_contact_save = service + "v1/clue_linkmen";

/**
 * 线索联系人 新建、编辑
 * @type {string}
 */
APIS.clue_contact_head_save = service + "v1/clue_linkmen/{id}/headPhoto";

/**
 * 商机  hj
 * @type {string}
 */
APIS.chance_list = service + 'v1/chances/search';

/**
 * 商机 详情 hj
 * @type {string}
 */
APIS.chance_detail = service + 'v1/chances/';

/**
 * 商机 新建、编辑 hj
 * @type {string}
 */
APIS.chance_add = service + 'v1/chances';

/**
 * 商机 跟进记录 hj
 * @type {string}
 */
APIS.chance_follow = service + "v1/chances/{id}/tracks";

/**
 * 商机 任务列表
 * @type {string}
 */
APIS.chance_task = service + "v1/chances/{id}/chance_sale_tasks";

/**
 * 商机 销售产品 hj
 * @type {string}
 */
APIS.chance_product = service + "v1/chances/{id}/products";

/**
 * 商机 新增、编辑、删除销售产品 hj
 * @type {string}
 */
APIS.chance_product_save = service + "v1/chance_products";

/**
 * 商机 销售产品 对手(get)、新增对手(post) hj
 * @type {string}
 */
APIS.chance_product_rival = service + "v1/chance_products/{id}/competitors";

/**
 * 商机 销售报价 hj
 * @type {string}
 */
APIS.chance_salesPrice = service + "v1/chances/{id}/quotations";

/**
 * 商机 联系人列表、添加商机联系人 hj
 * @type {string}
 */
APIS.chance_contact = service + "v1/chances/{id}/linkmans";

/**
 * 商机联系人 删除
 * @type {string}
 */
APIS.chance_contact_delete = service + "v1/chance_linkman/{id}";

/**
 * 商机 阶段列表 任务个数
 * @type {string}
 */
APIS.chance_stage = service + "v1/chances/{id}/stage_task_count";

/**
 * 商机 阶段任务
 * @type {string}
 */
APIS.chance_stage_task = service + "v1/chances/{id}/stage_task_results";

/**
 * 商机 修改阶段任务状态
 * @type {string}
 */
APIS.chance_update_stage_task_status = service + "v1/stage_task_results/{id}";

/**
 * 商机 新增阶段任务
 * @type {string}
 */
APIS.chance_update_stage_task = service + "v1/chances/stage_task";

/**
 * 商机 销售团队 hj
 * @type {string}
 */
APIS.chance_team = service + "v1/chances/{id}/sale_teams";

/**
 * 商机 销售团队 新增 hj
 * @type {string}
 */
APIS.chance_team_add_save = service + "v1/chance_sale_teams";

/**
 * 商机 销售团队 设置主责任人 hj
 * @type {string}
 */
APIS.chance_team_main = service + "v1/chance_sale_teams/{id}";

/**
 * 商机 销售团队 删除成员 hj
 * @type {string}
 */
APIS.chance_team_delete = service + "v1/chance_sale_teams/{id}";

/**
 * 商机 销售竞争对手 hj
 * @type {string}
 */
APIS.chance_rival = service + "v1/chances/{id}/competitors";

/**
 * 商机 新增竞争对手 hj
 * @type {string}
 */
APIS.chance_rival_save = service + "v1/chances/{id}/competitors";

/**
 * 商机 竞争对手 更新优劣势、删除(delete) hj
 * @type {string}
 */
APIS.chance_rival_good_bad = service + "v1/chance_competitors/{id}";

/**
 * 商机 删除(delete)产品机会 hj
 * @type {string}
 */
APIS.chance_delete_product_rival = service + "v1/chance_competitors/product/{id}";

/**
 * 联系人列表、新建、编辑 hj
 * @type {string}
 */
APIS.contact_list = service + "v1/customer_linkmen";

/**
 * 联系人 修改头像 hj
 * @type {string}
 */
APIS.contact_update_head = service + "v1/customer_linkmen/headPhoto";

/**
 * 销售报价  lism
 * @type {string}
 */
APIS.price_list = service + 'salesPrice/json/list.json';
/**
 * 任务管理  zhaomf
 * @type {string}
 */
APIS.tast_list = service + 'taskManage/json/list.json';

/**
 * 销售活动列表
 */
APIS.activity_list = service + "v1/sale_activities/list";

/**
 * 销售活动详情
 */
APIS.activity_detail = service + "v1/sale_activities/";

/**
 * 新建、编辑活动
 */
APIS.activity_add = service + "v1/sale_activities";

/**
 * 线索池列表  lism
 *
 */
APIS.clue_pool_lists = service + 'v1/clues/pool';

/**
 * 线索池详情 抢单  lism
 *
 */
//APIS.clue_pool_lists = service + 'v1/clues/';

/**
 * 线索新增  lism
 *
 */
//APIS.clue_add = service + 'v1/clues/';
/**
 * 市场活动列表接口  zmf
 * @type {string}
 */
APIS.market_list = service + 'v1/marketing_activities';
/**
 * 市场详情接口  zmf
 * @type {string}
 */
APIS.market_detail = service + 'v1/marketing_activities';
/**
 * 市场分析列表接口  zmf
 * @type {string}
 */
APIS.analysis_list = service + 'v1/marketing_analysis';
/**
 * 市场分析浏览次数接口  zmf
 * @type {string}
 */
APIS.analysis_add = service + 'v1/marketing_analysis/add-readcount';
/**
 * 市场信息列表接口  zmf
 * @type {string}
 */
APIS.manage_list = service + 'v1/marketing_infos';

/**
 * 产品手册列表接口  zmf
 * @type {string}

 */
APIS.product_list = service + 'v1/products';
/**
 * 产品手册关注列表接口  zmf
 * @type {string}

 */
APIS.product_follows = service + 'v1/product_follows';

/**
 * 任务管理列表接口  zmf
 * @type {string}
 */
APIS.task_list = service + 'v1/sale_tasks';

/**
 * 任务列表侧滑状态接口  zmf
 * @type {string}
 */
APIS.task_result = service + 'v1/sale_task_results';

/* 线索分配列表接口  lism
 *
 */
APIS.clue_distribule_lists = service + 'v1/clues/leader';
/**
 * 销售报价列表  lism
 *
 */
APIS.sales_price_lists = service + 'v1/chance_quotations/search';
/**
 * 销售报价详情, 编辑销售报价详情  lism
 *
 */
APIS.sales_price_detail = service + 'v1/chance_quotations';
/**
 * 销售报价详情-审批记录列表  lism
 * v1/chance_quotations/{id}/approvals
 */
APIS.sales_price_detail_approvalsList = service + 'v1/chance_quotations/';

/**
 * 工作报告
 * @type {string}
 */
APIS.work_report_list = service + 'v1/my_reports/search';

/**
 * 工作报告详情
 * @type {string}
 */
APIS.work_report_detail = service + 'v1/my_reports/';

/**
 * 工作报告详情--回复
 * @type {string}
 */
APIS.work_report_comment = service + 'v1/my_reports/{id}/comment';

/**
 * 工作报告 新建、编辑
 * @type {string}
 */
APIS.work_report_add = service + 'v1/my_reports';

/**
 * 获取跟进记录列表
 * @type {string}
 */
APIS.get_sign_Record = service + 'v1/staff_signs';

/*
 * 竞争对手 列表
 * @type {string}
 */
APIS.competitors_list = service + 'v1/competitors';
/**
 * 竞争对手 详情 新增 编辑
 * @type {string}
 */
APIS.competitors_detail = service + 'v1/competitors/';

/**
 * 竞争对手联系人 新建、编辑
 * @type {string}
 */
APIS.competitors_contact_save = service + "v1/competitors_linkman";

/**
 * 销售计划 列表
 * @type {string}
 */
APIS.sale_plans = service + 'v1/sale_plans/all';

/**
 * 销售计划 冲突合并
 * @type {string}
 */
APIS.sale_plans_merge = service + 'v1/sale_plans/';

/**
 * 销售计划
 * 详情(get)
 * 新建(post)
 * 编辑(put)
 * @type {string}
 */
APIS.sale_plans_port = service + 'v1/sale_plans/pc';

/**
 * 销售计划 查询 下属部门和人员
 * @type {string}
 */
APIS.sales_plan_dept = service + "v1/staffs/direct_reports";

/**
 * 今日任务
 * @type {string}
 */
APIS.my_schedule_today = service + 'v1/my_schedules/today?pageNo=1&pageSize=30&isDesktop=1';
/**
 * 日程
 * @type {string}
 */
APIS.schedule = service + 'v1/my_schedules';
/**
 * 日程详情
 * @type {string}
 */
APIS.schedule_detail = service + 'v1/my_schedules/';
/**
 * 销售报表
 * @type {string}
 */
APIS.sales_report = service + 'v1/reports/';
/**
 * 客户分配
 * @type {string}
 */
APIS.custormer_distribute = service + 'v1/customers/';
/**
 *数据字典-客户等级
 * @type {string}
 */
APIS.custormerLeval = service + 'v1/dicts/DictCustomerLevel';
/**
 * 数据字典-行业信息
 * @type {string}
 */
APIS.custormerIndustry = service + 'v1/dicts/DictIndustry';
/**
 * 数据字典-商机类别
 * @type {string}
 */
APIS.chanceType = service + 'v1/dicts/DictStageType';


/**
 * 员工、联系人搜索
 * @type {string}
 */
APIS.search_contact_staff = service + "v1/adv_search/contact_list";

/**
 * 客户、商机、线索搜索
 * @type {string}
 */
APIS.search_function_list = service + "v1/adv_search";

/**
 * 报价审批-列表  lism
 * @type {string}
 */
APIS.priceApproval_list = service + "v1/chance_quotations/approvals";

/**
 * 报价审批-审批操作  lism
 * @type {string}
 */
APIS.priceApproval = service + "v1/chance_quotation_approvals";

/**
 * 销售漏斗
 * @type {string}
 */
APIS.funnel_list = service + "v1/reports/sales_funnel";
APIS.api_update_pwd = service + 'v1/staff_accounts/update-psw';
APIS.admin_update_pwd = serviceAdmin + 'api/v1/emp/update-pwd';
/**
 * 修改手机
 * @type {string}
 */
APIS.modify_mobile = service + 'v1/staffs/547';
APIS.modify_mobile_admin = serviceAdmin + 'api/v1/emp/update';
/**
 * 修改密码
 * @type {string}
 */
APIS.modify_email = service + 'v1/staffs/547';
APIS.modify_email_admin = serviceAdmin + 'api/v1/emp/update';

export {service, APIS};
