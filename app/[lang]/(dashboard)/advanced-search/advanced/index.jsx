import { Fragment, useEffect, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
// import { data } from "./data";

export default function AdvancedTable() {
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [data, setData] = useState([])
  const [date, setDate] = useState(null)

  const fetchData = async () => {
    try {
      setIsLoadingData(true)
      const response = await fetch("/api/analytics/advanced-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_time: date.from,
          end_time: date.to
        }),
      });

      const { data } = await response.json()
      setData(data)
    } catch (error) {

    } finally {
      setIsLoadingData(false)

    }
  }

  useEffect(() => {
    fetchData()
  }, [date])

  return (
    <Fragment>
      <DataTable isLoadingData = {isLoadingData} data={data} columns={columns} dateControl={{ date, setDate }} />
    </Fragment>
  );
}
