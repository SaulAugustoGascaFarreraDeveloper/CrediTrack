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

        console.log(res)

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
    <div className='flex w-full h-screen flex-col items-center justify-center lg:p-24 p-3'>
        {/* {clients?.map((client) => {
            return(
                <div key={client.id} >
                    {JSON.stringify(client)}
                </div>
            )
        })} */}
         {/* <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">No.</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellido</TableHead>
          <TableHead>Telefono</TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients?.map((client,index) => (
          <TableRow key={client.id}>
             <TableCell className="font-medium">{index+1}</TableCell>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.lastName}</TableCell>
            <TableCell>{client.phone}</TableCell>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.lastName}</TableCell>
            <TableCell>{client.phone}</TableCell>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.lastName}</TableCell>
            <TableCell>{client.phone}</TableCell>
           
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table> */}
       <ClientsTable data={clients || []}  />
    </div>
  )
}

export default ClientsPage