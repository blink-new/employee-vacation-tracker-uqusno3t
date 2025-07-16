import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { CheckCircle, XCircle, AlertCircle, Search, Users, Calendar, TrendingUp, Check, X } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '../hooks/use-toast'

interface User {
  id: string
  email: string
  displayName?: string
}

interface AdminPanelProps {
  user: User
}

interface PendingRequest {
  id: string
  employeeName: string
  employeeEmail: string
  startDate: string
  endDate: string
  daysRequested: number
  reason: string
  submittedAt: string
  department: string
}

interface Employee {
  id: string
  name: string
  email: string
  department: string
  totalDays: number
  usedDays: number
  pendingDays: number
}

export function AdminPanel({ user }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const { toast } = useToast()

  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
    {
      id: '1',
      employeeName: 'John Smith',
      employeeEmail: 'john.smith@company.com',
      startDate: '2024-08-15',
      endDate: '2024-08-19',
      daysRequested: 5,
      reason: 'Family vacation to Europe',
      submittedAt: '2024-07-20T10:30:00Z',
      department: 'Engineering'
    },
    {
      id: '2',
      employeeName: 'Emily Davis',
      employeeEmail: 'emily.davis@company.com',
      startDate: '2024-08-05',
      endDate: '2024-08-09',
      daysRequested: 5,
      reason: 'Wedding anniversary celebration',
      submittedAt: '2024-07-18T14:15:00Z',
      department: 'Design'
    },
    {
      id: '3',
      employeeName: 'Mike Chen',
      employeeEmail: 'mike.chen@company.com',
      startDate: '2024-09-02',
      endDate: '2024-09-02',
      daysRequested: 1,
      reason: 'Medical appointment',
      submittedAt: '2024-07-22T09:45:00Z',
      department: 'Engineering'
    }
  ])

  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      department: 'Engineering',
      totalDays: 25,
      usedDays: 8,
      pendingDays: 5
    },
    {
      id: '2',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      department: 'Design',
      totalDays: 25,
      usedDays: 12,
      pendingDays: 5
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      department: 'Engineering',
      totalDays: 25,
      usedDays: 6,
      pendingDays: 1
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      department: 'Product',
      totalDays: 25,
      usedDays: 15,
      pendingDays: 0
    },
    {
      id: '5',
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@company.com',
      department: 'Engineering',
      totalDays: 25,
      usedDays: 10,
      pendingDays: 0
    }
  ])

  const handleApproveRequest = async (requestId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setPendingRequests(prev => prev.filter(req => req.id !== requestId))
      
      toast({
        title: "Request Approved",
        description: "The vacation request has been approved and the employee has been notified.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve request. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDenyRequest = async (requestId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setPendingRequests(prev => prev.filter(req => req.id !== requestId))
      
      toast({
        title: "Request Denied",
        description: "The vacation request has been denied and the employee has been notified.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deny request. Please try again.",
        variant: "destructive"
      })
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const stats = {
    totalEmployees: employees.length,
    pendingRequests: pendingRequests.length,
    totalVacationDays: employees.reduce((sum, emp) => sum + emp.usedDays, 0),
    averageUsage: Math.round(employees.reduce((sum, emp) => sum + (emp.usedDays / emp.totalDays), 0) / employees.length * 100)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground mt-2">
          Manage vacation requests and view team analytics.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Used</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVacationDays}</div>
            <p className="text-xs text-muted-foreground">Total this year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageUsage}%</div>
            <p className="text-xs text-muted-foreground">Of allocated days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">Pending Requests</TabsTrigger>
          <TabsTrigger value="employees">Employee Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Pending Vacation Requests</CardTitle>
              <CardDescription>
                Review and approve vacation requests from your team members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">No pending vacation requests to review.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.employeeName}</div>
                            <div className="text-sm text-muted-foreground">{request.department}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {format(new Date(request.startDate), 'MMM d')} - {format(new Date(request.endDate), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center font-medium">
                            {request.daysRequested}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={request.reason}>
                            {request.reason}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(request.submittedAt), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDenyRequest(request.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Deny
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApproveRequest(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Overview</CardTitle>
              <CardDescription>
                View vacation day usage and balances for all team members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Total Days</TableHead>
                    <TableHead>Used Days</TableHead>
                    <TableHead>Pending Days</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Usage %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => {
                    const remainingDays = employee.totalDays - employee.usedDays - employee.pendingDays
                    const usagePercent = Math.round((employee.usedDays / employee.totalDays) * 100)
                    
                    return (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">{employee.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{employee.department}</Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {employee.totalDays}
                        </TableCell>
                        <TableCell className="text-center">
                          {employee.usedDays}
                        </TableCell>
                        <TableCell className="text-center">
                          {employee.pendingDays > 0 ? (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              {employee.pendingDays}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          <span className={remainingDays < 5 ? 'text-red-600' : 'text-green-600'}>
                            {remainingDays}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  usagePercent > 80 ? 'bg-red-500' : usagePercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(usagePercent, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{usagePercent}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}