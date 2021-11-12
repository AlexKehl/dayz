import { getTableData } from '@/api/Tables'
import { AsyncReturnType } from '@/types'
import React from 'react'
import GoogleTable from './GoogleTable'

interface Props {
  tableData: AsyncReturnType<typeof getTableData>
}

const Home = ({ tableData }: Props) => {
  const { headers, rows } = tableData
  return <GoogleTable headers={headers} rows={rows}></GoogleTable>
}

export default Home
