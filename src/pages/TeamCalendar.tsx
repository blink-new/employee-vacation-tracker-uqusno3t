import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Calendar } from '../components/ui/calendar'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { ChevronLeft, ChevronRight, Users, Calendar as CalendarIcon } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns'

interface User {
  id: string
  email: string
  displayName?: string
}

interface TeamCalendarProps {
  user: User
}

interface TeamMember {
  id: string
  name: string
  email: string
  department: string
  initials: string
}

interface VacationEvent {
  id: string
  employeeId: string
  employeeName: string
  startDate: string
  endDate: string
  status: 'approved' | 'pending'
  type: 'vacation' | 'sick' | 'personal'
}

export function TeamCalendar({ user }: TeamCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const teamMembers: TeamMember[] = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah.j@company.com', department: 'Engineering', initials: 'SJ' },
    { id: '2', name: 'Mike Chen', email: 'mike.c@company.com', department: 'Engineering', initials: 'MC' },
    { id: '3', name: 'Emily Davis', email: 'emily.d@company.com', department: 'Design', initials: 'ED' },
    { id: '4', name: 'Alex Rodriguez', email: 'alex.r@company.com', department: 'Engineering', initials: 'AR' },
    { id: '5', name: 'Lisa Wang', email: 'lisa.w@company.com', department: 'Product', initials: 'LW' }
  ]

  const vacationEvents: VacationEvent[] = [
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Sarah Johnson',
      startDate: '2024-07-22',
      endDate: '2024-07-26',
      status: 'approved',
      type: 'vacation'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Mike Chen',
      startDate: '2024-07-18',
      endDate: '2024-07-19',
      status: 'approved',
      type: 'personal'
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Emily Davis',
      startDate: '2024-08-05',
      endDate: '2024-08-09',
      status: 'pending',
      type: 'vacation'
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Alex Rodriguez',
      startDate: '2024-07-29',
      endDate: '2024-08-02',
      status: 'approved',
      type: 'vacation'
    }
  ]

  const getEventsForDate = (date: Date) => {
    return vacationEvents.filter(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      return date >= eventStart && date <= eventEnd
    })
  }

  const getSelectedDateEvents = () => {
    if (!selectedDate) return []
    return getEventsForDate(selectedDate)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vacation':
        return 'bg-blue-100 text-blue-800'
      case 'sick':
        return 'bg-red-100 text-red-800'
      case 'personal':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'border-green-200 bg-green-50'
      case 'pending':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Team Calendar</h1>
        <p className="text-muted-foreground mt-2">
          View your team's vacation schedule and plan accordingly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {format(currentDate, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentDate}
                onMonthChange={setCurrentDate}
                className="w-full"
                components={{
                  Day: ({ date, ...props }) => {
                    const events = getEventsForDate(date)
                    const hasEvents = events.length > 0
                    
                    return (
                      <div className="relative">
                        <button
                          {...props}
                          className={`
                            w-full h-10 text-sm rounded-md transition-colors
                            ${isSameDay(date, selectedDate || new Date()) 
                              ? 'bg-primary text-primary-foreground' 
                              : hasEvents 
                                ? 'bg-blue-100 text-blue-900 hover:bg-blue-200' 
                                : 'hover:bg-muted'
                            }
                          `}
                        >
                          {format(date, 'd')}
                        </button>
                        {hasEvents && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="w-1 h-1 bg-primary rounded-full"></div>
                          </div>
                        )}
                      </div>
                    )
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </CardTitle>
              <CardDescription>
                {getSelectedDateEvents().length} event{getSelectedDateEvents().length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getSelectedDateEvents().length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events on this date</p>
                ) : (
                  getSelectedDateEvents().map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border ${getStatusColor(event.status)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{event.employeeName}</p>
                        <Badge variant="outline" className={getTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.startDate), 'MMM d')} - {format(new Date(event.endDate), 'MMM d')}
                      </p>
                      {event.status === 'pending' && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Pending Approval
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-100 rounded border"></div>
                  <span className="text-sm">Vacation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-100 rounded border"></div>
                  <span className="text-sm">Sick Leave</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-100 rounded border"></div>
                  <span className="text-sm">Personal Day</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-100 rounded border border-yellow-200"></div>
                  <span className="text-sm">Pending Approval</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}