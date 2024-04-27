"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { getCurrentLoanData, updateCurrentLoanData } from "@/lib/actions"
import { Loan } from "@prisma/client"
import { useEffect, useState } from "react"


interface EditLoanPageProps{
    params:{
        clientId: string
    }
}


const EditLoanPage = ({params:{clientId}} : EditLoanPageProps) => {

    const [loan,setLoan] = useState<Loan | null>(null)
    const [totalAmount,setTotalAmount] = useState<number>(0)
    const [renewal,setRenewal] = useState<boolean>(false)


    const handleGetCurrentLoan = async () => {

        const data = await getCurrentLoanData(clientId)


        setLoan(data ? data : null)
    }


    useEffect(() => {

        handleGetCurrentLoan()

    },[])

    const handleEditLoan = async () => {

        try{

            const response = await updateCurrentLoanData(clientId,renewal,totalAmount,loan?.remainingBalance ?? 0)

            console.log(response)
    
            return response

        }catch(error)
        {
            console.log(error)
        }

       

    }


  return (
    <div className="flex flex-col gap-6 p-24">
        LOAN CLIENT ID: {clientId}

        <label>Te liquida con: </label>
        <Input type="number" value={loan?.remainingBalance ?? 0} disabled={true}   />

        <DropdownMenu>
            <DropdownMenuTrigger asChild >
                 <Button>
                    Renovar ?
                 </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setRenewal(true)} >
                    <span>Si</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        {renewal && (
            <div>
                <Input type="number" value={totalAmount} onChange={(e) => setTotalAmount(parseFloat(e.target.value))} />
                <Button className="mt-6" onClick={handleEditLoan} variant={"secondary"} >
                    EDITAR
                </Button>
            </div>
         )}
        
    </div>
  )
}

export default EditLoanPage