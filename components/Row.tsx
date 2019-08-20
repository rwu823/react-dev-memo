/* eslint-disable react/destructuring-assignment */
import React from 'react'
import styled, { css } from 'styled-components'
import devMemo from '../lib'

const Div = styled.div`
  ${(_p: {}) => css``}
`

type Props = {
  index: number
  checked: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

const Row: React.FC<Props> = ({ index, checked, onChange, ...props }) => {
  return (
    <Div {...props}>
      {index}. <input onChange={onChange} type="checkbox" checked={checked} />
    </Div>
  )
}

export default devMemo(Row, [], {
  highlight: true,
})
