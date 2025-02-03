"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Application, Cup, Eye, Increase, Note2, PretentionChartLine2, Session, User, UserPlus, UserSign } from "@/components/svg";
import { useEffect, useState } from "react"; // Add this import
import HoverableRows from "./hoverableRows"

const ReportsArea = ({ analyticsData }) => {
  const [employeesCompletedHours, setEmployeesCompletedHours] = useState([])
  const [employeesNotCompletedHours, setEmployeesNotCompletedHours] = useState([])
  const [employeesAvgHoursLastWeek, setEmployeesAvgHoursLastWeek] = useState([])
  const [data, setData] = useState([])
  const [column, setColumn] = useState([
    'User ID',
    'User Name',
    'Phone Number',
    'Working Hours'
  ])
  const [isDialogOpen, setDialogOpen] = useState(false); // Add state for dialog

  useEffect(() => {
    const fetchEmployeeList = async () => {
      try {
        const response = await fetch('/api/analytics/employee-list');
        const data = await response.json();
        const { employeesCompletedHours,
          employeesNotCompletedHours,
          averageHours } = data
        setEmployeesCompletedHours(employeesCompletedHours)
        setEmployeesNotCompletedHours(employeesNotCompletedHours)
        setEmployeesAvgHoursLastWeek(averageHours)
      } catch (error) {
        console.error('Error fetching employee list:', error);
      }
    };

    fetchEmployeeList(); // Call the fetch function
  }, [])

  const handleCardClick = (item) => {
    // Check if item.name matches specific criteria and perform different actions
    setColumn([
      'User ID',
      'User Name',
      'Phone Number',
      'Working Hours'
    ])
    switch (item.name) {
      case "Avg. Working Hours":
        // Action for Avg. Working Hours
        console.log("Action for Avg. Working Hours");
        setData(employeesAvgHoursLastWeek)
        console.log(data)
        setDialogOpen(true);
        break;
      case "Number of Employees Completed 8H":
        // Action for Number of Employees Completed 8H
        console.log("Action for Employees Completed 8H");
        setData(employeesCompletedHours)
        setDialogOpen(true);
        break;
      case "Number of Employees Not Completed 8H":
        // Action for Number of Employees Not Completed 8H
        console.log("Action for Employees Not Completed 8H");
        setData(employeesNotCompletedHours)
        setDialogOpen(true);
        break;
      default:
        // Ignore other cases
        break;
    }
  };

  const handleBackdropClick = () => {
    setDialogOpen(false); // Close dialog on backdrop click
  };

  const reports = [
    {
      id: 1,
      name: "Check-in",
      count: analyticsData?.attendanceChecks?.check_in || '0',
      hasRate: false,
      rate: "150",
      isUp: true,
      icon: <UserPlus className="h-4 w-4" />,
      color: "info",
    },
    {
      id: 2,
      name: "Check-out",
      count: analyticsData?.attendanceChecks?.check_out || '0',
      hasRate: false,
      rate: "202",
      isUp: false,
      icon: <UserSign className="h-4 w-4" />,
      color: "info",
    },
    {
      id: 3,
      name: "Avg. Working Hours",
      hasRate: false,
      count: Number(analyticsData?.averageHoursLastWeek.average_hours || 0).toFixed(2) + "h" ,
      rate: analyticsData?.averageHoursLastWeek.average_hours / analyticsData?.averageHoursLastTwoWeeks.average_hours,
      isUp: analyticsData?.averageHoursLastWeek.average_hours > analyticsData?.averageHoursLastTwoWeeks.average_hours,
      icon: <Application className="h-4 w-4" />,
      color: "info",
    },
    {
      id: 4,
      name: "Number of Employees Completed Their Shift",
      count: analyticsData?.completedNotCompleted.completed || 0,
      hasRate: false,
      rate: "30",
      isUp: false,
      icon: <PretentionChartLine2 className="h-4 w-4" />,
      color: "primary",
    },
    {
      id: 5,
      name: "Number of Employees Not Completed Their Shift",
      count: analyticsData?.completedNotCompleted.not_completed || 0,
      hasRate: false,
      rate: "30",
      isUp: false,
      icon: <Note2 className="h-4 w-4" />,
      color: "destructive",
    },
    {
      id: 6,
      name: "Total Employees",
      count: analyticsData?.totalEmployees.total_employees || 0,
      hasRate: false,
      rate: "30",
      isUp: true,
      icon: <User className="h-4 w-4" />,
      color: "primary",
    },
  ];

  return (
    <>
      {reports.map((item, index) => (
        <Card key={`report-card-${index}`} onClick={() => handleCardClick(item)}> {/* Add onClick here */}
          <CardHeader className="flex-col-reverse sm:flex-row flex-wrap gap-2  border-none mb-0 pb-0">
            <span className="text-sm font-medium text-default-900 flex-1">{item.name}</span>
            <span className={cn("flex-none h-9 w-9 flex justify-center items-center bg-default-100 rounded-full", {
              "bg-primary bg-opacity-10 text-primary": item.color === "primary",
              "bg-info bg-opacity-10 text-info": item.color === "info",
              "bg-warning bg-opacity-10 text-warning": item.color === "warning",
              "bg-destructive bg-opacity-10 text-destructive": item.color === "destructive",
            })}>{item.icon}</span>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="text-2xl font-semibold text-default-900 mb-2.5">{item.count}</div>
            {item.hasRate && (
              <>
                <div className="flex items-center font-semibold gap-1">
                  {
                    item.isUp ? <>
                      <span className="text-success">{item.rate}%</span>
                      <Icon icon="heroicons:arrow-trending-up-16-solid" className="text-success text-xl" />
                    </>
                      :
                      <>
                        <span className="text-destructive">{item.rate}</span>
                        <Icon icon="heroicons:arrow-trending-down-16-solid" className="text-destructive text-xl" />
                      </>
                  }
                </div>
                <div className="mt-1 text-xs text-default-600">vs Previous 30 Days</div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
      {isDialogOpen && ( // Add dialog conditionally
        <div className="dialog-backdrop" onClick={handleBackdropClick}> {/* Close on backdrop click */}
          <div className="dialog" onClick={(e) => e.stopPropagation()}> {/* Prevent closing on dialog click */}
            <button className="text-red-600 hover:text-red-800 text-xl font-extrabold" onClick={() => setDialogOpen(false)}>X</button>
            <HoverableRows data={data} columns={column} />
          </div>
        </div>
      )}
    </>
  );
};


export default ReportsArea;