// @ts-nocheck
import Env from 'Env'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import nc from 'next-connect'
import cors from 'cors'

const doc = new GoogleSpreadsheet(Env.SHEET_ID)

doc.useApiKey(Env.API_KEY)

export const getTableData = async () => {
  await doc.loadInfo()
  const sheet = doc.sheetsByIndex[0] // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  const rows = await sheet.getRows()

  return {
    headers: doc.sheetsByIndex[0].headerValues,
    rows: rows.map((r) => r._rawData),
  }
}

const handler = nc()
  .use(cors())
  .get(async (req, res) => {
    const data = await getTableData()
    // console.log(data.headers.rowIndex);
    res.json(data)
  })

export default handler
