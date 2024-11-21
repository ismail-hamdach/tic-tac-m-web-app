import { DashBoard, Medical } from "@/components/svg";
// Import the Employee icon (assuming it exists)
import { UserSign, Grid } from "@/components/svg";
import { User, Settings } from "@/components/svg";

export const menusConfig = {
  mainNav: [
    {
      title: "Dashboard",
      icon: DashBoard,
      href: "/dashboard",
    },
    // Add Employee to mainNav
    {
      title: "Employees",
      icon: UserSign,
      href: "/add-employee",
    },
    {
      title: "Departments",
      icon: User,
      href: "/departments",
    },
    {
      title: "Shifts",
      icon: Medical,
      href: "/shifts",
    },
    {
      title: "Configuration",
      icon: Settings,
      href: "/configuration",
    },
  ],
  // Official sidebar
  sidebarNav: {
    modern: [
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
      },
      // Add Employee to mainNav
      {
        title: "Employees",
        icon: User,
        href: "/add-employee",
      },
      {
        title: "Departments",
        icon: Grid,
        href: "/departments",
      },
      {
        title: "Shifts",
        icon: Medical,
        href: "/shifts",
      },
      {
        title: "Configuration",
        icon: Settings,
        href: "/configuration",
      },
    ],
    classic: [
      {
        isHeader: true,
        title: "menu",
      },
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
      },
      // Add Employee to mainNav
      {
        title: "Employees",
        icon: User,
        href: "/add-employee",
      },
      {
        title: "Departments",
        icon: Grid,
        href: "/departments",
      },
      {
        title: "Shifts",
        icon: Medical,
        href: "/shifts",
      },
      {
        title: "Configuration",
        icon: Settings,
        href: "/configuration",
      },
    ],
  },
};