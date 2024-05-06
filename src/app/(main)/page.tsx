"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LampDemo } from "@/components/ui/lamp";
import { Tabs } from "@/components/ui/tabs";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTotalClients, getTotalLoans } from "@/lib/actions";
import { WobbleCard } from "@/components/ui/wobble-card";

export  default function Home() {

  const [clientData, setClientData] = useState({ amount: 0 });
  const [loanData, setLoanData] = useState({ amount: 0 });
  
    const fetchData = async () => {
      // const [clientData,loanData] = await Promise.all([
      //   await getTotalClients(),
      //   await getTotalLoans()
      // ])
      try {
        const clients = await getTotalClients();
        const loans = await getTotalLoans();
        setClientData(clients);
        setLoanData(loans);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    }
  
    
  useEffect(() => {
    fetchData()
  })


  

 

  const tabs = [
    {
      title: "Agregar Cliente",
      value: "product",
      content: (
        <div className="overflow-hidden relative  rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br flex items-center justify-center">
          
          <Link href={'/addClient'}>
          <Card className="lg:w-[350px] w-[260px]  border-2 border-slate-500">
          <CardHeader>
            <CardTitle>Añadir Clientes</CardTitle>
            <CardDescription>Agrega Nuevos Clientes.</CardDescription>
          </CardHeader>
          <CardContent>
          <h1>Agrega Clientes</h1>
          </CardContent>
          <CardFooter className="flex justify-between">
            
          </CardFooter>
        </Card>
      </Link>
        </div>
      ),
    },
    {
      title: "Ver Clientes",
      value: "services",
      content: (
        <div className="overflow-hidden relative rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br flex items-center justify-center">
          
          <Link href={'/getClients'}>
          <Card className="lg:w-[350px] w-[260px] border-2 border-slate-500">
          <CardHeader>
            <CardTitle>Ver Clientes</CardTitle>
            <CardDescription>Consulta a los datos de tus clientes</CardDescription>
          </CardHeader>
          <CardContent>
          <h1>Consulta Clientes</h1>
          </CardContent>
          <CardFooter className="flex justify-between text-lg font-normal">
            <p>Clientes: {clientData.amount}</p>
          </CardFooter>
        </Card>
      </Link>
        </div>
      ),
    },
    {
      title: "Ver Prestamos",
      value: "playground",
      content: (
        <div className=" overflow-hidden relative  rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br flex items-center justify-center">
          
          <Link href={'/getLoans'}>
          <Card className="lg:w-[350px] w-[260px] border-2 border-slate-500">
          <CardHeader>
            <CardTitle>Ver Prestamos</CardTitle>
            <CardDescription>Consulta a los prestamos de tus clientes</CardDescription>
          </CardHeader>
          <CardContent>
          <h1>Consulta Prstamos</h1>
          </CardContent>
          <CardFooter className="flex justify-between text-lg font-normal">
          <p>Prestamos: {loanData.amount}</p>
          </CardFooter>
        </Card>
      </Link>
        </div>
      ),
    },
    
  ];


  

  return (
    <main className="flex h-screen flex-col items-center p-16 gap-8 ">
      
      <h1 className="text-blue-700 font-semibold text-4xl">CrediTrack</h1>
      {/* <Tabs tabs={tabs} />   */}
      <div className="flex lg:flex-row md:flex-row flex-col lg:gap-x-20 md:gap-x-20 gap-y-7">

            <Link href={'/addClient'} >
                <Card className="lg:w-[350px] w-[260px] h-[204px] shadow-lg  border-2 border-slate-500 hover:border-b-4 hover:border-r-4 hover:border-slate-900">
                <CardHeader>
                  <CardTitle>Añadir Clientes</CardTitle>
                  <CardDescription>Agrega Nuevos Clientes.</CardDescription>
                </CardHeader>
                <CardContent>
                <h1>Agrega Clientes</h1>
                </CardContent>
                <CardFooter className="flex justify-between">
                  
                </CardFooter>
              </Card>
            </Link>

            <Link href={'/getClients'}>
                <Card className="lg:w-[350px] w-[260px]  shadow-lg  border-2 border-slate-500 hover:border-b-4 hover:border-r-4 hover:border-slate-900">
                <CardHeader>
                  <CardTitle>Ver Clientes</CardTitle>
                  <CardDescription>Consulta los datos de tus clientes</CardDescription>
                </CardHeader>
                <CardContent>
                <h1>Consulta Clientes</h1>
                </CardContent>
                <CardFooter className="flex justify-between text-lg font-normal">
                  <p>Clientes: {clientData.amount}</p>
                </CardFooter>
              </Card>
            </Link>

      

      </div>


      <div className="">

          <Link href={'/getLoans'}>
              <Card className="lg:w-[788px] w-[260px]  shadow-lg  border-2 border-slate-500 hover:border-b-4 hover:border-r-4 hover:border-slate-900">
              <CardHeader>
                <CardTitle>Ver Prestamos</CardTitle>
                <CardDescription>Consulta a los prestamos de tus clientes</CardDescription>
              </CardHeader>
              <CardContent>
              <h1>Consulta Prstamos</h1>
              </CardContent>
              <CardFooter className="flex justify-between text-lg font-normal">
              <p>Prestamos: {loanData.amount}</p>
              </CardFooter>
            </Card>
          </Link>

      </div>
        
     
    
    </main>
  );
}
