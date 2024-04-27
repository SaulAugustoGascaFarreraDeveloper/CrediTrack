"use client"
import { getCurrentPaymentData } from "@/lib/actions"
import { Payment,Loan } from "@prisma/client"
import { use, useEffect, useState } from "react"
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


interface GetPaymentPageProps{
    params:{
        loanId: string
    }
}


const GetPaymentPage = ({params: {loanId}} : GetPaymentPageProps) => {

    const [payData,setPayData] = useState<(Payment & {loan: Loan})[]>([])
    const [totalPaymentAmount,setTotalPaymentAmount] = useState<number>(0)

    const getLoanPaymentData = async () => {

        try{

            const data = await getCurrentPaymentData(loanId)

            const res = data?.reduce((acc,pay) => {
                if (pay.paymentAmount !== null && pay.paymentAmount !== undefined) {
                    return acc + pay.paymentAmount;
                } else {
                    return acc;
                }
            },0)

            setTotalPaymentAmount(res)
            
 
            setPayData(data ? data : [])

            
    
            return data

        }catch(error)
        {
            console.log(error)
        }

       

    }


    useEffect(() => {
            getLoanPaymentData()
    })


  return (
    <div className="flex flex-col items-center w-full mt-16 p-9">
        <Table className="">
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="">Prestamo</TableHead>
                <TableHead>Pagado ?</TableHead>
                <TableHead>Cantidad Pagada</TableHead>
                <TableHead className="">Fecha Pago</TableHead>
                <TableHead className="">Numero Pago</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {payData.map((invoice) => (
                <TableRow key={invoice.loanId}>
                    <TableCell className="font-medium">{invoice.loan.totalAmount}</TableCell>
                    <TableCell>{invoice.hasPay ? "Si" : "No"}</TableCell>
                    <TableCell>{invoice.paymentAmount}</TableCell>
                    <TableCell>{invoice.paymentDate?.toLocaleDateString()}</TableCell>
                    <TableCell>{invoice.paymentNumber}</TableCell>
                    {/* <TableCell className="text-right">{invoice.createdAt.toLocaleDateString()}</TableCell> */}
                </TableRow>
                ))}
            </TableBody>
            <TableFooter className="">
                <TableRow className="">
                <TableCell colSpan={4}>Total Pagado</TableCell>
                <TableCell className="text-right">${totalPaymentAmount}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </div>
  )
}

export default GetPaymentPage