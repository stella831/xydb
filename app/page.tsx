'use client';
import { useState, useEffect } from 'react';

// 任务类型定义
interface TaskItem {
  id: number;
  taskLevel: '一级' | '二级';
  taskName: string;
  subTaskName: string;
  status: '进行中' | '已完成' | '即将到期' | '已逾期';
  deadline: string;
  department: string;
  handler: string;
  finishStandard: string;
}

// 任务卡片组件
const TaskCard = ({ task }: { task: TaskItem }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // 样式映射
  const statusMap = {
    '进行中': 'bg-blue-100 text-blue-600',
    '即将到期': 'bg-orange-100 text-orange-600',
    '已完成': 'bg-green-100 text-green-600',
    '已逾期': 'bg-red-100 text-red-600',
  };
  const levelMap = {
    '一级': 'bg-purple-100 text-purple-600',
    '二级': 'bg-sky-100 text-sky-600',
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all mb-4">
      {/* 头部 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span 
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer text-gray-500 transition-transform"
            style={{ transform: isExpanded ? 'rotate(180deg)' : '0' }}
          >
            ▲
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelMap[task.taskLevel]}`}>
            {task.taskLevel}
          </span>
          <h3 className="text-xl font-bold text-gray-800">{task.taskName}</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[task.status]}`}>
            {task.status}
          </span>
          <span className="text-lg font-medium text-gray-700">{task.deadline}</span>
        </div>
      </div>

      {/* 详情（折叠控制） */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-4 mb-3">
            <span className="text-gray-600">{task.department}</span>
            <span className="font-medium text-gray-700">{task.handler}</span>
            <span className="ml-auto text-blue-600 font-medium cursor-pointer hover:underline">编辑</span>
          </div>
          <div className="mb-3">
            <span className="text-gray-500 font-medium">分项任务：</span>
            <span className="text-gray-700">{task.subTaskName}</span>
          </div>
          <div>
            <span className="text-gray-500 font-medium block mb-1">办结标准：</span>
            <p className="text-gray-700 leading-relaxed text-sm">{task.finishStandard}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// 主页面
export default function SupervisePage() {
  const [searchKey, setSearchKey] = useState('');
  const [taskList, setTaskList] = useState<TaskItem[]>([]);

  // 全量任务数据（完整34条，部门/经办人已匹配）
  const fullData: TaskItem[] = [
    { id:1, taskLevel:'一级', taskName:'经营计划指标推进工作', subTaskName:'营业收入', status:'进行中', deadline:'2026/12/31', department:'财务管理部', handler:'王锴荫', finishStandard:'3月31日前完成商管集团整体营业收入4678万元；6月30日前完成9356万元；9月30日前完成22455万元；12月31日前完成37425.4万元' },
    { id:2, taskLevel:'一级', taskName:'经营计划指标推进工作', subTaskName:'利润总额', status:'进行中', deadline:'2026/12/31', department:'财务管理部', handler:'王锴荫', finishStandard:'3月31日前完成商管集团整体利润总额209.25万元；6月30日前完成502.19万元；9月30日前完成1004.38万元；12月31日前完成1673.97万元' },
    { id:3, taskLevel:'一级', taskName:'代管物业业绩指标推进工作', subTaskName:'代管物业营业收入', status:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'胡妍', finishStandard:'2026年完成代管物业收入29262.48万元（含奥莱492.77万元），其中：代管翔置业存量资产23596.43万元，翔业福州1327.5万元；福州空港楼外资产293.97万元；航空工业4044.58万元' },
    { id:4, taskLevel:'一级', taskName:'代管物业业绩指标推进工作', subTaskName:'代管房屋出租率', status:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'胡妍', finishStandard:'2026年代管物业房屋（含翔业国际大厦，不含砂之船奥莱项目）总可租面积918084.81㎡，对外总可租面积555493.86㎡，对外出租率85.63%' },
    { id:5, taskLevel:'一级', taskName:'代管物业业绩指标推进工作', subTaskName:'代管土地出租率', status:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'王之慧', finishStandard:'2026年代管翔业福州土地总可租面积243863.26㎡，对外总可租面积170600㎡，对外出租率17.45%' },
    { id:6, taskLevel:'一级', taskName:'五通商业新经济标杆项目打造工作', subTaskName:'五通商业新经济标杆项目打造', status:'进行中', deadline:'2026/9/30', department:'商服事业部', handler:'李晓炜', finishStandard:'9月30日前完成项目定位及规划方案，通过集团专题会并下发会议纪要' },
    { id:7, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'瀚澜楼茶博城', status:'即将到期', deadline:'2026/5/31', department:'商服事业部', handler:'李泉', finishStandard:'3月31日前局部试营业；5月31日前全面试营业' },
    { id:8, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'码头二期侯船楼太合音乐', status:'即将到期', deadline:'2026/5/31', department:'商服事业部', handler:'李晓炜', finishStandard:'3月31日力争试营业；5月31日正式营业' },
    { id:9, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'艾德航空产业园', status:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'姜吕斌', finishStandard:'3月31日前出租率85.5%；12月30日达90%' },
    { id:10, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'厦门国际航材中心', status:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'姜吕斌', finishStandard:'3月31日前出租率91%；12月31日达95%' },
    { id:11, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'翔业国际大厦', status:'即将到期', deadline:'2026/3/31', department:'创新事业部', handler:'曹冰涛', finishStandard:'3月31日前新增招商4360㎡，出租率65%' },
    { id:12, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'海丝羲缘楼', status:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'李泉', finishStandard:'3月31日前出租率82%；12月31日达85%' },
    { id:13, taskLevel:'一级', taskName:'宠物经济项目落地实施推进工作', subTaskName:'宠物经济线下平台1.1期', status:'进行中', deadline:'2026/6/30', department:'创新事业部', handler:'曹冰涛', finishStandard:'6月30日前与首个合作方签订协议' },
    { id:14, taskLevel:'一级', taskName:'厦门市内免税店开业推进工作', subTaskName:'厦门市内免税店开业', status:'进行中', deadline:'2026/6/30', department:'免税事业部', handler:'林宇恒', finishStandard:'6月30日前完成参股运营并开业' },
    { id:15, taskLevel:'一级', taskName:'五通码头免税店开业推进工作', subTaskName:'五通码头免税店开业', status:'进行中', deadline:'2026/6/30', department:'免税事业部', handler:'林宇恒', finishStandard:'6月30日前正式营业并转入投后管理' },
    { id:16, taskLevel:'一级', taskName:'福州长乐国际机场免税店开业推进工作', subTaskName:'福州长乐国际机场免税店开业', status:'进行中', deadline:'2026/6/30', department:'免税事业部', handler:'林宇恒', finishStandard:'6月30日前根据转场进度组织开业' },
    { id:17, taskLevel:'一级', taskName:'免税牌照攻坚推进工作', subTaskName:'免税牌照攻坚工作', status:'进行中', deadline:'2026/12/20', department:'免税事业部', handler:'林宇恒', finishStandard:'12月20日前形成年度会议纪要并汇报' },
    { id:18, taskLevel:'一级', taskName:'参股投资业务经营指标推进工作', subTaskName:'参股投资业务经营业绩指标', status:'进行中', deadline:'2026/12/31', department:'免税事业部', handler:'林宇恒', finishStandard:'12月31日前实现全口径销售额18586万元' },
    { id:19, taskLevel:'一级', taskName:'五通奥莱项目经营业务推进工作', subTaskName:'经营移交', status:'进行中', deadline:'2026/6/30', department:'商服事业部', handler:'李晓炜', finishStandard:'6月30日前与砂之船完成移交' },
    { id:20, taskLevel:'一级', taskName:'五通奥莱项目经营业务推进工作', subTaskName:'经营推进', status:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'李晓炜', finishStandard:'12月31日完成双诞活动策划及执行' },
    { id:21, taskLevel:'一级', taskName:'海峡新岸仙岳路跨线桥推进工作', subTaskName:'仙岳五通跨线桥推进', status:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'周晓萍', finishStandard:'12月31日前完成外部主管部门审批' },
    { id:22, taskLevel:'一级', taskName:'商管与物管业务效能优化工作', subTaskName:'组织架构整合优化', status:'进行中', deadline:'2026/6/30', department:'党务人力行政部', handler:'林杉', finishStandard:'6月30日前完成组织架构优化并实施' },
    { id:23, taskLevel:'一级', taskName:'翔业商管与兆翔置业工作界面明确', subTaskName:'工作边界梳理、经营指明确及委托管理合同签订', status:'进行中', deadline:'2026/6/30', department:'商服事业部', handler:'胡妍', finishStandard:'6月30日前完成兆翔置业资产委托合同签订' },
    { id:24, taskLevel:'一级', taskName:'机场城市一体化推进工作', subTaskName:'机场城市一体化', status:'进行中', deadline:'2026/9/30', department:'物服事业部', handler:'林健', finishStandard:'9月30日前完成物业服务方案并通过审议' },
    { id:25, taskLevel:'一级', taskName:'“一线“高崎片区战略布局推进工作', subTaskName:'打造高崎片区文化产业新IP', status:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'李泉', finishStandard:'12月31日前举办“厦门美术季”' },
    { id:26, taskLevel:'一级', taskName:'厦泉金先行示范区战略先行布局工作', subTaskName:'“一岛”大嶝岛战略布局推进', status:'进行中', deadline:'2026/11/30', department:'免税事业部', handler:'林涛', finishStandard:'11月30日前形成阶段性研究报告' },
    { id:27, taskLevel:'一级', taskName:'翔安机场免税店转场运营推进工作', subTaskName:'翔安机场免税店转场运营', status:'进行中', deadline:'2026/12/24', department:'免税事业部', handler:'林宇恒', finishStandard:'12月24日前推进完成免税店开业运营' },
    { id:28, taskLevel:'一级', taskName:'商管集团数字化推进工作', subTaskName:'商业管理系统上线', status:'进行中', deadline:'2026/12/31', department:'财务管理部', handler:'李森元', finishStandard:'12月31日前完成ERP系统财务管理模块上线' },
    { id:29, taskLevel:'一级', taskName:'翔安机场环境保障推进工作', subTaskName:'调试勘查', status:'即将到期', deadline:'2026/5/31', department:'物服事业部', handler:'林健', finishStandard:'5月31日完成机电设备全量勘查并形成总结' },
    { id:30, taskLevel:'一级', taskName:'翔安机场环境保障推进工作', subTaskName:'开荒保洁招标', status:'进行中', deadline:'2026/6/30', department:'物服事业部', handler:'林健', finishStandard:'6月30日完成中标单位最终确认' },
    { id:31, taskLevel:'一级', taskName:'翔安机场环境保障推进工作', subTaskName:'航站楼保洁、手推车招标', status:'进行中', deadline:'2026/9/30', department:'物服事业部', handler:'林健', finishStandard:'9月30日完成中标单位确认并签约' },
    { id:32, taskLevel:'一级', taskName:'翔安机场环境保障推进工作', subTaskName:'建立机电设备运维体系', status:'进行中', deadline:'2026/9/20', department:'物服事业部', handler:'林健', finishStandard:'9月20日完成运行手册定稿' },
    { id:33, taskLevel:'一级', taskName:'福州机场二期环境保障推进工作', subTaskName:'机电设备保障', status:'即将到期', deadline:'2026/6/10', department:'物服事业部', handler:'林健', finishStandard:'6月10日前完成人员取证及演练整改' },
    { id:34, taskLevel:'一级', taskName:'福州机场二期环境保障推进工作', subTaskName:'物业服务保障', status:'即将到期', deadline:'2026/6/10', department:'物服事业部', handler:'林健', finishStandard:'6月10日前完成保洁转场及综合演练' }
  ];

  // 搜索过滤逻辑
  useEffect(() => {
    if (!searchKey) {
      setTaskList(fullData);
      return;
    }
    const key = searchKey.toLowerCase();
    setTaskList(fullData.filter(item => 
      item.taskName.toLowerCase().includes(key) ||
      item.subTaskName.toLowerCase().includes(key) ||
      item.handler.toLowerCase().includes(key) ||
      item.department.toLowerCase().includes(key)
    ));
  }, [searchKey]);

  // 初始化数据
  useEffect(() => setTaskList(fullData), []);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">2026年集团攻坚专项行动任务督办</h1>
        <input
          type="text"
          placeholder="搜索任务/分项/经办人/部门"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        {taskList.length > 0 ? (
          taskList.map(task => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="text-center py-12 text-gray-500">暂无匹配任务</div>
        )}
      </div>
    </main>
  );
}
