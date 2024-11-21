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
import { toast } from "@/components/ui/use-toast";


import { users, columns } from "./data";
import { formatDate, formatTime } from "@/lib/utils";

const FixedHeader = ({employees, setEmployees}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch('/api/employee');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchEmployees();
  }, []);

  const onDelete = async (employee) => {
    try {
      const storedIpAddress = localStorage.getItem('ipAddress');
      const storedPortNumber = localStorage.getItem('portNumber');

      if (!storedIpAddress || !storedPortNumber)
        toast({
          title: "Configuration Required",
          description: "Please go to configuration and configure your fingerprint scanner.",
          color: "warning",
        });
      const response = await fetch('/api/employee/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: employee.user_id, ip_address: storedIpAddress, port: storedPortNumber }), // Send employee ID to delete
      });
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      toast({
        title: 'Employee deleted successfully!',
        color: "success"
      }); // Success toast
      setEmployees((prevEmployees) =>
        prevEmployees.filter(emp => emp.user_id !== employee.user_id) // Remove deleted employee from state
      );
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({ title: "Error", description: 'Error deleting employee: ' + error.message, color: "destructive" }); // Error toast
    }
  }


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
              <TableCell>{employee.departement_name ?? "N/A"}</TableCell>
              <TableCell>{`${formatDate(employee.created_at)} : ${formatTime(employee.created_at)}`}</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                  <EditingDialog employee={employee} setEmployees={setEmployees} />
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
                        <AlertDialogAction onClick={() => onDelete(employee)} className="bg-destructive hover:bg-destructive/80">
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
}

export default FixedHeader;


const EditingDialog = ({ employee, setEmployees }) => {
  const [name, setName] = useState(employee.user_name);
  const [phoneNumber, setPhoneNumber] = useState(employee.phone_number);
  const [departementName, setDepartementName] = useState(employee.departement_name);
  const [departementId, setDepartementId] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/departements');
        if (!response.ok) {
          throw new Error("Failed to fetch departments.");
        }
        const data = await response.json();
        setDepartments(data); // Assuming the response is an array of departments
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/employee/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: employee.user_id, name, phoneNumber, departementName }),
      });
      if (!response.ok) {
        throw new Error('Failed to update employee');
      }
      toast({
        title: 'Employee updated successfully!'
        , color: "success"
      }); // Success toast

      // Update the employee data in the list
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.user_id === employee.user_id ? { ...emp, user_name: name, phone_number: phoneNumber, departement_name: departementName } : emp
        )
      );
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({ title: "Error", description: 'Error updating employee: ' + error.message, color: "destructive" }); // Error toast
    } finally {
      setIsLoading(false);
    }
  };

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
          <DialogTitle>Edit Employee</DialogTitle>

          <form action="#" className=" space-y-5 pt-4" onSubmit={handleSubmit}>
            <div>
              <Label className="mb-2">ID</Label>
              <Input placeholder="id" disabled value={employee.user_id} />
            </div>
            <div>
              <Label className="mb-2">Name</Label>
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-2">Phone Number</Label>
              <Input
                placeholder="Title"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-2">Department</Label>
              {isLoading ? ( // Show loading effect
                <div className="text-center">
                  <Icon icon="eos-icons:loading" className="w-6 h-6 animate-spin mx-auto" />
                </div>
              ) : (
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Departement" />
                  </SelectTrigger>
                  <SelectContent >
                    {departments.length > 0 ? (
                      departments.map((departement) => (
                        <SelectItem key={departement.id} value={departement.id}>{departement.departement_name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No departments available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" color="destructive">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit" color="success" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </DialogClose>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};