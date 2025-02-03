'use client'

import React, { useState } from "react";
import HrFormWithIcon from "./hr-form-withicon";
import Card from "@/components/ui/card-snippet";
import FixedHeader from "./components/fixed-header";


const page = () => {
  const [shifts, setShifts] = useState([])
  const [schedules, setSchedules] = useState([])

  return <div className="text-2xl font-semibold pt-8 flex flex-col gap-4">

    <Card title="Assign Shift">
      <HrFormWithIcon schedules={schedules} setSchedules={setSchedules}/>
    </Card>

    <Card title="List of Schedules" >
      <FixedHeader schedules={schedules} setSchedules={setSchedules}/>
    </Card>
  </div>;
};

export default page;
