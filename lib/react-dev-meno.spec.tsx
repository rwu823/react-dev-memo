import React from 'react'
import { render } from 'react-dom'
import { act } from 'react-dom/test-utils'

import devMemo from '.'

type Props = {
  name: string
  age: number
}

const Pure: React.FC<Props> = ({ name, age, children, ...props }) => (
  <div {...props}>
    {name} - {age}
  </div>
)

const PureDevMemo = devMemo(Pure, [], {
  console: true,
})

let app: HTMLDivElement
let root: Element

beforeEach(() => {
  app = document.createElement('div')
  app.id = 'app'
  document.body.appendChild(app)

  const App: React.FC<{}> = () => {
    const [name, setName] = React.useState('name')
    const [age, setAge] = React.useState(0)

    return (
      <div>
        <PureDevMemo name={name} age={age} />
      </div>
    )
  }

  act(() => {
    render(<App />, app)
  })

  root = app.firstElementChild!
})

describe('Test `devMemo` Spec', () => {
  it('test spec', async () => {
    expect(1).toBe(1)
  })
})
