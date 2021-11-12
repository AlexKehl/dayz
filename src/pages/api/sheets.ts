import { GoogleSpreadsheet } from 'google-spreadsheet'
import nc from 'next-connect'
import cors from 'cors'
import EnvProxy from 'EnvProxy'
import axios from 'axios'

export interface PlayerInfo {
  isOnline: boolean
  name: string
}

const doc = new GoogleSpreadsheet(EnvProxy.SHEET_ID)

doc.useApiKey(EnvProxy.API_KEY)

export const getGameTrackerPage = async (): Promise<string> => {
  const { data } = await axios.get(
    'https://www.gametracker.com/server_info/135.125.188.104:2352/'
  )
  return data
}

export const playerMap = (
  gameTrackerPage: string,
  playerList: string[][]
): PlayerInfo[][] => {
  return playerList.map((row) => {
    return row.map((player) => {
      return {
        isOnline: Boolean(player)
          ? new RegExp(player).test(gameTrackerPage)
          : false,
        name: player,
      }
    })
  })
}

const getDocData = async () => {
  await doc.loadInfo()
  const sheet = doc.sheetsByIndex[0]
  const rows = await sheet.getRows()
  return { headers: doc.sheetsByIndex[0].headerValues, rows }
}

export const getTableData = async () => {
  const [{ headers, rows }, gameTrackerPage] = await Promise.all([
    getDocData(),
    getGameTrackerPage(),
  ])

  return {
    headers,
    rows: playerMap(
      gameTrackerPage,
      rows.map((r) => r._rawData)
    ),
  }
}

const handler = nc()
  .use(cors())
  .get(async (req, res) => {
    const data = await getTableData()
    // @ts-ignore
    res.json(data)
  })

export default handler
