"use client"

import React from "react";
import ReportsArea from "./components/reports-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicColumn from "./basic-column"

const page = () => {
  const [loading, setLoading] = React.useState(false); // {{ edit_1 }}
  const [analyticsData, setAnalyticsData] = React.useState();

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true); // {{ edit_3 }}
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/analytics`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAnalyticsData(data.data); // Assuming data is in the format { data: [...] }
        console.log(data.data)
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false); // {{ edit_4 }}
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 pt-8">
      {loading ? <div>Loading...</div> :
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ReportsArea analyticsData={analyticsData} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Working Hours Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <BasicColumn analyticsData={analyticsData} />
              </CardContent>
            </Card>
          </div>
        </>
      }
    </div>
  )
}

export default page;