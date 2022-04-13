import { GetServerSideProps } from 'next'
import React from 'react'
import { getTableData } from 'src/api/Tables'
import Home from 'src/components/Home'
import { AsyncReturnType } from 'src/types'

interface Props {
  tableData: AsyncReturnType<typeof getTableData>
}

const HomePage = ({ tableData }: Props) => {
  return <Home tableData={tableData} />
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const tableData = await getTableData()
    return {
      props: { tableData },
    }
  } catch (e) {
    console.log(e)
    throw e
  }
}

export default HomePage
