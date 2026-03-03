'use client'
import { useState, useMemo, useEffect } from 'react'

// 核心类型定义
type TaskLevel = '一级' | '二级' | '三级'
type TaskStatus = '进行中' | '已完成' | '未完成' | '已逾期' | '即将到期'

interface TaskItem {
  id: string
  level: TaskLevel
  title: string
  baseStatus: '进行中' | '已完成' // 基础状态，用于动态计算衍生状态
  deadline: string // 格式：YYYY/MM/DD
  department: string
  person: string
  finishStandard: string
  description?: string
  children?: TaskItem[]
}

// 扩展任务数据（补充更多样例，适配状态计算）
const initialTaskData: TaskItem[] = [
  {
    id: 'task-1',
    level: '一级',
    title: '重点项目载体去化',
    baseStatus: '进行中',
    deadline: '2026/3/31',
    department: '创新事业部',
    person: '曹冰涛',
    finishStandard: '3月31日前完成新增招商面积4360，出租率65%(新增5%)',
    children: [
      {
        id: 'task-1-1',
        level: '二级',
        title: '新增客户储备',
        baseStatus: '进行中',
        deadline: '2026/3/25',
        department: '创新事业部',
        person: '曹冰涛',
        finishStandard: '完成15组意向客户线索收集',
        children: [
          {
            id: 'task-1-1-1',
            level: '三级',
            title: '打造三端产品',
            baseStatus: '进行中',
            deadline: '2026/3/20',
            department: '创新事业部',
            person: '康丹霞',
            finishStandard: '对政府端、项目端、客户端形成定制化产品包，并完成首个产品包下发和迭代',
          },
          {
            id: 'task-1-1-2',
            level: '三级',
            title: '互联网产业圈层挖掘',
            baseStatus: '进行中',
            deadline: '2026/4/5',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '围绕厦门互联网经济型企业展开专项拓客，收集5家意向企业，与人力负责人建立直接对接关系',
          },
          {
            id: 'task-1-1-3',
            level: '三级',
            title: '对厦门全市航空企业办公地点进行摸排',
            baseStatus: '已完成',
            deadline: '2026/3/10',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '对类似国泰航空等航司进行系统性盘点，对无自建办公楼的航司进行拜访争取',
            description: '已完成全市23家航空企业摸排，形成台账',
          },
        ]
      },
      {
        id: 'task-1-2',
        level: '二级',
        title: '存量客户签约',
        baseStatus: '进行中',
        deadline: '2026/3/18',
        department: '创新事业部',
        person: '林飞',
        finishStandard: '3月31日前完成新增招商面积4360，出租率65%(新增5%)',
        children: [
          {
            id: 'task-1-2-1',
            level: '三级',
            title: '山西证券签约',
            baseStatus: '进行中',
            deadline: '2026/3/15',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '完成山西证券(691.41㎡) 的合同签约，累计新增签约面积2137.24㎡',
          },
          {
            id: 'task-1-2-2',
            level: '三级',
            title: '稿定签约',
            baseStatus: '已完成',
            deadline: '2026/3/5',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '完成稿定(2235m²) 的合同签约，累计新增签约面积4372.24m²',
            description: '合同已签约且押金已到账',
          },
        ]
      }
    ]
  },
  {
    id: 'task-2',
    level: '一级',
    title: '战略规划',
    baseStatus: '进行中',
    deadline: '2026/3/20',
    department: '商服事业部',
    person: '连甘草',
    finishStandard: '完成商服事业部十五五战略报告',
    description: '报告已完成并提报商管集团汇报。下一步根据集团领导要求，对科技商服进行落地路径的研究与讨论。',
    children: [
      {
        id: 'task-2-1',
        level: '二级',
        title: '战略规划编制',
        baseStatus: '进行中',
        deadline: '2026/3/17',
        department: '物业事业部',
        person: '张振铭',
        finishStandard: '完成战略规划编制并通过商管集团审批。',
      },
      {
        id: 'task-2-2',
        level: '二级',
        title: '福州机场航站楼服务产品打造',
        baseStatus: '进行中',
        deadline: '2026/3/22',
        department: '物业事业部',
        person: '张振铭',
        finishStandard: '完成服务产品方案初稿并提交评审。',
      },
    ]
  },
  {
    id: 'task-3',
    level: '一级',
    title: '资产一项一策',
    baseStatus: '进行中',
    deadline: '2026/2/28',
    department: '商服事业部',
    person: '连甘草',
    finishStandard: '完成2026年资产一项一策方案定稿',
    description: '2月28日已汇总提交业主单位预审，待最终定稿。',
  }
]

// 样式映射
const levelColorMap: Record<TaskLevel, string> = {
  '一级': 'bg-purple-100 text-purple-700',
  '二级': 'bg-green-100 text-green-700',
  '三级': 'bg-orange-100 text-orange-700',
}

