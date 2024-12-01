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

const hriFormWithIcon = ({ shifts, setShifts }) => {



  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shiftName, setShiftName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [departmentId, setDepartmentId] = useState('');
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

    // Basic validation
    if (!shiftName || !startTime || !endTime || !departmentId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        color: "destructive",
      });
      setIsLoading(false);
      return;
    }



    try {

      const addDeptResponse = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shift_name: shiftName, start_time: startTime, end_time: endTime, departement_id: departmentId }),
      });

      if (!addDeptResponse.ok) {
        throw new Error(". Please try again.");
      }

      if (addDeptResponse.ok) {
        const newShift = await addDeptResponse.json()
        setShifts((prevShifts) => [newShift, ...prevShifts])
        toast({
          title: "Success",
          description: "Department added successfully.",
          color: "success",
        });
      } else {
        throw new Error("Failed to add Department. Please try again.");
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
            onChange={(selectedOption) => setDepartmentId(selectedOption.value)}
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