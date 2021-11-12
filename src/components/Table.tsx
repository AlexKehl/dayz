import { Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'

interface Props {
  headers?: string[]
}
const GoogleTable = ({ headers }: Props) => {
  if (!headers) {
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
        <Tr>
          <Td>inches</Td>
          <Td>millimetres (mm)</Td>
          <Td isNumeric>25.4</Td>
        </Tr>
        <Tr>
          <Td>feet</Td>
          <Td>centimetres (cm)</Td>
          <Td isNumeric>30.48</Td>
        </Tr>
        <Tr>
          <Td>yards</Td>
          <Td>metres (m)</Td>
          <Td isNumeric>0.91444</Td>
        </Tr>
      </Tbody>
      <Tfoot>
        <Tr>
          <Th>To convert</Th>
          <Th>into</Th>
          <Th isNumeric>multiply by</Th>
        </Tr>
      </Tfoot>
    </Table>
  )
}

export default GoogleTable
