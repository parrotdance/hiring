import categoryData from '../assets/categories.csv'

export default categoryData.reduce<Dictionary<string>>(
  (res, line) => Object.assign(res, { [line['id']]: line['name'] }),
  {}
)
