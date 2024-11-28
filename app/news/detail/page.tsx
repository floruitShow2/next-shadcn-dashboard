'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function NewsDetail() {
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log(searchParams.get('id'))
  })

  return <div>News Detail</div>
}
