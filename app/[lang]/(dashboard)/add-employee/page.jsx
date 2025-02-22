'use client'

import React, { useState } from "react";
import HrFormWithIcon from "./hr-form-withicon";
import Card from "@/components/ui/card-snippet";
import FixedHeader from "./components/fixed-header";


const page = () => {
  const [employees, setEmployees] = useState([])
  return <div className="text-2xl font-semibold pt-8 flex flex-col gap-4">

    <Card title="Add Employee">
      <HrFormWithIcon employees={employees} setEmployees={setEmployees} />
    </Card>

    <Card title="List of Employees" >
      <FixedHeader employees={employees} setEmployees={setEmployees}/>
    </Card>
  </div>;
};

export default page;
