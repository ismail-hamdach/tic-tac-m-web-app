"use client"
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { users, columns } from "./data";
import { formatDate, formatTime } from "@/lib/utils";

const FixedHeader = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employee'); // Adjust the API endpoint as needed
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <Table wrapperClass="h-[400px] overflow-auto custom-scrollbar">
      <TableHeader>
        <TableRow>
          {
            columns.map(column => (
              <TableHead key={column.key} className="bg-default-100 last:pr-6  sticky top-0">
                {column.label}
              </TableHead>
            ))
          }
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-8">
              <Icon icon="eos-icons:loading" className="w-8 h-8 animate-spin mx-auto" />
            </TableCell>
          </TableRow>
        ) : employees.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-8">
              <div className="flex flex-col items-center">
                <Icon icon="carbon:no-data" className="w-16 h-16 text-gray-400 mb-2" />
                <span>No records found</span>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          employees.map((employee) => (
            <TableRow key={employee.id} className="hover:bg-slate-400 hover:bg-opacity-20 hover:cursor-pointer animate-slideDownAndFade">
              <TableCell>{employee.user_id}</TableCell>
              <TableCell>{employee.user_name}</TableCell>
              <TableCell>{employee.phone_number}</TableCell>
              <TableCell>{`${formatDate(employee.created_at)} : ${formatTime(employee.created_at)}`}</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                  <EditingDialog employee={employee} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className=" h-7 w-7"
                        color="secondary"
                      >
                        <Icon icon="heroicons:trash" className=" h-4 w-4  " />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className=" bg-secondary">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/80">
                          Ok
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default FixedHeader;


const EditingDialog = ({ employee }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          color="secondary"
          className=" h-7 w-7"
        >
          <Icon icon="heroicons:pencil" className=" h-4 w-4  " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <form action="#" className=" space-y-5 pt-4">
            <div>
              <Label className="mb-2">Name</Label>
              <Input placeholder="Name" value={employee.name} />
            </div>
            {/* end single */}
            <div>
              <Label className="mb-2">Title</Label>
              <Input placeholder="Title" value={employee.title} />
            </div>
            {/* end single */}
            <div>
              <Label className="mb-2">Email</Label>
              <Input placeholder="Email" type="email" value={employee.email} />
            </div>
            {/* end single */}
            <div>
              <Label className="mb-2">Email</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Role" value={employee.role} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Admin</SelectItem>
                  <SelectItem value="dark">Owner</SelectItem>
                  <SelectItem value="system">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* end single */}
            <div className="flex justify-end space-x-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" color="destructive">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button color="success">Save</Button>
              </DialogClose>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};