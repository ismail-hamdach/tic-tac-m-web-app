"use client"
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Icon } from '@iconify/react';
import { toast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation'; // Import useRouter
import Select from "react-select";


const furits = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const hriFormWithIcon = ({ schedules, setSchedules }) => {



  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingShifts, setIsLoadingShifts] = useState(true);

  const [departementName, setDepartementName] = useState(null);
  const [departementId, setDepartementId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [shiftId, setShiftId] = useState('');
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);



  useEffect(() => {

    const fetchDepartments = async () => {
      setIsLoadingDepartments(true); // Set loading to true when fetching starts
      try {
        const response = await fetch('/api/employee');
        if (!response.ok) {
          throw new Error("Failed to fetch employee.");
        }
        const data = await response.json();

        const fomattedEmployee = data.map(employee => ({
          value: employee.user_id,
          label: employee.user_name,
          employee
        }));
        setEmployees(fomattedEmployee); // Assuming the response is an array of departments
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: "Error",
          description: error.message || "An error occurred while fetching employees.",
          color: "destructive",
        });
      } finally {
        setIsLoadingDepartments(false); // Set loading to false when fetching ends
      }
    };

    fetchDepartments(); // Call the function to fetch departments

  }, []);


  useEffect(() => {
    const fetchShifts = async () => {
      setIsLoadingShifts(true)
      setShiftId(null)
      const selectedEmployee = employees.find(employee => employee.value === employeeId)
      const departementId = selectedEmployee?.employee.departement_id
      try {
        if (!departementId) return
        const response = await fetch(`/api/shifts?id=${departementId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch shift.");
        }
        const data = await response.json()
        const formattedShifts = data.map(elmnt => ({
          value: elmnt.shift_id,
          label: elmnt.shift
        }))
        setShifts(formattedShifts)
      } catch (error) {
        console.error('Error fetching schedules:', error);
        toast({
          title: "Error",
          description: error.message || "An error occurred while fetching schedules.",
          color: "destructive",
        });
      } finally {
        setIsLoadingShifts(false)
      }
    }

    fetchShifts();
  }, [employeeId])



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!shiftId || !employeeId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        color: "destructive",
      });
      setIsLoading(false);
      return;
    }



    try {

      const addDeptResponse = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId, employeeId }),
      });

      if (!addDeptResponse.ok) {
        throw new Error("Failed. Please try again.");
      }

      if (addDeptResponse.ok) {
        const newShift = await addDeptResponse.json()
        console.log(newShift)
        setSchedules((prevShifts) => [newShift.schedule, ...prevShifts])
        toast({
          title: "Success",
          description: "Schedule added successfully.",
          color: "success",
        });
      } else {
        throw new Error("Failed to add Schedule. Please try again.");
      }

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        color: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">



        <div className="col-span-2  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">
          <Label htmlFor="employeeId" className="lg:min-w-[160px]">Employee Name</Label>
          <Select
            className="react-select w-full text-[14px] p-0 m-0"
            classNamePrefix="select"
            defaultValue={employeeId}
            name="employeeId"
            options={employees}
            isLoading={isLoadingDepartments}
            isClearable={true}
            onChange={(selectedOption) => {
              setEmployeeId(selectedOption.value)
              setDepartementId(selectedOption?.employee.departement_id || Null)
              setDepartementName(selectedOption?.employee.department_name || Null)
              setShiftId(null);
            }}
          />
        </div>
        <div className="col-span-2  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">
          <Label htmlFor="departmentName" className="lg:min-w-[160px]">Department Name</Label>
          <span className="react-select w-full text-[14px] p-0 m-0">
            {departementName || 'No employee selected'}
          </span>
        </div>
        <div className="col-span-2  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">
          <Label htmlFor="shiftId" className="lg:min-w-[160px]">Shift</Label>
          <Select
            className="react-select w-full text-[14px] p-0 m-0"
            classNamePrefix="select"
            value={shifts?.find(shift => shift.value === shiftId) || null}
            name="shiftId"
            options={shifts}
            isLoading={isLoadingShifts}
            isClearable={true}
            onChange={(selectedOption) => setShiftId(selectedOption ? selectedOption.value : null)}
          />
        </div>

        <div className="col-span-2 lg:pl-[160px]">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Icon icon="eos-icons:loading" className="mr-2 h-4 w-4 animate-spin" />

            ) : (
              'Submit Form'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default hriFormWithIcon;