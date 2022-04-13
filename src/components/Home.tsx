import React from 'react'
import { getTableData } from 'src/api/Tables'
import { AsyncReturnType } from 'src/types'
import GoogleTable from './GoogleTable'

interface Props {
  tableData: AsyncReturnType<typeof getTableData>
}

const Home = ({ tableData }: Props) => {
  const { headers, rows, names } = tableData
  return <GoogleTable headers={headers} rows={rows} names={names}></GoogleTable>
}

export default Home
