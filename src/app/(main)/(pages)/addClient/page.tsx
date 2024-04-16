"use client"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { ClientFormSchema } from "@/lib/schemas"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { createClient } from "@/lib/actions"
import { useState } from "react"
import {  useRouter } from "next/navigation"


const AddClientPage = () => {

   const [isLoading,setIsLoading] = useState<boolean>(false)

   const router = useRouter()

    
   const clientForm = useForm<z.infer<typeof ClientFormSchema>>({
    resolver: zodResolver(ClientFormSchema),
    
    })
    

    let cId: string | Response

    const createClientData = async () => {

        setIsLoading(true)

        try{
            
            const clientId = await createClient(clientForm.getValues().name,clientForm.getValues().lastName,clientForm.getValues().phone)


            cId = clientId

            console.log(cId)
            //console.log(clientId)

            return clientId

        }catch(error)
        {
            console.log(error)
        }finally{
            setIsLoading(false)
            clientForm.reset()

            setTimeout(() => {
                
            router.push(`/addLoan/${cId}`)
            

    
            },100)
            
        }

       

        
       
    }


  return (
    <div className="flex flex-col w-full h-screen lg:items-center items-start p-4 gap-y-10">
        <h1 className="font-semibold text-2xl">Agrega Nuevos Clientes</h1>
        <Form {...clientForm}>
            <form onSubmit={clientForm.handleSubmit(createClientData)} className="lg:w-[800px] w-full">
                <div className="gap-12">

                <FormField 

                    control={clientForm.control}
                    name="name"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel  className="font-semibold lg:text-lg ">Nombre: </FormLabel>
                            <FormControl >
                                <Input disabled={isLoading} placeholder="Ingresa el nombre del cliente...." {...field} />
                            </FormControl>
                        </FormItem>
                    )}


                    />
                    <FormField 

                    control={clientForm.control}
                    name="lastName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="font-semibold lg:text-lg ">Apellido: </FormLabel>
                            <FormControl>
                                <Input disabled={isLoading} placeholder="Ingresa el nombre del cliente...." {...field} />
                            </FormControl>
                        </FormItem>
                    )}


                    />

                        <FormField 

                        control={clientForm.control}
                        name="phone"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="font-semibold lg:text-lg ">Telefono: </FormLabel>
                                <FormControl>
                                    <Input disabled={isLoading} placeholder="Ingresa el telefono del cliente...." {...field} />
                                </FormControl>
                            </FormItem>
                        )}


                        />

                   
                    <Button disabled={isLoading} type="submit" className="gap-2 mt-8">
                        {!isLoading ? <> Agregar <Plus size={18} /> </> : <Loader2 size={18} className="animate-spin" />}
                    </Button>
                  
                    

                </div>
                
            </form>
        </Form>
    </div>
  )
}

export default AddClientPage