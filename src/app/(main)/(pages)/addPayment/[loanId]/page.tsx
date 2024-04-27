"use client"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { createPayment } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'


interface PaymentPageProps{
    params:{
        loanId: string
    }
}


const PaymentPage = ({params: {loanId}} : PaymentPageProps) => {

  const [hasPay,setHasPay] = useState<boolean>(null!)
  const [payAmount,setPayAmount] = useState<number>(0)
  const [isLoading,setIsLoading] = useState<boolean>(false)

  const [maxPaymentsReached, setMaxPaymentsReached] = React.useState(false);

  const router = useRouter()

  const handleCreatePayData = async () => {

    setIsLoading(true)

    try{

      const response = await createPayment(hasPay,loanId,payAmount.toString())

      
          

          // Verificar si la respuesta es un objeto con una propiedad 'status'
        if (typeof response === 'object' && 'status' in response) {
          //console.log("Estado de la respuesta:", response.status);

          if(response.status === 400)
            {
              
              setMaxPaymentsReached(true)

            
            }
        }

         

          setTimeout(() => {
            router.push("/getLoans")
          },!maxPaymentsReached ? 1200 : 0)
          
          
         
  
          return response
          
        

        

     

    }catch(error)
    {
      console.log("Create Payment Error -->",error)

    }finally{
      setIsLoading(false)


    
    }

    // Redirección fuera del bloque try-catch-finally
    

  }

//   useEffect(() => {
//     if (maxPaymentsReached) {
//         const timeoutId = setTimeout(() => {
//             router.push('/getLoans');
//         }, 1500);

//         // Limpiar el timeout en caso de que el componente se desmonte antes de que se complete el timeout
//         return () => clearTimeout(timeoutId);
//     }
// }, [maxPaymentsReached]);

  
  
  return (
    <div className='flex flex-col items-center gap-5'>
        <h1 className='mt-4 font-semibold text-2xl'>Agrega información del Pago</h1>
        <div>loan ID: {loanId}</div>
        {!maxPaymentsReached && ( <div className='flex flex-col gap-4'><span>Ha realizado el pago? </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button>
                  pago ?
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => setHasPay(true)}>
              <span>Si</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHasPay(false)}>
              <span>No</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasPay && (
          <div className='mt-8 flex flex-col'>

              <label>Monto Pago</label>
              <Input placeholder='pago del cliente...' type='number'  value={payAmount} onChange={(e) => setPayAmount(parseFloat(e.target.value))}   />
          </div>
        )}

        <Button disabled={isLoading} onClick={handleCreatePayData} >
          {!isLoading ? "subir" : "cargando ...."}
        </Button> </div>)}
        {maxPaymentsReached && <div> 


                <p className='text-2xl font-semibold text-red-600'>
                  YA NO PUEDES AGREGAR MAS PAGOS, YA SE UMPCLIERON LOS 12 PAGOS NECESARIOS
                </p>  
          
                
          
        </div>}
    </div>
    
  )
}

export default PaymentPage