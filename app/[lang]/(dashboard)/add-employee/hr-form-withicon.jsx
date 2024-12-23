"use client"
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Select from "react-select";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Icon } from '@iconify/react';
import { toast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation'; // Import useRouter

const hriFormWithIcon = ({ employees, setEmployees }) => {
  const router = useRouter(); // Initialize router
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [portNumber, setPortNumber] = useState();
  const [departements, setDepartements] = useState([])
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true); // New state for loading departments
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [shifts, setShifts] = useState([])
  const [selectedShift, setSelectedShift] = useState(null);
  const [isLoadingShift, setIsLoadingShift] = useState(true); // New state for loading departments


  const fetchShifts = async (id) => {
    if(id == null) return;
    try {
      setIsLoadingShift(true)
      console.log(id)
      const response = await fetch(`/api/shifts?id=${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch Shifts")
      }
      const data = await response.json()
      const formattedShifts = data.map(shift => ({
        value: shift.shift_id,
        label: shift.start_time + " - " + shift.end_time
      }));
      setShifts(formattedShifts);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while fetching shifts.",
        color: "destructive",
      });
    } finally {
      setIsLoadingShift(false)
    }
  }

  useEffect(() => {
    // Retrieve IP address and port from local storage
    const storedIpAddress = localStorage.getItem('ipAddress');
    const storedPortNumber = localStorage.getItem('portNumber');

    if (!storedIpAddress || !storedPortNumber)
      toast({
        title: "Configuration Required",
        description: "Please go to configuration and configure your fingerprint scanner.",
        color: "warning",
      });

    if (storedIpAddress) setIpAddress(storedIpAddress);
    if (storedPortNumber) setPortNumber(Number(storedPortNumber));

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
        setDepartements(formattedDepartments); // Assuming the response is an array of departments
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

  useEffect(() => {
    console.log(selectedDepartment)
    fetchShifts(selectedDepartment);
  }, [selectedDepartment])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!ipAddress || !portNumber) {
      toast({
        title: "Configuration Required",
        description: "Please go to configuration and configure your fingerprint scanner.",
        color: "warning",
      });
      setIsLoading(false);
      return;
    }

    // Basic validation
    if (!fullName || !phoneNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        color: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // New validation for phone number format
    const phoneRegex = /^[0-9]{10}$/; // Example regex for 10-digit phone numbers
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid phone number (10 digits).",
        color: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Check connectivity
      const connectivityResponse = await fetch('/api/connection/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip_address: ipAddress, port: portNumber }),
      });

      if (!connectivityResponse.ok) {
        throw new Error("Connection failed. Please check your network.");
      }

      // Step 3: Prompt for fingerprint scan
      toast({
        title: "Scan Fingerprint",
        description: "Please scan your fingerprint on the device.",
        duration: 9000,
        color: "info"
      });

      // Step 2: Add user
      const addUserResponse = await fetch('/api/employee/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: fullName, phoneNumber, ip_address: ipAddress, port: portNumber, departmentId: selectedDepartment, shiftId: selectedShift }),
      });

      if (!addUserResponse.ok) {
        throw new Error("Failed to add user. Please try again.");
      }

      if (addUserResponse.ok) {
        const { message, user } = await addUserResponse.json(); // Destructure message and user from the response
        setEmployees((prevEmployees) => [user, ...prevEmployees]); // Add new user to the list

        toast({
          title: "Success",
          description: "Employee added successfully with fingerprint.",
          color: "success",
        });
      } else {
        throw new Error("Fingerprint scan failed. Please try again.");
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
          <Label htmlFor="hriFullName1" className="lg:min-w-[160px]">Full Name</Label>
          <InputGroup merged>
            <InputGroupText>
              <Icon icon="mdi:user" />
            </InputGroupText>
            <Input
              type="text"
              placeholder="Your name"
              id="hriFullName1"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </InputGroup>
        </div>


        <div className="col-span-2  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">
          <Label htmlFor="hriPhone1" className="lg:min-w-[160px]">Phone Number</Label>
          <InputGroup merged className="flex">
            <InputGroupText>
              <Icon icon="tdesign:call" />
            </InputGroupText>
            <Input
              type="tel"
              placeholder="Type number"
              id="hriPhone1"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </InputGroup>
        </div>

        <div className="col-span-3  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">


          {/* <div className="col-span-2  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2"> */}
          <Label htmlFor="departmentId" className="lg:min-w-[160px]">Department</Label>
          <Select
            className="react-select w-full text-[14px] p-0 m-0"
            classNamePrefix="select"
            // defaultValue={departmentId}
            name="departmentId"
            options={departements}
            isLoading={isLoadingDepartments}
            isClearable={true}
            onChange={(selectedOption) => {
              setSelectedDepartment(selectedOption.value)
            }}
          />
          {/* </div> */}
          <div className="lg:min-w-[160px] mx-2 cursor-pointer text-primary  hover:text-primary/80" onClick={() => router.push('/departments')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house-plus"><path d="M13.22 2.416a2 2 0 0 0-2.511.057l-7 5.999A2 2 0 0 0 3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7.354" /><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M15 6h6" /><path d="M18 3v6" /></svg>
          </div>
        </div>
        <div className="col-span-3  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">


          {/* <div className="col-span-2  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2"> */}
          <Label htmlFor="shiftId" className="lg:min-w-[160px]">Shift</Label>
          <Select
            className="react-select w-full text-[14px] p-0 m-0"
            classNamePrefix="select"
            // defaultValue={departmentId}
            name="shiftId"
            options={shifts}
            isLoading={isLoadingShift}
            isClearable={true}
            onChange={(selectedOption) => {
              setSelectedShift(selectedOption.value)
            }}
          />
          {/* </div> */}
          <div className="lg:min-w-[160px] mx-2 cursor-pointer text-primary  hover:text-primary/80" onClick={() => router.push('/shifts')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house-plus"><path d="M13.22 2.416a2 2 0 0 0-2.511.057l-7 5.999A2 2 0 0 0 3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7.354" /><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M15 6h6" /><path d="M18 3v6" /></svg>
          </div>
        </div>


        <div className="col-span-2 lg:pl-[160px]">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Icon icon="eos-icons:loading" className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
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