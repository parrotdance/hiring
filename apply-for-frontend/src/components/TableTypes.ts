export interface TableColInfo {
  prop: string
  label?: string
  width?: string
  formatter?: (v: string, r: object) => string
}
