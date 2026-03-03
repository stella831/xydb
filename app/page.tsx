'use client'
import { useState, useMemo } from 'react'

// 督办事项类型定义
type TaskLevel = '一级' | '二级' | '三级'
type TaskStatus = '进行中' | '已完成'

interface TaskItem {
  id: string
  level: TaskLevel
  title: string
  status: TaskStatus
  deadline: string
  department: string
  person: string
  finishStandard: string
  description?: string
  children?: TaskItem[]
}

// 完整督办数据（从截图完整提取）
const taskData: TaskItem[] = [
  {
    id: 'task-1',
    level: '一级',
    title: '重点项目载体去化',
    status: '进行中',
    deadline: '2026/3/31',
    department: '创新事业部',
    person: '曹冰涛',
    finishStandard: '3月31日前完成新增招商面积4360，出租率65%(新增5%)',
    children: [
      {
        id: 'task-1-1',
        level: '二级',
        title: '新增客户储备',
        status: '进行中',
        deadline: '2026/3/31',
        department: '创新事业部',
        person: '曹冰涛',
        finishStandard: '完成15组意向客户线索收集',
        children: [
          {
            id: 'task-1-1-1',
            level: '三级',
            title: '打造三端产品',
            status: '进行中',
            deadline: '2026/3/10',
            department: '创新事业部',
            person: '康丹霞',
            finishStandard: '对政府端、项目端、客户端形成定制化产品包，并完成首个产品包下发和迭代',
          },
          {
            id: 'task-1-1-2',
            level: '三级',
            title: '互联网产业圈层挖掘',
            status: '进行中',
            deadline: '2026/3/31',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '围绕厦门互联网经济型企业展开专项拓客，收集5家意向企业，与人力负责人建立直接对接关系',
          },
          {
            id: 'task-1-1-3',
            level: '三级',
            title: '金融属性行业深拓和客户池储备',
            status: '进行中',
            deadline: '2026/3/31',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '完成10组意向企业收集，拜访至对方办公室主任或同等级别，建立正式对接关系',
          },
          {
            id: 'task-1-1-4',
            level: '三级',
            title: '推围绕交通新格局进行主题性推广',
            status: '进行中',
            deadline: '2026/3/31',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '借助新机场转场和厦金大桥通车，形成主题，保持推广露出',
          },
          {
            id: 'task-1-1-5',
            level: '三级',
            title: '对厦门全市航空企业办公地点进行摸排',
            status: '已完成',
            deadline: '2026/1/31',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '对类似国泰航空等航司进行系统性盘点，对无自建办公楼的航司进行拜访争取',
          },
          {
            id: 'task-1-1-6',
            level: '三级',
            title: '拓展安踏新增收购品牌',
            status: '已完成',
            deadline: '2026/2/25',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '与狼爪团队和彪马团队建立联系',
            description: '1.狼爪，25年年初收购，内部人员25年10月份开始竞聘，目前架构还未确认，暂无对接人。2.彪马，...',
          },
        ]
      },
      {
        id: 'task-1-2',
        level: '二级',
        title: '存量客户签约',
        status: '进行中',
        deadline: '2026/3/31',
        department: '创新事业部',
        person: '林飞',
        finishStandard: '3月31日前完成新增招商面积4360，出租率65%(新增5%)',
        children: [
          {
            id: 'task-1-2-1',
            level: '三级',
            title: '山西证券签约',
            status: '进行中',
            deadline: '2026/3/15',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '完成山西证券(691.41㎡) 的合同签约，累计新增签约面积2137.24㎡',
          },
          {
            id: 'task-1-2-2',
            level: '三级',
            title: '兆翔科技签约',
            status: '进行中',
            deadline: '2026/3/31',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '完成兆翔科技（约3200㎡）的合同签约，累计新增签约面积7500㎡',
          },
          {
            id: 'task-1-2-3',
            level: '三级',
            title: '推进国泰航空进入合同文本审核',
            status: '进行中',
            deadline: '2026/3/31',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '推进国泰航空(691.41㎡) 的租赁合同文本递交至香港总部进行审核，与经办确认合同正式开始流转',
          },
          {
            id: 'task-1-2-4',
            level: '三级',
            title: '高意向客户锁签',
            status: '已完成',
            deadline: '2026/1/31',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '完成斐乐(1094.64m²) 、方之旅(192.89m²) 跨境支付(158.3m²) 合计1445.8...',
          },
          {
            id: 'task-1-2-5',
            level: '三级',
            title: '稿定签约',
            status: '已完成',
            deadline: '2026/2/14',
            department: '创新事业部',
            person: '林飞',
            finishStandard: '完成稿定(2235m²) 的合同签约，累计新增签约面积4372.24m²',
            description: '合同已签约且押金',
          },
        ]
      }
    ]
  },
  {
    id: 'task-2',
    level: '一级',
    title: '宠物经济线下平台1.1期',
    status: '进行中',
    deadline: '2026/3/31',
    department: '创新事业部',
    person: '曹冰涛',
    finishStandard: '制定项目招商运营策略，确定业态与品牌组合，完成空间方案修正稿',
    children: [
      {
        id: 'task-2-1',
        level: '二级',
        title: '制定项目招商运营策略，确定业态与品牌组合，完成空间方案修正稿',
        status: '进行中',
        deadline: '2026/3/27',
        department: '创新事业部',
        person: '曹冰涛',
        finishStandard: '在商管集团内部审核提交督办申请办结',
        children: [
          {
            id: 'task-2-1-1',
            level: '三级',
            title: '空间方案修正稿',
            status: '进行中',
            deadline: '2026/3/15',
            department: '创新事业部',
            person: '曹冰涛',
            finishStandard: '根据前、中台共识调整空间方案，形成修成稿',
          },
          {
            id: 'task-2-1-2',
            level: '三级',
            title: '招商协同共识建立',
            status: '已完成',
            deadline: '2026/3/2',
            department: '创新事业部',
            person: '曹冰涛',
            finishStandard: '前台、中泰协同后完成品牌招商规划',
            description: '2月27日召开商管集团首次宠物经济调度会，前台商服、创新和中台规划设计中心一同参会，建立招商协同和竞...',
          },
        ]
      }
    ]
  },
  {
    id: 'task-3',
    level: '一级',
    title: '宠物经济线下平台1.1期',
    status: '进行中',
    deadline: '2026/6/30',
    department: '创新事业部',
    person: '曹冰涛',
    finishStandard: '与首个宠物经济相关合作方签订协议，凭协议办结',
    children: [
      {
        id: 'task-3-1',
        level: '二级',
        title: '签订宠物经济进驻意向协议',
        status: '进行中',
        deadline: '2026/6/30',
        department: '创新事业部',
        person: '曹冰涛',
        finishStandard: '首家宠物经济门店开业',
        children: [
          {
            id: 'task-3-1-1',
            level: '三级',
            title: '首家租户签订意向协议',
            status: '进行中',
            deadline: '2026/3/30',
            department: '创新事业部',
            person: '曹冰涛',
            finishStandard: '与首家意向进驻企业签确商务条件',
          },
          {
            id: 'task-3-1-2',
            level: '三级',
            title: '租户正式进场装修',
            status: '进行中',
            deadline: '2026/4/15',
            department: '创新事业部',
            person: '曹冰涛',
            finishStandard: '租户正式申请装修许可证，进场施工',
          },
          {
            id: 'task-3-1-3',
            level: '三级',
            title: '首家商户试营业',
            status: '进行中',
            deadline: '2026/6/26',
            department: '创新事业部',
            person: '曹冰涛',
            finishStandard: '宠物经济类别首家门店试营业',
          },
          {
            id: 'task-3-1-4',
            level: '三级',
            title: '完成10家宠物行业拜访及交流',
            status: '已完成',
            deadline: '2026/2/14',
            department: '创新事业部',
            person: '曹冰涛',
            finishStandard: '形成拜访客户反馈清单表格',
            description: '已拜访公寓2家、医院3家、协会1家、公益机构2家、洗护和售卖2家、猫粮狗粮1家',
          },
          {
            id: 'task-3-1-5',
            level: '三级',
            title: '确认3家重点跟进宠物经济招商企业',
            status: '已完成',
            deadline: '2026/2/28',
            department: '创新事业部',
            person: '曹冰涛',
            finishStandard: '通过集中拜访确认未来重点洽商的合作商家',
            description: '已确认一家公寓机构、一家医院作为重点洽谈对象，另外一条线索围绕福建农林大学展开。合计共三组，其中两家...',
          },
        ]
      }
    ]
  },
  {
    id: 'task-4',
    level: '一级',
    title: '宠物经济线下平台1.1期',
    status: '已完成',
    deadline: '2026/2/16',
    department: '创新事业部',
    person: '曹冰涛',
    finishStandard: '完成五通“人宠共生”城市商业综合体多方案比选，多轮修正空间方案及商业定位报告',
    description: '目前方案编制完成，2月9日下午2点半商管集团内部汇报。',
    children: [
      {
        id: 'task-4-1',
        level: '二级',
        title: '完成五通“人宠共生”城市商业综合体多方案比选，多轮修正空间方案及商业定位报告',
        status: '已完成',
        deadline: '2026/2/9',
        department: '创新事业部',
        person: '曹冰涛',
        finishStandard: '在商管集团内部审核提交督办申请办结',
        children: [
          {
            id: 'task-4-1-1',
            level: '三级',
            title: '完成五通“人宠共生”城市商业综合体多方案比选，多轮修正空间方案及商业定位报告',
            status: '已完成',
            deadline: '2026/2/9',
            department: '创新事业部',
            person: '曹冰涛',
            finishStandard: '在商管集团内部审核提交督办申请办结',
          }
        ]
      }
    ]
  }
]

