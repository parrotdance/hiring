import React from 'react'
import Body from './TableBody'
import Header from './TableHeader'
import { TableColInfo } from './TableTypes'

interface TableProps {
  data: Array<object>
  width: string
}
interface TableState {
  cols: { prop: string; label: string }[]
}
export default class Table extends React.PureComponent<TableProps, TableState> {
  constructor(props) {
    super(props)
    this.state = {
      cols: props.children.map((col: { props: TableColInfo }) => ({
        prop: col.props.prop,
        label: col.props.label || col.props.prop,
        width: col.props.width || '140px',
        formatter: col.props.formatter || null
      }))
    }
  }
  render() {
    return (
      <div className="parotable-wrapper" style={{ width: this.props.width }}>
        <Header data={this.state.cols} />
        <Body cols={this.state.cols} data={this.props.data} />
      </div>
    )
  }
}
