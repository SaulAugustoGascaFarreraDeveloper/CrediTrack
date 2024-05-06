"use client"
import React, { useEffect, useState } from 'react'
import { getAllClientData } from '@/lib/actions'
import { Client, Loan } from '@prisma/client'
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
import ClientsTable from './_components/ClientsTable'




const ClientsPage = () => {

    const [clients, setClients] = useState<Client[] | undefined>();


    useEffect(() => {

        getClients()

    },[])

    const getClients = async () => {

        const res = await getAllClientData()

       
        if(res instanceof Response)
        {
             // Manejar el caso de error, por ejemplo lanzando una excepción
             throw new Error('Error al obtener los clientes');
        }else{
            setClients(res)
        }
        



        return res

    }

    
  return (
    <div className='flex w-full h-screen flex-col items-center  lg:p-24 md:p-20 p-3 gap-4'>
        
       <h1 className='font-semibold lg:text-2xl md:text-xl text-sm '>Clientes Registrados</h1>
       <ClientsTable data={clients || []}  />
    </div>
  )
}

export default ClientsPage