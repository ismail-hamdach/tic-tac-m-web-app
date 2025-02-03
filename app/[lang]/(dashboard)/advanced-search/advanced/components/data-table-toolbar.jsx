"use client";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { departments, priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import DatePickerWithRange from "@/components/date-picker-with-range";

export function DataTableToolbar({ table, dateControl, departments }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Name ..."
        value={table.getColumn("name")?.getFilterValue() ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="h-8 min-w-[200px] max-w-sm"
      />

      <DatePickerWithRange dateControl = {dateControl} className={"rounded-xl border-2 text-"}/>


      {table.getColumn("department_name") && (
        <DataTableFacetedFilter
          column={table.getColumn("department_name")}
          title="Department"
          options={departments}
        />
      )}
      {/* {table.getColumn("priority") && (
        <DataTableFacetedFilter
          column={table.getColumn("priority")}
          title="Priority"
          options={priorities}
        />
      )} */}
      {isFiltered && (
        <Button
          variant="outline"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <X className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      )}
      <DataTableViewOptions table={table} />
    </div>

  );
}
