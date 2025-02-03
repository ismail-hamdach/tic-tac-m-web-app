"use client"
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { toast } from "@/components/ui/use-toast";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";



import { users, columns } from "./data";
import { formatDate, formatTime, formatTimeTo12Hour } from "@/lib/utils";

const FixedHeader = ({ schedules, setSchedules }) => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch('/api/schedules');
        const data = await response.json();
        console.log(data)
        setSchedules(data);
      } catch (error) {
        setSchedules([])
        console.error('Error fetching shift:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchDepartments();
  }, []);



  const onDelete = async (schedule) => {
    try {
      const response = await fetch(`/api/schedules`, { // Ensure the correct endpoint is used
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId: schedule.schedule_id }), // Include scheduleId in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to delete schedule.");
      }

      setSchedules((prevSchedules) =>
        prevSchedules.filter(elmnt => elmnt.schedule_id !== schedule.schedule_id) // Update state to remove the deleted schedule
      );
      toast({
        title: "Success",
        description: "Schedule deleted successfully.",
        color: "success",
      });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while deleting the schedule.",
        color: "destructive",
      });
    }
  }


  return (
    <Table wrapperClass="h-[400px] overflow-auto custom-scrollbar">
      <TableHeader>
        <TableRow>
          {
            columns.map(column => (
              <TableHead key={column.key} className="bg-default-100 last:pr-6  sticky top-0">
                {column.label}
              </TableHead>
            ))
          }
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-8">
              <Icon icon="eos-icons:loading" className="w-8 h-8 animate-spin mx-auto" />
            </TableCell>
          </TableRow>
        ) : schedules.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-8">
              <div className="flex flex-col items-center">
                <Icon icon="carbon:no-data" className="w-16 h-16 text-gray-400 mb-2" />
                <span>No records found</span>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          (schedules || []).map((shift) => (
            <TableRow key={shift.schedule_id} className="hover:bg-slate-400 hover:bg-opacity-20 hover:cursor-pointer animate-slideDownAndFade">

              <TableCell>{shift.schedule_id}</TableCell>
              <TableCell>{shift.user_name}</TableCell>
              <TableCell>{shift.department_name}</TableCell>
              <TableCell>{formatTimeTo12Hour(shift.start_time || '')} - {formatTimeTo12Hour(shift.end_time || '')}</TableCell>
              <TableCell>{shift.phone_number}</TableCell>
              <TableCell>{`${formatDate(shift.created_at)} : ${formatTime(shift.created_at)}`}</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                  <EditingDialog shiftElem={shift} setSchedules={setSchedules} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className=" h-7 w-7"
                        color="secondary"
                      >
                        <Icon icon="heroicons:trash" className=" h-4 w-4  " />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className=" bg-secondary">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(shift)} className="bg-destructive hover:bg-destructive/80">
                          Ok
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default FixedHeader;


const EditingDialog = ({ shiftElem, setSchedules }) => {

  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [shiftName, setShiftName] = useState(shiftElem.shift_name);
  const [startTime, setStartTime] = useState(shiftElem.start_time);
  const [endTime, setEndTime] = useState(shiftElem.end_time);
  const [departmentId, setDepartmentId] = useState({ value: shiftElem.department_id, label: shiftElem.department_name });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {

    const fetchDepartments = async () => {
      setIsLoadingDepartments(true); // Set loading to true when fetching starts
      try {
        const response = await fetch('/api/departements');
        if (!response.ok) {
          throw new Error("Failed to fetch departments.");
        }
        const data = await response.json();

        const formattedDepartments = data.map(department => ({
          value: department.id,
          label: department.department_name
        }));
        setDepartments(formattedDepartments); // Assuming the response is an array of departments
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: "Error",
          description: error.message || "An error occurred while fetching departments.",
          color: "destructive",
        });
      } finally {
        setIsLoadingDepartments(false); // Set loading to false when fetching ends
      }
    };

    fetchDepartments(); // Call the function to fetch departments

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const requestBody = {
      shift_id: shiftElem.shift_id,
      shift_name: shiftName,
      start_time: startTime,
      end_time: endTime,
      departement_id: departmentId.value
    }

    try {
      const response = await fetch('/api/schedules', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error('Failed to update Shift');
      }
      toast({
        title: 'Shift updated successfully!'
        , color: "success"
      }); // Success toast

      const newShift = await response.json();

      // Update the schedules state in the parent component
      setSchedules(prevShifts =>
        prevShifts.map(shift =>
          shift.shift_id === shiftElem.shift_id ? newShift.shift : shift
        )
      );
    } catch (error) {
      console.error('Error updating shift:', error);
      toast({ title: "Error", description: 'Error updating shift: ' + error.message, color: "destructive" }); // Error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          color="secondary"
          className=" h-7 w-7"
        >
          <Icon icon="heroicons:pencil" className=" h-4 w-4  " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>

          <form action="#" className=" space-y-5 pt-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">
                <Label htmlFor="shiftName" className="lg:min-w-[160px]">Shift Name</Label>
                <InputGroup merged>
                  <InputGroupText>
                    <Icon icon="line-md:pencil-alt-twotone" />
                  </InputGroupText>
                  <Input
                    type="text"
                    placeholder="Shift name"
                    id="shiftName"
                    value={shiftName}
                    onChange={(e) => setShiftName(e.target.value)}
                    required
                  />
                </InputGroup>
              </div>
              <div className="col-span-2  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">

                <Label htmlFor="startTime" className="lg:min-w-[160px]">Start time</Label>
                <InputGroup merged>
                  <InputGroupText>
                    <Icon icon="material-symbols:nest-clock-farsight-analog-outline" />
                  </InputGroupText>
                  <Input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </InputGroup>
              </div>
              <div className="col-span-2  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">
                <Label htmlFor="endTime" className="lg:min-w-[160px]">End time</Label>
                <InputGroup merged>
                  <InputGroupText>
                    <Icon icon="material-symbols:nest-clock-farsight-analog-outline" />
                  </InputGroupText>
                  <Input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </InputGroup>

              </div>

              <div className="col-span-2  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">
                <Label htmlFor="departmentId" className="lg:min-w-[160px]">Department Name</Label>
                <Select
                  className="react-select w-full text-[14px] p-0 m-0"
                  classNamePrefix="select"
                  defaultValue={departmentId}
                  name="departmentId"
                  options={departments}
                  isLoading={isLoadingDepartments}
                  isClearable={true}
                  onChange={(selectedOption) => {
                    setDepartmentId(selectedOption)
                  }}
                />
              </div>


              <div className="flex justify-end space-x-3">
                <DialogClose asChild>
                  <Button type="button" variant="outline" color="destructive">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit" color="success" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                </DialogClose>
              </div>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};