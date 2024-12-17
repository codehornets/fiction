export function validateForm(args: { el?: HTMLFormElement, reportValidity?: boolean } = {}): boolean {
  const { el, reportValidity = false } = args
  if (!el)
    return false

  const inputs = el.querySelectorAll('input, select, textarea')
  let isValid = true

  inputs.forEach((input) => {
    const inputElement = input as HTMLInputElement
    const isInputValid = inputElement.checkValidity()

    inputElement.setAttribute('data-is-valid', isInputValid.toString())

    if (!isInputValid) {
      isValid = false
      if (reportValidity) {
        inputElement.reportValidity()
      }
    }
  })

  return isValid
}
