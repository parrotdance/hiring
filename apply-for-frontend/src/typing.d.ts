declare interface CSVLine {
  [index: string]: string
}

declare module '*.csv' {
  const value: Array<CSVLine>
  export default value
}

declare interface Dictionary<T = any> {
  [index: string]: T
}
