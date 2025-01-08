import { Fragment, useEffect, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
// import { data } from "./data";

export default function AdvancedTable() {
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [data, setData] = useState([])
  const [departments, setDepartments] = useState([])
  const [date, setDate] = useState({ 
    from: new Date(new Date().setDate(new Date().getDate() - 1)),
    to: new Date() 
  })

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



  const fetchDataDepartements = async () => {
    try {
      setIsLoadingData(true)





      const response = await fetch('/api/departements');
      const data = await response.json();


      setDepartments(data.map(department => {
        return {
          value: department.department_name,
          label: department.department_name,
        }
      }))
    } catch (error) {

    } finally {
      setIsLoadingData(false)

    }
  }

  useEffect(() => {
    fetchData()
  }, [date])

  useEffect(() => {
    fetchDataDepartements()
  }, [])

  return (
    <Fragment>
      <DataTable isLoadingData={isLoadingData} data={data} columns={columns} dateControl={{ date, setDate }} departments={departments} />
    </Fragment>
  );
}
