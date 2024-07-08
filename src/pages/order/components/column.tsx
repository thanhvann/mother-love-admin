// src/orders/components/columns.tsx

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { OrderDto } from "@/models/Order"; // Make sure the path to the Order model is correct

export const orderColumns: ColumnDef<OrderDto>[] = [
  {
    accessorKey: "orderId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Order ID
        <Icons.sort className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "afterTotalAmount",
    header: "Total Amount",
  },
  {
    accessorKey: "feedBack",
    header: "Feedback",
  },
];
