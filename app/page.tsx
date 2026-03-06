'use client';

import { useState, useMemo } from 'react';

// 任务数据类型定义，和你的表格字段1:1对应
interface Task {
  id: number;
  serialNumber: string;
  responsibleUnit: string;
  taskLevel: string;
  taskDimension: string;
  taskSource: string;
  taskName: string;
  subTaskName: string;
  targetSpring: string;
  targetQ1: string;
  targetQ2: string;
  targetQ3: string;
  targetQ4: string;
  deadline: string;
  handler: string;
  status: '进行中' | '已完成' | '即将到期' | '已逾期';
}

export default function TaskDashboardPage() {
  // 筛选状态管理
  const [searchKeyword, setSearchKeyword] = useState('');
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 完整41项任务数据，和你提供的Excel清单1:1还原
  const tasks: Task[] = [
    {
      id: 1,
      serialNumber: '1',
      responsibleUnit: '兆翔物业',
      taskLevel: '重要',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      taskName: '经营计划指标推进工作',
      subTaskName: '营业收入',
      targetSpring: '/',
      targetQ1: '3月31日前完成营业收入4324.21万元',
      targetQ2: '6月30日前完成营业收入10378.10万元',
      targetQ3: '9月30日前完成营业收入20756.20万元',
      targetQ4: '12月31日前完成营业收入34593.66万元',
      deadline: '2026/12/31',
      handler: '黄森岩',
      status: '进行中',
    },
    {
      id: 2,
      serialNumber: '2',
      responsibleUnit: '兆翔物业',
      taskLevel: '重要',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      taskName: '经营计划指标推进工作',
      subTaskName: '利润总额',
      targetSpring: '/',
      targetQ1: '3月31日前完成利润总额263.19万元',
      targetQ2: '6月30日前完成利润总额631.65万元',
      targetQ3: '9月30日前完成利润总额1263.31万元',
      targetQ4: '12月31日前完成利润总额2105.51万元',
      deadline: '2026/12/31',
      handler: '黄森岩',
      status: '进行中',
    },
    {
      id: 3,
      serialNumber: '3',
      responsibleUnit: '兆翔物业',
      taskLevel: '重要',
      taskDimension: '经营深化改革',
      taskSource: '2026年董事会',
      taskName: '应收账款“四清”工作',
      subTaskName: '应收账款“四清”工作',
      targetSpring: '2月16日前收回3706.35万元',
      targetQ1: '3月31日前收回2064.22万元',
      targetQ2: '6月30日前收回696.08万元',
      targetQ3: '9月30日前收回482.87万元',
      targetQ4: '12月31日前收回536.12万元',
      deadline: '2026/12/31',
      handler: '王锴荫',
      status: '进行中',
    },
    {
      id: 4,
      serialNumber: '4',
      responsibleUnit: '兆翔物业',
      taskLevel: '重要',
      taskDimension: '市场开拓攻艰',
      taskSource: '2026年董事会',
      taskName: '外部业务拓展推进工作',
      subTaskName: '2026年外部业务拓展',
      targetSpring: '/',
      targetQ1: '3月31日前完成外部合同签约额5000万元',
      targetQ2: '6月30日前完成外部合同签约额6500万元',
      targetQ3: '9月30日前完成外部合同签约额8000万元',
      targetQ4: '12月31日前累计完成外部合同签约额10000万元',
      deadline: '2026/12/31',
      handler: '黄森岩',
      status: '进行中',
    },
    {
      id: 5,
      serialNumber: '5',
      responsibleUnit: '兆翔物业',
      taskLevel: '重要',
      taskDimension: '市场开拓攻艰',
      taskSource: '2026年董事会',
      taskName: '资质提升推进工作',
      subTaskName: '配电领域资质升级以及新资质获取',
      targetSpring: '/',
      targetQ1: '/',
      targetQ2: '获取电力工程施工总承包二级资质：6月30日前完成电力工程施工总承包资质技术项目负责人招聘工作，并取得资质证书',
      targetQ3: '/',
      targetQ4: '积累2027年升级承装（修、试）电力设施资质业绩：11月30日前三级承装（修、试）电力设施许可证二级需至少承接1项变（配）电的维修或试验活动业绩，以及1项线路设施的维修或试验活动业绩',
      deadline: '2026/11/30',
      handler: '张晨岚',
      status: '进行中',
    },
    {
      id: 6,
      serialNumber: '6',
      responsibleUnit: '兆翔物业',
      taskLevel: '重要',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会，一夜转场和二期投运专题会',
      taskName: '机电业务重点项目实施工作',
      subTaskName: '翔安机场口岸通关设施设备项目一标段',
      targetSpring: '/',
      targetQ1: '3月31日完成行李跟踪、运行李人包智能关联、箱体识别、外观采集、条码扫描等系统安装；3月31日完成海关智能通道设备、手提行李查验一体化通道设备安装',
      targetQ2: '4月30日完成口岸一标段所有设备的安装，进行调试；6月30日前完成试运行，并组织相应设备厂商技术人员对业主及相关使用、运保单位人员进行运行、维护等相关内容的培训',
      targetQ3: '7月31日之前完成翔安新机场海关通关设备一标段项目交付；9月30日前按需求配合通航前相应测试及试运行',
      targetQ4: '11月30日完成高崎机场入境无感通过先行先试设备的搬迁方案，待转场后进行搬迁、修复及安调工作',
      deadline: '2026/12/31',
      handler: '张晨岚',
      status: '进行中',
    },
    {
      id: 7,
      serialNumber: '7',
      responsibleUnit: '兆翔物业',
      taskLevel: '重要',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会，一夜转场和二期投运专题会',
      taskName: '机电业务重点项目实施工作',
      subTaskName: '新机场货站工艺设备项目',
      targetSpring: '/',
      targetQ1: '3月31日完成1库区输送线体及打板台机械和电气安装完成，汽车调平台安装完成；3月31日完成Y库打板台机械和电气安装，输送线体机械安装完成',
      targetQ2: '5月31日完成完成输送线、分拣线、调平台设备安装，完成整个库区实现货运数据上传；6月30日完成工艺设备联调联试，并移交业主',
      targetQ3: '7月31日完成运行、维护等相关内容的培训；8月31日完成业主及相关使用的培训；9月30日完善试运行过程发现的遗漏，缺陷等，进行系统设备完善工作',
      targetQ4: '10月31日整理竣工资料，配合预结算工作；11月30日完成升降打板台、智能分拣线先行先试设备的搬迁方案，待转场后进行搬迁、修复及安调工作',
      deadline: '2026/12/31',
      handler: '张晨岚',
      status: '进行中',
    },
    {
      id: 8,
      serialNumber: '8',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      taskName: '经营计划指标推进工作',
      subTaskName: '营业收入',
      targetSpring: '/',
      targetQ1: '3月31日前完成商管集团整体营业收入4678万元',
      targetQ2: '6月30日前完成商管集团整体营业收入9356万元',
      targetQ3: '9月30日前完成商管集团整体营业收入22455万元',
      targetQ4: '12月31日前完成商管集团整体营业收入37425.4万元',
      deadline: '2026/12/31',
      handler: '王锴荫',
      status: '进行中',
    },
    {
      id: 9,
      serialNumber: '9',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      taskName: '经营计划指标推进工作',
      subTaskName: '利润总额',
      targetSpring: '/',
      targetQ1: '3月31日前完成商管集团整体利润总额209.25万元',
      targetQ2: '6月30日前完成商管集团整体利润总额502.19万元',
      targetQ3: '9月30日前完成商管集团整体利润总额1004.38万元',
      targetQ4: '12月31日前完成商管集团整体利润总额1673.97万元',
      deadline: '2026/12/31',
      handler: '王锴荫',
      status: '进行中',
    },
    {
      id: 10,
      serialNumber: '10',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      taskName: '代管物业业绩指标推进工作',
      subTaskName: '代管物业营业收入',
      targetSpring: '/',
      targetQ1: '/',
      targetQ2: '/',
      targetQ3: '/',
      targetQ4: '2026年代管物业收入29262.48万元（含奥莱492.77万元）其中：1.代管翔置业存量资产23596.43万元，翔业福州1327.5万元；2.福州空港楼外资产293.97万元；3.航空工业4044.58万元',
      deadline: '2026/12/31',
      handler: '胡妍',
      status: '进行中',
    },
    {
      id: 11,
      serialNumber: '11',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '载体高效去化',
      taskSource: '2026年董事会',
      taskName: '代管物业业绩指标推进工作',
      subTaskName: '代管房屋出租率',
      targetSpring: '/',
      targetQ1: '/',
      targetQ2: '/',
      targetQ3: '/',
      targetQ4: '2026年代管物业房屋（含翔业国际大厦，不含砂之船奥莱项目）总可租面积918084.81㎡，对外总可租面积555493.86㎡，对外出租率85.63%，其中：兆翔置业对外总可租面积391334.96㎡，对外出租率84.08%；翔业福州对外总可租面积13667.67㎡，对外出租率94%；航空工业对外总可租面积130696.14㎡，对外出租率88%；福州空港楼外资产总可租面积19795.09㎡，对外出租率85.61%',
      deadline: '2026/12/31',
      handler: '胡妍',
      status: '进行中',
    },
    {
      id: 12,
      serialNumber: '12',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '载体高效去化',
      taskSource: '2026年董事会',
      taskName: '代管物业业绩指标推进工作',
      subTaskName: '代管土地出租率',
      targetSpring: '/',
      targetQ1: '/',
      targetQ2: '/',
      targetQ3: '/',
      targetQ4: '2026年代管翔业福州土地总可租面积243863.26㎡，对外总可租面积170600㎡，对外出租率17.45%（备注：未代管兆翔置业土地）',
      deadline: '2026/12/31',
      handler: '王之慧',
      status: '进行中',
    },
    {
      id: 13,
      serialNumber: '13',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '战略优化布局',
      taskSource: '2026年董事会',
      taskName: '五通商业新经济标杆项目打造工作',
      subTaskName: '五通商业新经济标杆项目打造',
      targetSpring: '/',
      targetQ1: '/',
      targetQ2: '/',
      targetQ3: '9月30日前完成五通商业新经济标杆项目项目定位及规划方案，通过集团专题会并下发会议纪要',
      targetQ4: '/',
      deadline: '2026/9/30',
      handler: '李晓炜',
      status: '进行中',
    },
    {
      id: 14,
      serialNumber: '14',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '载体高效去化',
      taskSource: '跨越二五二六',
      taskName: '重点项目载体去化工作',
      subTaskName: '瀚澜楼茶博城',
      targetSpring: '/',
      targetQ1: '3月31日前实现局部商铺试营业',
      targetQ2: '5月31日实现试营业',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/5/31',
      handler: '李泉',
      status: '进行中',
    },
    {
      id: 15,
      serialNumber: '15',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '载体高效去化',
      taskSource: '跨越二五二六，2026年董事会',
      taskName: '重点项目载体去化工作',
      subTaskName: '码头二期侯船楼太合音乐',
      targetSpring: '/',
      targetQ1: '/',
      targetQ2: '5月31日完成正式营业',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/5/31',
      handler: '李晓炜',
      status: '进行中',
    },
    {
      id: 16,
      serialNumber: '16',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '载体高效去化',
      taskSource: '跨越二五二六，2026年董事会',
      taskName: '重点项目载体去化工作',
      subTaskName: '艾德航空产业园',
      targetSpring: '/',
      targetQ1: '3月31日前完成招商面积5867㎡，出租率85.5%（退租5867㎡，新增0%）',
      targetQ2: '6月30日出租率达86%',
      targetQ3: '9月30日出租率达88%',
      targetQ4: '12月30日出租率达90%',
      deadline: '2026/12/31',
      handler: '姜吕斌',
      status: '进行中',
    },
    {
      id: 17,
      serialNumber: '17',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '载体高效去化',
      taskSource: '跨越二五二六，2026年董事会',
      taskName: '重点项目载体去化工作',
      subTaskName: '厦门国际航材中心',
      targetSpring: '/',
      targetQ1: '3月31日前完成招商面积3573㎡，出租率91%（退租3573㎡，新增0%）',
      targetQ2: '6月30日出租率达92%',
      targetQ3: '9月30日出租率达93%',
      targetQ4: '12月31日出租率达95%',
      deadline: '2026/12/31',
      handler: '姜吕斌',
      status: '进行中',
    },
    {
      id: 18,
      serialNumber: '18',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '载体高效去化',
      taskSource: '跨越二五二六，2026年董事会',
      taskName: '重点项目载体去化工作',
      subTaskName: '翔业国际大厦',
      targetSpring: '/',
      targetQ1: '3月31日前完成新增招商面积4360㎡，出租率65%（新增5%）',
      targetQ2: '6月30日出租率达70%',
      targetQ3: '9月30日出租率达75%',
      targetQ4: '12月31日出租率达80%',
      deadline: '2026/12/31',
      handler: '曹冰涛',
      status: '进行中',
    },
    {
      id: 19,
      serialNumber: '19',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '载体高效去化',
      taskSource: '跨越二五二六，2026年董事会',
      taskName: '重点项目载体去化工作',
      subTaskName: '海丝羲缘楼',
      targetSpring: '/',
      targetQ1: '3月31日前完成招商面积2779㎡，出租率82%（退租2779㎡，新增0%）',
      targetQ2: '6月30日出租率达83%',
      targetQ3: '9月30日出租率达84%',
      targetQ4: '12月31日出租率达85%',
      deadline: '2026/12/31',
      handler: '李泉',
      status: '进行中',
    },
    {
      id: 20,
      serialNumber: '20',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '新兴产业发展',
      taskSource: '2026年董事会,跨越二五二六',
      taskName: '宠物经济项目落地实施推进工作',
      subTaskName: '宠物经济线下平台1.1期',
      targetSpring: '2月16日前完成五通“人宠共生”城市商业综合体多方案比选，多轮修正空间方案及商业定位报告',
      targetQ1: '3月31日前制定项目招商运营策略，确定业态与品牌组合，完成空间方案修正稿',
      targetQ2: '6月30日前与首个宠物经济相关合作方签订协议，凭协议办结',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/6/30',
      handler: '曹冰涛',
      status: '进行中',
    },
    {
      id: 21,
      serialNumber: '21',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会',
      taskName: '厦门市内免税店开业推进工作',
      subTaskName: '厦门市内免税店开业',
      targetSpring: '/',
      targetQ1: '/',
      targetQ2: '6月30日前完成翔业免税与厦门市内免税店运营主体的变更或合作等操作，实现在厦门市内店的顺利参股运营并开业',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/6/30',
      handler: '林宇恒',
      status: '进行中',
    },
    {
      id: 22,
      serialNumber: '22',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '招商引资合作',
      taskSource: '2026年董事会',
      taskName: '五通码头免税店开业推进工作',
      subTaskName: '五通码头免税店开业',
      targetSpring: '/',
      targetQ1: '/',
      targetQ2: '6月30日前完成五通码头免税店的正式营业工作，并转入常态化投后管理阶段',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/6/30',
      handler: '林宇恒',
      status: '进行中',
    },
    {
      id: 23,
      serialNumber: '23',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '招商引资合作',
      taskSource: '2026年董事会',
      taskName: '福州长乐国际机场免税店开业推进工作',
      subTaskName: '福州长乐国际机场免税店开业',
      targetSpring: '2月16日前配合福州空港完成免税店招标方案的制定',
      targetQ1: '3月31日前，完成福州机场免税店投资方案，通过集团审批',
      targetQ2: '6月30日前根据福州机场转场进度组织开业，完成开业宣传工作',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/6/30',
      handler: '林宇恒',
      status: '进行中',
    },
    {
      id: 24,
      serialNumber: '24',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '招商引资合作',
      taskSource: '2026年董事会',
      taskName: '免税牌照攻坚推进工作',
      subTaskName: '免税牌照攻坚工作',
      targetSpring: '/',
      targetQ1: '/',
      targetQ2: '6月30日前组织免税牌照攻坚专项组会议，形成半年度会议纪要，并向上级领导汇报',
      targetQ3: '/',
      targetQ4: '12月20日前组织免税牌照攻坚专项组会议，形成年度会议纪要，并向上级领导汇报',
      deadline: '2026/12/20',
      handler: '林宇恒',
      status: '进行中',
    },
    {
      id: 25,
      serialNumber: '25',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      taskName: '参股投资业务经营指标推进工作',
      subTaskName: '参股投资业务经营业绩指标',
      targetSpring: '/',
      targetQ1: '/',
      targetQ2: '/',
      targetQ3: '/',
      targetQ4: '12月31日前参股合资项目实现全口径销售额18586万元',
      deadline: '2026/12/31',
      handler: '林宇恒',
      status: '进行中',
    },
    {
      id: 26,
      serialNumber: '26',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      taskName: '五通奥莱项目经营业务推进工作',
      subTaskName: '经营移交',
      targetSpring: '/',
      targetQ1: '3月31日前完成全部品牌租赁合同转签工作',
      targetQ2: '6月30日前与砂之船完成移交，凭移交清单或解除相关文件办结',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/6/30',
      handler: '李晓炜',
      status: '进行中',
    },
    {
      id: 27,
      serialNumber: '27',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      taskName: '五通奥莱项目经营业务推进工作',
      subTaskName: '经营推进',
      targetSpring: '/',
      targetQ1: '3月31日前完成组织架构确认，完成奥莱关键员工劳动关系平移工作',
      targetQ2: '6月30日前根据架构完成团队人员招聘到位',
      targetQ3: '9月30日完成项目更名，并对外换新宣传，并完成奥莱LOGO、AI方案更换',
      targetQ4: '12月31日完成双诞活动策划及执行',
      deadline: '2026/12/31',
      handler: '李晓炜',
      status: '进行中',
    },
    {
      id: 28,
      serialNumber: '28',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      taskName: '海峡新岸仙岳路跨线桥推进工作',
      subTaskName: '仙岳五通跨线桥推进',
      targetSpring: '/',
      targetQ1: '3月31日前完成初版新交通优化方案，在商管集团内部汇报',
      targetQ2: '6月30日前完成新交通优化方案的修改完善及费用测算，报产城集团审核',
      targetQ3: '9月30日前配合产城集团新交通优化方案向集团汇报并通过',
      targetQ4: '12月31日前配合产城集团新交通优化方案完成外部主管部门汇报审批并通过',
      deadline: '2026/12/31',
      handler: '周晓萍',
      status: '进行中',
    },
    {
      id: 29,
      serialNumber: '29',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '经营深化改革',
      taskSource: '2026年董事会',
      taskName: '商管与物管业务效能优化工作',
      subTaskName: '组织架构整合优化',
      targetSpring: '/',
      targetQ1: '/',
      targetQ2: '6月30日前完成商业服务事业部及物业服务事业部组织架构优化工作，实现前台事业部职能集约化，形成优化方案并经公司审批后实施',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/6/30',
      handler: '林杉',
      status: '进行中',
    },
    {
      id: 30,
      serialNumber: '30',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '经营深化改革',
      taskSource: '2026年董事会',
      taskName: '翔业商管与兆翔置业工作界面明确',
      subTaskName: '工作边界梳理、经营指明确及委托管理合同签订',
      targetSpring: '/',
      targetQ1: '3月31日前完成航空工业和福州空港资产委托合同签订；3月31日前完成兆翔置业资产委托方案及收费模式的确认，并上党委会审批通过',
      targetQ2: '6月30日前完成兆翔置业资产委托合同签订',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/6/30',
      handler: '胡妍',
      status: '进行中',
    },
    {
      id: 31,
      serialNumber: '31',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '机场投运筹备',
      taskSource: '跨越二六二七',
      taskName: '机场城市一体化推进工作',
      subTaskName: '机场城市一体化',
      targetSpring: '/',
      targetQ1: '3月25日前完成机场城市一体化物业服务方案编制并向商管集团完成首次汇报，形成会议纪要',
      targetQ2: '征求商管集团中后台各部门意见，6月30日前向商管集团完成第二次汇报，形成会议纪要',
      targetQ3: '9月30日前完成机场城市一体化物业服务方案，并通过商管集团审议下发',
      targetQ4: '/',
      deadline: '2026/9/30',
      handler: '林健',
      status: '进行中',
    },
    {
      id: 32,
      serialNumber: '32',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '战略优化布局',
      taskSource: '2026年董事会',
      taskName: '“一线“高崎片区战略布局推进工作',
      subTaskName: '打造高崎片区文化产业新IP',
      targetSpring: '/',
      targetQ1: '3月31日前锚定打造厦门美术季等新IP目标，初步与相关客户对接意向',
      targetQ2: '6月30日前会同兆翔置业清退A2原租户，并与意向客户形成合作备忘录',
      targetQ3: '9月30日前完成“厦门美术季”的方案（在6月30日完成原租户清退的前提下）',
      targetQ4: '12月31日前举办“厦门美术季”（在6月30日完成原租户清退的前提下）',
      deadline: '2026/12/31',
      handler: '李泉',
      status: '进行中',
    },
    {
      id: 33,
      serialNumber: '33',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '战略优化布局',
      taskSource: '2026年董事会,跨越二五二六,跨越二六二七',
      taskName: '厦泉金先行示范区战略先行布局工作',
      subTaskName: '“一岛”大嶝岛战略布局推进',
      targetSpring: '2月16日前优化完善《大嶝岛战略及产业研究》集团汇报版，初步形成战略项目清单',
      targetQ1: '3月31日前向集团提报大嶝岛战略项目清单，明确近期可实施项目；3月31日前针对选定项目深化研究，完成项目可行性研究报告初稿',
      targetQ2: '6月30日前根据会议要求，进行行业/竞品/内部的再次沟通，并完成方案修订；6月30日前组织相关单位进行业务研讨，形成下一阶段工作安排',
      targetQ3: '9月30日前向翔业集团进行《2026年中期阶段性工作》汇报，并形成会议纪要，确认下一阶段重点研究项目清单',
      targetQ4: '11月30日前聚焦商管集团核心项目进行可行性研究，形成阶段性研究报告。配合成员单位开展相关项目研究辅助工作，修订完善整体方案。',
      deadline: '2026/11/30',
      handler: '林涛',
      status: '进行中',
    },
    {
      id: 34,
      serialNumber: '34',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会,跨越二六二七',
      taskName: '翔安机场免税店转场运营推进工作',
      subTaskName: '翔安机场免税店转场运营',
      targetSpring: '/',
      targetQ1: '3月31日前配合厦门空港取得免税店设立批复',
      targetQ2: '6月30日前配合厦门空港完成招标方案',
      targetQ3: '9月30日前配合厦门空港完成免税店招标事宜',
      targetQ4: '10月30日前完成翔安机场免税店投资方案，通过集团审批；12月24日前推进完成免税店开业运营',
      deadline: '2026/12/24',
      handler: '林宇恒',
      status: '进行中',
    },
    {
      id: 35,
      serialNumber: '35',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '经营深化改革',
      taskSource: '2026年董事会',
      taskName: '商管集团数字化推进工作',
      subTaskName: '商业管理系统上线',
      targetSpring: '2月16日前完成五通奥莱项目ERP系统上线，实现POS机收银功能，商场每日销售额进入翔业商运公司账户',
      targetQ1: '3月31日前完成原砂之船奥莱会员数据接收（同意授权转移部份）',
      targetQ2: '6月30日前上线五通奥莱会员小程序，并将“同意授权”的原砂之船会员合并至五通奥莱会员小程序；6月30日前完成五通奥莱商场客流系统合同主体变更，实现商场客流统计',
      targetQ3: '9月30日前完成ERP系统税务系统模块上线，实现顾客扫码开票功能',
      targetQ4: '12月31日前完成ERP系统财务管理模块上线，实现ERP系统数据与金蝶EAS凭证对接功能',
      deadline: '2026/12/31',
      handler: '李森元',
      status: '进行中',
    },
    {
      id: 36,
      serialNumber: '36',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会,跨越二六二七，一夜转场和二期投运专题会',
      taskName: '翔安机场环境保障推进工作',
      subTaskName: '调试勘查',
      targetSpring: '/',
      targetQ1: '3月31日完成翔安新机场A、B、C、主楼南半区（共5层）机电设备设备勘查，完成系统设备信息收集',
      targetQ2: '5月31日完成翔安新机场机电设备设备勘查，完成系统设备信息收集，形成《阶段性调试踏勘总结》',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/5/31',
      handler: '林健',
      status: '进行中',
    },
    {
      id: 37,
      serialNumber: '37',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会,跨越二六二七，一夜转场和二期投运专题会',
      taskName: '翔安机场环境保障推进工作',
      subTaskName: '开荒保洁招标',
      targetSpring: '/',
      targetQ1: '3月31日配合业主单位完成开荒保洁标前询价资料整理、费用测算讨论及市场调研工作',
      targetQ2: '6月30日，配合业主单位完成航站楼保洁、手推车项目的中标单位并最终确认',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/6/30',
      handler: '林健',
      status: '进行中',
    },
    {
      id: 38,
      serialNumber: '38',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会,跨越二六二七，一夜转场和二期投运专题会',
      taskName: '翔安机场环境保障推进工作',
      subTaskName: '航站楼保洁、手推车招标',
      targetSpring: '/',
      targetQ1: '3月31日配合业主单位完成航站楼保洁、手推车招标前询价资料整理、费用测算讨论及市场调研工作',
      targetQ2: '6月30日，配合业主单位发布航站楼保洁、手推车招标信息',
      targetQ3: '9月30日配合业主单位完成航站楼保洁、手推车项目的中标单位并最终确认，签订服务合同',
      targetQ4: '/',
      deadline: '2026/9/30',
      handler: '林健',
      status: '进行中',
    },
    {
      id: 39,
      serialNumber: '39',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会,跨越二六二七，一夜转场和二期投运专题会',
      taskName: '翔安机场环境保障推进工作',
      subTaskName: '建立机电设备运维体系',
      targetSpring: '/',
      targetQ1: '3月31日组织机电踏勘小组对现场机电设备数量、动线流程进行梳理，评估现场巡检内容及用时',
      targetQ2: '4月20日确定翔安新机场团队组建，明确高崎国际机场、翔安新机场重心保障人员，评估配电设备、空调设备、电梯设备等巡检内容及检查标准；5月20日制定翔安新机场电气、空调、电梯系统设备日常巡检内容清单和机房、配电室管理制度；6月20日完成航站楼电气、空调、电梯系统设备日常巡检标准、维保标准等初稿',
      targetQ3: '7月20日完成翔安新机场电气、空调、电梯系统应急处置预案初稿；8月20日根据设备清单、巡检标准、应急预案等形成翔安新机场电气、空调、电梯系统岗位安全运行手册初稿；9月20日根据现场运行实际，建立翔安新机场电气、空调、电梯系统及候机楼管理岗位运行手册定稿',
      targetQ4: '/',
      deadline: '2026/9/20',
      handler: '林健',
      status: '进行中',
    },
    {
      id: 40,
      serialNumber: '40',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会,跨越二六二七，一夜转场和二期投运专题会',
      taskName: '福州机场二期环境保障推进工作',
      subTaskName: '机电设备保障',
      targetSpring: '/',
      targetQ1: '联调联试：3月31日前配合业主及建设单位完成变配电室设备系统、电梯及行李系统设备供电系统联调联试工作；体系建设：2月28日完成保洁专业作业指导书与应急预案梳理；3月31日完成电气机房、配电室管理制度整理、电气设备、空调专业设备清单整理及档案编制，并完成各岗位基本安全风险评估档案',
      targetQ2: '人力资源：6月10日前完成各岗位人员通行证取证及门禁通行权限；6月10日前完成空调专业现场实操培训及各类综合演练、压力测试、模拟运行，并完成问题整改；6月10日前完成电气、电梯现场实操培训及各类演练、并完成问题整改',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/6/10',
      handler: '林健',
      status: '进行中',
    },
    {
      id: 41,
      serialNumber: '41',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会,跨越二六二七，一夜转场和二期投运专题会',
      taskName: '福州机场二期环境保障推进工作',
      subTaskName: '物业服务保障',
      targetSpring: '/',
      targetQ1: '物业外包：3月12日完成开标，3月15日中标结果公示；高空保洁外包：3月9日完成立项文件审批，3月24日发布招标信息公示；联调联试：3月15日前配合完成生活给水系统、排水与排污系统、雨水排放系统联调联试工作',
      targetQ2: '日常保洁：6月10日前完成物业服务人员（含外包单位）通行证取证及门禁通行权限；6月10日前完成候机楼保洁业务从过渡期深度保洁到日常保洁转场；人力资源：6月10日前完成区域管家人员及外包人员现场实操培训及各类综合演练、压力测试、模拟运行，并完成问题整改',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/6/10',
      handler: '林健',
      status: '进行中',
    },
  ];

  // 自动提取筛选选项
  const unitOptions = useMemo(() => Array.from(new Set(tasks.map(task => task.responsibleUnit))), [tasks]);
  const levelOptions = useMemo(() => Array.from(new Set(tasks.map(task => task.taskLevel))), [tasks]);
  const statusOptions = useMemo(() => Array.from(new Set(tasks.map(task => task.status))), [tasks]);

  // 多维度筛选逻辑
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 关键词搜索
      const matchesKeyword = searchKeyword
        ? task.taskName.toLowerCase().includes(searchKeyword.toLowerCase())
        || task.subTaskName.toLowerCase().includes(searchKeyword.toLowerCase())
        || task.handler.toLowerCase().includes(searchKeyword.toLowerCase())
        || task.responsibleUnit.toLowerCase().includes(searchKeyword.toLowerCase())
        : true;

      // 责任单位筛选
      const matchesUnit = unitFilter !== 'all' ? task.responsibleUnit === unitFilter : true;

      // 任务等级筛选
      const matchesLevel = levelFilter !== 'all' ? task.taskLevel === levelFilter : true;

      // 任务状态筛选
      const matchesStatus = statusFilter !== 'all' ? task.status === statusFilter : true;

      return matchesKeyword && matchesUnit && matchesLevel && matchesStatus;
    });
  }, [searchKeyword, unitFilter, levelFilter, statusFilter, tasks]);

  // 状态样式映射
  const statusClassMap: Record<Task['status'], string> = {
    '进行中': 'bg-blue-500 text-white',
    '已完成': 'bg-green-500 text-white',
    '即将到期': 'bg-yellow-500 text-white',
    '已逾期': 'bg-red-500 text-white',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-[1920px] mx-auto">
        {/* 页面标题 */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          2026年集团攻坚专项行动二级任务清单
        </h1>

        {/* 筛选操作栏 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="搜索任务名称、分项任务、经办人、责任单位"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部责任单位</option>
            {unitOptions.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部任务等级</option>
            {levelOptions.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部任务状态</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* 任务表格 */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-16">序号</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">责任单位</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">任务等级</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">任务维度</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">任务名称</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">分项任务名称</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">领跑首季目标</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">攻坚过半目标</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">完成时限</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">经办人</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{task.serialNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{task.responsibleUnit}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{task.taskLevel}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{task.taskDimension}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate" title={task.taskName}>
                      {task.taskName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate" title={task.subTaskName}>
                      {task.subTaskName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-[250px] truncate" title={task.targetQ1}>
                      {task.targetQ1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-[250px] truncate" title={task.targetQ2}>
                      {task.targetQ2}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{task.deadline}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{task.handler}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusClassMap[task.status]}`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-sm text-gray-500">
                    暂无匹配的任务数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
