import React, { SyntheticEvent } from 'react'
import EventBus from './utils/EventBus'
import { UPDATE_FILTER_MONTH } from './utils/EventType'

interface FilterState {
  currentFilterMonth: number
}

const months = [
  'Jan.',
  'Feb.',
  'Mar.',
  'Apr.',
  'May.',
  'Jun.',
  'Jul.',
  'Aug.',
  'Sep.',
  'Oct.',
  'Nov.',
  'Dec.'
]
const renderMonths = ['None', ...months]
export default class Filter extends React.Component<{}, FilterState> {
  constructor(props) {
    super(props)
    this.state = {
      currentFilterMonth: 0
    }
  }
  componentWillUnmount() {}
  onFilterChange(e: SyntheticEvent<HTMLOptionElement>) {
    const index = Number(e.currentTarget.value)
    if (index !== this.state.currentFilterMonth) {
      this.setState({ currentFilterMonth: index })
      EventBus.$emit(UPDATE_FILTER_MONTH, index)
    }
  }
  render() {
    return (
      <form className="filter-form">
        <div className="filter-form-item">
          <label htmlFor="forMonth">Filter by month: </label>
          <select
            style={{ width: '120px' }}
            name="forMonth"
            placeholder="Please Select"
            value={this.state.currentFilterMonth}
            onChange={this.onFilterChange.bind(this)}
          >
            {renderMonths.map((month, i) => (
              <option value={i} key={i}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button>Append Data</button>
        </div>
      </form>
    )
  }
}
