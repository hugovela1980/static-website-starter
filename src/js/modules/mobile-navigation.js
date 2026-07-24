export function initMobileNavigation() {
  const menuToggle = document.querySelector(
    ".site-header__menu-toggle"
  );

  const mobileMenu = document.querySelector(
    ".site-header__mobile-menu"
  );

  const mobileClose = document.querySelector(
    ".site-header__mobile-close"
  );

  const mobileLinks = document.querySelectorAll(
    ".site-header__mobile-nav-link, .site-header__mobile-cta"
  );

  /*
   * Stop initialization on pages where the required
   * mobile-navigation elements do not exist.
   */
  if (!menuToggle || !mobileMenu) {
    return;
  }

  function openMobileMenu() {
    mobileMenu.hidden = false;

    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    document.body.classList.add(
      "menu-is-open"
    );

    mobileClose?.focus();
  }

  function closeMobileMenu() {
    mobileMenu.hidden = true;

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.classList.remove(
      "menu-is-open"
    );

    menuToggle.focus();
  }

  menuToggle.addEventListener(
    "click",
    openMobileMenu
  );

  mobileClose?.addEventListener(
    "click",
    closeMobileMenu
  );

  mobileLinks.forEach((link) => {
    link.addEventListener(
      "click",
      closeMobileMenu
    );
  });

  document.addEventListener(
    "keydown",
    (event) => {
      const menuIsOpen = !mobileMenu.hidden;

      if (
        event.key === "Escape"
        && menuIsOpen
      ) {
        closeMobileMenu();
      }
    }
  );
}