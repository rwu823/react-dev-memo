/* eslint-disable react/no-array-index-key */

import { NextPage } from 'next'
import React from 'react'
import styled, { css } from 'styled-components'
import Row from '../components/Row'
import Code from '../components/Code'

const Flex = styled.div`
  ${(_p: {}) => css`
    display: flex;

    > div {
      flex: 1;
    }
  `}
`
type Props = {}

const genData = () =>
  [...Array(5)].map((_, id) => ({
    id,
    checked: false,
  }))

const TestPage: NextPage<Props> = () => {
  const [data, setData] = React.useState(genData())
  const [data2, setData2] = React.useState(genData())

  const onChangeMemo = (id: number) =>
    React.useCallback(() => {
      setData2(d => {
        d[id].checked = !d[id].checked

        return Array.from(d)
      })
    }, [])

  const onChange = (id: number) => () => {
    setData(d => {
      d[id].checked = !d[id].checked

      return Array.from(d)
    })
  }

  return (
    <Flex>
      <div>
        <h2>No Pure</h2>
        <Code src={data} />
        <pre>
          {data.map(item => {
            return (
              <Row
                key={item.id}
                index={item.id}
                checked={item.checked}
                onChange={onChange(item.id)}
              />
            )
          })}
        </pre>
      </div>

      <div>
        <h2>Pure</h2>
        <Code src={data2} />
        <pre>
          {data2.map(item => {
            return (
              <Row
                key={item.id}
                index={item.id}
                checked={item.checked}
                onChange={onChangeMemo(item.id)}
              />
            )
          })}
        </pre>
      </div>
    </Flex>
  )
}

export default TestPage
