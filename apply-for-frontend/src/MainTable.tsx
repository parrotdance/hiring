import day from 'dayjs'
import React from 'react'
import categoryData from './assets/categories.csv'
import Table from './components/Table'
import TableColumn from './components/TableColumn'

const categoryMap = categoryData.reduce(
  (res, line) => Object.assign(res, { [line['id']]: line['name'] }),
  {}
)
export default function MainTable(props: { data: Array<CSVLine> }) {
  return (
    <div className="table">
      <Table data={props.data} width="640px">
        <TableColumn
          prop="type"
          label="收入/支出"
          width="140px"
          formatter={(v) => (v === '0' ? '支出' : '收入')}
        />
        <TableColumn
          prop="time"
          label="时间"
          width="180px"
          formatter={(v) => day(v).format('YYYY 年 MM 月 DD 日')}
        />
        <TableColumn
          prop="category"
          label="类型"
          width="160px"
          formatter={(v) => categoryMap[v]}
        />
        <TableColumn
          prop="amount"
          label="金额"
          width="160px"
          formatter={(v, r: CSVLine) =>
            `${r.type === '0' ? '-' : '+'}${Math.abs(Number(v)).toFixed(2)}`
          }
        />
      </Table>
    </div>
  )
}
