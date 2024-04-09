import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

interface ProviderProp{
    children: ReactNode
}


const Provider = ({children} : ProviderProp) => {
  return (
    <ClerkProvider>
        {children}
    </ClerkProvider>
  )
}

export default Provider