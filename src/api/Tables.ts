import axios from 'axios'

export const getTableData = async () => {
  const { data } = await axios.get('/api/sheets')
  return data
}
