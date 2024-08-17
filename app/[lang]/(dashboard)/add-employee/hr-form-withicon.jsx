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

const hriFormWithIcon = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [portNumber, setPortNumber] = useState();

  useEffect(() => {
    // Retrieve IP address and port from local storage
    const storedIpAddress = localStorage.getItem('ipAddress');
    const storedPortNumber = localStorage.getItem('portNumber');
    
    if(!storedIpAddress || !storedPortNumber) 
      toast({
        title: "Configuration Required",
        description: "Please go to configuration and configure your fingerprint scanner.",
        color: "warning",
      });
    
    if (storedIpAddress) setIpAddress(storedIpAddress);
    if (storedPortNumber) setPortNumber(Number(storedPortNumber));

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if(!ipAddress || !portNumber){
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
      });

      // Step 2: Add user
      const addUserResponse = await fetch('/api/employee/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: fullName, phoneNumber, ip_address: ipAddress, port: portNumber }),
      });

      if (!addUserResponse.ok) {
        throw new Error("Failed to add user. Please try again.");
      }

      if (addUserResponse.ok) {
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