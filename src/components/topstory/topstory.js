/*!
 * topStories.js
 */
// (function () {
//   const isActive = "is-active";
//   const topStories = document.querySelectorAll(".js-topStory");
//   const images = document.querySelectorAll(".js-topStory-img");
//   const navItems = document.querySelectorAll(".js-topStory-activate");
//   let activeNavItem = document.querySelector(".js-topStory-activate.is-active");

//   if (topStories.length && navItems.length) {
//     window.addEventListener("resize", () => {
//       activeNavItem = document.querySelector(".js-topStory-activate.is-active");
//     });

//     const clear = () => {
//       navItems.forEach((item) => {
//         item.classList.remove(isActive);
//       });
//       topStories.forEach((item) => {
//         item.classList.remove(isActive);
//       });
//     };

//     const handleTopStory = (index) => {
//       clear();
//       const topStory = topStories[index];
//       const navItem = navItems[index];
//       if (topStory && navItem) {
//         topStory.classList.add(isActive);
//         navItem.classList.add(isActive);
//       }
//     };

//     const handleImages = () => {
//       images.forEach((img) => {
//         img.src = img.src;
//         img.addEventListener("load", () => {
//           const placeholder = img.closest(".js-topStory")
//             ? img
//                 .closest(".js-topStory")
//                 .querySelector(".js-topStory-imgPlaceholder")
//             : img
//                 .closest(".js-topStory-activate")
//                 .querySelector(".js-topStory-imgPlaceholder");
//           img.classList.add(isActive);
//           placeholder.classList.remove(isActive);
//         });
//       });
//     };

//     handleImages();

//     navItems.forEach((item, index) => {
//       item.addEventListener("mouseenter", () => {
//         handleTopStory(index);
//       });
//     });
//   }
// })();

// (function () {
//   const slides = document.querySelectorAll(".js-topStory");
//   const dots = document.querySelectorAll(".dot");
//   const navItems = document.querySelectorAll(".js-topStory-activate");
//   let currentSlide = 0;
//   const slideDuration = 4000;

//   const clearActiveStates = () => {
//     slides.forEach((slide) => slide.classList.remove("is-active"));
//     dots.forEach((dot) => dot.classList.remove("is-active"));
//     navItems.forEach((navItem) => navItem.classList.remove("is-active"));
//   };

//   const changeSlide = (index) => {
//     clearActiveStates();
//     slides[index].classList.add("is-active");
//     dots[index].classList.add("is-active");
//     navItems[index].classList.add("is-active");
//     const event = new Event("mouseenter");
//     slides[index].dispatchEvent(event);
//     currentSlide = index;
//   };

//   const autoplay = () => {
//     currentSlide = (currentSlide + 1) % slides.length;
//     changeSlide(currentSlide);
//   };

//   let autoplayInterval = setInterval(autoplay, slideDuration);

//   dots.forEach((dot, index) => {
//     dot.addEventListener("click", () => {
//       clearInterval(autoplayInterval);
//       changeSlide(index);
//       autoplayInterval = setInterval(autoplay, slideDuration);
//     });
//   });

//   navItems.forEach((navItem, index) => {
//     navItem.addEventListener("click", () => {
//       clearInterval(autoplayInterval);
//       changeSlide(index);
//       autoplayInterval = setInterval(autoplay, slideDuration);
//     });
//   });

//   window.addEventListener("load", () => {
//     changeSlide(currentSlide);
//   });
// })();

(function () {
  const slides = document.querySelectorAll(".js-topStory");
  const dots = document.querySelectorAll(".dot");
  const slideDuration = 4000;
  let currentSlide = 0;
  let autoplayInterval;

  if (!slides.length || !dots.length) return;

  const clearActiveStates = () => {
    slides.forEach((slide) => slide.classList.remove("is-active"));
    dots.forEach((dot) => dot.classList.remove("is-active"));
  };

  const changeSlide = (index) => {
    clearActiveStates();

    slides[index].classList.add("is-active");
    dots[index].classList.add("is-active");

    currentSlide = index;
  };

  const autoplay = () => {
    changeSlide((currentSlide + 1) % slides.length);
  };

  const startAutoplay = () => {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(autoplay, slideDuration);
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

  changeSlide(currentSlide);
  startAutoplay();
})();
