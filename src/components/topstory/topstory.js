(function () {
  const slider = document.querySelector(".TopStories");
  const slides = document.querySelectorAll(".js-topStory");
  const dots = document.querySelectorAll(".dot");
  const slideDuration = 4000;

  let currentSlide = 0;
  let autoplayInterval;
  let startX = 0;
  let endX = 0;
  let isPointerDown = false;

  if (!slider || !slides.length || !dots.length) return;

  const clearActiveStates = () => {
    slides.forEach((slide) => slide.classList.remove("is-active"));
    dots.forEach((dot) => dot.classList.remove("is-active"));
  };

  const changeSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    clearActiveStates();

    slides[index].classList.add("is-active");
    dots[index].classList.add("is-active");

    currentSlide = index;
  };

  const nextSlide = () => {
    changeSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    changeSlide(currentSlide - 1);
  };

  const autoplay = () => {
    nextSlide();
  };

  const startAutoplay = () => {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(autoplay, slideDuration);
  };

  const handleSwipe = () => {
    const diff = startX - endX;
    const swipeDistance = 50;

    if (Math.abs(diff) < swipeDistance) return;

    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }

    startAutoplay();
  };

  document.querySelectorAll(".js-topStory-img").forEach((img) => {
    if (img.complete) {
      img.classList.add("is-active");
      img
        .closest(".js-topStory")
        ?.querySelector(".js-topStory-imgPlaceholder")
        ?.classList.remove("is-active");
      return;
    }

    img.addEventListener("load", () => {
      img.classList.add("is-active");
      img
        .closest(".js-topStory")
        ?.querySelector(".js-topStory-imgPlaceholder")
        ?.classList.remove("is-active");
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      changeSlide(index);
      startAutoplay();
    });
  });

  slider.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
  });

  slider.addEventListener("touchend", (event) => {
    endX = event.changedTouches[0].clientX;
    handleSwipe();
  });

  slider.addEventListener("mousedown", (event) => {
    isPointerDown = true;
    startX = event.clientX;
  });

  slider.addEventListener("mouseup", (event) => {
    if (!isPointerDown) return;

    isPointerDown = false;
    endX = event.clientX;
    handleSwipe();
  });

  slider.addEventListener("mouseleave", () => {
    isPointerDown = false;
  });

  changeSlide(currentSlide);
  startAutoplay();
})();
