"use client"
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Icon } from '@iconify/react';
const ConfigurationForm = () => {
  return (
    <form>
      <div className="grid grid-cols-2 gap-4">

        <div className="col-span-2  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">
          <Label htmlFor="hriAddressIP" className="lg:min-w-[160px]">Address IP</Label>
          <InputGroup merged>
            <InputGroupText>
              <Icon icon="mdi:ip-network" />
            </InputGroupText>
            <Input type="text" placeholder="Enter IP address" id="hriAddressIP" />
          </InputGroup>
        </div>
        
        
        <div className="col-span-2  flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2">
          <Label htmlFor="hriPortNumber" className="lg:min-w-[160px]">Port Number</Label>
          <InputGroup merged className="flex">
            <InputGroupText>
              <Icon icon="icon-park:import-and-export" />
            </InputGroupText>
            <Input type="number" placeholder="Enter port number" id="hriPortNumber" />
          </InputGroup>
        </div>

        

        
        <div className="col-span-2 lg:pl-[160px]">
          <Button type="submit">Submit Form</Button>
        </div>
      </div>
    </form>
  );
};

export default ConfigurationForm;