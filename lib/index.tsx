/* eslint-disable react/destructuring-assignment, react/prop-types */

import React from 'react'

const { NODE_ENV } = process.env
const isDev = !NODE_ENV || NODE_ENV === 'development'

export interface DevMemoOptions {
  /** display highlight */
  highlight: boolean

  /** display console */
  console: boolean

  /** set outline style */
  outline: string

  /** set highlight duration time */
  duration: number
}

const devMemo = <P extends object>(
  Com: React.FC<P>,
  compareProps: Array<keyof P> = [],
  options: Partial<DevMemoOptions> = {},
) => {
  const opts: DevMemoOptions = {
    outline: '1px solid #f2e',
    duration: 500,
    highlight: isDev,
    console: false,
    ...options,
  }

  const InjectedHighlight: React.FC<P> = props => {
    const [style, setStyle] = React.useState<React.CSSProperties>({})

    React.useEffect(
      () => {
        setStyle({
          outline: opts.outline,
        })

        const t = setTimeout(() => {
          setStyle({})
        }, opts.duration)

        return () => clearTimeout(t)
      },
      compareProps.length
        ? compareProps.map(name => props[name])
        : Object.values(props),
    )

    // @ts-ignore
    return <Com {...props} style={{ ...props.style, ...style }} />
  }

  return React.memo(
    opts.highlight ? InjectedHighlight : Com,
    (prevProps, nextProps) => {
      type PropKeys = Array<keyof P>

      const noUpdate = compareProps.length
        ? compareProps.every(
            propsName => prevProps[propsName] === nextProps[propsName],
          )
        : (Object.keys(prevProps) as PropKeys).every(
            propsName => prevProps[propsName] === nextProps[propsName],
          )

      if (opts.console && !noUpdate) {
        const {
          displayName = (Com.toString()
            .split('\n')[0]
            .match(/function\s([^(]+)/) || [])[1],
        } = Com

        console.warn(
          `%c[devMemo]%c update ${displayName}`,
          'color: yellow',
          'color: inherit',
        )

        console.table({
          prev: prevProps,
          next: nextProps,
        })

        let diffProps: PropKeys = []
        if (compareProps.length) {
          diffProps = compareProps.filter(
            propName => prevProps[propName] !== nextProps[propName],
          )
        } else {
          diffProps = (Object.keys(prevProps) as PropKeys).filter(
            propName => prevProps[propName] !== nextProps[propName],
          )
        }

        console.log('Diff props:', diffProps)

        console.table(
          diffProps.reduce(
            (o, propName) =>
              Object.assign(o, {
                [propName]: {
                  prev: prevProps[propName],
                  next: nextProps[propName],
                },
              }),
            {},
          ),
        )
      }

      return noUpdate
    },
  )
}

export default devMemo
