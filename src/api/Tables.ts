import { GoogleSpreadsheet } from 'google-spreadsheet'
import _ from 'lodash'
import EnvProxy from 'EnvProxy'
import axios from 'axios'
import cheerio from 'cheerio'
import { playerMap } from 'src/api/OnlineStatus'
const doc = new GoogleSpreadsheet(EnvProxy.SHEET_ID)

doc.useApiKey(EnvProxy.API_KEY)

const getPlayerNameBySteamId =
  (steamIdMap: ReturnType<typeof getSteamIdMap>) =>
  (cellValue: string): string => {
    const steamIdRegex = /\d{17}/
    if (!steamIdRegex.test(cellValue)) {
      return cellValue
    }
    const [steamId] = cellValue.match(steamIdRegex)!

    return steamIdMap[steamId]?.[0]?.nickName || steamId
  }

const getSteamIdMap = (
  firstPlayer: cheerio.Cheerio,
  acc: { steamId: string; nickName: string }[] = []
): Record<string, { steamId: string; nickName: string }[]> => {
  if (!firstPlayer.next().length) {
    return _.groupBy(acc, 'steamId')
  }

  const steamId = _.trim(firstPlayer.children().first().html()!)
  const nickName = _.trim(
    firstPlayer.children().first().next().children().first().html()!
  )
  return getSteamIdMap(firstPlayer.next(), [...acc, { steamId, nickName }])
}

const mapSteamIdsToNames = async (playerList: string[][]) => {
  const europaSite = await axios.get(
    'https://www.dayzeuropa.com/leaderboard.php?p=quarter'
  )
  console.log(europaSite.status)
  console.log(europaSite.statusText)
  const $ = cheerio.load(europaSite.data)
  const tableChildren = $('#playerTable').children()
  const tableBody = $(tableChildren).children().get(1)

  const firstPlayer = $(tableBody).first()

  const steamIdMap = getSteamIdMap(firstPlayer)

  return playerList.map((row) => {
    return row.map((player) => {
      return getPlayerNameBySteamId(steamIdMap)(player)
    })
  })
}

const getGameTrackerPage = async (): Promise<string> => {
  const { data } = await axios.get(
    'https://www.gametracker.com/server_info/135.125.188.104:2352/'
  )

  const $ = cheerio.load(data)
  return $('#HTML_online_players').html() as string
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
    names,
  }
}
