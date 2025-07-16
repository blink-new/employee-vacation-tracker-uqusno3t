import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { blink } from '../blink/client'

interface User {
  id: string
  email: string
  displayName?: string
}

interface DashboardProps {
  user: User
}

interface VacationRequest {
  id: string
  userId: string
  startDate: string
  endDate: string
  daysRequested: number
  reason: string
  status: 'pending' | 'approved' | 'denied'
  createdAt: string
}

interface Employee {
  id: string
  userId: string
  email: string
  displayName?: string
  vacationDaysTotal: number
  vacationDaysUsed: number
}

export function Dashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState({
    totalDays: 25,
    usedDays: 0,
    pendingRequests: 0,
    approvedRequests: 0
  })

  const [recentRequests, setRecentRequests] = useState<VacationRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load employee profile
        const employees = await blink.db.employees.list({
          where: { userId: user.id },
          limit: 1
        })

        let employee = employees[0]
        if (!employee) {
          // Create employee profile if it doesn't exist
          employee = await blink.db.employees.create({
            userId: user.id,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            vacationDaysTotal: 25,
            vacationDaysUsed: 0,
            department: 'General',
            isManager: false
          })
        }

        // Load vacation requests
        const requests = await blink.db.vacationRequests.list({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          limit: 5
        })

        // Calculate stats
        const pendingCount = requests.filter(r => r.status === 'pending').length
        const approvedCount = requests.filter(r => r.status === 'approved').length
        const usedDays = requests
          .filter(r => r.status === 'approved')
          .reduce((sum, r) => sum + r.daysRequested, 0)

        setStats({
          totalDays: employee.vacationDaysTotal,
          usedDays,
          pendingRequests: pendingCount,
          approvedRequests: approvedCount
        })

        setRecentRequests(requests)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      loadDashboardData()
    }
  }, [user?.id, user?.email, user?.displayName])

  const remainingDays = stats.totalDays - stats.usedDays

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Loading your vacation overview...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'denied':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case 'denied':
        return <Badge variant="destructive">Denied</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user.displayName || user.email.split('@')[0]}! Here's your vacation overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{remainingDays}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.totalDays} total days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Used</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usedDays}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.usedDays / stats.totalDays) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedRequests}</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>
            Your latest vacation requests and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(request.status)}
                  <div>
                    <p className="font-medium">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.daysRequested} day{request.daysRequested !== 1 ? 's' : ''} • {request.reason}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(request.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}