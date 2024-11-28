'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import type { NewsProps } from './index.interface'

export default function News() {
  const [list, setList] = useState<NewsProps[]>([])

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  useEffect(() => {
    setTimeout(() => {
      const mockData = new Array(10).fill(0).map((_, i) => {
        return {
          id: i,
          title: '新闻标题' + i,
          content: '新闻内容' + i
        }
      })

      setList(mockData)
    }, 500)
  })

  return (
    <>
      <ul>
        {list.map((item) => (
          <Link key={item.id} href={pathname + '/detail' + '?' + createQueryString('id', item.id.toString())}>
            <p>{item.content}</p>
          </Link>
        ))}
      </ul>
    </>
  )
}
