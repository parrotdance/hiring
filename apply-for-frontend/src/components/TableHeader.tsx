import React from 'react'
import Cell from './TableCell'
import { TableColInfo } from './TableTypes'

export default (props: { data: Array<TableColInfo> }) => {
  return (
    <div
      className="parotable-header"
      style={{ borderBottom: '1px solid #ccc' }}
    >
      {props.data.map((col, i) => (
        <Cell data={col.label} width={col.width} key={i} />
      ))}
    </div>
  )
}
