'use client'

import React, { useState } from "react";
import HrFormWithIcon from "./hr-form-withicon";
import Card from "@/components/ui/card-snippet";
import FixedHeader from "./components/fixed-header";


const page = () => {
  const [shifts, setShifts] = useState([])

  return <div className="text-2xl font-semibold pt-8 flex flex-col gap-4">

    <Card title="Add Shifts">
      <HrFormWithIcon shifts={shifts} setShifts={setShifts}/>
    </Card>

    <Card title="List of Shifts" >
      <FixedHeader shifts={shifts} setShifts={setShifts}/>
    </Card>
  </div>;
};

export default page;
