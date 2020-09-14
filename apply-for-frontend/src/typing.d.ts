declare interface CSVLine {
  [index: string]: string
}

declare module '*.csv' {
  const value: Array<CSVLine>
  export default value
}
