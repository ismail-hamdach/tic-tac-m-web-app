import React from "react";
import HrFormWithIcon from "./hr-form-withicon";
import Card from "@/components/ui/card-snippet";

const page = () => {
  return <div className="text-2xl font-semibold pt-8">

    <Card title="Add Employee">
      <HrFormWithIcon />
    </Card>
  </div>;
};

export default page;
