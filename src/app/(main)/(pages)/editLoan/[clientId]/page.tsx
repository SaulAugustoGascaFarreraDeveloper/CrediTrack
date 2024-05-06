"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getCurrentLoanData, updateCurrentLoanData } from "@/lib/actions"
import { formatCurrency } from "@/lib/formatters"
import { Loan } from "@prisma/client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"


interface EditLoanPageProps{
    params:{
        clientId: string
    }
}


const EditLoanPage = ({params:{clientId}} : EditLoanPageProps) => {

    const [loan,setLoan] = useState<Loan | null>(null)
    const [total,setTotal] = useState<string>()
    const [totalAmount,setTotalAmount] = useState<string>()
    const [renewal,setRenewal] = useState<boolean>(false)
    const [date,setDate] = useState<Date | undefined>()


    const handleGetCurrentLoan = async () => {

        const data = await getCurrentLoanData(clientId)


        setLoan(data ? data : null)
    }


    useEffect(() => {

        handleGetCurrentLoan()

    },[])

    const handleEditLoan = async () => {

        try{

            const response = await updateCurrentLoanData(clientId,renewal,totalAmount,loan?.remainingBalance ?? 0,date)

            
    
            return response

        }catch(error)
        {
            console.log(error)
        }

       

    }

    const handleTotalChange = (value: string) => {
        //const numericValue = parseFloat(value) / 100; // Convertir a centavos
        // Eliminar el símbolo de moneda y los separadores de miles
        //const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
        const numericValue = parseFloat(value.replace(/[$,]/g, ''));
        setTotalAmount(formatCurrency(numericValue));

        console.log(totalAmount)
    };

    // const handleChange = (e: any) => {
    //     const value = e.target.value;
    //     // Eliminar cualquier caracter que no sea número
    //     const numericValue = value.replace(/[^0-9.]/g, '');
    //     // Convertir a número con dos decimales
    //     const formattedValue = parseFloat(numericValue).toFixed(2);
    //     // Formatear como moneda en pesos mexicanos
    //     const formattedCurrency = parseFloat(formattedValue).toLocaleString('es-MX', {
    //       style: 'currency',
    //       currency: 'MXN',
    //     });
    //     setTotalAmount(formattedCurrency);

    //     console.log(totalAmount)
    //   };


    const handleBlur = () => {
        // Si el campo está vacío, no hacemos nada
        if (!totalAmount) return;
    
        // Eliminar cualquier caracter que no sea número
        const numericValue = totalAmount.replace(/[^0-9.]/g, '');
        // Convertir a número con dos decimales
        const formattedValue = parseFloat(numericValue).toFixed(2);
        // Formatear como moneda en pesos mexicanos
        const formattedCurrency = parseFloat(formattedValue).toLocaleString('es-MX', {
          style: 'currency',
          currency: 'MXN',
        });
        setTotalAmount(formattedCurrency);

        console.log(totalAmount)
      };
    
      const handleChange = (e: any) => {
        setTotalAmount(e.target.value);
      };


  return (
    <div className="flex flex-col gap-6 p-24">
        LOAN CLIENT ID: {clientId}

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
            <div className="flex flex-col gap-4">
                <label>Te liquida con: </label>
                <Input type="number" value={loan?.remainingBalance ?? 0} disabled={true}   />
                <Input type="text" value={totalAmount}  onChange={(e) =>
                    setTotalAmount(e.target.value)
                    //handleTotalChange(e.target.value);
                    //handleChange
                }  placeholder="Ingreso el Monto Nuevo de la Renovacion..." />
               
                <label>Fecha Inicio: </label>
                <Popover>
                    <PopoverTrigger className="ml-2" asChild>
                        <Button>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date,"PPP") : <span>Fecha Renovacion</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                        <Calendar 
                            mode="single"
                            selected={date ?? undefined}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <Button className="mt-6" onClick={handleEditLoan} variant={"secondary"} >
                    EDITAR
                </Button>
            </div>
         )}
        
    </div>
  )
}

export default EditLoanPage