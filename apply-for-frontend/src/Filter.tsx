import React, { SyntheticEvent } from 'react'
import categoryMap from './utils/categoryMap'
import EventBus from './utils/EventBus'
import { APPEND_NEW_BILL, UPDATE_FILTER_MONTH } from './utils/EventType'

type TimeStampStr = string
interface AppendForm {
  type: '1' | '0'
  time: TimeStampStr
  category: string
  amount: string
}
interface FilterState {
  currentFilterMonth: number
  appendForm: AppendForm
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
const categoryList = Object.entries(categoryMap).map(([hash, name]) => ({
  hash,
  name
}))
export default class Filter extends React.Component<{}, FilterState> {
  constructor(props) {
    super(props)
    this.state = {
      currentFilterMonth: 0,
      appendForm: {
        type: '0',
        time: '',
        category: categoryList[0].hash,
        amount: ''
      }
    }
  }
  componentWillUnmount() {}
  setForm(newForm: Partial<AppendForm>) {
    this.setState({ appendForm: Object.assign(this.state.appendForm, newForm) })
  }
  onFilterChange(e: SyntheticEvent<HTMLOptionElement>) {
    const index = Number(e.currentTarget.value)
    if (index !== this.state.currentFilterMonth) {
      this.setState({ currentFilterMonth: index })
      EventBus.$emit(UPDATE_FILTER_MONTH, index)
    }
  }
  onAppendTypeChange(e: SyntheticEvent<HTMLOptionElement>) {
    const type = e.currentTarget.value as '1' | '0'
    this.setForm({ type })
  }
  onAppendTimeChange(e: SyntheticEvent<HTMLInputElement>) {
    const time = e.currentTarget.value
    this.setForm({ time })
  }
  onAppendCategoryChange(e: SyntheticEvent<HTMLOptionElement>) {
    const category = e.currentTarget.value
    this.setForm({ category })
  }
  onAppendAmountChange(e: SyntheticEvent<HTMLInputElement>) {
    const amount = e.currentTarget.value
    this.setForm({ amount })
  }
  onClickAppendData(e: SyntheticEvent<HTMLButtonElement>) {
    e.preventDefault()
    EventBus.$emit(APPEND_NEW_BILL, Object.assign({}, this.state.appendForm))
  }
  render() {
    return (
      <form className="filter-form">
        <div>
          <h3>Filter</h3>
          <div className="filter-form-item">
            <label className="filter-form-item-label" htmlFor="month">
              By month:{' '}
            </label>
            <select
              style={{ width: '208px' }}
              name="month"
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
        </div>
        <div>
          <h3>Append Bill</h3>
          <div>
            <div className="filter-form-item">
              <label className="filter-form-item-label" htmlFor="type">
                Type:{' '}
              </label>
              <select
                style={{ width: '208px' }}
                name="type"
                placeholder="Please Select"
                value={this.state.appendForm.type}
                onChange={this.onAppendTypeChange.bind(this)}
              >
                <option value="0">Payment</option>
                <option value="1">Income</option>
              </select>
            </div>
            <div className="filter-form-item">
              <label className="filter-form-item-label" htmlFor="time">
                Time:{' '}
              </label>
              <input
                type="text"
                placeholder="e.g. 2020-02-20"
                value={this.state.appendForm.time}
                onChange={this.onAppendTimeChange.bind(this)}
              />
            </div>
            <div className="filter-form-item">
              <label className="filter-form-item-label" htmlFor="category">
                Category:{' '}
              </label>
              <select
                style={{ width: '208px' }}
                name="category"
                placeholder="Please Select"
                value={this.state.appendForm.category}
                onChange={this.onAppendCategoryChange.bind(this)}
              >
                {categoryList.map((category, i) => (
                  <option key={i} value={category.hash}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-form-item">
              <label className="filter-form-item-label" htmlFor="amount">
                Amount:{' '}
              </label>
              <input
                type="amount"
                placeholder="e.g. 9999"
                value={this.state.appendForm.amount}
                onChange={this.onAppendAmountChange.bind(this)}
              />
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <button onClick={this.onClickAppendData.bind(this)}>Append</button>
        </div>
      </form>
    )
  }
}
