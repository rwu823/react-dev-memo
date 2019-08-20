export const copy = (text: string) => {
  const textarea = document.createElement('textarea')

  textarea.style.display = 'absolute'
  textarea.style.left = '-99em'
  textarea.style.top = '-99em'

  document.body.appendChild(textarea)
  textarea.value = text
  textarea.select()
  document.execCommand('copy')

  document.body.removeChild(textarea)
}

export default copy