// 级别颜色配置
const levelColorMap: Record<TaskLevel, string> = {
  '一级': 'bg-purple-100 text-purple-700',
  '二级': 'bg-green-100 text-green-700',
  '三级': 'bg-orange-100 text-orange-700',
}

// 状态颜色配置
const statusColorMap: Record<TaskStatus, string> = {
  '进行中': 'bg-blue-100 text-blue-700',
  '已完成': 'bg-green-100 text-green-700',
}

export default function SupervisePage() {
  // 状态管理
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<'全部' | TaskStatus>('全部')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(taskData.map(item => item.id)))

  // 展开/折叠切换
  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  // 详情展开/折叠
  const [descExpandedIds, setDescExpandedIds] = useState<Set<string>>(new Set())
  const toggleDescExpand = (id: string) => {
    const newExpanded = new Set(descExpandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setDescExpandedIds(newExpanded)
  }

  // 筛选数据
  const filteredData = useMemo(() => {
    const filterTask = (tasks: TaskItem[]): TaskItem[] => {
      return tasks.filter(task => {
        // 关键词匹配
        const matchKeyword = searchKeyword === '' 
          ? true 
          : task.title.includes(searchKeyword) 
            || task.person.includes(searchKeyword)
            || task.department.includes(searchKeyword)
            || task.finishStandard.includes(searchKeyword)
            || (task.description && task.description.includes(searchKeyword))
        
        // 状态匹配
        const matchStatus = statusFilter === '全部' ? true : task.status === statusFilter

        // 子项匹配
        const hasMatchChildren = task.children ? filterTask(task.children).length > 0 : false

        return (matchKeyword && matchStatus) || hasMatchChildren
      }).map(task => {
        if (!task.children) return task
        return {
          ...task,
          children: filterTask(task.children)
        }
      })
    }
    return filterTask(taskData)
  }, [searchKeyword, statusFilter])

  // 递归渲染任务项
  const renderTaskItem = (task: TaskItem, level: number = 0) => {
    const isExpanded = expandedIds.has(task.id)
    const isDescExpanded = descExpandedIds.has(task.id)
    const hasChildren = task.children && task.children.length > 0

    return (
      <div key={task.id} className={`mb-4 ${level > 0 ? 'ml-6' : ''}`}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          {/* 任务头部 */}
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

            {/* 标题 */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
              <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
                <span>{task.department}</span>
                <span>·</span>
                <span>{task.person}</span>
              </div>
            </div>

            {/* 状态标签 */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColorMap[task.status]}`}>
              {task.status}
            </span>

            {/* 截止日期 */}
            <span className="text-sm text-gray-500 whitespace-nowrap">{task.deadline}</span>
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
                {isDescExpanded ? task.description : `${task.description.slice(0, 50)}...`}
                <button 
                  onClick={() => toggleDescExpand(task.id)}
                  className="ml-2 text-blue-600 hover:underline"
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

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:px-8 max-w-5xl mx-auto">
      {/* 页面标题 */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">商管督办通</h1>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* 状态筛选 */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="全部">全部状态</option>
          <option value="进行中">进行中</option>
          <option value="已完成">已完成</option>
        </select>

        {/* 搜索框 */}
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
    </div>
  )
}
