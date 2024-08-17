"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Icon } from '@iconify/react';
import { toast } from "@/components/ui/use-toast";


const ConfigurationForm = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [portNumber, setPortNumber] = useState(4370);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Basic validation
    if (!ipAddress || !portNumber) {
      // reToast.error("Connection failed, Please enter both IP address and port number.")
      toast({
        title: "",
        description: <>Please enter both IP address and port number.</>,
        color: "warning",
      });

      return;
    }

    try {
      const response = await fetch('/api/connection/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip_address: ipAddress,
          port: portNumber
        }),
      });

      if (response.ok) {

        toast({
          title: "Connected successfully",
          description: <>Your connection details have been saved.</>,
          color: "success",
        });

        // Save to local storage
        localStorage.setItem('ipAddress', ipAddress);
        localStorage.setItem('portNumber', portNumber);
      } else {
        toast({
          title: "Connection failed",
          description: "Please check your IP address and port number, or try again later.",
          color: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking connection:', error);

      toast({
        title: "Error",
        description: "An error occurred. Please try again later.",
        color: "destructive",
      });
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">
          <Label htmlFor="hriAddressIP" className="lg:min-w-[160px]">Address IP</Label>
          <InputGroup merged>
            <InputGroupText>
              <Icon icon="mdi:ip-network" />
            </InputGroupText>
            <Input
              type="text"
              placeholder="Enter IP address"
              id="hriAddressIP"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              required
            />
          </InputGroup>
        </div>

        <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">
          <Label htmlFor="hriPortNumber" className="lg:min-w-[160px]">Port Number</Label>
          <InputGroup merged className="flex">
            <InputGroupText>
              <Icon icon="icon-park:import-and-export" />
            </InputGroupText>
            <Input
              type="number"
              placeholder="Enter port number"
              id="hriPortNumber"
              value={portNumber}
              onChange={(e) => setPortNumber(e.target.value)}
              required
            />
          </InputGroup>
        </div>

        <div className="col-span-2 lg:pl-[160px]">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Icon icon="eos-icons:loading" className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Check'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ConfigurationForm;