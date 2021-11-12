// @ts-nocheck
import { GoogleSpreadsheet } from 'google-spreadsheet'
import nc from 'next-connect'
import cors from 'cors'
import EnvProxy from 'EnvProxy'

const doc = new GoogleSpreadsheet(EnvProxy.SHEET_ID)

doc.useApiKey(EnvProxy.API_KEY)

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
