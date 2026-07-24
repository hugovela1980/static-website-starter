export function initSignsParallax() {
  const educationalBg = document.querySelector(
    ".educational-bg"
  );

  /*
   * Stop initialization on pages without
   * the educational background.
   */
  if (!educationalBg) {
    return;
  }

  const prefersReducedMotion = window
    .matchMedia(
      "(prefers-reduced-motion: reduce)"
    )
    .matches;

  /*
   * Do not initialize the motion effect when
   * the visitor has requested reduced motion.
   */
  if (prefersReducedMotion) {
    return;
  }

  let ticking = false;

  function updateEducationalParallax() {
    const rect =
      educationalBg.getBoundingClientRect();

    const scrollProgress =
      -rect.top;

    const parallaxOffset =
      scrollProgress * 0.25;

    educationalBg.style.setProperty(
      "--educational-parallax-y",
      `${parallaxOffset}px`
    );

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) {
        return;
      }

      window.requestAnimationFrame(
        updateEducationalParallax
      );

      ticking = true;
    }
  );

  /*
   * Calculate the initial position immediately
   * instead of waiting for the first scroll.
   */
  updateEducationalParallax();
}