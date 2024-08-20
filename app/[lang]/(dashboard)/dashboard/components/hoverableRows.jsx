"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";


const HoverableRows = ({ data, columns }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {
            columns.map(column => (
              <TableHead key={column}>
                {column}
              </TableHead>
            ))
          }
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                <div className="flex flex-col items-center">
                  <Icon icon="carbon:no-data" className="w-16 h-16 text-gray-400 mb-2" />
                  <span>No records found</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (data?.map((item) => (
            <TableRow key={item.user_id} className="hover:bg-default-100">
              <TableCell>{item.user_id}</TableCell>
              <TableCell>{item.user_name}</TableCell>
              <TableCell>{item.phone_number}</TableCell>
              {/* {/* <TableCell>{item.age}</TableCell> */}
              <TableCell>{Number(item.working_hours).toFixed(2)}</TableCell>
            </TableRow>
          )
          ))}
      </TableBody>
    </Table>
  );
};

export default HoverableRows;
