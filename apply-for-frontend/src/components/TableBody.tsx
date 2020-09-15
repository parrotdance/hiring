import React from 'react'
import Cell from './TableCell'
import { TableColInfo } from './TableTypes'

export default (props: { cols: Array<TableColInfo>; data: Array<object> }) => {
  const colMap = props.cols.reduce(
    (res, col) =>
      Object.assign(res, {
        [col.prop]: {
          formatter: col.formatter || null,
          width: col.width
        }
      }),
    {}
  )
  return (
    <div className="parotable-body">
      {props.data.map((row, i) => (
        <div className="parotable-row" key={i}>
          {Object.entries(row).map(([prop, value], i) => (
            <Cell
              data={colMap[prop] ? colMap[prop].formatter(value, row) : value}
              width={colMap[prop].width}
              key={i}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
