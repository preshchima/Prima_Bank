"use strict";

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const linkContainer = document.querySelector(".nav__links");
const btnShowModal = document.querySelectorAll(".btn--show-modal");
const btnCloseModal = document.querySelector(".btn--close-modal");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const navContainer = document.querySelector(".nav");
const header = document.querySelector(".header");
const lazyImgs = document.querySelectorAll("img[data-src]");
const tabContainer = document.querySelector(".operations__tab-container");
const tabsBtn = document.querySelectorAll(".operations__tab");
const tabsContent = document.querySelectorAll(".operations__content");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

//smooth scrolling
btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

linkContainer.addEventListener("click", function (e) {
  e.preventDefault();
  const link = e.target;
  if (
    link.classList.contains("nav__link") &&
    !link.classList.contains("btn--show-modal")
  ) {
    const href = link.getAttribute("href");

    document.querySelector(href).scrollIntoView({ behavior: "smooth" });
  }
});

//Display sign up modal
const openModal = e => {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
const closeModal = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnShowModal.forEach(btn => {
  btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});

//menu fade in
const handleFadeIn = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const currentlink = e.target;
    const nav = currentlink.closest(".nav");
    const logo = nav.querySelector(".nav__logo");
    nav.querySelectorAll(".nav__link").forEach(link => {
      if (link !== currentlink) {
        link.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
};

linkContainer.addEventListener("mouseover", handleFadeIn.bind(0.5));

linkContainer.addEventListener("mouseout", handleFadeIn.bind(1));

//sticky navigation
const navContainerHeight = `-${getComputedStyle(navContainer).height}`;

const headerObserver = function (entries) {
  entries.forEach(entry => {
    if (!entry) return;
    if (!entry.isIntersecting) {
      navContainer.classList.add("sticky");
    } else {
      navContainer.classList.remove("sticky");
    }
  });
};

const headerIntersection = new IntersectionObserver(headerObserver, {
  root: null,
  threshold: 0,
  rootMargin: navContainerHeight,
});

headerIntersection.observe(header);

//lazy loading images
const imgObserver = function (entries, observe) {
  entries.forEach(entry => {
    lazyImgs.forEach(img => {
      if (entry.isIntersecting) {
        img.src = img.getAttribute("data-src");
        img.addEventListener("load", function () {
          img.classList.remove("lazy-img");
        });

        observe.unobserve(img);
      }
    });
  });
};

const imgIntersection = new IntersectionObserver(imgObserver, {
  root: null,
  threshold: 0,
  rootMargin: "100px",
});

lazyImgs.forEach(img => imgIntersection.observe(img));

//tabbed section
tabContainer.addEventListener("click", function (e) {
  const btn = e.target.closest(".operations__tab");
  if (!btn) return;
  //remove active class
  tabsBtn.forEach(btn => btn.classList.remove("operations__tab--active"));
  tabsContent.forEach(content =>
    content.classList.remove("operations__content--active")
  );
  //add active class
  btn.classList.add("operations__tab--active");
  const index = btn.dataset.tab;
  document
    .querySelector(`.operations__content--${index}`)
    .classList.add("operations__content--active");
});

//slider and pagination
const slider = () => {
  let currentSlide = 0;
  const createDots = () => {
    slides.forEach((slide, i) => {
      const html = `
              <button class='dots__dot ' data-dot=${i}></button>
              `;
      dotContainer.insertAdjacentHTML("beforeend", html);
    });
  };
  createDots();

  const activateDot = function (slide) {
    document.querySelectorAll(".dots__dot").forEach(dot => {
      dot.classList.remove("dots__dot--active");
    });
    document
      .querySelector(`.dots__dot[data-dot='${slide}']`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = currSlide => {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - currSlide) - 0}%)`;
    });
  };

  const init = () => {
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  init();

  const nextSlide = function () {
    if (currentSlide === slides.length - 1) {
      currentSlide = 0;
    } else currentSlide++;

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  const previousSlide = function () {
    if (currentSlide === 0) {
      currentSlide = slides.length - 1;
    } else currentSlide--;
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  btnRight.addEventListener("click", nextSlide);

  btnLeft.addEventListener("click", previousSlide);

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      currentSlide = e.target.dataset.dot;

      goToSlide(currentSlide);
      activateDot(currentSlide);
    }
  });
};
slider();
