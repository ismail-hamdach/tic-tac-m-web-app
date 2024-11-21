'use client'

import React from "react";
import HrFormWithIcon from "./hr-form-withicon";
import Card from "@/components/ui/card-snippet";
import FixedHeader from "./components/fixed-header";


const page = () => {
  const [departments, setDepartments] = React.useState([])
  return <div className="text-2xl font-semibold pt-8 flex flex-col gap-4">

    <Card title="Add Departments">
      <HrFormWithIcon departments={departments} setDepartments={setDepartments}/>
    </Card>

    <Card title="List of Departments" >
      <FixedHeader departments={departments} setDepartments={setDepartments}/>
    </Card>
  </div>;
};

export default page;
