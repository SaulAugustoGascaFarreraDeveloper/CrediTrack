import * as React from "react";
import {
  ChevronDownIcon,
  Edit,
  Edit2Icon,
  MoreHorizontal,
  Trash,
} from "lucide-react";
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
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@prisma/client";
import { useRouter } from "next/navigation";
import prisma from "@/db/db"
import { useToast } from "@/components/ui/use-toast";
import { deleteCurrentClient } from "@/lib/actions";
import { ColumnDefWithActions } from "@/lib/types";



function ClientsTable({ data }: { data: Client[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const router = useRouter()

  const {toast} = useToast()


  const handleEditClient = (client: Client,router: any) => {
  
    router.push(`/editClient/${client.id}`);
  };
  
  
  const handleDeleteClient = async (client: Client) => {
  
    
    try{
  
        const userDeleted = await deleteCurrentClient(client.id)

        toast({
          variant: "success",
          title: "Todo Bien.",
          description: "Tu cliente se ha eliminado exitosamente.",
         
      })


      setTimeout(() => {

        location.reload()

      },10)

      return userDeleted
  
    }catch(error)
    {
      console.log("Delte Client Error -->",error)

      toast({
        variant: "destructive",
        title: "Uh! Algo salio mal.",
        description: "Hubo un Error al tratar de eliminar al cliente.",
       
    })
  
    }
  
  }


  const columns: ColumnDefWithActions<Client>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "lastName",
      header: "Apellido",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("lastName")}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => (
        <div>{row.getValue("phone")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        
    
  
        return (
          // <div className="flex flex-row lg:gap-12 md:gap-9 gap-3 space-x-1">
          //     <div onClick={() => handleAction(row.original,router)} className="flex flex-col gap-1 items-center hover:cursor-pointer">
          //      <Edit2Icon />
          //      <span>Editar</span>
          //     </div>
             
            
                
          //     <div onClick={() => handleDeleteClient(row.original)} className="flex flex-col gap-1 items-center hover:cursor-pointer">
          //      <Trash  color="red" />
          //      <span className="text-red-500">Eliminar</span>
          //     </div>
          //     {/* <Button variant="default" onClick={() => handleAction(row.original,router)}>
          //       Editar 
          //     </Button> */}

          // </div>

          
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} className="p-0 h-8 w-8" >
                   <span className="sr-only">Open menu</span>
                   <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" >
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator className="border-slate-600 border " />
                    <DropdownMenuItem className="flex flex-row gap-2 mr-2 hover:cursor-pointer" onClick={() => handleEditClient(row.original,router)} >
                        <Edit size={18}  /> 
                        <span> Editar </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClient(row.original)} className="flex flex-row gap-2 mr-1 hover:cursor-pointer">
                        <Trash color="red" size={18}  /> 
                        <span  className="text-red-600"> Eliminar </span>
                    </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          
          
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
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
    initialState:{
      pagination:{
        pageSize: 3
      }
    }
  });

  // Función para manejar el cambio de página hacia atrás
  const handlePreviousPage = () => {
    if (table.getCanPreviousPage()) {
      table.previousPage();
    }
  };

  // Función para manejar el cambio de página hacia adelante
  const handleNextPage = () => {
    if (table.getCanNextPage()) {
      table.nextPage();
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas <ChevronDownIcon className="ml-2 h-4 w-4" />
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
                );
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
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
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ClientsTable;
