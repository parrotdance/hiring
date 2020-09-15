import day from 'dayjs'
import React from 'react'
import billData from './assets/bill.csv'
import Filter from './Filter'
import MainTable from './MainTable'
import EventBus from './utils/EventBus'
import { APPEND_NEW_BILL, UPDATE_FILTER_MONTH } from './utils/EventType'

type TableData = Array<CSVLine>
interface AppState {
  tableData: TableData
  applyFilter: Dictionary
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
      applyFilter: {}
    }
  }
  componentDidMount() {
    EventBus.$on(UPDATE_FILTER_MONTH, this.setMonthFilter.bind(this))
    EventBus.$on(APPEND_NEW_BILL, this.appendTableData.bind(this))
  }
  componentWillUnmount() {
    EventBus.$off(UPDATE_FILTER_MONTH, this.setMonthFilter.bind(this))
    EventBus.$off(APPEND_NEW_BILL, this.appendTableData.bind(this))
  }
  setMonthFilter(month: number) {
    this.setState({
      applyFilter: Object.assign(this.state.applyFilter, { month })
    })
    this.updateTableDataByFilters()
  }
  updateTableDataByFilters() {
    Object.entries(this.state.applyFilter).forEach(([type, value]) => {
      switch (type) {
        case 'month':
          if (value > 0) {
            const newTableData = monthDataIndex[value]
            this.setState({ tableData: newTableData })
          } else {
            this.setState({ tableData: billData })
          }
          break
        default:
          return
      }
    })
  }
  appendTableData(newData: CSVLine) {
    billData.push(newData)
    monthDataIndex = buildMonthDataIndex(billData) // after source data changed, the index should be rebuilded
    this.updateTableDataByFilters()
  }
  render() {
    return (
      <div className="app">
        <MainTable data={this.state.tableData} />
        <Filter />
      </div>
    )
  }
}
