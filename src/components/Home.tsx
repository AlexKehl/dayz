import { getTableData } from '@/api/Tables'
import { AsyncReturnType } from '@/types'
import React, { useEffect, useState } from 'react'
import GoogleTable from './GoogleTable'

const Home = () => {
  const [table, setTable] = useState<AsyncReturnType<typeof getTableData>>()
  useEffect(() => {
    getTableData().then(setTable)
  }, [])
  return <GoogleTable headers={table?.headers} rows={table?.rows}></GoogleTable>
}

export default Home
