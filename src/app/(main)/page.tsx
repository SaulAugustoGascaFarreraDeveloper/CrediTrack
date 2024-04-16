import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center p-16 gap-8">
      <h1 className="text-blue-700 font-semibold text-4xl">CrediTrack</h1>

      <Link href={'/addClient'}>
          <Card className="w-[350px] border-2 border-slate-500">
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
          <Card className="w-[350px] border-2 border-slate-500">
          <CardHeader>
            <CardTitle>Ver Clientes</CardTitle>
            <CardDescription>Consulta a los datos de tus clientes</CardDescription>
          </CardHeader>
          <CardContent>
          <h1>Consulta Clientes</h1>
          </CardContent>
          <CardFooter className="flex justify-between">
            
          </CardFooter>
        </Card>
      </Link>

      <Link href={'/getLoans'}>
          <Card className="w-[350px] border-2 border-slate-500">
          <CardHeader>
            <CardTitle>Ver Prestamos</CardTitle>
            <CardDescription>Consulta a los prestamos de tus clientes</CardDescription>
          </CardHeader>
          <CardContent>
          <h1>Consulta Prstamos</h1>
          </CardContent>
          <CardFooter className="flex justify-between">
            
          </CardFooter>
        </Card>
      </Link>
     
    </main>
  );
}
