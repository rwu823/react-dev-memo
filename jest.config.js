module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: 'tsconfig.esm.json',
    },
  },
}
