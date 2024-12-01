"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdvancedTable from "./advanced";
import DatePickerWithRange from "@/components/date-picker-with-range";

const DataTablePage = () => {


  return (
    <div className="mx-auto container space-y-5">

      <div className="flex items-center flex-wrap justify-between gap-4  mt-9">
        <div className="text-2xl font-medium text-default-800 ">
          Advanced Table
        </div>
        
      </div>

      <Card>
        <CardHeader>

        </CardHeader>
        <CardContent >
          <AdvancedTable />
        </CardContent>
      </Card>



    </div>
  );
};

export default DataTablePage;
