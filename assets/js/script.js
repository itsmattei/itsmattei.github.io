'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

document.addEventListener('DOMContentLoaded', () => {
    const clientsList = document.querySelector('.clients-list');
    const clientsListWrapper = document.querySelector('.clients-list-wrapper');

    if (!clientsList || !clientsListWrapper) {
        console.warn('Carosello o wrapper non trovati.'); 
        return;
    }

    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    let animationFrameId;
    let isPaused = false;

    const originalContent = clientsList.innerHTML;
    const originalItemsCount = clientsList.children.length;

    let singleItemAndGapWidth = 0;
    if (originalItemsCount > 0) {
        const firstItem = clientsList.children[0];
        const computedStyle = getComputedStyle(firstItem);
        const itemWidth = firstItem.offsetWidth;
        const gap = parseFloat(getComputedStyle(clientsList).gap || '0');
        singleItemAndGapWidth = itemWidth + gap;
    } else {
        console.warn('Nessun elemento clients-item trovato nella lista. Animazione disabilitata.');
        return;
    }

    const numberOfCopies = 2;
    for (let i = 0; i < numberOfCopies; i++) {
        clientsList.innerHTML += originalContent;
    }

    let widthOfOriginalBlock = 0;
    if (originalItemsCount > 0) {
        widthOfOriginalBlock = (singleItemAndGapWidth * originalItemsCount) - (parseFloat(getComputedStyle(clientsList).gap || '0'));
    } else {
        widthOfOriginalBlock = clientsList.scrollWidth / (numberOfCopies + 1); // Fallback se originalItemsCount è 0
    }

    function animateScroll() {
        if (!isPaused) {
            scrollPosition -= scrollSpeed;

            if (scrollPosition <= -widthOfOriginalBlock) {
                scrollPosition = 0;
            }

            clientsList.style.transform = `translateX(${scrollPosition}px)`;
        }
        animationFrameId = requestAnimationFrame(animateScroll);
    }

    animateScroll();
});