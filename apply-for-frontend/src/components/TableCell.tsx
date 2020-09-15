import React from 'react'

export default ({ data, width = '140px' }) => (
  <span
    className="parotable-cell"
    style={{
      display: 'inline-block',
      width,
      lineHeight: '24px',
      textAlign: 'center'
    }}
  >
    {data}
  </span>
)
