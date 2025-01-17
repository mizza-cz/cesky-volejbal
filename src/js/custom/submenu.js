// Define the active class name
const isActive = "is-active";

// Toggle submenus
const subMenuLinks = document.querySelectorAll(".js-subMenu-toggle");

const inactiveSubMenu = (navItem, subMenuLink, subMenu) => {
  navItem.classList.remove(isActive);
  subMenuLink.classList.remove(isActive);
  subMenuLink.setAttribute("aria-expanded", false);
  subMenu.classList.remove(isActive);
};

if (subMenuLinks.length) {
  subMenuLinks.forEach((subMenuLink) => {
    subMenuLink.addEventListener("click", (ev) => {
      ev.preventDefault();

      const navItem = subMenuLink.parentElement;
      const subMenu = subMenuLink.nextElementSibling;

      if (subMenu) {
        console.log(subMenu);
        navItem.classList.toggle(isActive);
        subMenuLink.classList.toggle(isActive);
        subMenu.classList.toggle(isActive);
        console.log(subMenu.classList.contains(isActive));
        subMenuLink.setAttribute(
          "aria-expanded",
          subMenu.classList.contains(isActive)
        );
      } else {
        return false;
      }

      const onPressEscape = (ev) => {
        if (ev.key === "Escape") {
          if (subMenu.classList.contains(isActive)) {
            inactiveSubMenu(navItem, subMenuLink, subMenu);
          }
          document.removeEventListener("keydown", onPressEscape);
        }
      };

      const onClickOutside = (ev) => {
        if (
          subMenu.classList.contains(isActive) &&
          !subMenuLink.contains(ev.target) &&
          !subMenu.contains(ev.target)
        ) {
          inactiveSubMenu(navItem, subMenuLink, subMenu);
          document.removeEventListener("click", onClickOutside);
        }
      };

      // Uncomment these lines if you want to enable the escape key and outside click functionality
      // document.addEventListener("keydown", onPressEscape);
      // document.addEventListener("click", onClickOutside);
    });
  });
}
