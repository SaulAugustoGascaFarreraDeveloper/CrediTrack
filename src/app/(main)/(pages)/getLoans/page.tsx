"use client"

import { getAllLoanData, getClientIdData } from "@/lib/actions"
import { Loan,Client } from "@prisma/client"
import { useEffect, useState } from "react"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import prisma from "@/db/db"



const GetLoans = () => {

    const [loans,setLoans] = useState<(Loan & { client: Client })[]>([])
    const [total,setTotal] = useState<number>(0)

    const fetchLoanData = async ( ) =>{

        try{

            const loanData = await getAllLoanData()
            //const loansWithClient: (Loan & { client: Client })[] = [];

            const data = loanData?.reduce((acc,loan) => acc + loan.totalAmount,0)

            setTotal(data ? data : 0)
    
            setLoans(loanData ? loanData : [])

        }catch(error)
        {
            console.log(error)
        }

    }



    useEffect(() => {
        fetchLoanData()
    },[total])

  return (
    <div className="flex  flex-col w-full h-screen items-center">
       <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Cliente</TableHead>
          <TableHead>Prestamo Total</TableHead>
          <TableHead>Fecha Inicio</TableHead>
          
          
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans?.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.client.name}</TableCell>
            <TableCell>{invoice.totalAmount}</TableCell>
            <TableCell>{new Date(invoice.startDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short',year: "numeric" })}</TableCell>
            
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{total}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
    </div>
  )
}

export default GetLoans