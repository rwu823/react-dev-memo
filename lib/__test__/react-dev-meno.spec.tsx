import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'

import devMemo from '..'

type Props = {
  name: string
  age: number
}

const Pure: React.FC<Props> = ({ name, age, children, ...props }) => (
  <div {...props} data-name={name} data-age={age} />
)

let app: HTMLDivElement

beforeEach(() => {
  app = document.createElement('div')
  app.id = 'app'
  document.body.appendChild(app)
})

afterEach(() => {
  if (app) {
    unmountComponentAtNode(app)

    app.remove()
  }
})

describe('Test `devMemo` Spec', () => {
  it('render component correctly.', async () => {
    const PureDevMemo = devMemo(Pure)
    act(() => {
      render(<PureDevMemo name={'foo'} age={0} />, app)
    })

    expect(app.querySelector('[data-name="foo"][data-age="0"]')).toBeTruthy()
  })

  it('re-render correctly', async () => {
    const PureDevMemo = devMemo(Pure, [], {
      console: true,
    })
    const App: React.FC<{}> = () => {
      const [name, setName] = React.useState('foo')

      const onClick = () => {
        setName('bar')
      }

      return (
        <div onClick={onClick}>
          <PureDevMemo name={name} age={0} />
        </div>
      )
    }

    act(() => {
      render(<App />, app)
      app.firstElementChild!.dispatchEvent(
        new MouseEvent('click', { bubbles: true }),
      )
    })

    expect(app.querySelector('[data-name="bar"][data-age="0"]')).toBeTruthy()
  })

  it(`prevent re-render when watching props doesn't change`, async () => {
    const PureDevMemo = devMemo(Pure, ['age'])
    const App: React.FC<{}> = () => {
      const [name, setName] = React.useState('foo')

      const onClick = () => {
        setName('bar')
      }

      return (
        <div onClick={onClick}>
          <PureDevMemo name={name} age={0} />
        </div>
      )
    }

    act(() => {
      render(<App />, app)
      app.firstElementChild!.dispatchEvent(
        new MouseEvent('click', { bubbles: true }),
      )
    })

    expect(app.querySelector('[data-name="foo"][data-age="0"]')).toBeTruthy()
  })

  it(`watching all props should same as none`, async () => {
    const PureDevMemo = devMemo(Pure, ['name', 'age'])
    const App: React.FC<{}> = () => {
      const [name, setName] = React.useState('foo')

      const onClick = () => {
        setName('bar')
      }

      return (
        <div onClick={onClick}>
          <PureDevMemo name={name} age={0} />
        </div>
      )
    }

    act(() => {
      render(<App />, app)
      app.firstElementChild!.dispatchEvent(
        new MouseEvent('click', { bubbles: true }),
      )
    })

    expect(app.querySelector('[data-name="bar"][data-age="0"]')).toBeTruthy()
  })
})
