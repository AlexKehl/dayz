import { GoogleSpreadsheet } from 'google-spreadsheet'
import nc from 'next-connect'
import cors from 'cors'
import EnvProxy from 'EnvProxy'
import axios from 'axios'
import cheerio from 'cheerio'
import { withRetry } from '@/utils/Functions'

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

  const $ = cheerio.load(data)
  return $('#HTML_online_players').html() as string
}

const getPlayerNameBySteamId = async (cellValue: string): Promise<string> => {
  const steamIdRegex = /\d{17}/
  if (!steamIdRegex.test(cellValue)) {
    return cellValue
  }
  const [steamId] = cellValue.match(steamIdRegex)!
  const { data } = await axios.get(
    `https://www.dayzeuropa.com/playerProfile.php?id=${steamId}&p=quarter`
  )

  const $ = cheerio.load(data)
  return $('.playerName').html() || steamId
}

const mapSteamIdsToNames = async (playerList: string[][]) => {
  return Promise.all(
    playerList.map((row) => {
      return Promise.all(
        row.map((player) => {
          return withRetry({ delay: 500, retryAmount: Infinity })(
            getPlayerNameBySteamId
          )(player)
        })
      )
    })
  )
}

export const playerMap = (
  gameTrackerPage: string,
  playerList: string[][]
): PlayerInfo[][] => {
  return playerList.map((row) => {
    return row.map((player) => {
      return {
        isOnline: Boolean(player)
          ? new RegExp(player.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(
              gameTrackerPage
            )
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
  const names = await mapSteamIdsToNames(rows.map((r) => r._rawData))

  return {
    headers,
    rows: playerMap(gameTrackerPage, names),
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
