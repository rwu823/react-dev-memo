import React from 'react'

import devMemo from '../lib'

type Props = {
  src: object
}

const Code: React.FC<Props> = ({ src, ...props }) => {
  return <pre {...props}>{JSON.stringify(src, null, 2)}</pre>
}

export default devMemo(Code, [], {
  highlight: true,
  outline: '2px solid blue',
})
