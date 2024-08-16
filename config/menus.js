import { DashBoard } from "@/components/svg";
// Import the Employee icon (assuming it exists)
import { UserSign } from "@/components/svg";
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
      title: "Add Employee",
      icon: UserSign,
      href: "/add-employee",
    },
    {
      title: "List of Employees",
      icon: User,
      href: "/list-employee",
    },
    {
      title: "Configuration",
      icon: Settings,
      href: "/configuration",
    },
  ],
  sidebarNav: {
    modern: [
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
      },
      // Add Employee to mainNav
      {
        title: "Add Employee",
        icon: UserSign,
        href: "/add-employee",
      },
      {
        title: "List of Employees",
        icon: User,
        href: "/list-employee",
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
        title: "Add Employee",
        icon: UserSign,
        href: "/add-employee",
      },
      {
        title: "List of Employees",
        icon: User,
        href: "/list-employee",
      },
      {
        title: "Configuration",
        icon: Settings,
        href: "/configuration",
      },
    ],
  },
};