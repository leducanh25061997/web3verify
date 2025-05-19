import { useState, useEffect, useRef } from 'react'
import './App.css'
import { WagmiProvider } from 'wagmi'
import { config } from './config';
import Homepage from './Homepage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <Homepage />
        </QueryClientProvider> 
    </WagmiProvider>

  )
}

export default App
