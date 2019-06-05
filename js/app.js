/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("./bootstrap");

require("lightcase/src/js/lightcase");
require("fotorama/fotorama.js");
require("air-datepicker/src/js/air-datepicker");

import objectFitImages from "object-fit-images";
import Swiper from "swiper/dist/js/swiper.js";
import setTabsOnPage from "./tabs";
import {
  disableBodyScroll,
  clearAllBodyScrollLocks
} from "body-scroll-lock";
import detectIt from "detect-it";

document.addEventListener("DOMContentLoaded", function(event) {
  // Полифилл для свойства object-fit
  objectFitImages();

  // Слайдеры с игроками на главной

  const playerSliders = Array.from(
    document.querySelectorAll(".js-player-card")
  );

  playerSliders.forEach(slider => {
    const swiperContainer = slider.querySelector(".swiper-container");
    const swiperPagination = slider.querySelector(".swiper-pagination");
    const swiperNext = slider.querySelector(".player__slider-button--next");
    const swiperPrev = slider.querySelector(".player__slider-button--prev");
    new Swiper(swiperContainer, {
      loop: true,
      effect: "fade",
      autoplay: true,
      delay: 3000,
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        el: swiperPagination,
        clickable: true
      },
      navigation: {
        nextEl: swiperNext,
        prevEl: swiperPrev
      },
    });
  });

  // Слайдеры с карточками фото и видео

  const photosVideosSliders = Array.from(
    document.querySelectorAll(".js-photos-videos-slider-block")
  );

  photosVideosSliders.forEach(slider => {
    const swiperContainer = slider.querySelector(".swiper-container");
    const swiperPrev = slider.querySelector(
      ".photos-videos__slider-button--prev"
    );
    const swiperNext = slider.querySelector(
      ".photos-videos__slider-button--next"
    );

    new Swiper(swiperContainer, {
      slidesPerView: 3,
      spaceBetween: 20,
      navigation: {
        nextEl: swiperNext,
        prevEl: swiperPrev
      },
      breakpoints: {
        768: {
          slidesPerView: 1
        },
        1024: {
          spaceBetween: 20,
          slidesPerView: 2
        },
        1200: {
          slidesPerView: 2,
          spaceBetween: 30
        }
      }
    });
  });

  // Слайдер спонсоров и партнеров

  const sponsorsAndPartnersSlider = document.querySelector(
    ".js-sponsors-and-partners-slider"
  );

  if (sponsorsAndPartnersSlider) {
    const slider = new Swiper(
      sponsorsAndPartnersSlider.querySelector(".swiper-container"),
      {
        slidesPerView: 4,
        spaceBetween: 10,
        navigation: {
          nextEl: sponsorsAndPartnersSlider.querySelector(
            ".sponsors-and-partners__button--next"
          ),
          prevEl: sponsorsAndPartnersSlider.querySelector(
            ".sponsors-and-partners__button--prev"
          )
        },
        pagination: {
          el: sponsorsAndPartnersSlider.querySelector(
            ".sponsors-and-partners__pagination"
          ),
          clickable: true
        },
        breakpoints: {
          // when window width is <= 1200px
          768: {
            slidesPerView: "auto",
            spaceBetween: 15,
            centeredSlides: true
          },
          1024: {
            spaceBetween: 10,
            slidesPerView: 3,
            centeredSlides: false
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 20
          }
        },
        on: {
          beforeResize() {
            if (window.innerWidth <= 768) {
              slider.slides.css("width", "");
            }
          }
        }
      }
    );
  }

  // Табы

  setTabsOnPage();

  // Управление всплывающим меню

  const burgerMenu = document.querySelector(".js-burger-menu");
  const burgerOpen = document.querySelector(".js-burger-open");
  const burgerClose = document.querySelector(".js-burger-close");
  let scrollBlocked = false;

  if (burgerMenu && burgerOpen && burgerClose) {
    burgerOpen.addEventListener("click", function() {
      burgerMenu.classList.toggle("burger-menu__open");
      this.classList.toggle("page-header__burger--open");
      if (
        !scrollBlocked &&
        detectIt.deviceType === "touchOnly" &&
        window.matchMedia("(max-width: 1024px)").matches
      ) {
        disableBodyScroll(burgerMenu);
        scrollBlocked = true;
      } else {
        clearAllBodyScrollLocks();
        scrollBlocked = false;
      }
    });
    burgerClose.addEventListener("click", function() {
      burgerMenu.classList.remove("burger-menu__open");
      burgerOpen.classList.remove("page-header__burger--open");
      clearAllBodyScrollLocks();
      scrollBlocked = false;
    });
  }

  // Фиксация хедера

  const pageHeaderTopPart = document.querySelector(".page-header__top-part");
  const pageHeaderBottomPart = document.querySelector(
    ".page-header__bottom-part"
  );

  const headerHandler = function(event) {
    const topHeight = pageHeaderTopPart.offsetHeight;
    const scrollTop = window.pageYOffset;
    if (scrollTop > topHeight) {
      document.body.classList.add("header-fixed");
    } else {
      document.body.classList.remove("header-fixed");
    }
  };

  if (matchMedia) {
    const mq = window.matchMedia("(max-width: 1024px)");
    mq.addListener(fixHeader);
    fixHeader(mq);
  }

  function fixHeader(mq) {
    if (mq.matches) {
      window.removeEventListener("scroll", headerHandler);
      document.body.classList.remove("header-fixed");
    } else {
      window.addEventListener("scroll", headerHandler);
    }
  }

  // Активация слайдера у соревнований на мобильной ширине

  const sliderContainer = document.querySelector(
    ".js-competitions-slider-container"
  );

  if (sliderContainer) {
    let sliderActivated = false;
    let swiperInstance;
    const sliderWrapper = sliderContainer.querySelector(".competitions__list");
    const slides = Array.from(
      sliderContainer.querySelectorAll(".competitions__list-item")
    );

    if (matchMedia) {
      const mq = window.matchMedia("(max-width: 768px)");
      mq.addListener(WidthChange);
      WidthChange(mq);
    }

    function addStyles() {
      sliderContainer.classList.remove("competitions__slider-container");
      sliderWrapper.classList.remove("competitions__list");
      sliderContainer.classList.add("swiper-container");
      sliderWrapper.classList.add("swiper-wrapper");
      slides.forEach(slide => {
        slide.classList.remove("competitions__list-item");
        slide.classList.add("swiper-slide");
      });
    }

    function removeStyles() {
      sliderContainer.classList.add("competitions__slider-container");
      sliderWrapper.classList.add("competitions__list");
      sliderContainer.classList.remove("swiper-container");
      sliderWrapper.classList.remove("swiper-wrapper");
      slides.forEach(slide => {
        slide.classList.add("competitions__list-item");
        slide.classList.remove("swiper-slide");
      });
    }

    function WidthChange(mq) {
      if (mq.matches) {
        console.log("Match");
        if (!sliderActivated) {
          addStyles();
          sliderActivated = true;
          swiperInstance = new Swiper(sliderContainer, {
            slidesPerView: "auto",
            spaceBetween: 15,
            centeredSlides: true,
            pagination: {
              el: document.querySelector(".js-competitions-pagination"),
              clickable: true
            }
          });
          console.log("Slider created");
        } else {
          return;
        }
      } else {
        console.log("No match");
        if (sliderActivated) {
          removeStyles();
          sliderActivated = false;
          swiperInstance.destroy();
          console.log("Slider destroyed");
        } else {
          return;
        }
      }
    }
  }
});
