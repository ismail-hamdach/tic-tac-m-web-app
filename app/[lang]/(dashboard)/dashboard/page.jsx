import React from "react";
import ReportsSnapshot from "./components/reports-snapshot.jsx";
import ReportsArea from "./components/reports-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicColumn from "./basic-column"

const page = () => {
  return (
    <div className="space-y-6 pt-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ReportsArea />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Working Hours Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <BasicColumn />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default page;
