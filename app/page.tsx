'use client';
import { useState, useEffect, useMemo, useRef } from 'react';

// 登录弹窗组件
const LoginModal = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'jiandu' && password === '000000') {
      localStorage.setItem('isSuperviseLoggedIn', 'true');
      onLogin(true);
      setError('');
    } else {
      setError('账号或密码错误');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-6">督办系统登录</h2>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">账号</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="请输入账号"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="请输入密码"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          登录
        </button>
      </div>
    </div>
  );
};

// 任务卡片组件
const TaskCard = ({ task, onUpdate, isLoggedIn }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...task });

  // 样式映射
  const statusMap = {
    '进行中': 'bg-blue-50 text-blue-600',
    '即将到期': 'bg-orange-50 text-orange-600',
    '已完成': 'bg-green-50 text-green-600',
    '未完成': 'bg-gray-100 text-gray-600',
    '已逾期': 'bg-red-50 text-red-600',
  };
  const levelMap = {
    '一级': 'bg-purple-50 text-purple-600',
    '二级': 'bg-green-50 text-green-600',
    '三级': 'bg-orange-50 text-orange-600',
  };

  // 修改截止日期/办结标准时，自动重新计算状态
  useEffect(() => {
    const newStatus = getDefaultTaskStatus(editData.deadline, editData.finishStandard);
    setEditData(prev => ({
      ...prev,
      status: newStatus,
      isStatusLocked: false
    }));
  }, [editData.deadline, editData.finishStandard]);

  // 保存编辑
  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };
  // 取消编辑
  const handleCancel = () => {
    setEditData({ ...task });
    setIsEditing(false);
  };

  // 判断是否需要显示逾期警告
  const showWarning = task.status === '已逾期' || task.status === '即将到期' || task.status === '未完成';

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-3">
      <div className="flex items-center gap-3">
        <span 
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer text-gray-400 transition-transform select-none"
        >
          {isExpanded ? '∨' : '>'}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelMap[task.taskLevel]}`}>
          {task.taskLevel}
        </span>
        
        {!isEditing ? (
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{task.taskName}</h3>
            {task.subTaskName && <p className="text-sm text-gray-500">{task.subTaskName}</p>}
          </div>
        ) : (
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={editData.taskName}
              onChange={(e) => setEditData({ ...editData, taskName: e.target.value })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
            />
            <input
              type="text"
              value={editData.subTaskName}
              onChange={(e) => setEditData({ ...editData, subTaskName: e.target.value })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
            />
          </div>
        )}

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusMap[task.status]}`}>
            {task.status}
          </span>
          <span className="text-sm font-medium text-gray-600 whitespace-nowrap">{task.deadline}</span>
          {showWarning && <span className="text-red-500">⚠️</span>}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-gray-100 ml-6">
          <div className="flex flex-wrap gap-3 mb-3 text-sm items-center">
            <span className="text-gray-600">{task.department}</span>
            <span className="font-medium text-gray-700">· {task.handler}</span>

            {isLoggedIn && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="ml-auto text-blue-600 font-medium cursor-pointer hover:underline bg-transparent border-none p-0"
              >
                编辑
              </button>
            )}

            {isEditing && (
              <div className="ml-auto flex gap-3">
                <button onClick={handleCancel} className="text-gray-500 cursor-pointer bg-transparent border-none p-0">取消</button>
                <button onClick={handleSave} className="text-blue-600 font-medium cursor-pointer bg-transparent border-none p-0">保存</button>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <span className="text-gray-500 font-medium text-sm block mb-1">部门</span>
                <input
                  value={editData.department}
                  onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <span className="text-gray-500 font-medium text-sm block mb-1">负责人</span>
                <input
                  value={editData.handler}
                  onChange={(e) => setEditData({ ...editData, handler: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          )}

          {isEditing && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <span className="text-gray-500 font-medium text-sm block mb-1">任务状态</span>
                <select
                  value={editData.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setEditData(prev => ({
                      ...prev,
                      status: newStatus,
                      isStatusLocked: true
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="进行中">进行中</option>
                  <option value="已完成">已完成</option>
                  <option value="未完成">未完成</option>
                  <option value="已逾期">已逾期</option>
                  <option value="即将到期">即将到期</option>
                </select>
                {editData.isStatusLocked && (
                  <p className="text-xs text-gray-400 mt-1">已锁定，修改截止日期将自动解锁</p>
                )}
              </div>
              <div>
                <span className="text-gray-500 font-medium text-sm block mb-1">截止日期</span>
                <input
                  type="text"
                  value={editData.deadline}
                  onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="例：2026/12/31"
                />
              </div>
            </div>
          )}

          {!isEditing ? (
            <>
              <div className="mb-3">
                <span className="text-gray-500 font-medium text-sm block mb-1">办结标准：</span>
                <p className="text-gray-700 leading-relaxed text-sm">{task.finishStandard}</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium text-sm block mb-1">情况说明：</span>
                <p className="text-gray-700 leading-relaxed text-sm">{task.description || '暂无说明'}</p>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 font-medium text-sm block mb-1">办结标准：</span>
                <textarea
                  value={editData.finishStandard}
                  onChange={(e) => setEditData({ ...editData, finishStandard: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm min-h-[80px]"
                />
              </div>
              <div>
                <span className="text-gray-500 font-medium text-sm block mb-1">情况说明：</span>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="请补充情况说明"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm min-h-[80px]"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 核心工具函数
const getBeijingDate = () => {
  const now = new Date();
  const utcTimestamp = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const beijingTimestamp = utcTimestamp + 8 * 60 * 60 * 1000;
  return new Date(beijingTimestamp);
};

const getDefaultTaskStatus = (deadlineStr, finishStandard) => {
  const today = getBeijingDate();
  today.setHours(0, 0, 0, 0);

  const formatDeadline = deadlineStr.replace(/\//g, '-');
  const deadline = new Date(formatDeadline);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 0-7天为即将到期（严格遵循你的需求）
  if (diffDays >= 0 && diffDays <= 7) {
    return '即将到期';
  }
  if (diffDays < 0) {
    const hasNumberTarget = /\d+(\.\d+)?/.test(finishStandard);
    return hasNumberTarget ? '未完成' : '已逾期';
  }
  return '进行中';
};

// 首页主组件
export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [searchKey, setSearchKey] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('全部事业部');
  const [selectedLevel, setSelectedLevel] = useState('全部等级');
  const [selectedStatus, setSelectedStatus] = useState('全部状态');

  const [deptOpen, setDeptOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const deptRef = useRef(null);
  const levelRef = useRef(null);
  const statusRef = useRef(null);

  // 全量任务初始数据
  const defaultTaskData = [
    { id:1, taskLevel:'一级', taskName:'经营计划指标推进工作', subTaskName:'营业收入', status:'进行中', isStatusLocked: false, deadline:'2026/12/31', department:'财务管理部', handler:'王锴荫', finishStandard:'3月31日前完成商管集团整体营业收入4678万元；6月30日前完成9356万元；9月30日前完成22455万元；12月31日前完成37425.4万元', description:'暂无说明' },
    { id:2, taskLevel:'一级', taskName:'经营计划指标推进工作', subTaskName:'利润总额', status:'进行中', isStatusLocked: false, deadline:'2026/12/31', department:'财务管理部', handler:'王锴荫', finishStandard:'3月31日前完成商管集团整体利润总额209.25万元；6月30日前完成502.19万元；9月30日前完成1004.38万元；12月31日前完成1673.97万元', description:'暂无说明' },
    { id:3, taskLevel:'一级', taskName:'代管物业业绩指标推进工作', subTaskName:'代管物业营业收入', status:'进行中', isStatusLocked: false, deadline:'2026/12/31', department:'商服事业部', handler:'胡妍', finishStandard:'2026年完成代管物业收入29262.48万元（含奥莱492.77万元），其中：代管翔置业存量资产23596.43万元，翔业福州1327.5万元；福州空港楼外资产293.97万元；航空工业4044.58万元', description:'暂无说明' },
    { id:4, taskLevel:'一级', taskName:'代管物业业绩指标推进工作', subTaskName:'代管房屋出租率', status:'进行中', isStatusLocked: false, deadline:'2026/12/31', department:'商服事业部', handler:'胡妍', finishStandard:'2026年代管物业房屋（含翔业国际大厦，不含砂之船奥莱项目）总可租面积918084.81㎡，对外总可租面积555493.86㎡，对外出租率85.63%', description:'暂无说明' },
    { id:5, taskLevel:'一级', taskName:'代管物业业绩指标推进工作', subTaskName:'代管土地出租率', status:'进行中', isStatusLocked: false, deadline:'2026/12/31', department:'商服事业部', handler:'王之慧', finishStandard:'2026年代管翔业福州土地总可租面积243863.26㎡，对外总可租面积170600㎡，对外出租率17.45%', description:'暂无说明' },
    { id:6, taskLevel:'一级', taskName:'五通商业新经济标杆项目打造工作', subTaskName:'五通商业新经济标杆项目打造', status:'进行中', isStatusLocked: false, deadline:'2026/09/30', department:'商服事业部', handler:'李晓炜', finishStandard:'9月30日前完成项目定位及规划方案，通过集团专题会并下发会议纪要', description:'暂无说明' },
    { id:7, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'瀚澜楼茶博城', status:'即将到期', isStatusLocked: false, deadline:'2026/05/31', department:'商服事业部', handler:'李泉', finishStandard:'3月31日前局部试营业；5月31日前全面试营业', description:'暂无说明' },
    { id:8, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'码头二期侯船楼太合音乐', status:'即将到期', isStatusLocked: false, deadline:'2026/05/31', department:'商服事业部', handler:'李晓炜', finishStandard:'3月31日力争试营业；5月31日正式营业', description:'暂无说明' },
    { id:9, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'艾德航空产业园', status:'进行中', isStatusLocked: false, deadline:'2026/12/31', department:'商服事业部', handler:'姜吕斌', finishStandard:'3月31日前出租率85.5%；12月30日达90%', description:'暂无说明' },
    { id:10, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'厦门国际航材中心', status:'进行中', isStatusLocked: false, deadline:'2026/12/31', department:'商服事业部', handler:'姜吕斌', finishStandard:'3月31日前出租率91%；12月31日达95%', description:'暂无说明' },
    { id:11, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'翔业国际大厦', status:'即将到期', isStatusLocked: false, deadline:'2026/03/31', department:'创新事业部', handler:'曹冰涛', finishStandard:'3月31日前新增招商4360㎡，出租率65%', description:'2月28日已汇总并提交业主单位预审，待汇报定稿' },
    { id:12, taskLevel:'一级', taskName:'重点项目载体去化工作', subTaskName:'海丝羲缘楼', status:'进行中', isStatusLocked: false, deadline:'2026/12/31', department:'商服事业部', handler:'李泉', finishStandard:'3月31日前出租率82%；12月31日达85%', description:'暂无说明' },
    { id:13, taskLevel:'一级', taskName:'宠物经济项目落地实施推进工作', subTaskName:'宠物经济线下平台1.1期', status:'即将到期', isStatusLocked: false, deadline:'2026/06/30', department:'创新事业部', handler:'曹冰涛', finishStandard:'6月30日前与首个合作方签订协议', description:'暂无说明' },
    { id:14, taskLevel:'一级', taskName:'厦门市内免税店开业推进工作', subTaskName:'厦门市内免税店开业', status:'即将到期', isStatusLocked: false, deadline:'2026/06/30', department:'免税事业部', handler:'林宇恒', finishStandard:'6月30日前完成参股运营并开业', description:'暂无说明' },
    { id:15, taskLevel:'一级', taskName:'五通码头免税店开业推进工作', subTaskName:'五通码头免税店开业', status:'即将到期', isStatusLocked: false, deadline:'2026/06/30', department:'免税事业部', handler:'林宇恒', finishStandard:'6月30日前正式营业并转入投后管理', description:'暂无说明' },
    { id:16, taskLevel:'一级', taskName:'福州长乐国际机场免税店开业推进工作', subTaskName:'福州长乐国际机场免税店开业', status:'即将到期', isStatusLocked: false, deadline:'2026/06/30', department:'免税事业部', handler:'林宇恒', finishStandard:'6月30日前根据转场进度组织开业', description:'暂无说明' },
    { id:17, taskLevel:'一级', taskName:'免税牌照攻坚推进工作', subTaskName:'免税牌照攻坚工作', status:'进行中', isStatusLocked: false, deadline:'2026/12/20', department:'免税事业部', handler:'林宇恒', finishStandard:'12月20日前形成年度会议纪要并汇报', description:'暂无说明' },
    { id:18, taskLevel:'一级', taskName:'参股投资业务经营指标推进工作', subTaskName:'参股投资业务经营业绩指标', status:'进行中', isStatusLocked: false, deadline:'2026/12/31', department:'免税事业部', handler:'林宇恒', finishStandard:'12月31日前实现全口径销售额18586万元', description:'暂无说明' },
    { id:19, taskLevel:'一级', taskName:'五通奥莱项目经营业务推进工作', subTaskName:'经营移交', status:'即将到期', isStatusLocked: false, deadline:'2026/06/30', department:'商服事业部', handler:'李晓炜', finishStandard:'6月30日前与砂之船完成移交', description:'暂无说明' },
    { id:20, taskLevel:'一级', taskName:'五通奥莱项目经营业务推进工作', subTaskName:'经营推进', status:'进行中', isStatusLocked: false, deadline:'2026/12/31', department:'商服事业部', handler:'李晓炜', finishStandard:'12月31日完成双诞活动策划及执行', description:'暂无说明' },
    { id:21, taskLevel:'一级', taskName:'海峡新岸仙岳路跨线桥推进工作', subTaskName:'仙岳五通跨线桥推进', status:'进行中', isStatusLocked: false, deadline:'2026/12/31', department:'商服事业部', handler:'周晓萍', finishStandard:'12月31日前完成外部主管部门审批', description:'暂无说明' },
    { id:22, taskLevel:'一级', taskName:'商管与物管业务效能优化工作', subTaskName:'组织架构整合优化', status:'即将到期', isStatusLocked: false, deadline:'2026/06/30', department:'党务人力行政部', handler:'林杉', finishStandard:'6月30日前完成组织架构优化并实施', description:'暂无说明' },
    { id:23, taskLevel:'一级', taskName:'翔业商管与兆翔置业工作界面明确', subTaskName:'工作边界梳理、经营指明确及委托管理合同签订', status:'即将到期', isStatusLocked: false, deadline:'2026/06/30', department:'商服事业部', handler:'胡妍', finishStandard:'6月30日前完成兆翔置业资产委托合同签订', description:'暂无说明' },
    { id:24, taskLevel:'一级', taskName:'机场城市一体化推进工作', subTaskName:'机场城市一体化', status:'进行中', isStatusLocked: false, deadline:'2026/09/30', department:'物服事业部', handler:'林健', finishStandard:'9月30日前完成物业服务方案并通过审议', description:'暂无说明' },
    { id:25, taskLevel:'一级', taskName:'“一线“高崎片区战略布局推进工作', subTaskName:'打造高崎片区文化产业新IP', status:'进行中', isStatusLocked: false, deadline:'2026/12/31', department:'商服事业部', handler:'李泉', finishStandard:'12月31日前举办“厦门美术季”', description:'暂无说明' },
    { id:26, taskLevel:'一级', taskName:'厦泉金先行示范区战略先行布局工作', subTaskName:'“一岛”大嶝岛战略布局推进', status:'进行中', isStatusLocked: false, deadline:'2026/11/30', department:'免税事业部', handler:'林涛', finishStandard:'11月30日前形成阶段性研究报告', description:'暂无说明' },
    { id:27, taskLevel:'一级', taskName:'翔安机场免税店转场运营推进工作', subTaskName:'翔安机场免税店转场运营', status:'进行中', isStatusLocked: false, deadline:'2026/12/24', department:'免税事业部', handler:'林宇恒', finishStandard:'12月24日前推进完成免税店开业运营', description:'暂无说明' },
    { id:28, taskLevel:'一级', taskName:'商管集团数字化推进工作', subTaskName:'商业管理系统上线', status:'进行中', isStatusLocked: false, deadline:'2026/12/31', department:'财务管理部', handler:'李森元', finishStandard:'12月31日前完成ERP系统财务管理模块上线', description:'暂无说明' },
    { id:29, taskLevel:'一级', taskName:'翔安机场环境保障推进工作', subTaskName:'调试勘查', status:'即将到期', isStatusLocked: false, deadline:'2026/05/31', department:'物服事业部', handler:'林健', finishStandard:'5月31日完成机电设备全量勘查并形成总结', description:'暂无说明' },
    { id:30, taskLevel:'一级', taskName:'翔安机场环境保障推进工作', subTaskName:'开荒保洁招标', status:'即将到期', isStatusLocked: false, deadline:'2026/06/30', department:'物服事业部', handler:'林健', finishStandard:'6月30日完成中标单位最终确认', description:'暂无说明' },
    { id:31, taskLevel:'一级', taskName:'翔安机场环境保障推进工作', subTaskName:'航站楼保洁、手推车招标', status:'进行中', isStatusLocked: false, deadline:'2026/09/30', department:'物服事业部', handler:'林健', finishStandard:'9月30日完成中标单位确认并签约', description:'暂无说明' },
    { id:32, taskLevel:'一级', taskName:'翔安机场环境保障推进工作', subTaskName:'建立机电设备运维体系', status:'进行中', isStatusLocked: false, deadline:'2026/09/20', department:'物服事业部', handler:'林健', finishStandard:'9月20日完成运行手册定稿', description:'暂无说明' },
    { id:33, taskLevel:'一级', taskName:'福州机场二期环境保障推进工作', subTaskName:'机电设备保障', status:'即将到期', isStatusLocked: false, deadline:'2026/06/10', department:'物服事业部', handler:'林健', finishStandard:'6月10日前完成人员取证及演练整改', description:'暂无说明' },
    { id:34, taskLevel:'一级', taskName:'福州机场二期环境保障推进工作', subTaskName:'物业服务保障', status:'即将到期', isStatusLocked: false, deadline:'2026/06/10', department:'物服事业部', handler:'林健', finishStandard:'6月10日前完成保洁转场及综合演练', description:'暂无说明' },
  ];

  const [taskList, setTaskList] = useState([]);

  // 页面初始化时自动更新任务状态
  useEffect(() => {
    const loggedIn = localStorage.getItem('isSuperviseLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    const savedTasks = localStorage.getItem('superviseTaskList');
    let initialTasks = savedTasks ? JSON.parse(savedTasks) : defaultTaskData;

    const tasksWithUpdatedStatus = initialTasks.map(task => {
      if (task.isStatusLocked) return task;
      const newStatus = getDefaultTaskStatus(task.deadline, task.finishStandard);
      return { ...task, status: newStatus, isStatusLocked: false };
    });

    setTaskList(tasksWithUpdatedStatus);
    localStorage.setItem('superviseTaskList', JSON.stringify(tasksWithUpdatedStatus));
  }, []);

  // 任务数据变化时同步到本地存储
  useEffect(() => {
    if (taskList.length > 0) {
      localStorage.setItem('superviseTaskList', JSON.stringify(taskList));
    }
  }, [taskList]);

  // 每天0点自动刷新任务状态
  useEffect(() => {
    const now = getBeijingDate();
    const nextMidnight = new Date(now);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);
    const timeToMidnight = nextMidnight.getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      setTaskList(prev => {
        const updatedTasks = prev.map(task => {
          if (task.isStatusLocked) return task;
          const newStatus = getDefaultTaskStatus(task.deadline, task.finishStandard);
          return { ...task, status: newStatus };
        });
        localStorage.setItem('superviseTaskList', JSON.stringify(updatedTasks));
        return updatedTasks;
      });
    }, timeToMidnight);

    return () => clearTimeout(midnightTimer);
  }, [taskList]);

  // 自动提取事业部列表
  const departmentList = useMemo(() => {
    const depts = Array.from(new Set(taskList.map(item => item.department)));
    return ['全部事业部', ...depts];
  }, [taskList]);

  const levelList = ['全部等级', '一级', '二级', '三级'];
  const statusList = ['全部状态', '进行中', '已完成', '未完成', '已逾期', '即将到期'];

  // 顶部统计数据
  const stats = useMemo(() => {
    const total = taskList.length;
    let doing = 0;
    let finished = 0;
    let overdue = 0;
    let expiring = 0;
    let unfinished = 0;

    taskList.forEach(task => {
      if (task.status === '进行中') doing++;
      if (task.status === '已完成') finished++;
      if (task.status === '已逾期') overdue++;
      if (task.status === '即将到期') expiring++;
      if (task.status !== '已完成') unfinished++;
    });

    return { total, doing, finished, overdue, expiring, unfinished };
  }, [taskList]);

  // 多条件筛选
  const filteredTaskList = useMemo(() => {
    return taskList.filter(task => {
      if (selectedDepartment !== '全部事业部' && task.department !== selectedDepartment) return false;
      if (selectedLevel !== '全部等级' && task.taskLevel !== selectedLevel) return false;
      if (selectedStatus !== '全部状态' && task.status !== selectedStatus) return false;
      if (searchKey) {
        const key = searchKey.toLowerCase();
        const match = task.taskName.toLowerCase().includes(key)
          || task.subTaskName.toLowerCase().includes(key)
          || task.handler.toLowerCase().includes(key)
          || task.department.toLowerCase().includes(key)
          || task.description.toLowerCase().includes(key);
        if (!match) return false;
      }
      return true;
    });
  }, [taskList, selectedDepartment, selectedLevel, selectedStatus, searchKey]);

  // 更新任务数据
  const handleUpdateTask = (updatedTask) => {
    setTaskList(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (deptRef.current && !deptRef.current.contains(e.target)) {
        setDeptOpen(false);
      }
      if (levelRef.current && !levelRef.current.contains(e.target)) {
        setLevelOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-700 to-blue-600">
      {showLoginModal && <LoginModal onLogin={(success) => {
        setIsLoggedIn(success);
        setShowLoginModal(false);
      }} />}

      <div className="p-4 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">商管督办通</h1>
          {!isLoggedIn ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-white text-blue-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100"
            >
              登录编辑
            </button>
          ) : (
            <button
              onClick={() => {
                if(confirm('确定要退出登录吗？')) {
                  localStorage.removeItem('isSuperviseLoggedIn');
                  window.location.reload();
                }
              }}
              className="bg-white/20 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30"
            >
              退出登录
            </button>
          )}
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl p-6 w-full">
          <div className="grid grid-cols-2 gap-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-base">总数</span>
              <span className="text-xl font-bold text-gray-800">{stats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-base">进行中</span>
              <span className="text-xl font-bold text-blue-600">{stats.doing}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-base">已完成</span>
              <span className="text-xl font-bold text-green-600">{stats.finished}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-base">已逾期</span>
              <span className="text-xl font-bold text-red-600">{stats.overdue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-base">即将到期</span>
              <span className="text-xl font-bold text-orange-600">{stats.expiring}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-base">未完成</span>
              <span className="text-xl font-bold text-purple-600">{stats.unfinished}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-t-3xl min-h-screen p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">督办事项细节</h2>
          <p className="text-gray-500">共 {filteredTaskList.length} 个督办事项</p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative" ref={deptRef}>
              <button
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg flex items-center gap-2 text-gray-800 min-w-[140px] shadow-sm"
                onClick={() => {
                  setDeptOpen(!deptOpen);
                  setLevelOpen(false);
                  setStatusOpen(false);
                }}
              >
                {selectedDepartment}
                <span className="text-gray-400 ml-auto">∨</span>
              </button>
              {deptOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-48 overflow-y-auto min-w-[140px]">
                  {departmentList.map(dept => (
                    <div
                      key={dept}
                      className={`py-3 px-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between
                        ${selectedDepartment === dept ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-700'}`}
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setDeptOpen(false);
                      }}
                    >
                      {dept}
                      {selectedDepartment === dept && <span className="text-gray-500">✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={levelRef}>
              <button
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg flex items-center gap-2 text-gray-800 min-w-[120px] shadow-sm"
                onClick={() => {
                  setLevelOpen(!levelOpen);
                  setDeptOpen(false);
                  setStatusOpen(false);
                }}
              >
                {selectedLevel}
                <span className="text-gray-400 ml-auto">∨</span>
              </button>
              {levelOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50 min-w-[120px]">
                  {levelList.map(level => (
                    <div
                      key={level}
                      className={`py-3 px-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between
                        ${selectedLevel === level ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-700'}`}
                      onClick={() => {
                        setSelectedLevel(level);
                        setLevelOpen(false);
                      }}
                    >
                      {level}
                      {selectedLevel === level && <span className="text-gray-500">✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={statusRef}>
              <button
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg flex items-center gap-2 text-gray-800 min-w-[120px] shadow-sm"
                onClick={() => {
                  setStatusOpen(!statusOpen);
                  setDeptOpen(false);
                  setLevelOpen(false);
                }}
              >
                {selectedStatus}
                <span className="text-gray-400 ml-auto">∨</span>
              </button>
              {statusOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50 min-w-[120px]">
                  {statusList.map(status => (
                    <div
                      key={status}
                      className={`py-3 px-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between
                        ${selectedStatus === status ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-700'}`}
                      onClick={() => {
                        setSelectedStatus(status);
                        setStatusOpen(false);
                      }}
                    >
                      {status}
                      {selectedStatus === status && <span className="text-gray-500">✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="搜索关键词..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pb-10">
          {filteredTaskList.length > 0 ? (
            filteredTaskList.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onUpdate={handleUpdateTask} 
                isLoggedIn={isLoggedIn} 
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl">暂无匹配的督办事项</div>
          )}
        </div>
      </div>
    </main>
  );
}
