import { GetServerSideProps } from 'next'

import Home from '@/components/Home'
import { getTableData } from '@/api/Tables'
import { AsyncReturnType } from '@/types'

interface Props {
  tableData: AsyncReturnType<typeof getTableData>
}

const HomePage = ({ tableData }: Props) => {
  return <Home tableData={tableData} />
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tableData = await getTableData()
  return {
    props: { tableData },
  }
}

export default HomePage
