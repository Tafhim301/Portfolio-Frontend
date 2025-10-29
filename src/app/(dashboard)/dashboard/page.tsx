
import BlogCardSkeleton from '@/components/ui/blogCardSkeleton'
import { redirect } from 'next/navigation'
import React from 'react'

export default function Dashboard() {

  redirect('/dashboard/manage-blogs')

  
  return (
    <div><BlogCardSkeleton></BlogCardSkeleton></div>
  )
}
