"use client"; // Error components must be Client Components

import Card from "@/components/ui/card-snippet";
import FixedHeader from "./fixed-header";
import RowEditingDialog from "./row-editing-dialog"

export default function page() {
  return (
    <div className="text-2xl font-semibold pt-8">
      <Card title="List of Employees">
        <FixedHeader />
      </Card>
    </div>
  );
}
