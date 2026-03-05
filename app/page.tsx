'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

// 任务核心类型定义
interface TaskItem {
  id: number;
  taskLevel: '一级' | '二级';
  taskName: string; // 任务名称
  subTaskName: string; // 分项任务名称
  status: '进行中' | '已完成' | '即将到期' | '已逾期';
  deadline: string; // 完成时限
  department: string; // 所属部门
  handler: string; // 经办人
  finishStandard: string; // 办结标准
}

// 任务卡片组件
const TaskCard = ({ task }: { task: TaskItem }) => {
  // 折叠/展开状态
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={styles.taskCard}>
      {/* 卡片头部（始终展示） */}
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          {/* 折叠箭头 */}
          <span 
            className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            ^
          </span>
          {/* 任务等级标签 */}
          <span className={`${styles.levelTag} ${styles[task.taskLevel]}`}>
            {task.taskLevel}
          </span>
          {/* 任务主名称 */}
          <h3 className={styles.taskName}>{task.taskName}</h3>
        </div>
        <div className={styles.headerRight}>
          {/* 任务状态标签 */}
          <span className={`${styles.statusTag} ${styles[task.status]}`}>
            {task.status}
          </span>
          {/* 完成时限 */}
          <span className={styles.deadline}>{task.deadline}</span>
        </div>
      </div>

      {/* 卡片详情区（折叠控制） */}
      {isExpanded && (
        <div className={styles.cardContent}>
          {/* 部门、经办人、编辑按钮 */}
          <div className={styles.metaRow}>
            <span className={styles.department}>{task.department}</span>
            <span className={styles.handler}>{task.handler}</span>
            <span className={styles.editBtn}>编辑</span>
          </div>
          {/* 分项任务名称 */}
          <div className={styles.subTaskRow}>
            <span className={styles.subTaskLabel}>分项任务：</span>
            <span className={styles.subTaskName}>{task.subTaskName}</span>
          </div>
          {/* 办结标准 */}
          <div className={styles.standardRow}>
            <span className={styles.standardLabel}>办结标准：</span>
            <p className={styles.standardText}>{task.finishStandard}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function GroupSuperviseTaskPage() {
  // 搜索关键词状态
  const [searchKey, setSearchKey] = useState('');
  // 过滤后的任务列表
  const [filterTaskList, setFilterTaskList] = useState<TaskItem[]>([]);

  // 集团督办全量任务数据（已按部门-经办人对应关系全量更新）
  const fullTaskData: TaskItem[] = [
    {
      id: 1,
      taskLevel: '一级',
      taskName: '经营计划指标推进工作',
      subTaskName: '营业收入',
      status: '进行中',
      deadline: '2026/12/31',
      department: '财务管理部',
      handler: '王锴荫',
      finishStandard: '3月31日前完成商管集团整体营业收入4678万元；6月30日前完成9356万元；9月30日前完成22455万元；12月31日前完成37425.4万元'
    },
    {
      id: 2,
      taskLevel: '一级',
      taskName: '经营计划指标推进工作',
      subTaskName: '利润总额',
      status: '进行中',
      deadline: '2026/12/31',
      department: '财务管理部',
      handler: '王锴荫',
      finishStandard: '3月31日前完成商管集团整体利润总额209.25万元；6月30日前完成502.19万元；9月30日前完成1004.38万元；12月31日前完成1673.97万元'
    },
    {
      id: 3,
      taskLevel: '一级',
      taskName: '代管物业业绩指标推进工作',
      subTaskName: '代管物业营业收入',
      status: '进行中',
      deadline: '2026/12/31',
      department: '商服事业部',
      handler: '胡妍',
      finishStandard: '2026年完成代管物业收入29262.48万元（含奥莱492.77万元），其中：1.代管翔置业存量资产23596.43万元，翔业福州1327.5万元；2.福州空港楼外资产293.97万元；3.航空工业4044.58万元'
    },
    {
      id: 4,
      taskLevel: '一级',
      taskName: '代管物业业绩指标推进工作',
      subTaskName: '代管房屋出租率',
      status: '进行中',
      deadline: '2026/12/31',
      department: '商服事业部',
      handler: '胡妍',
      finishStandard: '2026年代管物业房屋（含翔业国际大厦，不含砂之船奥莱项目）总可租面积918084.81㎡，对外总可租面积555493.86㎡，对外出租率85.63%，其中：兆翔置业对外总可租面积391334.96㎡，对外出租率84.08%；翔业福州对外总可租面积13667.67㎡，对外出租率94%；航空工业对外总可租面积130696.14㎡，对外出租率88%；福州空港楼外资产总可租面积19795.09㎡，对外出租率85.61%'
    },
    {
      id: 5,
      taskLevel: '一级',
      taskName: '代管物业业绩指标推进工作',
      subTaskName: '代管土地出租率',
      status: '进行中',
      deadline: '2026/12/31',
      department: '商服事业部',
      handler: '王之慧',
      finishStandard: '2026年代管翔业福州土地总可租面积243863.26㎡，对外总可租面积170600㎡，对外出租率17.45%（备注：未代管兆翔置业土地）'
    },
    {
      id: 6,
      taskLevel: '一级',
      taskName: '五通商业新经济标杆项目打造工作',
      subTaskName: '五通商业新经济标杆项目打造',
      status: '进行中',
      deadline: '2026/9/30',
      department: '商服事业部',
      handler: '李晓炜',
      finishStandard: '9月30日前完成五通商业新经济标杆项目项目定位及规划方案，通过集团专题会并下发会议纪要'
    },
    {
      id: 7,
      taskLevel: '一级',
      taskName: '重点项目载体去化工作',
      subTaskName: '瀚澜楼茶博城',
      status: '即将到期',
      deadline: '2026/5/31',
      department: '商服事业部',
      handler: '李泉',
      finishStandard: '3月31日前实现局部商铺试营业、外街试营业；5月31日前全面完成试营业'
    },
    {
      id: 8,
      taskLevel: '一级',
      taskName: '重点项目载体去化工作',
      subTaskName: '码头二期侯船楼太合音乐',
      status: '即将到期',
      deadline: '2026/5/31',
      department: '商服事业部',
      handler: '李晓炜',
      finishStandard: '3月31日力争试营业；5月31日完成正式营业'
    },
    {
      id: 9,
      taskLevel: '一级',
      taskName: '重点项目载体去化工作',
      subTaskName: '艾德航空产业园',
      status: '进行中',
      deadline: '2026/12/31',
      department: '商服事业部',
      handler: '姜吕斌',
      finishStandard: '3月31日前完成招商面积5867㎡，出租率85.5%；6月30日出租率达86%；9月30日出租率达88%；12月30日出租率达90%'
    },
    {
      id: 10,
      taskLevel: '一级',
      taskName: '重点项目载体去化工作',
      subTaskName: '厦门国际航材中心',
      status: '进行中',
      deadline: '2026/12/31',
      department: '商服事业部',
      handler: '姜吕斌',
      finishStandard: '3月31日前完成招商面积3573㎡，出租率91%；6月30日出租率达92%；9月30日出租率达93%；12月31日出租率达95%'
    },
    {
      id: 11,
      taskLevel: '一级',
      taskName: '重点项目载体去化工作',
      subTaskName: '翔业国际大厦',
      status: '即将到期',
      deadline: '2026/3/31',
      department: '创新事业部',
      handler: '曹冰涛',
      finishStandard: '3月31日前完成新增招商面积4360㎡，出租率65%（新增5%）；6月30日出租率达70%；9月30日出租率达75%；12月31日出租率达80%'
    },
    {
      id: 12,
      taskLevel: '一级',
      taskName: '重点项目载体去化工作',
      subTaskName: '海丝羲缘楼',
      status: '进行中',
      deadline: '2026/12/31',
      department: '商服事业部',
      handler: '李泉',
      finishStandard: '3月31日前完成招商面积2779㎡，出租率82%；6月30日出租率达83%；9月30日出租率达84%；12月31日出租率达85%'
    },
    {
      id: 13,
      taskLevel: '一级',
      taskName: '宠物经济项目落地实施推进工作',
      subTaskName: '宠物经济线下平台1.1期',
      status: '进行中',
      deadline: '2026/6/30',
      department: '创新事业部',
      handler: '曹冰涛',
      finishStandard: '2月16日前完成五通“人宠共生”城市商业综合体多方案比选，多轮修正空间方案及商业定位报告；3月31日前制定项目招商运营策略，确定业态与品牌组合，完成空间方案修正稿；6月30日前与首个宠物经济相关合作方签订协议，凭协议办结'
    },
    {
      id: 14,
      taskLevel: '一级',
      taskName: '厦门市内免税店开业推进工作',
      subTaskName: '厦门市内免税店开业',
      status: '进行中',
      deadline: '2026/6/30',
      department: '免税事业部',
      handler: '林宇恒',
      finishStandard: '6月30日前完成翔业免税与厦门市内免税店运营主体的变更或合作等操作，实现在厦门市内店的顺利参股运营并开业'
    },
    {
      id: 15,
      taskLevel: '一级',
      taskName: '五通码头免税店开业推进工作',
      subTaskName: '五通码头免税店开业',
      status: '进行中',
      deadline: '2026/6/30',
      department: '免税事业部',
      handler: '林宇恒',
      finishStandard: '6月30日前完成五通码头免税店的正式营业工作，并转入常态化投后管理阶段'
    },
    {
      id: 16,
      taskLevel: '一级',
      taskName: '福州长乐国际机场免税店开业推进工作',
      subTaskName: '福州长乐国际机场免税店开业',
      status: '进行中',
      deadline: '2026/6/30',
      department: '免税事业部',
      handler: '林宇恒',
      finishStandard: '2月16日前配合福州空港完成免税店招标方案的制定；3月31日前，完成福州机场免税店投资方案，通过集团审批；6月30日前根据福州机场转场进度组织开业，完成开业宣传工作'
    },
    {
      id: 17,
      taskLevel: '一级',
      taskName: '免税牌照攻坚推进工作',
      subTaskName: '免税牌照攻坚工作',
      status: '进行中',
      deadline: '2026/12/20',
      department: '免税事业部',
      handler: '林宇恒',
      finishStandard: '6月30日前组织免税牌照攻坚专项组会议，形成半年度会议纪要，并向上级领导汇报；12月20日前组织免税牌照攻坚专项组会议，形成年度会议纪要，并向上级领导汇报'
    },
    {
      id: 18,
      taskLevel: '一级',
      taskName: '参股投资业务经营指标推进工作',
      subTaskName: '参股投资业务经营业绩指标',
      status: '进行中',
      deadline: '2026/12/31',
      department: '免税事业部',
      handler: '林宇恒',
      finishStandard: '12月31日前参股合资项目实现全口径销售额18586万元'
    },
    {
      id: 19,
      taskLevel: '一级',
      taskName: '五通奥莱项目经营业务推进工作',
      subTaskName: '经营移交',
      status: '进行中',
      deadline: '2026/6/30',
      department: '商服事业部',
      handler: '李晓炜',
      finishStandard: '3月31日前完成全部品牌租赁合同转签工作；6月30日前与砂之船完成移交，凭移交清单或解除相关文件办结'
    },
    {
      id: 20,
      taskLevel: '一级',
      taskName: '五通奥莱项目经营业务推进工作',
      subTaskName: '经营推进',
      status: '进行中',
      deadline: '2026/12/31',
      department: '商服事业部',
      handler: '李晓炜',
      finishStandard: '3月31日前完成组织架构确认，完成奥莱关键员工劳动关系平移工作；6月30日前根据架构完成团队人员招聘到位；9月30日完成项目更名，并对外换新宣传，并完成奥莱LOGO、AI方案更换；12月31日完成双诞活动策划及执行'
    },
    {
      id: 21,
      taskLevel: '一级',
      taskName: '海峡新岸仙岳路跨线桥推进工作',
      subTaskName: '仙岳五通跨线桥推进',
      status: '进行中',
      deadline: '2026/12/31',
      department: '商服事业部',
      handler: '周晓萍',
      finishStandard: '3月31日前完成初版新交通优化方案，在商管集团内部汇报；6月30日前完成新交通优化方案的修改完善及费用测算，报产城集团审核；9月30日前配合产城集团新交通优化方案向集团汇报并通过；12月31日前配合产城集团新交通优化方案完成外部主管部门汇报审批并通过'
    },
    {
      id: 22,
      taskLevel: '一级',
      taskName: '商管与物管业务效能优化工作',
      subTaskName: '组织架构整合优化',
      status: '进行中',
      deadline: '2026/6/30',
      department: '党务人力行政部',
      handler: '林杉',
      finishStandard: '6月30日前完成商业服务事业部及物业服务事业部组织架构优化工作，实现前台事业部职能集约化，形成优化方案并经公司审批后实施'
    },
    {
      id: 23,
      taskLevel: '一级',
      taskName: '翔业商管与兆翔置业工作界面明确',
      subTaskName: '工作边界梳理、经营指明确及委托管理合同签订',
      status: '进行中',
      deadline: '2026/6/30',
      department: '商服事业部',
      handler: '胡妍',
      finishStandard: '3月31日前完成航空工业和福州空港资产委托合同签订，完成兆翔置业资产委托方案及收费模式的确认，并上党委会审批通过；6月30日前完成兆翔置业资产委托合同签订'
    },
    {
      id: 24,
      taskLevel: '一级',
      taskName: '机场城市一体化推进工作',
      subTaskName: '机场城市一体化',
      status: '进行中',
      deadline: '2026/9/30',
      department: '物服事业部',
      handler: '林健',
      finishStandard: '3月25日前完成机场城市一体化物业服务方案编制并向商管集团完成首次汇报，形成会议纪要；6月30日前向商管集团完成第二次汇报，形成会议纪要；9月30日前完成机场城市一体化物业服务方案，并通过商管集团审议下发'
    },
    {
      id: 25,
      taskLevel: '一级',
      taskName: '“一线“高崎片区战略布局推进工作',
      subTaskName: '打造高崎片区文化产业新IP',
      status: '进行中',
      deadline: '2026/12/31',
      department: '商服事业部',
      handler: '李泉',
      finishStandard: '3月31日前锚定打造厦门美术季等新IP目标，初步与相关客户对接意向；6月30日前会同兆翔置业清退A2原租户，并与意向客户形成合作备忘录；9月30日前完成“厦门美术季”的方案；12月31日前举办“厦门美术季”'
    },
    {
      id: 26,
      taskLevel: '一级',
      taskName: '厦泉金先行示范区战略先行布局工作',
      subTaskName: '“一岛”大嶝岛战略布局推进',
      status: '进行中',
      deadline: '2026/11/30',
      department: '免税事业部',
      handler: '林涛',
      finishStandard: '2月16日前优化完善《大嶝岛战略及产业研究》集团汇报版，初步形成战略项目清单；3月31日前向集团提报大嶝岛战略项目清单，明确近期可实施项目，针对选定项目深化研究，完成项目可行性研究报告初稿；6月30日前完成方案修订，组织相关单位进行业务研讨，形成下一阶段工作安排；9月30日前向翔业集团进行《2026年中期阶段性工作》汇报，形成会议纪要；11月30日前聚焦商管集团核心项目进行可行性研究，形成阶段性研究报告'
    },
    {
      id: 27,
      taskLevel: '一级',
      taskName: '翔安机场免税店转场运营推进工作',
      subTaskName: '翔安机场免税店转场运营',
      status: '进行中',
      deadline: '2026/12/24',
      department: '免税事业部',
      handler: '林宇恒',
      finishStandard: '3月31日前配合厦门空港取得免税店设立批复；6月30日前配合厦门空港完成招标方案；9月30日前配合厦门空港完成免税店招标事宜；10月30日前完成翔安机场免税店投资方案，通过集团审批；12月24日前推进完成免税店开业运营'
    },
    {
      id: 28,
      taskLevel: '一级',
      taskName: '商管集团数字化推进工作',
      subTaskName: '商业管理系统上线',
      status: '进行中',
      deadline: '2026/12/31',
      department: '财务管理部',
      handler: '李森元',
      finishStandard: '2月16日前完成五通奥莱项目ERP系统上线，实现POS机收银功能；3月31日前完成原砂之船奥莱会员数据接收；6月30日前上线五通奥莱会员小程序，完成商场客流系统合同主体变更；9月30日前完成ERP系统税务系统模块上线，实现顾客扫码开票功能；12月31日前完成ERP系统财务管理模块上线，实现ERP系统数据与金蝶EAS凭证对接功能'
    },
    {
      id: 29,
      taskLevel: '一级',
      taskName: '翔安机场环境保障推进工作',
      subTaskName: '调试勘查',
      status: '即将到期',
      deadline: '2026/5/31',
      department: '物服事业部',
      handler: '林健',
      finishStandard: '3月31日完成翔安新机场A、B、C、主楼南半区（共5层）机电设备勘查，完成系统设备信息收集；5月31日完成翔安新机场机电设备全量勘查，完成系统设备信息收集，形成《阶段性调试踏勘总结》'
    },
    {
      id: 30,
      taskLevel: '一级',
      taskName: '翔安机场环境保障推进工作',
      subTaskName: '开荒保洁招标',
      status: '进行中',
      deadline: '2026/6/30',
      department: '物服事业部',
      handler: '林健',
      finishStandard: '3月31日配合业主单位完成开荒保洁标前询价资料整理、费用测算讨论及市场调研工作；6月30日，配合业主单位完成航站楼保洁、手推车项目的中标单位并最终确认'
    },
    {
      id: 31,
      taskLevel: '一级',
      taskName: '翔安机场环境保障推进工作',
      subTaskName: '航站楼保洁、手推车招标',
      status: '进行中',
      deadline: '2026/9/30',
      department: '物服事业部',
      handler: '林健',
      finishStandard: '3月31日配合业主单位完成航站楼保洁、手推车招标前询价资料整理、费用测算讨论及市场调研工作；6月30日，配合业主单位发布招标信息；9月30日配合业主单位完成中标单位确认，签订服务合同'
    },
    {
      id: 32,
      taskLevel: '一级',
      taskName: '翔安机场环境保障推进工作',
      subTaskName: '建立机电设备运维体系',
      status: '进行中',
      deadline: '2026/9/20',
      department: '物服事业部',
      handler: '林健',
      finishStandard: '3月31日组织机电踏勘小组梳理现场设备信息，评估巡检内容；9月20日根据现场运行实际，建立翔安新机场电气、空调、电梯系统及候机楼管理岗位运行手册定稿'
    },
    {
      id: 33,
      taskLevel: '一级',
      taskName: '福州机场二期环境保障推进工作',
      subTaskName: '机电设备保障',
      status: '即将到期',
      deadline: '2026/6/10',
      department: '物服事业部',
      handler: '林健',
      finishStandard: '3月31日前配合完成变配电室、电梯及行李系统供电系统联调联试，完成电气机房、配电室管理制度及设备清单整理；6月10日前完成各岗位人员通行证取证，完成空调、电气、电梯现场实操培训及各类演练，完成问题整改'
    },
    {
      id: 34,
      taskLevel: '一级',
      taskName: '福州机场二期环境保障推进工作',
      subTaskName: '物业服务保障',
      status: '即将到期',
      deadline: '2026/6/10',
      department: '物服事业部',
      handler: '林健',
      finishStandard: '3月完成物业外包开标、高空保洁外包招标公示，配合完成给排水系统联调联试；6月10日前完成物业服务人员通行证取证，完成保洁业务转场，完成现场实操培训及各类综合演练、压力测试、模拟运行，并完成问题整改'
    }
  ];

  // 搜索过滤逻辑（支持按任务名/分项任务/经办人/部门搜索）
  useEffect(() => {
    if (!searchKey.trim()) {
      setFilterTaskList(fullTaskData);
      return;
    }
    const lowerKey = searchKey.toLowerCase().trim();
    const filtered = fullTaskData.filter(
      item =>
        item.taskName.toLowerCase().includes(lowerKey) ||
        item.subTaskName.toLowerCase().includes(lowerKey) ||
        item.handler.toLowerCase().includes(lowerKey) ||
        item.department.toLowerCase().includes(lowerKey)
    );
    setFilterTaskList(filtered);
  }, [searchKey]);

  // 初始化加载全量数据
  useEffect(() => {
    setFilterTaskList(fullTaskData);
  }, []);

  return (
    <main className={styles.container}>
      {/* 页面头部 */}
      <div className={styles.pageHeader}>
        <h1>2026年集团攻坚专项行动任务督办</h1>
      </div>

      {/* 搜索栏 */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="搜索任务名称/分项任务/经办人/所属部门"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* 任务卡片列表 */}
      <div className={styles.cardList}>
        {filterTaskList.length > 0 ? (
          filterTaskList.map(task => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className={styles.emptyTip}>暂无匹配的任务数据</div>
        )}
      </div>
    </main>
  );
}
