export const shallowCopy = (source: object) =>
  Object.entries(source).reduce(
    (res, [k, v]) => Object.assign(res, { [k]: v }),
    {}
  )

export const shallowMerge = (obj1: object, obj2: object) =>
  [...Object.entries(obj1), ...Object.entries(obj2)].reduce(
    (res, [k, v]) => Object.assign(res, { [k]: v }),
    {}
  )
