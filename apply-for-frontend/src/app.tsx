import React from 'react'
import MainTable from './MainTable'
import Sidebar from './Sidebar'
import DataSource from './utils/DataSource'
import EventBus from './utils/EventBus'
import {
  APPEND_NEW_BILL,
  UPDATE_FILTER_CATEGORY,
  UPDATE_FILTER_MONTH,
  UPDATE_SORTER_AMOUNT
} from './utils/EventType'

type TableData = Array<CSVLine>
interface AppState {
  tableData: TableData
  applyFilter: Dictionary
  totalIncome: number
  totalPayment: number
}

export default class App extends React.Component<{}, AppState> {
  constructor(props) {
    super(props)
    const tableData = DataSource.getData()
    this.state = {
      tableData,
      applyFilter: {},
      ...this.getTotalAmount(tableData)
    }
  }
  componentDidMount() {
    EventBus.$on(UPDATE_FILTER_MONTH, this.setMonthFilter)
    EventBus.$on(UPDATE_FILTER_CATEGORY, this.setCategoryFilter)
    EventBus.$on(UPDATE_SORTER_AMOUNT, this.setAmountSorter)
    EventBus.$on(APPEND_NEW_BILL, this.appendTableData)
  }
  componentWillUnmount() {
    EventBus.$off(UPDATE_FILTER_MONTH, this.setMonthFilter)
    EventBus.$off(APPEND_NEW_BILL, this.appendTableData)
  }
  setMonthFilter = (month: number) => {
    const newTableData = DataSource.applyFilter({ month }).getData()
    this.updateTableData(newTableData)
  }
  setCategoryFilter = (category: string) => {
    const newTableData = DataSource.applyFilter({ category }).getData()
    this.updateTableData(newTableData)
  }
  setAmountSorter = (sorter: number) => {
    const newTableData = DataSource.applyFilter({
      'sort-amount': sorter
    }).getData()
    this.updateTableData(newTableData)
  }
  getTotalAmount(tableData: TableData) {
    return tableData.reduce<{ totalPayment: number; totalIncome: number }>(
      (res, row) => {
        const num = Math.abs(Number(row.amount))
        if (row.type === '0') res.totalPayment += num
        else res.totalIncome += num
        return res
      },
      { totalPayment: 0, totalIncome: 0 }
    )
  }
  updateTableData(tableData: TableData) {
    const { totalPayment, totalIncome } = this.getTotalAmount(tableData)
    this.setState({ tableData, totalPayment, totalIncome })
  }
  appendTableData = (row: CSVLine) => {
    const newData = DataSource.appendToSource(row).getData()
    this.updateTableData(newData)
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
