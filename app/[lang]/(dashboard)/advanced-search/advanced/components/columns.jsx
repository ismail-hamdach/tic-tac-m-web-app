"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { labels, priorities, departments, statuses } from "../data/data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { formatDate, formatTime } from "@/lib/utils";


export const columns = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-0.5"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-0.5"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{formatDate(row.getValue("date"))}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "user_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className={`flex items-center justify-center gap-2`}>
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className={`max-w-[500px] truncate font-medium`}>
            {row.getValue("user_name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "department_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Departement" />
    ),
    cell: ({ row }) => {
      const department = departments.find(
        (departments) => departments.value === row.getValue("department_name")
      );

      if (!department) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center justify-center">
          {department.icon && (
            <department.icon className="ltr:mr-2 rtl:ml-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{department.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue("status")
  //     );

  //     if (!status) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {status.icon && (
  //           <status.icon className="ltr:mr-2 rtl:ml-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{status.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    accessorKey: "check_in",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Check In" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className={`flex items-center justify-center gap-2`}>
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className={`max-w-[500px] truncate font-medium`}>
            {row.getValue("check_in") != null ? `${formatDate(row.getValue("check_in"))} - ${formatTime(row.getValue("check_in"))}` : "Null"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "check_out",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Check Out" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className={`flex items-center justify-center gap-2`}>
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className={`max-w-[500px] truncate font-medium`}>
            {row.getValue("check_out") != null ? `${formatDate(row.getValue("check_out"))} - ${formatTime(row.getValue("check_out"))}` : 'Null'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "delay",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delay" />
    ),
    cell: ({ row }) => {
      const delayValue = row.getValue("delay");
      const logId = row.original.id; // Assuming each log has a unique `id` field
  
      // Function to update delay
      const updateDelay = async (newDelayValue) => {
        try {
          const response = await fetch(`/api/logs/${logId}/delay`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ delay: newDelayValue }),
          });
  
          if (!response.ok) {
            throw new Error("Failed to update delay");
          }
  
          // Handle success (e.g., refresh the table or show a notification)
          console.log("Delay updated successfully");
        } catch (error) {
          console.error("Error updating delay:", error);
        }
      };
  
      return (
        <div className={`flex items-center justify-center gap-2 rounded-lg ${delayValue != 0 ? 'bg-orange-500 text-white' : delayValue == 2 ? 'bg-red-500 text-white' : ""}`}>
          <select
            value={delayValue}
            onChange={(e) => updateDelay(Number(e.target.value))}
            className={`bg-transparent outline-none ${delayValue != 0 ? 'text-white' : ''}`}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
            <option value={2}>Absent</option>
          </select>
        </div>
      );
    },
  },
  {
    accessorKey: "Absent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Absent" />
    ),
    cell: ({ row }) => {
      const absentValue = row.getValue("Absent");
      const logId = row.original.id; // Assuming each log has a unique `id` field
  
      // Function to update absence
      const updateAbsence = async (newAbsenceValue) => {
        try {
          const response = await fetch(`/api/logs/${logId}/absence`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ absent: newAbsenceValue }),
          });
  
          if (!response.ok) {
            throw new Error("Failed to update absence");
          }
  
          // Handle success (e.g., refresh the table or show a notification)
          console.log("Absence updated successfully");
        } catch (error) {
          console.error("Error updating absence:", error);
        }
      };
  
      return (
        <div className={`flex items-center justify-center gap-2 rounded-lg ${absentValue ? 'bg-red-500 text-white' : ''}`}>
          <select
            value={absentValue ? "true" : "false"} // Convert boolean to string for the dropdown
            onChange={(e) => updateAbsence(e.target.value === "true")} // Convert string back to boolean
            className={`bg-transparent outline-none ${absentValue ? 'text-white' : ''}`}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      );
    },
  },
  {
    accessorKey: "day_off",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Day Off" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className={`flex items-center justify-center gap-2 rounded-lg ${row.getValue("day_off") == true ? 'bg-green-500 text-white' : ''}`}>
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className={`max-w-[500px] truncate font-medium `}>
            {row.getValue("day_off") == true ? 'Yes' : 'No'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "total_minutes_delay",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Minutes Delay" />
    ),
    cell: ({ row }) => {
      const totalMinutesDelay = row.getValue("total_minutes_delay");
      const hours = Math.floor(totalMinutesDelay / 60);
      const minutes = totalMinutesDelay % 60;

      return (
        <div className={`flex items-center justify-center gap-2 ${totalMinutesDelay != 0 ? 'text-red-500' : ''}`}>
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className={`max-w-[500px] truncate font-medium`}>
            {totalMinutesDelay ? `${hours}H:${minutes}M` : "None"}
          </span>
        </div>
      );
    },
  },

  // {
  //   accessorKey: "priority",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Priority" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("priority")
  //     );

  //     if (!priority) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex items-center">
  //         {priority.icon && (
  //           <priority.icon className="ltr:mr-2 rtl:ml-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <Badge
  //           color={
  //             (priority.label === "High" && "destructive") ||
  //             (priority.label === "Medium" && "info") ||
  //             (priority.label === "Low" && "warning")
  //           }>
  //           {priority.label}
  //         </Badge>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
