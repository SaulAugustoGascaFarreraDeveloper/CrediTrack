"use client"
import { Button } from "@/components/ui/button"
import { getCurrentClientData, updateCurrentClientData } from "@/lib/actions"
import { ClientFormSchema, EditClientFormSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Client } from "@prisma/client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { Loader2,Activity } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"



interface EditClientPageProps{
    params:{
        clientId: string
    }
}


const EditClientPage = ({params: {clientId}} : EditClientPageProps) => {


    const [client,setClient] = useState<Client | null>(null)
    const [isLoading,setIsLoading] = useState<boolean>(false)

    const { toast } = useToast()

    const router = useRouter()

    const clientForm = useForm<z.infer<typeof EditClientFormSchema>>({
        resolver: zodResolver(EditClientFormSchema),
        
        })
    
    const handleClientData = async () => {
        const data = await getCurrentClientData(clientId)
        
        setClient(data ? data : null)

    
    }

    const handleUpdateClient = async () => {

        try{
            setIsLoading(true)

            await updateCurrentClientData(clientId,clientForm.getValues().name,clientForm.getValues().lastName,clientForm.getValues().phone)


            toast({
                variant: "success",
                title: "Todo Bien.",
                description: "Tu cliente se actualizo exitosamente.",
               
            })

            router.push("/getClients")

        }catch(error)
        {

            console.log("Edit Client Errror --> ",error)

            toast({
                variant: "destructive",
                title: "Uh! Algo salio mal.",
                description: "Hubo un Error al tratar de editar al cliente.",
               
            })

        }finally{
            setIsLoading(false)
        }

        
    }

    useEffect(() => {

        
        handleClientData()

    },[clientId])


  return (

    <div className="flex flex-col w-full h-screen lg:items-center items-start p-4 gap-y-10">
        <h1 className="font-semibold text-2xl">Edita la informacion del Cliente</h1>
        <Form {...clientForm}>
            <form onSubmit={clientForm.handleSubmit(handleUpdateClient)} className="lg:w-[800px] w-full">
                <div className="gap-12">

                <FormField 

                    control={clientForm.control}
                    name="name"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel  className="font-semibold lg:text-lg ">Nombre: </FormLabel>
                            <FormControl >
                                <Input  defaultValue={client?.name} value={field.value} onChange={field.onChange} disabled={isLoading} placeholder="Ingresa el nombre del cliente...." />
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
                                <Input defaultValue={client?.lastName} value={field.value} onChange={field.onChange}  disabled={isLoading} placeholder="Ingresa el apellido del cliente...." />
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
                                    <Input defaultValue={client?.phone} value={field.value} onChange={field.onChange} disabled={isLoading} placeholder="Ingresa el telefono del cliente...." />
                                </FormControl>
                            </FormItem>
                        )}


                        />

                   
                    <Button disabled={isLoading} type="submit" className="gap-2 mt-8">
                        {!isLoading ? <> Actualizar <Activity size={18} /> </> : <Loader2 size={18} className="animate-spin" />}
                    </Button>
                  
                    

                </div>
                
            </form>
        </Form>
    </div>
    
  )
}

export default EditClientPage