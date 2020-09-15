const arr = [
  {
    a: 'xx',
    children: [{ a: 'xx', children: [] }]
  },
  {
    a: 'xx',
    children: [{ a: 'xx', children: [] }]
  }
]
const key = '111'
const recur = (root, key) =>
  root.key === 'key'
    ? root
    : root.children
        .map((route) => recur(route, key))
        .some((res) => Boolean(res))
    ? root
    : undefined
const targetRoute = arr
  .map((route) => recur(route, key))
  .filter((res) => Boolean(res))
