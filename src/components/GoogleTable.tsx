import { PlayerInfo } from '@/pages/api/sheets'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'

interface Props {
  headers?: string[]
  rows?: PlayerInfo[][]
}
const GoogleTable = ({ headers, rows }: Props) => {
  if (!headers || !rows) {
    return <div>Loading</div>
  }
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          {headers.map((h) => (
            <Th idx={h}>{h}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row, rowIdx) => (
          <Tr key={rowIdx}>
            {row.map((player: PlayerInfo) => (
              <Td
                key={player.name}
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
