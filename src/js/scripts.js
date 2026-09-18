//=include ../../node_modules/vanilla-lazyload/dist/lazyload.js
//=include ../../node_modules/smooth-scroll/dist/smooth-scroll.polyfills.min.js
//=include ../../node_modules/select2/dist/js/select2.min.js
//=include ../../node_modules/slick-carousel/slick/slick.min.js
//=include ../../node_modules/magnific-popup/dist/jquery.magnific-popup.min.js
const galleryScriptUrl = new URL("gallery.js", document.currentScript.src).href;

document.addEventListener("DOMContentLoaded", function () {
  //=include ../components/**/*.js
  //=include custom/ajax-gallery.parcel.js
  //=include custom/content.js
  //=include custom/cookie-consent-config.js
  //=include custom/cookie-consent-social-media.js
  //=include custom/lazyloading.js
  //=include custom/scroll-anchor.js
  //=include custom/select2.js
  //=include custom/slide.js
  //=include custom/submenu.js
});
