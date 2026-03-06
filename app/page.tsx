'use client';

import { useState, useMemo, useEffect } from 'react';

// 任务完整类型定义
interface Task {
  id: number;
  serialNumber: string;
  taskLevel: '一级' | '二级' | '三级';
  taskName: string;
  subTaskName: string;
  department: string;
  responsibleUnit: string;
  handler: string;
  // 手动设置的状态，优先级最高
  manualStatus: '已完成' | null;
  deadline: string;
  taskDimension: string;
  taskSource: string;
  finishStandard: string[];
  // 是否有数字指标，用于自动判断逾期/未完成
  hasNumericTarget: boolean;
  supervisionLevel: '一级' | '二级' | '三级';
}

export default function SupervisionSystemPage() {
  // ========== 核心状态管理 ==========
  // 登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // 详情弹窗状态
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 编辑模式状态
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Task>>({});

  // 筛选状态管理
  const [searchKeyword, setSearchKeyword] = useState('');
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 任务原始数据（完整41项，已标注是否有数字指标）
  const [rawTasks, setRawTasks] = useState<Task[]>([
    {
      id: 1,
      serialNumber: '1',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '经营计划指标推进工作',
      subTaskName: '营业收入',
      department: '物业事业部',
      responsibleUnit: '兆翔物业',
      handler: '黄森岩',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '3月31日前完成营业收入4324.21万元',
        '6月30日前完成营业收入10378.10万元',
        '9月30日前完成营业收入20756.20万元',
        '12月31日前完成营业收入34593.66万元'
      ]
    },
    {
      id: 2,
      serialNumber: '2',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '经营计划指标推进工作',
      subTaskName: '利润总额',
      department: '物业事业部',
      responsibleUnit: '兆翔物业',
      handler: '黄森岩',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '3月31日前完成利润总额263.19万元',
        '6月30日前完成利润总额631.65万元',
        '9月30日前完成利润总额1263.31万元',
        '12月31日前完成利润总额2105.51万元'
      ]
    },
    {
      id: 3,
      serialNumber: '3',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '应收账款“四清”工作',
      subTaskName: '应收账款“四清”工作',
      department: '物业事业部',
      responsibleUnit: '兆翔物业',
      handler: '王锴荫',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '经营深化改革',
      taskSource: '2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '2月16日前收回3706.35万元',
        '3月31日前收回2064.22万元',
        '6月30日前收回696.08万元',
        '9月30日前收回482.87万元',
        '12月31日前收回536.12万元'
      ]
    },
    {
      id: 4,
      serialNumber: '4',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '外部业务拓展推进工作',
      subTaskName: '2026年外部业务拓展',
      department: '物业事业部',
      responsibleUnit: '兆翔物业',
      handler: '黄森岩',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '市场开拓攻艰',
      taskSource: '2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '3月31日前完成外部合同签约额5000万元',
        '6月30日前完成外部合同签约额6500万元',
        '9月30日前完成外部合同签约额8000万元',
        '12月31日前累计完成外部合同签约额10000万元'
      ]
    },
    {
      id: 5,
      serialNumber: '5',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '资质提升推进工作',
      subTaskName: '配电领域资质升级以及新资质获取',
      department: '物业事业部',
      responsibleUnit: '兆翔物业',
      handler: '张晨岚',
      manualStatus: null,
      deadline: '2026/11/30',
      taskDimension: '市场开拓攻艰',
      taskSource: '2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '6月30日前完成电力工程施工总承包资质技术项目负责人招聘工作，并取得资质证书',
        '11月30日前完成承装（修、试）电力设施资质业绩积累，承接至少1项变（配）电维修/试验业绩、1项线路设施维修/试验业绩'
      ]
    },
    {
      id: 6,
      serialNumber: '6',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '机电业务重点项目实施工作',
      subTaskName: '翔安机场口岸通关设施设备项目一标段',
      department: '物业事业部',
      responsibleUnit: '兆翔物业',
      handler: '张晨岚',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会，一夜转场和二期投运专题会',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日完成行李跟踪、人包智能关联、箱体识别、外观采集、条码扫描等系统安装，完成海关智能通道设备、手提行李查验一体化通道设备安装',
        '4月30日完成口岸一标段所有设备的安装与调试，6月30日前完成试运行及人员运维培训',
        '7月31日之前完成项目交付，9月30日前配合通航前测试及试运行',
        '11月30日完成高崎机场入境无感通过先行先试设备的搬迁方案编制'
      ]
    },
    {
      id: 7,
      serialNumber: '7',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '机电业务重点项目实施工作',
      subTaskName: '新机场货站工艺设备项目',
      department: '物业事业部',
      responsibleUnit: '兆翔物业',
      handler: '张晨岚',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会，一夜转场和二期投运专题会',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日完成1库区输送线体、打板台、汽车调平台机械和电气安装，完成Y库打板台机械和电气安装、输送线体机械安装',
        '5月31日完成全库区输送线、分拣线、调平台设备安装及货运数据上传，6月30日完成工艺设备联调联试并移交业主',
        '7-8月完成人员运维培训，9月30日完成试运行问题整改与系统完善',
        '10月31日完成竣工资料整理与预结算配合，11月30日完成先行先试设备搬迁方案编制'
      ]
    },
    {
      id: 8,
      serialNumber: '8',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '经营计划指标推进工作',
      subTaskName: '营业收入',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '王锴荫',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '3月31日前完成商管集团整体营业收入4678万元',
        '6月30日前完成商管集团整体营业收入9356万元',
        '9月30日前完成商管集团整体营业收入22455万元',
        '12月31日前完成商管集团整体营业收入37425.4万元'
      ]
    },
    {
      id: 9,
      serialNumber: '9',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '经营计划指标推进工作',
      subTaskName: '利润总额',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '王锴荫',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '3月31日前完成商管集团整体利润总额209.25万元',
        '6月30日前完成商管集团整体利润总额502.19万元',
        '9月30日前完成商管集团整体利润总额1004.38万元',
        '12月31日前完成商管集团整体利润总额1673.97万元'
      ]
    },
    {
      id: 10,
      serialNumber: '10',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '代管物业业绩指标推进工作',
      subTaskName: '代管物业营业收入',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '胡妍',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '12月31日前完成2026年代管物业收入29262.48万元（含奥莱492.77万元），其中代管翔置业存量资产23596.43万元、翔业福州1327.5万元、福州空港楼外资产293.97万元、航空工业4044.58万元'
      ]
    },
    {
      id: 11,
      serialNumber: '11',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '代管物业业绩指标推进工作',
      subTaskName: '代管房屋出租率',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '胡妍',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '载体高效去化',
      taskSource: '2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '12月31日前完成代管物业房屋总可租面积918084.81㎡，对外总可租面积555493.86㎡，对外出租率85.63%，其中兆翔置业出租率84.08%、翔业福州出租率94%、航空工业出租率88%、福州空港楼外资产出租率85.61%'
      ]
    },
    {
      id: 12,
      serialNumber: '12',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '代管物业业绩指标推进工作',
      subTaskName: '代管土地出租率',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '王之慧',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '载体高效去化',
      taskSource: '2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '12月31日前完成代管翔业福州土地总可租面积243863.26㎡，对外总可租面积170600㎡，对外出租率17.45%'
      ]
    },
    {
      id: 13,
      serialNumber: '13',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '五通商业新经济标杆项目打造工作',
      subTaskName: '五通商业新经济标杆项目打造',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '李晓炜',
      manualStatus: null,
      deadline: '2026/9/30',
      taskDimension: '战略优化布局',
      taskSource: '2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '9月30日前完成五通商业新经济标杆项目定位及规划方案，通过集团专题会并下发会议纪要'
      ]
    },
    {
      id: 14,
      serialNumber: '14',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '重点项目载体去化工作',
      subTaskName: '瀚澜楼茶博城',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '李泉',
      manualStatus: null,
      deadline: '2026/5/31',
      taskDimension: '载体高效去化',
      taskSource: '跨越二五二六',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日前实现局部商铺试营业',
        '5月31日实现整体试营业'
      ]
    },
    {
      id: 15,
      serialNumber: '15',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '重点项目载体去化工作',
      subTaskName: '码头二期侯船楼太合音乐',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '李晓炜',
      manualStatus: null,
      deadline: '2026/5/31',
      taskDimension: '载体高效去化',
      taskSource: '跨越二五二六，2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '5月31日完成正式营业'
      ]
    },
    {
      id: 16,
      serialNumber: '16',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '重点项目载体去化工作',
      subTaskName: '艾德航空产业园',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '姜吕斌',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '载体高效去化',
      taskSource: '跨越二五二六，2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '3月31日前完成招商面积5867㎡，出租率85.5%',
        '6月30日出租率达86%',
        '9月30日出租率达88%',
        '12月30日出租率达90%'
      ]
    },
    {
      id: 17,
      serialNumber: '17',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '重点项目载体去化工作',
      subTaskName: '厦门国际航材中心',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '姜吕斌',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '载体高效去化',
      taskSource: '跨越二五二六，2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '3月31日前完成招商面积3573㎡，出租率91%',
        '6月30日出租率达92%',
        '9月30日出租率达93%',
        '12月31日出租率达95%'
      ]
    },
    {
      id: 18,
      serialNumber: '18',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '重点项目载体去化工作',
      subTaskName: '翔业国际大厦',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '曹冰涛',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '载体高效去化',
      taskSource: '跨越二五二六，2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '3月31日前完成新增招商面积4360㎡，出租率65%',
        '6月30日出租率达70%',
        '9月30日出租率达75%',
        '12月31日出租率达80%'
      ]
    },
    {
      id: 19,
      serialNumber: '19',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '重点项目载体去化工作',
      subTaskName: '海丝羲缘楼',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '李泉',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '载体高效去化',
      taskSource: '跨越二五二六，2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '3月31日前完成招商面积2779㎡，出租率82%',
        '6月30日出租率达83%',
        '9月30日出租率达84%',
        '12月31日出租率达85%'
      ]
    },
    {
      id: 20,
      serialNumber: '20',
      taskLevel: '一级',
      supervisionLevel: '一级',
      taskName: '宠物经济项目落地实施推进工作',
      subTaskName: '宠物经济线下平台1.1期',
      department: '创新事业部',
      responsibleUnit: '翔业商管',
      handler: '曹冰涛',
      manualStatus: null,
      deadline: '2026/06/30',
      taskDimension: '新兴产业发展',
      taskSource: '2026年董事会、跨越二五二六',
      hasNumericTarget: false,
      finishStandard: [
        '2月16日前完成五通"人宠共生"城市商业综合体多方案比选，多轮修正空间方案及商业定位报告',
        '3月31日前制定项目招商运营策略，确定业态与品牌组合，完成空间方案修正稿',
        '6月30日前与首个宠物经济相关合作方签订协议，凭协议办结'
      ]
    },
    {
      id: 21,
      serialNumber: '21',
      taskLevel: '一级',
      supervisionLevel: '一级',
      taskName: '厦门市内免税店开业推进工作',
      subTaskName: '厦门市内免税店开业',
      department: '免税事业部',
      responsibleUnit: '翔业商管',
      handler: '林宇恒',
      manualStatus: null,
      deadline: '2026/6/30',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '6月30日前完成翔业免税与厦门市内免税店运营主体的变更或合作等操作，实现在厦门市内店的顺利参股运营并开业'
      ]
    },
    {
      id: 22,
      serialNumber: '22',
      taskLevel: '一级',
      supervisionLevel: '一级',
      taskName: '五通码头免税店开业推进工作',
      subTaskName: '五通码头免税店开业',
      department: '免税事业部',
      responsibleUnit: '翔业商管',
      handler: '林宇恒',
      manualStatus: null,
      deadline: '2026/6/30',
      taskDimension: '招商引资合作',
      taskSource: '2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '6月30日前完成五通码头免税店的正式营业工作，并转入常态化投后管理阶段'
      ]
    },
    {
      id: 23,
      serialNumber: '23',
      taskLevel: '一级',
      supervisionLevel: '一级',
      taskName: '福州长乐国际机场免税店开业推进工作',
      subTaskName: '福州长乐国际机场免税店开业',
      department: '免税事业部',
      responsibleUnit: '翔业商管',
      handler: '林宇恒',
      manualStatus: null,
      deadline: '2026/6/30',
      taskDimension: '招商引资合作',
      taskSource: '2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '2月16日前配合福州空港完成免税店招标方案的制定',
        '3月31日前完成福州机场免税店投资方案，通过集团审批',
        '6月30日前根据福州机场转场进度组织开业，完成开业宣传工作'
      ]
    },
    {
      id: 24,
      serialNumber: '24',
      taskLevel: '一级',
      supervisionLevel: '一级',
      taskName: '免税牌照攻坚推进工作',
      subTaskName: '免税牌照攻坚工作',
      department: '免税事业部',
      responsibleUnit: '翔业商管',
      handler: '林宇恒',
      manualStatus: null,
      deadline: '2026/12/20',
      taskDimension: '招商引资合作',
      taskSource: '2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '6月30日前组织免税牌照攻坚专项组会议，形成半年度会议纪要，并向上级领导汇报',
        '12月20日前组织免税牌照攻坚专项组会议，形成年度会议纪要，并向上级领导汇报'
      ]
    },
    {
      id: 25,
      serialNumber: '25',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '参股投资业务经营指标推进工作',
      subTaskName: '参股投资业务经营业绩指标',
      department: '免税事业部',
      responsibleUnit: '翔业商管',
      handler: '林宇恒',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      hasNumericTarget: true,
      finishStandard: [
        '12月31日前参股合资项目实现全口径销售额18586万元'
      ]
    },
    {
      id: 26,
      serialNumber: '26',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '五通奥莱项目经营业务推进工作',
      subTaskName: '经营移交',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '李晓炜',
      manualStatus: null,
      deadline: '2026/6/30',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日前完成全部品牌租赁合同转签工作',
        '6月30日前与砂之船完成移交，凭移交清单或解除相关文件办结'
      ]
    },
    {
      id: 27,
      serialNumber: '27',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '五通奥莱项目经营业务推进工作',
      subTaskName: '经营推进',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '李晓炜',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日前完成组织架构确认，完成奥莱关键员工劳动关系平移工作',
        '6月30日前根据架构完成团队人员招聘到位',
        '9月30日完成项目更名、对外宣传焕新，完成奥莱LOGO、AI方案更换',
        '12月31日完成双诞活动策划及执行'
      ]
    },
    {
      id: 28,
      serialNumber: '28',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '海峡新岸仙岳路跨线桥推进工作',
      subTaskName: '仙岳五通跨线桥推进',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '周晓萍',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日前完成初版新交通优化方案，在商管集团内部汇报',
        '6月30日前完成新交通优化方案的修改完善及费用测算，报产城集团审核',
        '9月30日前配合产城集团新交通优化方案向集团汇报并通过',
        '12月31日前配合产城集团新交通优化方案完成外部主管部门汇报审批并通过'
      ]
    },
    {
      id: 29,
      serialNumber: '29',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '商管与物管业务效能优化工作',
      subTaskName: '组织架构整合优化',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '林杉',
      manualStatus: null,
      deadline: '2026/6/30',
      taskDimension: '经营深化改革',
      taskSource: '2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '6月30日前完成商业服务事业部及物业服务事业部组织架构优化工作，实现前台事业部职能集约化，形成优化方案并经公司审批后实施'
      ]
    },
    {
      id: 30,
      serialNumber: '30',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '翔业商管与兆翔置业工作界面明确',
      subTaskName: '工作边界梳理、经营指明确及委托管理合同签订',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '胡妍',
      manualStatus: null,
      deadline: '2026/6/30',
      taskDimension: '经营深化改革',
      taskSource: '2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日前完成航空工业和福州空港资产委托合同签订，完成兆翔置业资产委托方案及收费模式的确认，并上党委会审批通过',
        '6月30日前完成兆翔置业资产委托合同签订'
      ]
    },
    {
      id: 31,
      serialNumber: '31',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '机场城市一体化推进工作',
      subTaskName: '机场城市一体化',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '林健',
      manualStatus: null,
      deadline: '2026/9/30',
      taskDimension: '机场投运筹备',
      taskSource: '跨越二六二七',
      hasNumericTarget: false,
      finishStandard: [
        '3月25日前完成机场城市一体化物业服务方案编制并向商管集团完成首次汇报，形成会议纪要',
        '6月30日前完成方案意见征集，向商管集团完成第二次汇报，形成会议纪要',
        '9月30日前完成机场城市一体化物业服务方案，并通过商管集团审议下发'
      ]
    },
    {
      id: 32,
      serialNumber: '32',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '“一线“高崎片区战略布局推进工作',
      subTaskName: '打造高崎片区文化产业新IP',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '李泉',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '战略优化布局',
      taskSource: '2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日前锚定打造厦门美术季等新IP目标，初步与相关客户对接意向',
        '6月30日前会同兆翔置业清退A2原租户，并与意向客户形成合作备忘录',
        '9月30日前完成“厦门美术季”的方案（需完成原租户清退）',
        '12月31日前举办“厦门美术季”（需完成原租户清退）'
      ]
    },
    {
      id: 33,
      serialNumber: '33',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '厦泉金先行示范区战略先行布局工作',
      subTaskName: '“一岛”大嶝岛战略布局推进',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '林涛',
      manualStatus: null,
      deadline: '2026/11/30',
      taskDimension: '战略优化布局',
      taskSource: '2026年董事会、跨越二五二六、跨越二六二七',
      hasNumericTarget: false,
      finishStandard: [
        '2月16日前优化完善《大嶝岛战略及产业研究》集团汇报版，初步形成战略项目清单',
        '3月31日前向集团提报大嶝岛战略项目清单，完成项目可行性研究报告初稿',
        '6月30日前完成方案修订，组织业务研讨形成下一阶段工作安排',
        '9月30日前向集团完成中期阶段性工作汇报，确认后续重点项目',
        '11月30日前完成核心项目可行性研究，形成阶段性研究报告'
      ]
    },
    {
      id: 34,
      serialNumber: '34',
      taskLevel: '一级',
      supervisionLevel: '一级',
      taskName: '翔安机场免税店转场运营推进工作',
      subTaskName: '翔安机场免税店转场运营',
      department: '免税事业部',
      responsibleUnit: '翔业商管',
      handler: '林宇恒',
      manualStatus: null,
      deadline: '2026/12/24',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会、跨越二六二七',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日前配合厦门空港取得免税店设立批复',
        '6月30日前配合厦门空港完成招标方案',
        '9月30日前配合厦门空港完成免税店招标事宜',
        '10月30日前完成翔安机场免税店投资方案，通过集团审批',
        '12月24日前推进完成免税店开业运营'
      ]
    },
    {
      id: 35,
      serialNumber: '35',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '商管集团数字化推进工作',
      subTaskName: '商业管理系统上线',
      department: '商服事业部',
      responsibleUnit: '翔业商管',
      handler: '李森元',
      manualStatus: null,
      deadline: '2026/12/31',
      taskDimension: '经营深化改革',
      taskSource: '2026年董事会',
      hasNumericTarget: false,
      finishStandard: [
        '2月16日前完成五通奥莱项目ERP系统上线，实现POS机收银功能',
        '3月31日前完成原砂之船奥莱会员数据接收',
        '6月30日前上线五通奥莱会员小程序，完成会员数据合并，完成客流系统合同主体变更',
        '9月30日前完成ERP系统税务模块上线，实现扫码开票功能',
        '12月31日前完成ERP系统财务模块上线，实现与金蝶EAS凭证对接'
      ]
    },
    {
      id: 36,
      serialNumber: '36',
      taskLevel: '一级',
      supervisionLevel: '一级',
      taskName: '翔安机场环境保障推进工作',
      subTaskName: '调试勘查',
      department: '机电事业部',
      responsibleUnit: '翔业商管',
      handler: '林健',
      manualStatus: null,
      deadline: '2026/05/31',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会、跨越二六二七、一夜转场和二期投运专题会',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日完成翔安新机场A、B、C、主楼南半区（共5层）机电设备勘查，完成系统设备信息收集',
        '5月31日完成翔安新机场机电设备全量勘查，完成系统设备信息收集，形成《阶段性调试踏勘总结》'
      ]
    },
    {
      id: 37,
      serialNumber: '37',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '翔安机场环境保障推进工作',
      subTaskName: '开荒保洁招标',
      department: '机电事业部',
      responsibleUnit: '翔业商管',
      handler: '林健',
      manualStatus: null,
      deadline: '2026/06/30',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会、跨越二六二七、一夜转场和二期投运专题会',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日配合业主单位完成开荒保洁标前询价资料整理、费用测算讨论及市场调研工作',
        '6月30日配合业主单位完成航站楼保洁、手推车项目的中标单位最终确认'
      ]
    },
    {
      id: 38,
      serialNumber: '38',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '翔安机场环境保障推进工作',
      subTaskName: '航站楼保洁、手推车招标',
      department: '机电事业部',
      responsibleUnit: '翔业商管',
      handler: '林健',
      manualStatus: null,
      deadline: '2026/09/30',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会、跨越二六二七、一夜转场和二期投运专题会',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日配合业主单位完成航站楼保洁、手推车招标前询价资料整理、费用测算讨论及市场调研工作',
        '6月30日配合业主单位发布航站楼保洁、手推车招标信息',
        '9月30日配合业主单位完成中标单位最终确认，签订服务合同'
      ]
    },
    {
      id: 39,
      serialNumber: '39',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '翔安机场环境保障推进工作',
      subTaskName: '建立机电设备运维体系',
      department: '机电事业部',
      responsibleUnit: '翔业商管',
      handler: '林健',
      manualStatus: null,
      deadline: '2026/09/20',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会、跨越二六二七、一夜转场和二期投运专题会',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日完成现场机电设备梳理与巡检内容评估',
        '4-6月完成团队组建、巡检清单、管理制度、巡检及维保标准初稿编制',
        '7-9月完成应急处置预案、岗位安全运行手册编制，9月20日前完成运行手册定稿'
      ]
    },
    {
      id: 40,
      serialNumber: '40',
      taskLevel: '二级',
      supervisionLevel: '二级',
      taskName: '福州机场二期环境保障推进工作',
      subTaskName: '机电设备保障',
      department: '机电事业部',
      responsibleUnit: '翔业商管',
      handler: '林健',
      manualStatus: null,
      deadline: '2026/06/10',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会、跨越二六二七、一夜转场和二期投运专题会',
      hasNumericTarget: false,
      finishStandard: [
        '3月31日前完成变配电室、电梯及行李系统供电系统联调联试，完成作业指导书、应急预案、管理制度、设备清单及安全风险评估档案编制',
        '6月10日前完成人员通行证办理、现场实操培训、综合演练及问题整改'
      ]
    },
    {
      id: 41,
      serialNumber: '41',
      taskLevel: '三级',
      supervisionLevel: '三级',
      taskName: '福州机场二期环境保障推进工作',
      subTaskName: '物业服务保障',
      department: '机电事业部',
      responsibleUnit: '翔业商管',
      handler: '林健',
      manualStatus: null,
      deadline: '2026/06/10',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会、跨越二六二七、一夜转场和二期投运专题会',
      hasNumericTarget: false,
      finishStandard: [
        '3月12日完成物业外包开标，3月15日完成中标结果公示；3月9日完成高空保洁外包立项审批，3月24日发布招标公示；3月15日前配合完成给排水系统联调联试',
        '6月10日前完成服务人员通行证办理、保洁业务转场、人员实操培训及综合演练整改'
      ]
    }
  ]);

  // ========== 自动状态计算逻辑（完全按你的要求） ==========
  const getTaskStatus = (task: Task): '进行中' | '已完成' | '即将到期' | '已逾期' | '未完成' => {
    // 手动设置已完成，优先级最高
    if (task.manualStatus === '已完成') return '已完成';

    // 日期计算
    const today = new Date();
    const deadlineDate = new Date(task.deadline);
    // 计算天数差（忽略时分秒）
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 超过完成日期
    if (diffDays < 0) {
      // 有数字指标→已逾期，无→未完成
      return task.hasNumericTarget ? '已逾期' : '未完成';
    }

    // 距离完成日期0-7天→即将到期
    if (diffDays >= 0 && diffDays <= 7) {
      return '即将到期';
    }

    // 其他情况→进行中
    return '进行中';
  };

  // 给任务加上自动计算的状态
  const tasksWithStatus = useMemo(() => {
    return rawTasks.map(task => ({
      ...task,
      autoStatus: getTaskStatus(task)
    }));
  }, [rawTasks]);

  // ========== 统计数据计算 ==========
  const totalStats = useMemo(() => {
    const total = tasksWithStatus.length;
    const inProgress = tasksWithStatus.filter(t => t.autoStatus === '进行中').length;
    const completed = tasksWithStatus.filter(t => t.autoStatus === '已完成').length;
    const overdue = tasksWithStatus.filter(t => t.autoStatus === '已逾期').length;
    const expiring = tasksWithStatus.filter(t => t.autoStatus === '即将到期').length;
    const unfinished = tasksWithStatus.filter(t => t.autoStatus === '未完成').length;
    return { total, inProgress, completed, overdue, expiring, unfinished };
  }, [tasksWithStatus]);

  // 完成率统计
  const completionRate = useMemo(() => {
    const total = tasksWithStatus.length;
    const completed = totalStats.completed;
    const totalRate = total > 0 ? ((completed / total) * 100).toFixed(2) : '0.00';

    const level1Tasks = tasksWithStatus.filter(t => t.supervisionLevel === '一级');
    const level1Completed = level1Tasks.filter(t => t.autoStatus === '已完成').length;
    const level1Rate = level1Tasks.length > 0 ? ((level1Completed / level1Tasks.length) * 100).toFixed(2) : '0.00';

    const level2Tasks = tasksWithStatus.filter(t => t.supervisionLevel === '二级');
    const level2Completed = level2Tasks.filter(t => t.autoStatus === '已完成').length;
    const level2Rate = level2Tasks.length > 0 ? ((level2Completed / level2Tasks.length) * 100).toFixed(2) : '0.00';

    const level3Tasks = tasksWithStatus.filter(t => t.supervisionLevel === '三级');
    const level3Completed = level3Tasks.filter(t => t.autoStatus === '已完成').length;
    const level3Rate = level3Tasks.length > 0 ? ((level3Completed / level3Tasks.length) * 100).toFixed(2) : '0.00';

    return { totalRate, level1Rate, level2Rate, level3Rate };
  }, [tasksWithStatus, totalStats]);

  // 筛选选项提取
  const unitOptions = useMemo(() => Array.from(new Set(tasksWithStatus.map(t => t.responsibleUnit))), [tasksWithStatus]);
  const departmentOptions = useMemo(() => Array.from(new Set(tasksWithStatus.map(t => t.department))), [tasksWithStatus]);
  const statusOptions = useMemo(() => Array.from(new Set(tasksWithStatus.map(t => t.autoStatus))), [tasksWithStatus]);

  // 筛选后任务列表
  const filteredTasks = useMemo(() => {
    return tasksWithStatus.filter(task => {
      const matchesKeyword = searchKeyword
        ? task.taskName.toLowerCase().includes(searchKeyword.toLowerCase())
        || task.subTaskName.toLowerCase().includes(searchKeyword.toLowerCase())
        || task.handler.toLowerCase().includes(searchKeyword.toLowerCase())
        || task.responsibleUnit.toLowerCase().includes(searchKeyword.toLowerCase())
        : true;

      const matchesUnit = unitFilter !== 'all' ? task.responsibleUnit === unitFilter : true;
      const matchesDept = departmentFilter !== 'all' ? task.department === departmentFilter : true;
      const matchesStatus = statusFilter !== 'all' ? task.autoStatus === statusFilter : true;

      return matchesKeyword && matchesUnit && matchesDept && matchesStatus;
    });
  }, [searchKeyword, unitFilter, departmentFilter, statusFilter, tasksWithStatus]);

  // 状态颜色映射
  const statusColorMap = {
    '进行中': 'text-blue-600',
    '已完成': 'text-green-600',
    '已逾期': 'text-red-600',
    '即将到期': 'text-orange-500',
    '未完成': 'text-purple-600',
  };

  // ========== 登录处理 ==========
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'jiandu' && loginForm.password === '000000') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('账号或密码错误，请重新输入');
    }
  };

  // ========== 编辑保存处理 ==========
  const handleSaveEdit = () => {
    if (!selectedTask) return;
    setRawTasks(prev => prev.map(task => {
      if (task.id === selectedTask.id) {
        return { ...task, ...editForm };
      }
      return task;
    }));
    setSelectedTask(prev => prev ? { ...prev, ...editForm } : null);
    setIsEditMode(false);
  };

  // 打开详情弹窗
  const openDetailModal = (task: typeof tasksWithStatus[0]) => {
    setSelectedTask(task);
    setEditForm(task);
    setIsEditMode(false);
    setShowDetailModal(true);
  };

  // 未登录显示登录页
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm w-full max-w-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6">督办系统登录</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">账号</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入账号"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">密码</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入密码"
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">督办系统</h1>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="text-gray-600 text-sm"
        >
          退出登录
        </button>
      </div>

      {/* 页面主体内容 */}
      <div className="px-4 py-4 space-y-4">
        {/* 顶部统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5">
            <p className="text-gray-500 text-base mb-1">总任务数</p>
            <p className="text-3xl font-bold text-gray-900">{totalStats.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-5">
            <p className="text-gray-500 text-base mb-1">进行中</p>
            <p className="text-3xl font-bold text-blue-600">{totalStats.inProgress}</p>
          </div>
          <div className="bg-white rounded-2xl p-5">
            <p className="text-gray-500 text-base mb-1">已完成</p>
            <p className="text-3xl font-bold text-green-600">{totalStats.completed}</p>
          </div>
          <div className="bg-white rounded-2xl p-5">
            <p className="text-gray-500 text-base mb-1">已逾期</p>
            <p className="text-3xl font-bold text-red-600">{totalStats.overdue}</p>
          </div>
          <div className="bg-white rounded-2xl p-5">
            <p className="text-gray-500 text-base mb-1">即将到期</p>
            <p className="text-3xl font-bold text-orange-500">{totalStats.expiring}</p>
          </div>
          <div className="bg-white rounded-2xl p-5">
            <p className="text-gray-500 text-base mb-1">未完成</p>
            <p className="text-3xl font-bold text-purple-600">{totalStats.unfinished}</p>
          </div>
        </div>

        {/* 完成率统计 */}
        <div className="bg-white rounded-2xl p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">完成率统计</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500 text-sm mb-1">总完成率</p>
              <p className="text-3xl font-bold text-green-600">{completionRate.totalRate}%</p>
              <p className="text-gray-400 text-xs mt-1">{totalStats.completed}/{totalStats.total}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">一级督办完成率</p>
              <p className="text-3xl font-bold text-blue-600">{completionRate.level1Rate}%</p>
              <p className="text-gray-400 text-xs mt-1">紧急程度：高</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">二级督办完成率</p>
              <p className="text-3xl font-bold text-purple-600">{completionRate.level2Rate}%</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">三级督办完成率</p>
              <p className="text-3xl font-bold text-orange-500">{completionRate.level3Rate}%</p>
            </div>
          </div>
        </div>

        {/* 筛选区域 */}
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <input
            type="text"
            placeholder="搜索任务名称、分项任务、经办人、责任单位"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none text-base appearance-none bg-[url('data:image/svg+xml;utf8,<svg fill=%22%23333%22 height=%2224%22 viewBox=%220 0 24 24%22 width=%2224%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M7 10l5 5 5-5z%22/><path d=%22M0 0h24v24H0z%22 fill=%22none%22/></svg>')] bg-no-repeat bg-right-[12px] bg-center"
            >
              <option value="all">全部事业部</option>
              {departmentOptions.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none text-base appearance-none bg-[url('data:image/svg+xml;utf8,<svg fill=%22%23333%22 height=%2224%22 viewBox=%220 0 24 24%22 width=%2224%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M7 10l5 5 5-5z%22/><path d=%22M0 0h24v24H0z%22 fill=%22none%22/></svg>')] bg-no-repeat bg-right-[12px] bg-center"
            >
              <option value="all">全部责任单位</option>
              {unitOptions.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none text-base appearance-none bg-[url('data:image/svg+xml;utf8,<svg fill=%22%23333%22 height=%2224%22 viewBox=%220 0 24 24%22 width=%2224%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M7 10l5 5 5-5z%22/><path d=%22M0 0h24v24H0z%22 fill=%22none%22/></svg>')] bg-no-repeat bg-right-[12px] bg-center"
            >
              <option value="all">全部任务状态</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 任务列表 */}
        <div className="space-y-2">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => openDetailModal(task)}
                className="bg-white rounded-2xl p-5 cursor-pointer hover:bg-gray-50 transition-colors border border-transparent hover:border-blue-200"
              >
                <p className="text-xl font-semibold text-gray-900 mb-1">
                  {task.taskName}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-lg">
                    {task.subTaskName}
                  </p>
                  <span className={`text-lg font-medium ${statusColorMap[task.autoStatus]}`}>
                    {task.autoStatus}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-500 text-lg">
              暂无匹配的任务数据
            </div>
          )}
        </div>
      </div>

      {/* ========== 全屏详情弹窗（覆盖当前页面，带关闭按钮） ========== */}
      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          {/* 弹窗顶部栏 */}
          <div className="sticky top-0 bg-white shadow-sm px-4 py-3 flex items-center justify-between z-10">
            <button
              onClick={() => setShowDetailModal(false)}
              className="text-gray-700 text-lg font-medium"
            >
              关闭
            </button>
            {/* 登录后显示编辑按钮 */}
            {isLoggedIn && !isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                编辑
              </button>
            )}
            {isLoggedIn && isEditMode && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setEditForm(selectedTask);
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  保存
                </button>
              </div>
            )}
          </div>

          {/* 详情内容 */}
          <div className="p-4 max-w-2xl mx-auto">
            {!isEditMode ? (
              // 查看模式
              <div className="space-y-0">
                <div className="py-4 border-b border-gray-100 flex">
                  <span className="text-gray-600 text-lg w-1/3">任务名称</span>
                  <span className="text-gray-900 text-lg flex-1">{selectedTask.taskName}</span>
                </div>
                <div className="py-4 border-b border-gray-100 flex">
                  <span className="text-gray-600 text-lg w-1/3">分项任务</span>
                  <span className="text-gray-900 text-lg flex-1">{selectedTask.subTaskName}</span>
                </div>
                <div className="py-4 border-b border-gray-100 flex">
                  <span className="text-gray-600 text-lg w-1/3">责任部门</span>
                  <span className="text-gray-900 text-lg flex-1">{selectedTask.department}</span>
                </div>
                <div className="py-4 border-b border-gray-100 flex">
                  <span className="text-gray-600 text-lg w-1/3">责任单位</span>
                  <span className="text-gray-900 text-lg flex-1">{selectedTask.responsibleUnit}</span>
                </div>
                <div className="py-4 border-b border-gray-100 flex">
                  <span className="text-gray-600 text-lg w-1/3">经办人</span>
                  <span className="text-gray-900 text-lg flex-1">{selectedTask.handler}</span>
                </div>
                <div className="py-4 border-b border-gray-100 flex">
                  <span className="text-gray-600 text-lg w-1/3">当前状态</span>
                  <span className={`text-lg font-medium flex-1 ${statusColorMap[selectedTask.autoStatus]}`}>
                    {selectedTask.autoStatus}
                  </span>
                </div>
                <div className="py-4 border-b border-gray-100 flex">
                  <span className="text-gray-600 text-lg w-1/3">完成时限</span>
                  <span className="text-gray-900 text-lg flex-1">{selectedTask.deadline}</span>
                </div>
                <div className="py-4 border-b border-gray-100 flex">
                  <span className="text-gray-600 text-lg w-1/3">任务维度</span>
                  <span className="text-gray-900 text-lg flex-1">{selectedTask.taskDimension}</span>
                </div>
                <div className="py-4 border-b border-gray-100 flex">
                  <span className="text-gray-600 text-lg w-1/3">任务来源</span>
                  <span className="text-gray-900 text-lg flex-1">{selectedTask.taskSource}</span>
                </div>
                <div className="py-4">
                  <span className="text-gray-600 text-lg block mb-3">核心办结标准</span>
                  <div className="space-y-2">
                    {selectedTask.finishStandard.map((item, index) => (
                      <p key={index} className="text-gray-900 text-lg leading-relaxed">
                        {index + 1}. {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // 编辑模式
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1">任务名称</label>
                  <input
                    type="text"
                    value={editForm.taskName}
                    onChange={(e) => setEditForm({ ...editForm, taskName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">分项任务</label>
                  <input
                    type="text"
                    value={editForm.subTaskName}
                    onChange={(e) => setEditForm({ ...editForm, subTaskName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">责任部门</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">责任单位</label>
                  <input
                    type="text"
                    value={editForm.responsibleUnit}
                    onChange={(e) => setEditForm({ ...editForm, responsibleUnit: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">经办人</label>
                  <input
                    type="text"
                    value={editForm.handler}
                    onChange={(e) => setEditForm({ ...editForm, handler: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">完成时限</label>
                  <input
                    type="text"
                    value={editForm.deadline}
                    onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="格式：2026/12/31"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">任务状态</label>
                  <select
                    value={editForm.manualStatus || ''}
                    onChange={(e) => setEditForm({ ...editForm, manualStatus: e.target.value ? '已完成' : null })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">自动计算</option>
                    <option value="已完成">已完成</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">任务维度</label>
                  <input
                    type="text"
                    value={editForm.taskDimension}
                    onChange={(e) => setEditForm({ ...editForm, taskDimension: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">任务来源</label>
                  <input
                    type="text"
                    value={editForm.taskSource}
                    onChange={(e) => setEditForm({ ...editForm, taskSource: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">核心办结标准（每行一条）</label>
                  <textarea
                    value={editForm.finishStandard?.join('\n')}
                    onChange={(e) => setEditForm({ ...editForm, finishStandard: e.target.value.split('\n').filter(item => item.trim()) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                    rows={6}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
