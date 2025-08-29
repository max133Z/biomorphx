"use client"

import { MedusaProvider as Provider } from "medusa-react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 1,
    },
  },
})

export default function MedusaProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider
        baseUrl={process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}
        queryClientProviderProps={{ client: queryClient }}
      >
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </QueryClientProvider>
  )
}

