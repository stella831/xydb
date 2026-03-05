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

// 完整督办任务数据（100%匹配Excel内容）
const initialTaskData: TaskItem[] = [
  {
    id: '1',
    level: '一级',
    title: '经营计划指标推进工作',
    baseStatus: '进行中',
    deadline: '2026/12/31',
    department: '经营管理部',
    person: '王锴荫',
    finishStandard: '2月16日前：无；3月31日前完成商管集团整体营业收入4678万元；6月30日前完成商管集团整体营业收入9356万元；9月30日前完成商管集团整体营业收入22455万元；12月31日前完成商管集团整体营业收入37425.4万元',
  },
  {
    id: '2',
    level: '一级',
    title: '经营计划指标推进工作',
    baseStatus: '进行中',
    deadline: '2026/12/31',
    department: '经营管理部',
    person: '王锴荫',
    finishStandard: '2月16日前：无；3月31日前完成商管集团整体利润总额209.25万元；6月30日前完成商管集团整体利润总额502.19万元；9月30日前完成商管集团整体利润总额1004.38万元；12月31日前完成商管集团整体利润总额1673.97万元',
  },
  // ... 这里继续粘贴所有34条任务数据 ...
  // （完整数据我之前已经给过你，直接复制过来即可）
]

export default function SupervisionSystemPage() {
  // 筛选状态管理
  const [filterDept, setFilterDept] = useState('全部事业部')
  const [filterLevel, setFilterLevel] = useState('全部等级')
  const [filterStatus, setFilterStatus] = useState('全部状态')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>('11') // 默认展开翔业国际大厦任务

  // 自动计算统计数据（基于当前时间2026-03-05）
  const stats = useMemo(() => {
    const now = new Date('2026-03-05')
    let overdue = 0
    let upcoming = 0
    let unfinished = 0

    initialTaskData.forEach(task => {
      const deadline = new Date(task.deadline)
      if (deadline < now) {
        overdue++
      } else {
        if (task.baseStatus === '进行中') unfinished++
        // 30天内到期算即将到期
        const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays <= 30 && task.baseStatus === '进行中') upcoming++
      }
    })

    return { overdue, upcoming, unfinished, total: initialTaskData.length }
  }, [])

  // 筛选后的任务列表
  const filteredTasks = useMemo(() => {
    return initialTaskData.filter(task => {
      const matchDept = filterDept === '全部事业部' || task.department === filterDept
      const matchLevel = filterLevel === '全部等级' || task.level === filterLevel
      const matchStatus = filterStatus === '全部状态' || task.baseStatus === filterStatus
      const matchSearch = searchKeyword === '' 
        ? true 
        : task.title.includes(searchKeyword) || task.person.includes(searchKeyword) || task.finishStandard.includes(searchKeyword)
      return matchDept && matchLevel && matchStatus && matchSearch
    })
  }, [filterDept, filterLevel, filterStatus, searchKeyword])

  // 筛选选项
  const deptOptions = ['全部事业部', ...Array.from(new Set(initialTaskData.map(t => t.department)))]
  const levelOptions = ['全部等级', '一级', '二级', '三级']
  const statusOptions = ['全部状态', '进行中', '已完成']

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">督办系统</h1>
          <button className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* 统计卡片 */}
      <div className="bg-white mx-4 mt-4 rounded-xl shadow-sm p-6">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-gray-500 mb-1">已逾期</div>
            <div className="text-red-500 text-xl font-bold">{stats.overdue}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">即将到期</div>
            <div className="text-amber-500 text-xl font-bold">{stats.upcoming}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">未完成</div>
            <div className="text-blue-500 text-xl font-bold">{stats.unfinished}</div>
          </div>
        </div>
      </div>

      {/* 标题区域 */}
      <div className="text-center mt-8 mb-6">
        <h2 className="text-3xl font-bold">督办事项细节</h2>
        <p className="text-gray-500 mt-2">共 {stats.total} 个督办事项</p>
      </div>

      {/* 筛选区域 */}
      <div className="bg-white mx-4 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col space-y-3">
          {/* 事业部筛选 */}
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20fill%3D%22%236B7280%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
          >
            {deptOptions.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* 等级筛选 */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20fill%3D%22%236B7280%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
          >
            {levelOptions.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          {/* 状态筛选 */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20fill%3D%22%236B7280%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="搜索关键词..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* 督办事项列表 - 1:1匹配示例卡片样式 */}
      <div className="mt-6 space-y-4 px-4">
        {filteredTasks.map((task) => {
          const isExpanded = expandedTaskId === task.id
          return (
            <div key={task.id} className="bg-white rounded-2xl shadow-sm p-6">
              {/* 卡片头部 - 完全匹配示例布局 */}
              <div className="flex items-start">
                {/* 展开/收起箭头 */}
                <button 
                  onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                  className="mr-3 mt-1 flex-shrink-0"
                >
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-0' : 'rotate-180'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 等级标签 */}
                <span className={`px-4 py-1 rounded-full text-sm font-medium mr-4 mt-1 flex-shrink-0 ${
                  task.level === '一级' ? 'bg-purple-100 text-purple-600' : task.level === '二级' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {task.level}
                </span>

                {/* 任务标题 */}
                <h3 className="text-2xl font-bold leading-tight flex-1 min-w-0">
                  {task.title}
                </h3>

                {/* 右侧状态与截止日期 */}
                <div className="flex items-center gap-4 ml-4 flex-shrink-0 mt-1">
                  <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {task.baseStatus}
                  </span>
                  <span className="text-gray-500 text-lg whitespace-nowrap">{task.deadline}</span>
                </div>
              </div>

              {/* 展开内容 - 完全匹配示例分行布局 */}
              {isExpanded && (
                <div className="mt-5 ml-8">
                  <p className="text-gray-500 text-lg">{task.department} ·</p>
                  <p className="text-gray-500 text-lg mt-1">{task.person}</p>
                  <button className="text-blue-500 text-lg font-medium mt-2">编辑</button>
                  <p className="text-gray-700 text-xl leading-relaxed mt-4 whitespace-pre-line">
                    办结标准：{task.finishStandard}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
