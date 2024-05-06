"use client"
import * as React from "react";
import {
  ChevronDownIcon,
  CircleDotDashedIcon,
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
import { Client, Loan } from "@prisma/client";
import { useRouter } from "next/navigation";
import prisma from "@/db/db"
import { useToast } from "@/components/ui/use-toast";
import { createPayment, deleteCurrentClient, deleteCurrentLoan, getClientIdData, updateCurrentLoanData } from "@/lib/actions";
import { ColumnDefWithActions } from "@/lib/types";
import Link from "next/link";
import { channel } from "diagnostics_channel";

interface LoansTableProps{
    data: Loan[] 
}


const LoansTable = ({data} : LoansTableProps) => {

    const [sorting,setSorting] = React.useState<SortingState>([])
    const [columnFilters,setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility,setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection,setRowSelection] = React.useState({})

    const [maxPaymentsReached, setMaxPaymentsReached] = React.useState(false);

    const [clientNames, setClientNames] = React.useState<{ [clientId: string]: string }>({});


    const router = useRouter()

    const {toast} = useToast()


    const handleDeleteLoan = async (loan: Loan) => {

      try{
  
        const loanDeleted = await deleteCurrentLoan(loan.id)

        toast({
          variant: "success",
          title: "Todo Bien.",
          description: "Tu préstamo se ha eliminado exitosamente.",
         
      })


      setTimeout(() => {

        location.reload()

      },10)

      return loanDeleted
  
    }catch(error)
    {
      console.log("Delete Loan Error -->",error)

      toast({
        variant: "destructive",
        title: "Uh! Algo salio mal.",
        description: "Hubo un Error al tratar de eliminar el préstamo.",
       
    })
  
    }

    }


    const handleEditLoanPage = async (loan: Loan) => {

      try{

        router.push(`/editLoan/${loan.id}`)

      }catch(error)
      {
        console.log(error)
      }

    }

    const handleAddPayment = async (loan: Loan) => {


      //  const response = await createPayment(true, loan.id); 

      

        router.push(`/addPayment/${loan.id}`)

    }

    const handlegetPayment = async (loan: Loan) => {
      router.push(`/getPayment/${loan.id}`)
    }

    React.useEffect(() => {

      const fetchClientNames = async () => {
        const names: { [clientId: string]: string } = {};
        for (const loan of data) {
          if (loan.clientId) {
            const clientData = await getClientIdData(loan.clientId);
            names[loan.clientId] = clientData ? clientData.name : 'Cliente no encontrado';
          }
        }
        setClientNames(names);
      };
  
      fetchClientNames();

    },[data])

    const getClientName = (clientId: string | undefined) => {
      if (!clientId) return '';
      return clientNames[clientId] || 'Cliente no encontrado';
    };


    const columns: ColumnDefWithActions<Loan>[] = [

        {
            accessorKey: "clientId",
            header: "Cliente",
            cell: ({row}) => {
                
                // const clientId: string |  undefined = row.getValue("clientId")

                // if(!clientId) return null

                // try{
                //   const client = await getClientIdData(clientId)

                //   return(
                //     <div className="capitalize">
                //       {client ? `${client.name}` : "Cliente no Encontrado " }
                //     </div>
                //   )
                // }catch(error)
                // {
                //   console.log(error)
                // }

                return (<div className="capitalize">
                     { getClientName(row.getValue('clientId'))}
                </div>)

                
                
            }
        },
        {
            accessorKey: "totalAmount",
            header: "Monto Préstamo",
            cell: ({row}) => (
                <div className="capitalize">
                    {row.getValue("totalAmount")}
                </div>
            )
        },
        {
          accessorKey: "interestRate",
          header: "Tasa de Interés",
          cell: ({row}) => (
              <div className="capitalize">
                  {row.getValue("interestRate")} %
              </div>
          )
      },
        {
          accessorKey: "greatTotalAmount",
          header: "Monto Total",
          cell: ({row}) => (
            <div className="capitalize">
              {row.getValue("greatTotalAmount")}
            </div>
          )
        },
        {
            accessorKey: "startDate",
            header: "Fecha Préstamo Inicio",
            cell: ({row}) => (
                <div className="capitalize">
                    {new Date(row.getValue("startDate")).toLocaleDateString()}
                </div>
            )
        },
        {
            accessorKey: "endDate",
            header: "Fecha Préstamo Fin",
            cell: ({row}) => (
                <div className="capitalize">
                   {new Date(row.getValue("endDate")).toLocaleDateString()}
                </div>
            )
        },
        {
          accessorKey: "remainingBalance",
          header: "Restante para Liquidar",
          cell: ({row}) => (
              <div className="capitalize">
                 {row.getValue("remainingBalance")}
              </div>
          )
        },
        {
          accessorKey: "renewal",
          header: "Renovación ?",
          cell: ({row}) => (
              <div className="capitalize">
                 {row.getValue("renewal") === false ? "No" : "Si"}
              </div>
          )
        },
        {
          id: "actions",
          enableHiding: false,
          cell: ({row}) => {
            const action = row.original

            return(
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
                      <DropdownMenuItem className="flex flex-row gap-2 mr-2 hover:cursor-pointer" onClick={() => handleEditLoanPage(row.original)} >
                          <Edit size={18}  /> 
                          <span> Editar </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteLoan(row.original)} className="flex flex-row gap-2 mr-1 hover:cursor-pointer">
                          <Trash color="red" size={18}  /> 
                          <span  className="text-red-600"> Eliminar </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="border-slate-600 border " />
                     
                      <div className="flex flex-col gap-2 mt-2">

                        <Button disabled={maxPaymentsReached} onClick={() => handleAddPayment(row.original)} variant={"default"} className="items-center" >
                            Agregar Pago
                        </Button>

                        <Button onClick={() => handlegetPayment(row.original)} variant={"default"} className="items-center" >
                            Ver Pagos
                        </Button>

                      </div>
                        

                      
                      
                </DropdownMenuContent>
              </DropdownMenu>
            )

          }
        }

    ]

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
      });

      //calcular total amount
      const totalAmountSum = data.reduce((total,loan) => total + loan.totalAmount,0)

      //calcular el gran total 
      const greatTotalAmountSum = data.reduce((total,loan) => total + (loan.greatTotalAmount ?? 0) ,0)

      const moneyNotReceivedSum = data.reduce((total,loan) => total + (loan.moneyNotReceived ?? 0),0)

      

  return (
    <div className="w-full">
        <div className="flex items-center py-4">
            <Input 
                placeholder="Filtrar..."
                value={(table.getColumn("clientId")?.getFilterValue() as string) ?? ""}
                onChange={(e) => 
                    table.getColumn("clientId")?.setFilterValue(e.target.value)
                }
                className="max-w-sm"
            />
            <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button  variant={'outline'} className="ml-auto">
                            Columnas <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table.getAllColumns().filter((column) => column.getCanHide())
                        .map((column) => {
                            return(
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
                        <TableRow key={headerGroup.id} >
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder ? 
                                    null : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
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

        <div className="flex w-full flex-col  mt-2 gap-y-2" >
                  <div className="ml-auto flex flex-row gap-2 mr-4">
                    <h3 className="font-extrabold">Total: </h3> 
                    <span>${totalAmountSum}</span>
                  </div>
                  <div className="ml-auto flex flex-row gap-2 mr-4">
                    <h3 className="font-extrabold">Gran Total: </h3> 
                    <span>${greatTotalAmountSum}</span>
                    
                  </div>
                  {moneyNotReceivedSum > 0 && <div className="ml-auto flex flex-row gap-2 mr-4">
                    <h3 className="font-extrabold">Dinero No Entrante Renovacion : </h3> 
                    <span>${moneyNotReceivedSum}</span>
                    
                  </div>}
                 
        </div>
        
    </div>
  )
}

export default LoansTable