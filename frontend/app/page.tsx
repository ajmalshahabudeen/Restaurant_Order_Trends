'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
  const r = useRouter()
  return (
    <div className='p-4 min-h-screen flex flex-col justify-center items-center'>
      <h1 className='text-5xl uppercase font-bold mb-4'>
        Restaurant Order Trends
      </h1>
      <Button variant='default' size='lg' onClick={() => {
        r.push('/dashboard')
      }}>
        GO
      </Button>
    </div>
  )
}

export default Page