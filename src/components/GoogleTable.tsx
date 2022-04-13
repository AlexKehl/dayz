import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { updateOnlineStatus } from 'src/api/OnlineStatus'
import { PlayerInfo } from 'src/types'

interface Props {
  headers?: string[]
  rows?: PlayerInfo[][]
  names: string[][]
}
const GoogleTable = ({ headers, rows, names }: Props) => {
  if (!headers || !rows) {
    return <div>Loading</div>
  }

  const [rowsState, setRowsState] = useState<PlayerInfo[][]>(rows)

  useEffect(() => {
    const interval = setInterval(async () => {
      const newRowsState = await updateOnlineStatus(headers, names)
      setRowsState(newRowsState.rows)
    }, 1000 * 30)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          {headers.map((h) => (
            <Th key={h} backgroundColor={'gray.200'}>
              {h}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {rowsState.map((row, rowIdx) => (
          <Tr key={rowIdx}>
            {row.map((player: PlayerInfo, cellIdx) => (
              <Td
                key={rows.length * rowIdx + cellIdx}
                backgroundColor={player.isOnline ? 'green.100' : 'white'}
              >
                {player.name}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default GoogleTable
