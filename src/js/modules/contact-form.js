function formatPhoneNumber(value) {
  const digits = value
    .replace(/\D/g, "")
    .slice(0, 10);

  if (digits.length === 0) {
    return "";
  }

  if (digits.length < 4) {
    return `(${digits}`;
  }

  if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function initContactForm() {
  const phoneInput = document.querySelector(
    "#phone"
  );

  /*
   * Stop initialization on pages that do not
   * contain the contact-form phone input.
   */
  if (!phoneInput) {
    return;
  }

  phoneInput.addEventListener(
    "input",
    () => {
      phoneInput.value = formatPhoneNumber(
        phoneInput.value
      );
    }
  );
}