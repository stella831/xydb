'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// 任务数据TS类型定义，完全匹配集团任务清单字段
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

  // 全量任务数据（含兆翔物业原有+补充任务、宠物经济模板任务、翔业商管核心任务）
  const tasks: Task[] = [
    // 兆翔物业原有7项核心任务
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
      targetQ2: '6月30日前完成电力工程施工总承包资质技术负责人招聘，取得资质证书',
      targetQ3: '/',
      targetQ4: '11月30日前完成承装（修、试）电力设施资质业绩积累',
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
      targetQ1: '3月31日完成行李跟踪、海关智能通道等设备安装',
      targetQ2: '4月30日完成全设备安装调试，6月30日前完成试运行及人员培训',
      targetQ3: '7月31日完成项目交付，9月30日前配合通航测试',
      targetQ4: '11月30日完成高崎机场设备搬迁方案',
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
      targetQ1: '3月31日完成1库区、Y库核心设备机械和电气安装',
      targetQ2: '5月31日完成全设备安装及数据上传，6月30日完成联调联试并移交',
      targetQ3: '8月31日完成人员培训，9月30日完成系统设备完善',
      targetQ4: '11月30日完成设备搬迁方案',
      deadline: '2026/12/31',
      handler: '张晨岚',
      status: '进行中',
    },
    // 兆翔物业补充任务
    {
      id: 8,
      serialNumber: '8',
      responsibleUnit: '兆翔物业',
      taskLevel: '重要',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会，一夜转场和二期投运专题会',
      taskName: '高崎机场转场撤场工作',
      subTaskName: '机场设施设备撤场及封存',
      targetSpring: '/',
      targetQ1: '完成高崎机场非核心物业设施盘点，形成撤场清单',
      targetQ2: '完成核心运维设备封存方案编制，完成非必要设施拆除',
      targetQ3: '配合空港完成高崎机场物业区域清场验收',
      targetQ4: '完成撤场资料归档，形成转场物业工作总结',
      deadline: '2026/12/31',
      handler: '张晨岚',
      status: '进行中',
    },
    {
      id: 9,
      serialNumber: '9',
      responsibleUnit: '兆翔物业',
      taskLevel: '重要',
      taskDimension: '经营深化改革',
      taskSource: '2026年董事会',
      taskName: '物业服务质量提升工作',
      subTaskName: '全业态服务标准升级',
      targetSpring: '完成物业各业态服务现状调研',
      targetQ1: '制定机场物业服务提质实施方案，明确服务考核指标',
      targetQ2: '完成新服务标准编制，组织全员培训',
      targetQ3: '开展服务标准落地督查，完成首轮问题整改',
      targetQ4: '实现服务满意度95%以上，形成提质工作长效机制',
      deadline: '2026/12/31',
      handler: '王锴荫',
      status: '进行中',
    },
    {
      id: 10,
      serialNumber: '10',
      responsibleUnit: '兆翔物业',
      taskLevel: '重要',
      taskDimension: '市场开拓攻坚',
      taskSource: '2026年董事会',
      taskName: '智慧物业建设推进工作',
      subTaskName: '智慧运维系统落地',
      targetSpring: '完成智慧物业系统选型及方案设计',
      targetQ1: '完成机场物业试点区域系统部署',
      targetQ2: '实现试点区域设备智能巡检、能耗实时监控',
      targetQ3: '完成全业务板块系统上线，实现运维数字化',
      targetQ4: '形成智慧物业运营体系，输出行业标杆案例',
      deadline: '2026/12/31',
      handler: '黄森岩',
      status: '进行中',
    },
    {
      id: 11,
      serialNumber: '11',
      responsibleUnit: '兆翔物业',
      taskLevel: '重要',
      taskDimension: '战略优化布局',
      taskSource: '2026年董事会，跨越二六二七',
      taskName: '低碳物业运营推进工作',
      subTaskName: '机场物业低碳改造',
      targetSpring: '对接兆翔综能完成翔安机场物业低碳运营方案对接',
      targetQ1: '完成高崎机场物业节能改造收尾工作',
      targetQ2: '完成翔安机场物业节能设施布局落地',
      targetQ3: '实现翔安机场物业区域能耗数据实时监测',
      targetQ4: '达成集团下达的碳减排目标，形成低碳运营报告',
      deadline: '2026/12/31',
      handler: '张晨岚',
      status: '进行中',
    },
    {
      id: 12,
      serialNumber: '12',
      responsibleUnit: '兆翔物业',
      taskLevel: '重要',
      taskDimension: '机场投运筹备',
      taskSource: '2026年董事会，一夜转场和二期投运专题会',
      taskName: '翔安机场物业服务落地',
      subTaskName: '机场全区域物业运维团队组建',
      targetSpring: '/',
      targetQ1: '完成翔安机场物业运维岗位定编，启动人员招聘',
      targetQ2: '完成运维人员专业培训及机场实操考核',
      targetQ3: '实现翔安机场物业全区域运维团队定岗到位',
      targetQ4: '形成翔安机场物业常态化运维管理体系',
      deadline: '2026/9/30',
      handler: '王锴荫',
      status: '进行中',
    },
    // 你提供的宠物经济项目模板（1:1还原）
    {
      id: 20,
      serialNumber: '20',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '新兴产业发展',
      taskSource: '2026年董事会,跨越二五二六',
      taskName: '宠物经济项目落地实施推进工作',
      subTaskName: '宠物经济线下平台1.1期',
      targetSpring: '2月16日前完成五通"人宠共生"城市商业综合体多方案比选，多轮修正空间方案及商业定位报告',
      targetQ1: '3月31日前制定项目招商运营策略，确定业态与品牌组合，完成空间方案修正稿',
      targetQ2: '6月30日前与首个宠物经济相关合作方签订协议，凭协议办结',
      targetQ3: '/',
      targetQ4: '/',
      deadline: '2026/06/30',
      handler: '曹冰涛',
      status: '进行中',
    },
    // 翔业商管核心任务（节选，可按需补充全量）
    {
      id: 13,
      serialNumber: '13',
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
      id: 14,
      serialNumber: '14',
      responsibleUnit: '翔业商管',
      taskLevel: '重要',
      taskDimension: '经营指标突破',
      taskSource: '2026年董事会',
      taskName: '经营计划指标推进工作',
      subTaskName: '利润总额',
      targetSpring: '/',
      targetQ1: '3月31日前完成利润总额209.25万元',
      targetQ2: '6月30日前完成利润总额502.19万元',
      targetQ3: '9月30日前完成利润总额1004.38万元',
      targetQ4: '12月31日前完成利润总额1673.97万元',
      deadline: '2026/12/31',
      handler: '王锴荫',
      status: '进行中',
    },
  ];

  // 多维度筛选逻辑
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 关键词搜索（任务名、分项任务、经办人、责任单位）
      const matchesKeyword = searchKeyword
        ? task.taskName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          task.subTaskName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          task.handler.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          task.responsibleUnit.toLowerCase().includes(searchKeyword.toLowerCase())
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

  // 自动提取唯一责任单位选项
  const unitOptions = useMemo(() => {
    return Array.from(new Set(tasks.map((task) => task.responsibleUnit)));
  }, [tasks]);

  // 任务状态徽章样式映射
  const statusStyleMap: Record<Task['status'], string> = {
    进行中: 'bg-blue-500 hover:bg-blue-600',
    已完成: 'bg-green-500 hover:bg-green-600',
    即将到期: 'bg-yellow-500 hover:bg-yellow-600',
    已逾期: 'bg-red-500 hover:bg-red-600',
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">2026年集团攻坚专项行动任务管理</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 筛选操作栏 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="搜索任务名称、分项任务、经办人、责任单位"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Select value={unitFilter} onValueChange={setUnitFilter}>
              <SelectTrigger><SelectValue placeholder="按责任单位筛选" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部单位</SelectItem>
                {unitOptions.map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger><SelectValue placeholder="按任务等级筛选" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部等级</SelectItem>
                <SelectItem value="重要">重要</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="按任务状态筛选" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="进行中">进行中</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
                <SelectItem value="即将到期">即将到期</SelectItem>
                <SelectItem value="已逾期">已逾期</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 任务清单表格 */}
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">序号</TableHead>
                  <TableHead>责任单位</TableHead>
                  <TableHead>任务等级</TableHead>
                  <TableHead>任务维度</TableHead>
                  <TableHead>任务名称</TableHead>
                  <TableHead>分项任务</TableHead>
                  <TableHead>领跑首季目标</TableHead>
                  <TableHead>攻坚过半目标</TableHead>
                  <TableHead>完成时限</TableHead>
                  <TableHead>经办人</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.serialNumber}</TableCell>
                      <TableCell>{task.responsibleUnit}</TableCell>
                      <TableCell>{task.taskLevel}</TableCell>
                      <TableCell>{task.taskDimension}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={task.taskName}>
                        {task.taskName}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={task.subTaskName}>
                        {task.subTaskName}
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate" title={task.targetQ1}>
                        {task.targetQ1}
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate" title={task.targetQ2}>
                        {task.targetQ2}
                      </TableCell>
                      <TableCell>{task.deadline}</TableCell>
                      <TableCell>{task.handler}</TableCell>
                      <TableCell>
                        <Badge className={statusStyleMap[task.status]}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="default" size="sm">编辑</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                      暂无匹配的任务数据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
