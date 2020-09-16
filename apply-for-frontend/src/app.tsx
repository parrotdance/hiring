import day from 'dayjs'
import React from 'react'
import billData from './assets/bill.csv'
import MainTable from './MainTable'
import Sidebar from './Sidebar'
import EventBus from './utils/EventBus'
import { APPEND_NEW_BILL, UPDATE_FILTER_MONTH } from './utils/EventType'

type TableData = Array<CSVLine>
interface AppState {
  tableData: TableData
  applyFilter: Dictionary
  totalIncome: number
  totalPayment: number
}

const buildMonthDataIndex = (source: TableData) =>
  source.reduce<Dictionary<TableData>>((map, row) => {
    const month = day(row.time).month() + 1
    return Object.assign(map, {
      [month]: map[month] ? map[month].concat([row]) : [row]
    })
  }, {})
let monthDataIndex = buildMonthDataIndex(billData)

export default class App extends React.Component<{}, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      tableData: billData,
      applyFilter: {},
      ...this.getTotalAmount(billData)
    }
  }
  componentDidMount() {
    EventBus.$on(UPDATE_FILTER_MONTH, this.setMonthFilter)
    EventBus.$on(APPEND_NEW_BILL, this.appendTableData)
  }
  componentWillUnmount() {
    EventBus.$off(UPDATE_FILTER_MONTH, this.setMonthFilter)
    EventBus.$off(APPEND_NEW_BILL, this.appendTableData)
  }
  setMonthFilter = (month: number) => {
    this.setState({
      applyFilter: Object.assign(this.state.applyFilter, { month })
    })
    this.updateTableDataByFilters()
  }
  getTotalAmount(
    tableData: TableData
  ): { totalPayment: number; totalIncome: number } {
    return tableData.reduce(
      (res, row) => {
        if (row.type === '0') res.totalPayment += Number(row.amount)
        else res.totalIncome += Number(row.amount)
        return res
      },
      { totalPayment: 0, totalIncome: 0 }
    )
  }
  updateTableDataByFilters() {
    let tableData: TableData
    Object.entries(this.state.applyFilter).forEach(([type, value]) => {
      switch (type) {
        case 'month':
          if (value > 0) {
            tableData = monthDataIndex[value]
          } else {
            tableData = billData
          }
          break
        default:
          return
      }
    })
    if (tableData) {
      const { totalPayment, totalIncome } = this.getTotalAmount(tableData)
      this.setState({ tableData, totalPayment, totalIncome })
    }
  }
  appendTableData = (newData: CSVLine) => {
    billData.push(newData)
    monthDataIndex = buildMonthDataIndex(billData) // after source data changed, the index should be rebuilded
    this.updateTableDataByFilters()
  }
  render() {
    return (
      <div className="app">
        <MainTable data={this.state.tableData} />
        <Sidebar
          totalIncome={this.state.totalIncome}
          totalPayment={this.state.totalPayment}
        />
      </div>
    )
  }
}
