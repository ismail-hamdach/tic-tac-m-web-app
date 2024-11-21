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

const FixedHeader = ({departments, setDepartments}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch('/api/departements');
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departement:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchDepartments();
  }, []);

  const onDelete = async (department) => {
    try {
      const response = await fetch('/api/departements', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: department.id}), // Send employee ID to delete
      });
      if (!response.ok) {
        throw new Error('Failed to delete department');
      }
      toast({
        title: 'department deleted successfully!',
        color: "success"
      }); // Success toast
      setDepartments((prevDepartment) =>
        prevDepartment.filter(dept => dept.id !== department.id) // Remove deleted employee from state
      );
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({ title: "Error", description: 'Error deleting department: ' + error.message, color: "destructive" }); // Error toast
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
        ) : departments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-8">
              <div className="flex flex-col items-center">
                <Icon icon="carbon:no-data" className="w-16 h-16 text-gray-400 mb-2" />
                <span>No records found</span>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          departments.map((department) => (
            <TableRow key={department.id} className="hover:bg-slate-400 hover:bg-opacity-20 hover:cursor-pointer animate-slideDownAndFade">

              <TableCell>{department.id}</TableCell>
              <TableCell>{department.department_name}</TableCell>
              <TableCell>{`${formatDate(department.created_at)} : ${formatTime(department.created_at)}`}</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                  <EditingDialog department={department} setDepartments={setDepartments} />
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
                        <AlertDialogAction onClick={() => onDelete(department)} className="bg-destructive hover:bg-destructive/80">
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


const EditingDialog = ({ department, setDepartments }) => {

  const [departementName, setDepartementName] = useState(department.department_name);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/departements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: department.id, departementName }),
      });
      if (!response.ok) {
        throw new Error('Failed to update department');
      }
      toast({
        title: 'Department updated successfully!'
        , color: "success"
      }); // Success toast

      // Update the employee data in the list
      setDepartments((prevDepartment) =>
        prevDepartment.map((dept) =>
          dept.id === department.id ? { ...dept, department_name: departementName } : dept
        )
      );
    } catch (error) {
      console.error('Error updating department:', error);
      toast({ title: "Error", description: 'Error updating department: ' + error.message, color: "destructive" }); // Error toast
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
          <DialogTitle>Edit Department</DialogTitle>

          <form action="#" className=" space-y-5 pt-4" onSubmit={handleSubmit}>
            <div>
              <Label className="mb-2">ID</Label>
              <Input placeholder="id" disabled value={department.id} />
            </div>
            <div>
              <Label className="mb-2">Name</Label>
              <Input
                placeholder="Name"
                value={departementName}
                onChange={(e) => setDepartementName(e.target.value)}
              />
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