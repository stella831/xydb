'use client';
import { useState, useEffect, useMemo } from 'react';

// 任务核心类型定义
interface TaskItem {
  id: number;
  taskLevel: '一级' | '二级';
  taskName: string;
  subTaskName: string;
  baseStatus: '进行中' | '已完成';
  deadline: string;
  department: string;
  handler: string;
  finishStandard: string;
}

// 日期工具函数：计算任务实时状态
const getTaskRealStatus = (deadlineStr: string, baseStatus: string) => {
  if (baseStatus === '已完成') return '已完成';
  
  // 格式化日期，去除时间影响
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(deadlineStr);
  deadline.setHours(0, 0, 0, 0);

  // 计算天数差
  const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '已逾期';
  if (diffDays <= 7) return '即将到期';
  return '进行中';
};

// 任务卡片组件
const TaskCard = ({ task }: { task: TaskItem }) => {
  const [isExpanded, setIsExpanded] = useState(task.taskLevel === '一级');
  const realStatus = getTaskRealStatus(task.deadline, task.baseStatus);

  // 样式映射
  const statusMap = {
    '进行中': 'bg-blue-50 text-blue-600',
    '即将到期': 'bg-orange-50 text-orange-600',
    '已完成': 'bg-green-50 text-green-600',
    '已逾期': 'bg-red-50 text-red-600',
  };
  const levelMap = {
    '一级': 'bg-purple-50 text-purple-600',
    '二级': 'bg-green-50 text-green-600',
  };

  return (
    <div className={`rounded-xl p-4 shadow-sm mb-3 ${task.taskLevel === '二级' ? 'bg-gray-50 ml-4' : 'bg-white'}`}>
      {/* 卡片头部 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span 
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer text-gray-500 transition-transform"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▲
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelMap[task.taskLevel]}`}>
            {task.taskLevel}
          </span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{task.taskName}</h3>
            {task.subTaskName && <p className="text-sm text-gray-500">{task.subTaskName}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between ml-8">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[realStatus]}`}>
            {realStatus}
          </span>
          <span className="text-sm font-medium text-gray-600">{task.deadline}</span>
        </div>
      </div>

      {/* 卡片详情（折叠控制） */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-gray-100 ml-8">
          <div className="flex flex-wrap gap-3 mb-2 text-sm">
            <span className="text-gray-600">{task.department}</span>
            <span className="font-medium text-gray-700">{task.handler}</span>
            <span className="ml-auto text-blue-600 font-medium cursor-pointer hover:underline">编辑</span>
          </div>
          <div>
            <span className="text-gray-500 font-medium text-sm block mb-1">办结标准：</span>
            <p className="text-gray-700 leading-relaxed text-sm">{task.finishStandard}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// 主页面
export default function SupervisePage() {
  // 搜索与筛选状态
  const [searchKey, setSearchKey] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('全部事业部');
  const [selectedLevel, setSelectedLevel] = useState('全部等级');
  const [selectedStatus, setSelectedStatus] = useState('全部状态');

  // 下拉展开状态
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // 全量任务数据（完整34条，部门/经办人/日期已匹配）
  const fullTaskData: TaskItem[] = [
    { id:1, taskLevel:'一级', taskName:'经营计划指标推进工作', subTaskName:'营业收入', baseStatus:'进行中', deadline:'2026/12/31', department:'财务管理部', handler:'王锴荫', finishStandard:'3月31日前完成商管集团整体营业收入4678万元；6月30日前完成9356万元；9月30日前完成22455万元；12月31日前完成37425.4万元' },
    { id:2, taskLevel:'一级', taskName:'经营计划指标推进工作', subTaskName:'利润总额', baseStatus:'进行中', deadline:'2026/12/31', department:'财务管理部', handler:'王锴荫', finishStandard:'3月31日前完成商管集团整体利润总额209.25万元；6月30日前完成502.19万元；9月30日前完成1004.38万元；12月31日前完成1673.97万元' },
    { id:3, taskLevel:'一级', taskName:'代管物业业绩指标推进工作', subTaskName:'代管物业营业收入', baseStatus:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'胡妍', finishStandard:'2026年完成代管物业收入29262.48万元（含奥莱492.77万元），其中：代管翔置业存量资产23596.43万元，翔业福州1327.5万元；福州空港楼外资产293.97万元；航空工业4044.58万元' },
    { id:4, taskLevel:'一级', taskName:'代管物业业绩指标推进工作', subTaskName:'代管房屋出租率', baseStatus:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'胡妍', finishStandard:'2026年代管物业房屋（含翔业国际大厦，不含砂之船奥莱项目）总可租面积918084.81㎡，对外总可租面积555493.86㎡，对外出租率85.63%' },
    { id:5, taskLevel:'一级', taskName:'代管物业业绩指标推进工作', subTaskName:'代管土地出租率', baseStatus:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'王之慧', finishStandard:'2026年代管翔业福州土地总可租面积243863.26㎡，对外总可租面积170600㎡，对外出租率17.45%' },
    { id:6, taskLevel:'一级', taskName:'五通商业新经济标杆项目打造工作', subTaskName:'五通商业新经济标杆项目打造', baseStatus:'进行中', deadline:'2026/09/30', department:'商服事业部', handler:'李晓炜', finishStandard:'9月30日前完成项目定位及规划方案，通过集团专题会并下发会议纪要' },
    { id:7, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'瀚澜楼茶博城', baseStatus:'进行中', deadline:'2026/05/31', department:'商服事业部', handler:'李泉', finishStandard:'3月31日前局部试营业；5月31日前全面试营业' },
    { id:8, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'码头二期侯船楼太合音乐', baseStatus:'进行中', deadline:'2026/05/31', department:'商服事业部', handler:'李晓炜', finishStandard:'3月31日力争试营业；5月31日正式营业' },
    { id:9, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'艾德航空产业园', baseStatus:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'姜吕斌', finishStandard:'3月31日前出租率85.5%；12月30日达90%' },
    { id:10, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'厦门国际航材中心', baseStatus:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'姜吕斌', finishStandard:'3月31日前出租率91%；12月31日达95%' },
    { id:11, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'翔业国际大厦', baseStatus:'进行中', deadline:'2026/03/31', department:'创新事业部', handler:'曹冰涛', finishStandard:'3月31日前新增招商4360㎡，出租率65%' },
    { id:12, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'海丝羲缘楼', baseStatus:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'李泉', finishStandard:'3月31日前出租率82%；12月31日达85%' },
    { id:13, taskLevel:'一级', taskName:'宠物经济项目落地实施推进工作', subTaskName:'宠物经济线下平台1.1期', baseStatus:'进行中', deadline:'2026/06/30', department:'创新事业部', handler:'曹冰涛', finishStandard:'6月30日前与首个合作方签订协议' },
    { id:14, taskLevel:'一级', taskName:'厦门市内免税店开业推进工作', subTaskName:'厦门市内免税店开业', baseStatus:'进行中', deadline:'2026/06/30', department:'免税事业部', handler:'林宇恒', finishStandard:'6月30日前完成参股运营并开业' },
    { id:15, taskLevel:'一级', taskName:'五通码头免税店开业推进工作', subTaskName:'五通码头免税店开业', baseStatus:'进行中', deadline:'2026/06/30', department:'免税事业部', handler:'林宇恒', finishStandard:'6月30日前正式营业并转入投后管理' },
    { id:16, taskLevel:'一级', taskName:'福州长乐国际机场免税店开业推进工作', subTaskName:'福州长乐国际机场免税店开业', baseStatus:'进行中', deadline:'2026/06/30', department:'免税事业部', handler:'林宇恒', finishStandard:'6月30日前根据转场进度组织开业' },
    { id:17, taskLevel:'一级', taskName:'免税牌照攻坚推进工作', subTaskName:'免税牌照攻坚工作', baseStatus:'进行中', deadline:'2026/12/20', department:'免税事业部', handler:'林宇恒', finishStandard:'12月20日前形成年度会议纪要并汇报' },
    { id:18, taskLevel:'一级', taskName:'参股投资业务经营指标推进工作', subTaskName:'参股投资业务经营业绩指标', baseStatus:'进行中', deadline:'2026/12/31', department:'免税事业部', handler:'林宇恒', finishStandard:'12月31日前实现全口径销售额18586万元' },
    { id:19, taskLevel:'一级', taskName:'五通奥莱项目经营业务推进工作', subTaskName:'经营移交', baseStatus:'进行中', deadline:'2026/06/30', department:'商服事业部', handler:'李晓炜', finishStandard:'6月30日前与砂之船完成移交' },
    { id:20, taskLevel:'一级', taskName:'五通奥莱项目经营业务推进工作', subTaskName:'经营推进', baseStatus:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'李晓炜', finishStandard:'12月31日完成双诞活动策划及执行' },
    { id:21, taskLevel:'一级', taskName:'海峡新岸仙岳路跨线桥推进工作', subTaskName:'仙岳五通跨线桥推进', baseStatus:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'周晓萍', finishStandard:'12月31日前完成外部主管部门审批' },
    { id:22, taskLevel:'一级', taskName:'商管与物管业务效能优化工作', subTaskName:'组织架构整合优化', baseStatus:'进行中', deadline:'2026/06/30', department:'党务人力行政部', handler:'林杉', finishStandard:'6月30日前完成组织架构优化并实施' },
    { id:23, taskLevel:'一级', taskName:'翔业商管与兆翔置业工作界面明确', subTaskName:'工作边界梳理、经营指明确及委托管理合同签订', baseStatus:'进行中', deadline:'2026/06/30', department:'商服事业部', handler:'胡妍', finishStandard:'6月30日前完成兆翔置业资产委托合同签订' },
    { id:24, taskLevel:'一级', taskName:'机场城市一体化推进工作', subTaskName:'机场城市一体化', baseStatus:'进行中', deadline:'2026/09/30', department:'物服事业部', handler:'林健', finishStandard:'9月30日前完成物业服务方案并通过审议' },
    { id:25, taskLevel:'一级', taskName:'“一线“高崎片区战略布局推进工作', subTaskName:'打造高崎片区文化产业新IP', baseStatus:'进行中', deadline:'2026/12/31', department:'商服事业部', handler:'李泉', finishStandard:'12月31日前举办“厦门美术季”' },
    { id:26, taskLevel:'一级', taskName:'厦泉金先行示范区战略先行布局工作', subTaskName:'“一岛”大嶝岛战略布局推进', baseStatus:'进行中', deadline:'2026/11/30', department:'免税事业部', handler:'林涛', finishStandard:'11月30日前形成阶段性研究报告' },
    { id:27, taskLevel:'一级', taskName:'翔安机场免税店转场运营推进工作', subTaskName:'翔安机场免税店转场运营', baseStatus:'进行中', deadline:'2026/12/24', department:'免税事业部', handler:'林宇恒', finishStandard:'12月24日前推进完成免税店开业运营' },
    { id:28, taskLevel:'一级', taskName:'商管集团数字化推进工作', subTaskName:'商业管理系统上线', baseStatus:'进行中', deadline:'2026/12/31', department:'财务管理部', handler:'李森元', finishStandard:'12月31日前完成ERP系统财务管理模块上线' },
    { id:29, taskLevel:'一级', taskName:'翔安机场环境保障推进工作', subTaskName:'调试勘查', baseStatus:'进行中', deadline:'2026/05/31', department:'物服事业部', handler:'林健', finishStandard:'5月31日完成机电设备全量勘查并形成总结' },
    { id:30, taskLevel:'一级', taskName:'翔安机场环境保障推进工作', subTaskName:'开荒保洁招标', baseStatus:'进行中', deadline:'2026/06/30', department:'物服事业部', handler:'林健', finishStandard:'6月30日完成中标单位最终确认' },
    { id:31, taskLevel:'一级', taskName:'翔安机场环境保障推进工作', subTaskName:'航站楼保洁、手推车招标', baseStatus:'进行中', deadline:'2026/09/30', department:'物服事业部', handler:'林健', finishStandard:'9月30日完成中标单位确认并签约' },
    { id:32, taskLevel:'一级', taskName:'翔安机场环境保障推进工作', subTaskName:'建立机电设备运维体系', baseStatus:'进行中', deadline:'2026/09/20', department:'物服事业部', handler:'林健', finishStandard:'9月20日完成运行手册定稿' },
    { id:33, taskLevel:'一级', taskName:'福州机场二期环境保障推进工作', subTaskName:'机电设备保障', baseStatus:'进行中', deadline:'2026/06/10', department:'物服事业部', handler:'林健', finishStandard:'6月10日前完成人员取证及演练整改' },
    { id:34, taskLevel:'一级', taskName:'福州机场二期环境保障推进工作', subTaskName:'物业服务保障', baseStatus:'进行中', deadline:'2026/06/10', department:'物服事业部', handler:'林健', finishStandard:'6月10日前完成保洁转场及综合演练' }
  ];

  // 自动提取去重的事业部列表
  const departmentList = useMemo(() => {
    const depts = Array.from(new Set(fullTaskData.map(item => item.department)));
    return ['全部事业部', ...depts];
  }, [fullTaskData]);

  // 顶部统计数据计算
  const stats = useMemo(() => {
    let overdue = 0;
    let expiring = 0;
    let unfinished = 0;
    const total = fullTaskData.length;

    fullTaskData.forEach(task => {
      const realStatus = getTaskRealStatus(task.deadline, task.baseStatus);
      if (realStatus === '已逾期') overdue++;
      if (realStatus === '即将到期') expiring++;
      if (realStatus !== '已完成') unfinished++;
    });

    return { overdue, expiring, unfinished, total };
  }, [fullTaskData]);

  // 多条件筛选逻辑
  const filteredTaskList = useMemo(() => {
    return fullTaskData.filter(task => {
      // 事业部筛选
      if (selectedDepartment !== '全部事业部' && task.department !== selectedDepartment) {
        return false;
      }
      // 等级筛选
      if (selectedLevel !== '全部等级' && task.taskLevel !== selectedLevel) {
        return false;
      }
      // 状态筛选
      const realStatus = getTaskRealStatus(task.deadline, task.baseStatus);
      if (selectedStatus !== '全部状态' && realStatus !== selectedStatus) {
        return false;
      }
      // 关键词搜索
      if (searchKey) {
        const key = searchKey.toLowerCase();
        const match = task.taskName.toLowerCase().includes(key)
          || task.subTaskName.toLowerCase().includes(key)
          || task.handler.toLowerCase().includes(key)
          || task.department.toLowerCase().includes(key);
        if (!match) return false;
      }
      return true;
    });
  }, [fullTaskData, selectedDepartment, selectedLevel, selectedStatus, searchKey]);

  // 点击空白关闭下拉
  useEffect(() => {
    const handleClickOutside = () => {
      setDeptDropdownOpen(false);
      setLevelDropdownOpen(false);
      setStatusDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-4 max-w-3xl mx-auto pb-10">
      {/* 页面标题 */}
      <h1 className="text-center text-xl font-bold text-gray-800 mb-4">督办系统</h1>

      {/* 顶部统计栏 */}
      <div className="bg-white rounded-xl p-4 mb-6 flex justify-around items-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-1">已逾期</p>
          <p className="text-red-500 text-xl font-bold">{stats.overdue}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-1">即将到期</p>
          <p className="text-orange-500 text-xl font-bold">{stats.expiring}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-1">未完成</p>
          <p className="text-blue-500 text-xl font-bold">{stats.unfinished}</p>
        </div>
      </div>

      {/* 督办事项标题 */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">督办事项细节</h2>
        <p className="text-gray-500">共 {stats.total} 个督办事项</p>
      </div>

      {/* 筛选区域 */}
      <div className="bg-white rounded-xl p-4 mb-4">
        {/* 事业部下拉 */}
        <div className="relative mb-3" onClick={(e) => e.stopPropagation()}>
          <button
            className="w-full py-2 px-4 border border-gray-200 rounded-lg flex items-center justify-center gap-2 text-gray-700"
            onClick={() => {
              setDeptDropdownOpen(!deptDropdownOpen);
              setLevelDropdownOpen(false);
              setStatusDropdownOpen(false);
            }}
          >
            {selectedDepartment}
            <span className="text-gray-400">◇</span>
          </button>
          {deptDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-10 max-h-40 overflow-y-auto">
              {departmentList.map(dept => (
                <div
                  key={dept}
                  className="py-2 px-4 hover:bg-gray-50 cursor-pointer text-center"
                  onClick={() => {
                    setSelectedDepartment(dept);
                    setDeptDropdownOpen(false);
                  }}
                >
                  {dept}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 等级下拉 */}
        <div className="relative mb-3" onClick={(e) => e.stopPropagation()}>
          <button
            className="w-full py-2 px-4 border border-gray-200 rounded-lg flex items-center justify-center gap-2 text-gray-700"
            onClick={() => {
              setLevelDropdownOpen(!levelDropdownOpen);
              setDeptDropdownOpen(false);
              setStatusDropdownOpen(false);
            }}
          >
            {selectedLevel}
            <span className="text-gray-400">◇</span>
          </button>
          {levelDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
              {['全部等级', '一级', '二级'].map(level => (
                <div
                  key={level}
                  className="py-2 px-4 hover:bg-gray-50 cursor-pointer text-center"
                  onClick={() => {
                    setSelectedLevel(level);
                    setLevelDropdownOpen(false);
                  }}
                >
                  {level}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 状态下拉 */}
        <div className="relative mb-4" onClick={(e) => e.stopPropagation()}>
          <button
            className="w-full py-2 px-4 border border-gray-200 rounded-lg flex items-center justify-center gap-2 text-gray-700"
            onClick={() => {
              setStatusDropdownOpen(!statusDropdownOpen);
              setDeptDropdownOpen(false);
              setLevelDropdownOpen(false);
            }}
          >
            {selectedStatus}
            <span className="text-gray-400">◇</span>
          </button>
          {statusDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
              {['全部状态', '进行中', '即将到期', '已逾期', '已完成'].map(status => (
                <div
                  key={status}
                  className="py-2 px-4 hover:bg-gray-50 cursor-pointer text-center"
                  onClick={() => {
                    setSelectedStatus(status);
                    setStatusDropdownOpen(false);
                  }}
                >
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="搜索关键词..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 任务列表 */}
      <div className="space-y-2">
        {filteredTaskList.length > 0 ? (
          filteredTaskList.map(task => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl">暂无匹配的督办事项</div>
        )}
      </div>
    </main>
  );
}
