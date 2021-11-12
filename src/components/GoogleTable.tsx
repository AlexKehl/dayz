import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'

interface Props {
  headers?: string[]
  rows?: string[][]
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
            <Th>{h}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row) => (
          <Tr>
            {row.map((cell) => (
              <Td>{cell}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default GoogleTable
