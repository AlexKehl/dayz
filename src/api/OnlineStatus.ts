import axios from 'axios'
import cheerio from 'cheerio'
import { PlayerInfo } from 'src/types'
import { PROXY_URL } from 'src/utils/Constants'

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

export const getGameTrackerPage = async (): Promise<string> => {
  const { data } = await axios.post(PROXY_URL, {
    method: 'get',
    url: 'https://www.gametracker.com/server_info/135.125.188.104:2352/',
  })

  const $ = cheerio.load(data)
  return $('#HTML_online_players').html() as string
}

export const updateOnlineStatus = async (
  headers: string[],
  names: string[][]
) => {
  const gameTrackerPage = await getGameTrackerPage()

  return {
    headers,
    rows: playerMap(gameTrackerPage, names),
    names,
  }
}
