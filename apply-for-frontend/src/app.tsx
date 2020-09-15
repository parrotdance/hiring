import day from 'dayjs'
import React from 'react'
import billData from './assets/bill.csv'
import Filter from './Filter'
import MainTable from './MainTable'
import EventBus from './utils/EventBus'
import { UPDATE_FILTER_MONTH } from './utils/EventType'

type TableData = Array<CSVLine>
interface AppState {
  tableData: TableData
}

const monthDataMap = billData.reduce<Dictionary<TableData>>((map, row) => {
  const month = day(row.time).month() + 1
  return Object.assign(map, {
    [month]: map[month] ? map[month].concat([row]) : [row]
  })
}, {})
export default class App extends React.Component<{}, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      tableData: billData
    }
  }
  componentDidMount() {
    EventBus.$on(UPDATE_FILTER_MONTH, this.updateTableData.bind(this))
  }
  updateTableData(monthForFilter: number) {
    if (monthForFilter > 0) {
      const newTableData = monthDataMap[monthForFilter]
      this.setState({ tableData: newTableData })
    } else {
      this.setState({ tableData: billData })
    }
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
