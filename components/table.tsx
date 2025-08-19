"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
type CartResponse ={
id: string;
  customerId: string;
  items: {
    id: string;
    productId: string;
    quantity: number;
    variantId: string;
  }[];
}

type Order = {
  id: number;
  customerId: string;
    total_amount: number;
  status: string;
  items: {
    id: string;
    productVariantId: number;
    quantity: number;
    orderId: number;
  }[];
}

interface Customer{
  customer:any

  id:Number
  email:string
  phone_number:string
}

// type Cart ={
// carts:CartResponse[]
// }


const customerDetails = async (id: string): Promise<Customer> => {
  try {
    const response = await fetch(`/api/customers?id=${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const customer: Customer = await response.json();
    console.log("lo",customer.customer)

    return customer.customer;
  } catch (error) {
    console.error('Error fetching customer details:', error);
    throw error;
  }
};

const columns = (customerMap: Record<string, Customer>):  ColumnDef<Order>[] => [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "customerEmail",
    header: "Customer Email",
    cell: ({ row }) => {

      const customer = customerMap[row.original.customerId];
      return customer ? customer.email : "Loading...";
    },
  },
    {
    accessorKey: "customerPhone",
    header: "Customer Phone",
    cell: ({ row }) => {
      const customer = customerMap[row.original.customerId];
      return customer ? customer.phone_number : "Loading...";
    },
  },
  {
    header: "Items Count",
    cell: ({ row }) => row.original.items.length,
  },
  
    {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => {
      return row.original.total_amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },
  },
      {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return row.original.status
    },
  },   {
    accessorKey: "view",
    header: "view",
    cell: ({ row }) => {
      return (
        <a href={`/order/${row.original.id}`}>
        <Button >
          View
        </Button>
        </a>
      )
    },
  }

];

export function DataTableDemo({ carts ,orders}: { carts: CartResponse[],orders: Order[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  console.log("ff",orders)
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
// Update the state type to store a record of customer IDs to Customer objects
const [customerMap, setCustomerMap] = React.useState<Record<string, Customer>>({});

React.useEffect(() => {
  const loadCustomerEmails = async () => {
    const uniqueCustomerIds = [...new Set(orders.map(cart => cart.customerId))];

    const customerEntries = await Promise.all(
      uniqueCustomerIds.map(async (id) => {
        try {
          const customer = await customerDetails(id);
          return [id, customer] as [string, Customer];
        } catch (error) {
          console.error(`Error loading customer ${id}:`, error);
          return [id, null];
        }
      })
    );

    // Filter out null values and create the customer map
    const validCustomers = customerEntries.filter(([_, customer]) => customer !== null);
    setCustomerMap(Object.fromEntries(validCustomers));
  };

  loadCustomerEmails();
}, [carts]);
  const table = useReactTable<Order>({
    data: orders  ,
    columns: columns(customerMap),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  function handleRowClick(original: any): void {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                    )}
                </TableHead>
                )
              })}
              </TableRow>
            ))}
            </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={Number(row.original.id)}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
