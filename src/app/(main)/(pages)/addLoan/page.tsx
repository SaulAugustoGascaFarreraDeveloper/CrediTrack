"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {z} from "zod"
import { LoanFormSchema } from "@/lib/schemas"
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { format, addDays } from "date-fns"; // Importa la función addDays para sumar días a una fecha
import { Input } from "@/components/ui/input"
import { createLoan } from "@/lib/actions"
import { useParams,useRouter, useSearchParams } from "next/navigation"


const AddLoanPage = () => {

    const [date, setDate] = useState<Date | undefined>()
    const [finalDateCalculated,setFinalDateCalculated] = useState<Date | undefined>()
    const [greatTotal,setGreatTotal] = useState<number>(0)
    const [isMounted,setIsMounted] = useState<boolean>(false)
    const [isLoading,setIsLoading] = useState<boolean>(false)
   
    const param = useSearchParams()
    const clientId = param.get('clientId')

    const router = useRouter()

    const form = useForm<z.infer<typeof LoanFormSchema>>({
        resolver: zodResolver(LoanFormSchema),
        defaultValues:{
            client: clientId ? clientId : '',
            startDate: new Date(),
            endDate: new Date(),
            renewal: false,
            totalAmount: ''
        }
    })


    useEffect(() => {
        setIsMounted(true)


        if(date)
        {
            form.setValue("startDate", date);

            setFinalDateCalculated(addDays(date,12))

            

        }
        
    //    // Verifica si hay un ID de cliente en la URL
       if (!clientId) {
        // Si no hay ID de cliente, redirige al formulario para agregar un cliente
         router.push("/addClient");
       }

    },[isMounted,date])


    useEffect(() => {
        if(finalDateCalculated)
            {
                form.setValue("endDate",finalDateCalculated)
            }
    },[finalDateCalculated])

    const createLoanData = async () => {

        setIsLoading(true)

        try{

            

            const response = await createLoan(form.getValues().client,form.getValues().startDate,form.getValues().endDate,form.getValues().totalAmount)

            console.log(response)

            return response

        }catch(error)
        {
            console.log(error)
        }finally{
            form.reset()

            setIsLoading(false)
        }

    }


    


  return (
    <div className="flex flex-col w-full  h-screen lg:items-center items-start  p-4 gap-6">
        <h1 className="font-semibold lg:text-2xl text-sm">Agrega informacion sobre prestamos</h1>
        <Form {...form} >
            <form onSubmit={form.handleSubmit(createLoanData)} className="lg:w-[800px] w-full" >
                <div className="flex flex-col gap-y-12">


                <div className="gap-12 flex lg:flex-row md:flex-row flex-col w-full items-center justify-center">
                   
                   <FormField 
   
                           control={form.control}
                           name="startDate"
                           render={({field}) => (
                               <FormItem>
                                   <FormLabel>Fecha Incio</FormLabel>
                                   <FormControl>
   
                                   <Popover    {...field}>
                                           <PopoverTrigger className="ml-2" asChild>
                                               <Button
                                               variant={"outline"}
                                               className={cn(
                                                   "w-[240px] justify-start text-left font-normal",
                                                   !date && "text-muted-foreground"
                                               )}
                                               >
                                               <CalendarIcon className="mr-2 h-4 w-4" />
                                               {date ? format(date, "PPP") : <span>fecha Prestamo</span>}
                                               </Button>
                                           </PopoverTrigger>
                                           <PopoverContent  className="w-auto p-0" align="start">
                                               <Calendar
                                               mode="single"
                                               selected={date ? date : undefined}
                                               onSelect={setDate}
                                              
                                               initialFocus
                                               />
                                           </PopoverContent>
                                   </Popover>
   
                                   </FormControl>
                               </FormItem>
                           
                           )}
   
                        />
   
   
                       {date && (<FormField 
                           
                           control={form.control}
                           name="endDate"
                           render={({field}) => (
                               <FormItem>
                                   <FormLabel>Fecha Final</FormLabel>
                                   <FormControl>
   
                                   <Popover >
                                           <PopoverTrigger className="ml-2" asChild>
                                               <Button
                                               disabled={true}
                                               variant={"outline"}
                                               className={cn(
                                                   "w-[240px] justify-start text-left font-normal",
                                                   !date && "text-muted-foreground"
                                               )}
                                               >
                                               <CalendarIcon className="mr-2 h-4 w-4" />
                                               {finalDateCalculated ? format(finalDateCalculated, "PPP") : <span>fecha Final Prestamo</span>}
                                               </Button>
                                           </PopoverTrigger>
                                           <PopoverContent className="w-auto p-0" align="start">
                                               <Calendar
                                               mode="single"
                                               selected={finalDateCalculated ? finalDateCalculated : undefined}
                                               onSelect={setFinalDateCalculated}
                                               {...field}
                                               initialFocus
                                               />
                                           </PopoverContent>
                                   </Popover>
   
                                   </FormControl>
                               </FormItem>
                           
                           )}
   
                           />)}
   
   
                              
                                      
                   </div>
   
   
                   <FormField 
                               
                               control={form.control}
                               name="totalAmount"
                               render={({field}) => (
                                   <FormItem>
                                       <FormLabel className="font-semibold lg:text-lg ">AMOUNt: </FormLabel>
                                       <FormControl>
                                           <Input type="number" placeholder="prestamo...." {...field} />
                                       </FormControl>
                                   </FormItem>
                               )}
   
   
                   />
   
                   
   
                   <Button type="submit" className="mt-12" >
                           Crear Prestamo
                   </Button>


                </div>
                

               
              
            </form>
        </Form>
        
   
    </div>
  )
}

export default AddLoanPage