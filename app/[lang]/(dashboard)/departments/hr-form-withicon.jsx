"use client"
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Icon } from '@iconify/react';
import { toast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation'; // Import useRouter

const hriFormWithIcon = ({departments, setDepartments}) => {

  
  
  const [isLoading, setIsLoading] = useState(false);

  const [departementName, setDepartementName] = useState([])

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!departementName ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        color: "destructive",
      });
      setIsLoading(false);
      return;
    }

    

    try {
      
      const addDeptResponse = await fetch('/api/departements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: departementName }),
      });

      if (!addDeptResponse.ok) {
        throw new Error(". Please try again.");
      }

      if (addDeptResponse.ok) {
        const newDepartment = await addDeptResponse.json()
        setDepartments((prevDepartments) => [newDepartment, ...prevDepartments]);
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
          <Label htmlFor="hriFullName1" className="lg:min-w-[160px]">Department Name</Label>
          <InputGroup merged>
            <InputGroupText>
              <Icon icon="mdi:user" />
            </InputGroupText>
            <Input
              type="text"
              placeholder="Department name"
              id="hriFullName1"
              value={departementName}
              onChange={(e) => setDepartementName(e.target.value)}
              required
            />
          </InputGroup>
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