const statusColorMap: Record<TaskStatus, string> = {
  '进行中': 'bg-blue-100 text-blue-700',
  '已完成': 'bg-green-100 text-green-700',
  '未完成': 'bg-yellow-100 text-yellow-700',
  '已逾期': 'bg-red-100 text-red-700',
  '即将到期': 'bg-amber-100 text-amber-700',
}

// 工具函数：日期差计算（天）
const getDayDiff = (targetDateStr: string): number => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const targetDate = new Date(targetDateStr)
  targetDate.setHours(0, 0, 0, 0)
  const diffTime = targetDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// 工具函数：动态计算任务最终状态
const getFinalTaskStatus = (task: TaskItem): TaskStatus => {
  if (task.baseStatus === '已完成') return '已完成'
  
  const dayDiff = getDayDiff(task.deadline)
  if (dayDiff < 0) return '已逾期'
  if (dayDiff <= 7) return '即将到期'
  return '进行中'
}

export default function SuperviseSystem() {
  // 登录状态管理
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // 任务数据管理（支持编辑）
  const [taskData, setTaskData] = useState<TaskItem[]>(initialTaskData)
  // 筛选条件
  const [searchKeyword, setSearchKeyword] = useState('')
  const [deptFilter, setDeptFilter] = useState('全部')
  const [levelFilter, setLevelFilter] = useState<'全部' | TaskLevel>('全部')
  const [statusFilter, setStatusFilter] = useState<'全部' | TaskStatus>('全部')
  // 展开/编辑状态
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(taskData.map(item => item.id)))
  const [descExpandedIds, setDescExpandedIds] = useState<Set<string>>(new Set())
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null)

  // 🔴 新增：递归统计总任务数（包含所有子任务）
  const totalTaskCount = useMemo(() => {
    const countTasks = (tasks: TaskItem[]): number => {
      return tasks.reduce((total, task) => {
        // 每个任务本身算1个，再加上子任务的数量
        return total + 1 + (task.children ? countTasks(task.children) : 0)
      }, 0)
    }
    return countTasks(taskData)
  }, [taskData])

  // 登录逻辑
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'jiandu' && password === '000000') {
      setIsLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('账号或密码错误')
    }
  }

  // 展开/折叠切换
  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds)
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id)
    setExpandedIds(newExpanded)
  }

  // 详情展开/折叠
  const toggleDescExpand = (id: string) => {
    const newExpanded = new Set(descExpandedIds)
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id)
    setDescExpandedIds(newExpanded)
  }

  // 打开编辑弹窗
  const openEditModal = (task: TaskItem) => {
    setEditingTask({ ...task })
  }

  // 保存编辑内容
  const saveEdit = () => {
    if (!editingTask) return
    // 递归更新任务数据
    const updateTask = (tasks: TaskItem[]): TaskItem[] => {
      return tasks.map(task => {
        if (task.id === editingTask!.id) {
          return editingTask!
        }
        if (task.children) {
          return { ...task, children: updateTask(task.children) }
        }
        return task
      })
    }
    setTaskData(updateTask(taskData))
    setEditingTask(null)
  }

  // 动态筛选与状态计算
  const filteredData = useMemo(() => {
    const filterTask = (tasks: TaskItem[]): TaskItem[] => {
      return tasks.filter(task => {
        const finalStatus = getFinalTaskStatus(task)
        // 关键词匹配
        const matchKeyword = searchKeyword === '' 
          ? true 
          : task.title.includes(searchKeyword) 
            || task.person.includes(searchKeyword)
            || task.department.includes(searchKeyword)
            || task.finishStandard.includes(searchKeyword)
            || (task.description && task.description.includes(searchKeyword))
        
        // 事业部匹配
        const matchDept = deptFilter === '全部' ? true : task.department === deptFilter

        // 等级匹配
        const matchLevel = levelFilter === '全部' ? true : task.level === levelFilter

        // 状态匹配
        const matchStatus = statusFilter === '全部' ? true : finalStatus === statusFilter

        // 子项匹配
        const hasMatchChildren = task.children ? filterTask(task.children).length > 0 : false

        return (matchKeyword && matchDept && matchLevel && matchStatus) || hasMatchChildren
      }).map(task => {
        if (!task.children) return task
        return { ...task, children: filterTask(task.children) }
      })
    }
    return filterTask(taskData)
  }, [searchKeyword, deptFilter, levelFilter, statusFilter, taskData])

  // 统计数据（已逾期/即将到期/未完成）
  const stats = useMemo(() => {
    let overdue = 0
    let soonExpire = 0
    let unfinished = 0

    const countStats = (tasks: TaskItem[]) => {
      tasks.forEach(task => {
        const finalStatus = getFinalTaskStatus(task)
        if (finalStatus === '已逾期') overdue++
        if (finalStatus === '即将到期') soonExpire++
        if (finalStatus === '进行中') unfinished++

        if (task.children) countStats(task.children)
      })
    }

    countStats(taskData)
    return { overdue, soonExpire, unfinished }
  }, [taskData])

  // 递归渲染任务项
  const renderTaskItem = (task: TaskItem, level: number = 0) => {
    const finalStatus = getFinalTaskStatus(task)
    const isExpanded = expandedIds.has(task.id)
    const isDescExpanded = descExpandedIds.has(task.id)
    const hasChildren = task.children && task.children.length > 0

    return (
      <div key={task.id} className={`mb-4 ${level > 0 ? 'ml-6' : ''}`}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-start gap-3 mb-2">
            {/* 展开箭头 */}
            <button 
              onClick={() => toggleExpand(task.id)}
              className={`mt-1 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* 级别标签 */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColorMap[task.level]}`}>
              {task.level}
            </span>

            {/* 标题与操作 */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
              <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
                <span>{task.department}</span>
                <span>·</span>
                <span>{task.person}</span>
              </div>
              {/* 编辑按钮（登录后显示） */}
              {isLoggedIn && (
                <button
                  onClick={() => openEditModal(task)}
                  className="mt-1 text-xs text-blue-600 hover:underline"
                >
                  编辑
                </button>
              )}
            </div>

            {/* 状态标签（带逾期提醒） */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColorMap[finalStatus]}`}>
                {finalStatus}
              </span>
              {(finalStatus === '已逾期' || finalStatus === '即将到期') && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" viewBox="0 0 24 24">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"/>
                  <path d="M13 7h-2v6h6v-2h-4z"/>
                  <path d="M12 19v-2"/>
                </svg>
              )}
            </div>

            {/* 截止日期 */}
            <span className={`text-sm whitespace-nowrap ${finalStatus === '已逾期' ? 'text-red-500' : 'text-gray-500'}`}>
              {task.deadline}
            </span>
          </div>

          {/* 办结标准 */}
          <div className="ml-9 mb-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">办结标准：</span>
              {task.finishStandard}
            </p>
          </div>

          {/* 情况说明（可展开） */}
          {task.description && (
            <div className="ml-9 mb-1">
              <div className="text-sm text-gray-600">
                <span className="font-medium">情况说明：</span>
                {isDescExpanded ? task.description : `${task.description.slice(0, 60)}...`}
                <button 
                  onClick={() => toggleDescExpand(task.id)}
                  className="ml-2 text-blue-600 hover:underline text-xs"
                >
                  {isDescExpanded ? '收起' : '展开'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 子任务 */}
        {hasChildren && isExpanded && (
          <div className="mt-2">
            {task.children!.map(child => renderTaskItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  // 登录页面
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">商管督办通 - 登录</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">账号</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入账号"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入密码"
                required
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm text-center">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              登录
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              默认账号：jiandu | 密码：000000
            </p>
          </form>
        </div>
      </div>
    )
  }

  // 主页面
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:px-8 max-w-5xl mx-auto">
      {/* 顶部统计 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-wrap gap-4 justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">已逾期</p>
          <p className="text-lg font-bold text-red-500">{stats.overdue}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">即将到期</p>
          <p className="text-lg font-bold text-amber-500">{stats.soonExpire}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">未完成</p>
          <p className="text-lg font-bold text-blue-500">{stats.unfinished}</p>
        </div>
      </div>

      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">督办事项细节</h1>
        {/* 🔴 修改：替换硬编码的196为实际统计的总任务数 */}
        <p className="text-gray-500 text-center mt-1">共 {totalTaskCount} 个督办事项</p>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="全部">全部事业部</option>
          <option value="创新事业部">创新事业部</option>
          <option value="商服事业部">商服事业部</option>
          <option value="物业事业部">物业事业部</option>
        </select>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="全部">全部等级</option>
          <option value="一级">一级</option>
          <option value="二级">二级</option>
          <option value="三级">三级</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="全部">全部状态</option>
          <option value="进行中">进行中</option>
          <option value="已完成">已完成</option>
          <option value="未完成">未完成</option>
          <option value="已逾期">已逾期</option>
          <option value="即将到期">即将到期</option>
        </select>

        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="搜索关键词..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
      </div>

      {/* 任务列表 */}
      <div>
        {filteredData.length > 0 ? (
          filteredData.map(task => renderTaskItem(task))
        ) : (
          <div className="text-center py-12 text-gray-500">
            暂无匹配的督办事项
          </div>
        )}
      </div>

      {/* 编辑弹窗 */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">编辑督办事项</h3>
              <button onClick={() => setEditingTask(null)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">基础状态</label>
                <select
                  value={editingTask.baseStatus}
                  onChange={(e) => setEditingTask({ ...editingTask, baseStatus: e.target.value as '进行中' | '已完成' })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="进行中">进行中</option>
                  <option value="已完成">已完成</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">情况说明</label>
                <textarea
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                  placeholder="输入情况说明..."
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setEditingTask(null)}
                  className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={saveEdit}
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
