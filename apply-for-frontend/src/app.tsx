import React from 'react'
import billData from './assets/bill.csv'
import MainTable from './MainTable'

interface AppState {
  tableData: Array<CSVLine>
}
export default class App extends React.Component<{}, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      tableData: billData
    }
  }
  render() {
    return (
      <div>
        <MainTable data={this.state.tableData} />
      </div>
    )
  }
}
