/*!
 * topStories.js
 */
(function () {
   const isActive = "is-active";
   const topStories = document.querySelectorAll(".js-topStory");
   const images = document.querySelectorAll(".js-topStory-img");
   const navItems = document.querySelectorAll(".js-topStory-activate");
   let activeNavItem = document.querySelector(".js-topStory-activate.is-active");
   const navIndicator = document.getElementById("js-navTopStories-indicator");
 
   if (topStories.length && navItems.length) {
     // Set nav indicator to first (active) item
     navIndicator.style.height = `${activeNavItem.offsetHeight}px`;
 
     window.addEventListener("resize", () => {
       activeNavItem = document.querySelector(".js-topStory-activate.is-active");
       navIndicator.style.height = `${activeNavItem.offsetHeight}px`;
       navIndicator.style.top = `${activeNavItem.offsetTop}px`;
     });
 
     const clear = () => {
       navItems.forEach((item) => {
         item.classList.remove(isActive);
       });
 
       topStories.forEach((item) => {
         item.classList.remove(isActive);
       });
     };
 
     const handleTopStory = (ev) => {
       const navItem = ev.target;
 
       if (navItem.classList.contains(isActive)) {
         return false;
       }
 
       // Set nav indicator
       navIndicator.style.height = `${navItem.offsetHeight}px`;
       navIndicator.style.top = `${navItem.offsetTop}px`;
 
       clear();
       navItem.classList.add(isActive);
 
       const topStoryID = navItem.dataset.topStory;
       const topStory = document.getElementById(topStoryID);
       topStory.classList.add(isActive);
     };
 
     // Switch placeholder images to hi res images on load
     const handleImages = () => {
       images.forEach((img) => {
         // Prevent quick loading
         img.src = img.src;
         img.addEventListener("load", () => {
           const placeholder = img.closest(".js-topStory") ? img.closest(".js-topStory").querySelector(".js-topStory-imgPlaceholder") : img.closest(".js-topStory-activate").querySelector(".js-topStory-imgPlaceholder");
           img.classList.add(isActive);
           placeholder.classList.remove(isActive);
         });
       });
     };
 
     handleImages();
 
     navItems.forEach((item) => {
       item.addEventListener("mouseenter", handleTopStory);
     });
   }
 })();
 