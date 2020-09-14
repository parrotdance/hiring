import day from 'dayjs'
import React from 'react'
import billData from '../assets/bill.csv'
import categoryData from '../assets/categories.csv'

const categoryMap = categoryData.reduce(
  (res, line) => Object.assign(res, { [line['id']]: line['name'] }),
  {}
)
const Cell = (props: { data: string; key?: string }) => {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '140px',
        lineHeight: '24px',
        textAlign: 'center'
      }}
      key={props.key}
    >
      {props.data}
    </span>
  )
}
const HeaderRow = () => {
  const headerMap = {
    type: '收入/支出',
    time: '时间',
    category: '类型',
    amount: '金额'
  }
  return (
    <div style={{ borderBottom: '1px solid #cccccc' }}>
      {['type', 'time', 'category', 'amount'].map((type, i) => (
        <Cell data={headerMap[type]} key={i.toString()} />
      ))}
    </div>
  )
}
const DataRow = (props: { line: CSVLine; key?: string }) => {
  const { line, key } = props
  const [type, time, category] = [
    line['type'] === '0' ? '支出' : '收入',
    day(line['time']).format('YYYY 年 MM 月 DD 日'),
    categoryMap[line['category']]
  ]
  return (
    <div key={key}>
      <Cell data={type} key="0" />
      <Cell data={time} key="1" />
      <Cell data={category} key="2" />
      <Cell data={line['amount']} key="3" />
    </div>
  )
}

export default function Table() {
  return (
    <div>
      <HeaderRow />
      {billData.map((line, i) => (
        <DataRow line={line} key={i.toString()} />
      ))}
    </div>
  )
}
