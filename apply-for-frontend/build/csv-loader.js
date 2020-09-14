module.exports = function (source) {
  const lines = source.split('\n')
  const headers = lines[0].split(',')
  lines.shift()
  const buildLine = (values) => {
    const length = headers.length
    const res = {}
    for (let i = 0; i < length; i++) {
      res[headers[i]] = values[i]
    }
    return res
  }
  const data = lines.map((lineData) => buildLine(lineData.split(',')))
  return `export default ${JSON.stringify(data)}`
}
