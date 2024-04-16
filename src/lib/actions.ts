"use server"
import prisma from "@/db/db"
import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { use } from "react";


export const getCurrentUser = async () => {

    const user = await currentUser()

    if(!user)  return new Response("Unauthorized", { status: 401 });

    return user
}



export const createClient = async (name: string,lastName: string,phone: string) => {
    const user = await currentUser()

    if(!user)  return new Response("Unauthorized", { status: 401 });

    const findUser = await prisma.user.findUnique({
        where:{
            clerkUserId: user.id
        }
    })

    if(!findUser) return new Response("Unauthorized", { status: 401 });

    const client = await prisma.client.create({
        data:{
            name: name,
            lastName: lastName,
            userId: findUser.id,
            phone: phone
        }
    })

    return client.id
}


export const getClientIdData = async (clientId: string) => {

    try{

        const client = await prisma.client.findUnique({
            where:{
              id: clientId
            }
          })
        
          console.log(client)
        
        
          if(!client)
          {
            return redirect("/addClient")
          }


          return client


    }catch(error)
    {
        console.log(error)

        return redirect('/addClient')
    }

}


export const getCurrentClientData = async (clientId: string) => {


    try{
        const findClient = await prisma.client.findFirst({
            where:{
                id: clientId
            }
        })
    
   
         
         return findClient ?? null
    }catch(error)
    {
        console.log(error)
    }
    
   
    

}

export const updateCurrentClientData = async (clientId: string,name?: string,lastName?: string,phone?: string) => {

    const updateData = await prisma.client.update({
        where:{
            id: clientId
        },
        data:{
            name: name,
            lastName: lastName,
            phone: phone
        }
    })


    return updateData

}


export const deleteCurrentClient = async (clientId: string) => {

    try{

        await prisma.client.delete({
            where:{
              id: clientId
            }
        })

    }catch(error)
    {
        console.log("Delte Client Error -->",error)
    }

}



//LOAN DATA ACTIONS


export const createLoan = async (clientId: string,startDate: Date,endDate: Date,totalAmount: string) => {

    const findClient = await prisma.client.findFirst({
        where:{
            id: clientId
        }
    })

    if(!findClient) return new Response("Unauthorized", { status: 401 });

    const loan = await prisma.loan.create({
        data:{
            clientId: findClient.id,
            startDate: startDate,
            endDate: endDate,
            totalAmount: parseFloat(totalAmount)
        }
    })


    return loan

}


export const createTestAction = async (clientId: string,amount: string) => {

    try{

        const user = await currentUser()

        if(!user)  return new Response("Unauthorized", { status: 401 });

        const findUser = await prisma.user.findUnique({
            where:{
                clerkUserId: user.id
            }
        })


        if(!findUser) return console.log("CANNOT FIND CURRENT USER")


        const testData = await prisma.testNumber.create({
            data:{
                clientId: clientId,
                amount: parseInt(amount)
            }
        })


        return testData

    }catch(error)
    {
        console.log("CREATE TEST ERROR: --> ",error)
    }

}


export const getAllClientData = async () => {

    try{

        const user = await currentUser()

        if(!user) return new Response("Unauthorized", { status: 401 });



        const findUser = await prisma.user.findUnique({
            where:{
                clerkUserId: user.id
            }
        })


        if(!findUser) return new Response("Unauthorized", { status: 401 });


        const getClients = await prisma.client.findMany({
            where:{
                userId: findUser.id
            },
            include:{
                loans: true
            }
        })


        return getClients

    }catch(error)
    {
        console.log("Get All Client Data Error --> ",error)
    }

}


//LOAN DATA ACTIONS

export const getAllLoanData = async () => {

    try{

        await getCurrentUser()

        const findClient = await prisma.loan.findMany({
            include:{
                client: true
            }
        })

        return findClient

    }catch(error)
    {
        console.log("Get All Loan Data Error --> ",error)

    }

}




//PAYMENT DATA ACTIONS


export const addPaymentData = async () => {

    try{


        const user = await currentUser()

        if(!user) return new Response("Unauthorized", { status: 401 });

    }catch(error)
    {
        console.log("Create Payment Data error --> ",error)
    }

}

