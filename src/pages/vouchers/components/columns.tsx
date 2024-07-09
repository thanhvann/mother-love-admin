// src/vouchers/components/columns.tsx

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import { Icons } from "@/components/ui/icons";


import { VoucherObj } from "@/models/Voucher";
import CellAction from "./cell-action";

export const columns: ColumnDef<VoucherObj>[] = [

  {
    accessorKey: "voucherCode",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Voucher Code
        <Icons.sort className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "voucherName",
    header: "Voucher Name",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "discount",
    header: "Discount",
  },
  {
    accessorKey: "minOrderAmount",
    header: "Min Order Amount",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: () => <div>Actions</div>,
    cell: ({ row }) => (
      <CellAction
        data={row.original}
        onEditSuccess={() => {
          console.log("Edit success for voucher:", row.original);
        }}
      />
    ),
  },
];
