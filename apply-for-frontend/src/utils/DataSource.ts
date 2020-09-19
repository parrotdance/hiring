import day from 'dayjs'
import { shallowMerge } from '.'
import billData from '../assets/bill.csv'

type TableData = Array<CSVLine>
type FilterType = 'month' | 'category' | 'sort-amount'
type FilterOption = { [T in FilterType]?: any }
type FilteredDataIndex = WeakMap<FilterOption, Array<CSVLine>>

class DataSource {
  private _sourceData: TableData
  private _renderData: TableData
  private _filteredDataCache: FilteredDataIndex
  private _filtersCache: Array<FilterOption> = []
  private _applyedFilter: FilterOption = {}
  constructor() {
    this._sourceData = billData
    this._renderData = billData
    this._filteredDataCache = new WeakMap()
  }
  private filterOptionToStringArray(option: FilterOption): string[] {
    return Object.entries(option)
      .map(([type, value]) => `${type}-${value}`)
      .sort()
  }
  private findFilterIndex(option: FilterOption): number {
    const optStrs = this.filterOptionToStringArray(option)
    return this._filtersCache.findIndex((filter) => {
      const strs = this.filterOptionToStringArray(filter)
      if (strs.length === optStrs.length) {
        let same = true
        strs.forEach((str, i) => {
          if (str !== optStrs[i]) same = false
        })
        if (same) {
          return true
        }
      } else {
        return false
      }
    })
  }
  private filterByMonth(source: TableData, targetMonth: number): TableData {
    return targetMonth > 0
      ? source.filter(
          (row: CSVLine) => targetMonth === day(row.time).month() + 1
        )
      : source
  }
  private filterByCategory(
    source: TableData,
    targetCategory: string = ''
  ): TableData {
    return targetCategory
      ? source.filter((row: CSVLine) => row.category === targetCategory)
      : source
  }
  private getSignedAmount(row: CSVLine): number {
    return row.type === '0'
      ? -Math.abs(Number(row.amount))
      : Math.abs(Number(row.amount))
  }
  private sortByAmount(source: TableData, sorter: number): TableData {
    return sorter === 0
      ? source
      : sorter > 0
      ? source.sort((a, b) => this.getSignedAmount(a) - this.getSignedAmount(b))
      : source.sort((a, b) => this.getSignedAmount(b) - this.getSignedAmount(a))
  }
  public appendToSource(row: CSVLine): this {
    this._sourceData.push(row)
    this._filtersCache = []
    this._filteredDataCache = new WeakMap() // clear cache because source data has changed
    this.applyFilter() // re-compute data for render
    return this
  }

  public applyFilter(option?: FilterOption): this {
    const newFilter: FilterOption = shallowMerge(
      this._applyedFilter,
      option || {}
    )
    const existIndex = this.findFilterIndex(newFilter)
    this._applyedFilter = newFilter
    if (existIndex > -1) {
      this._renderData = this._filteredDataCache.get(
        this._filtersCache[existIndex]
      )
    } else {
      const filteredData: TableData = Object.entries(
        this._applyedFilter
      ).reduce((res, [type, value]) => {
        switch (type) {
          case 'month':
            return this.filterByMonth(res, value)
          case 'category':
            return this.filterByCategory(res, value)
          case 'sort-amount':
            return this.sortByAmount(res, value)
        }
      }, Array.from(this._sourceData))
      this._filtersCache.push(newFilter)
      this._filteredDataCache.set(newFilter, filteredData)
      this._renderData = filteredData
    }
    return this
  }
  public getData(): TableData {
    return this._renderData
  }
}

export default new DataSource()
