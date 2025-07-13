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
        console.warn('Carosello o wrapper non trovati.'); // Messaggio di avviso più chiaro
        return;
    }

    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    let animationFrameId;
    let isPaused = false;

    const originalContent = clientsList.innerHTML;
    const originalItemsCount = clientsList.children.length; // Numero di item originali

    // Calcola la larghezza media di un singolo item + gap
    // Questo è più affidabile che basarsi su scrollWidth durante il loop
    let singleItemAndGapWidth = 0;
    if (originalItemsCount > 0) {
        const firstItem = clientsList.children[0];
        const computedStyle = getComputedStyle(firstItem);
        const itemWidth = firstItem.offsetWidth;
        const gap = parseFloat(getComputedStyle(clientsList).gap || '0');
        singleItemAndGapWidth = itemWidth + gap;
    } else {
        // Se non ci sono item, non possiamo animare
        console.warn('Nessun elemento clients-item trovato nella lista. Animazione disabilitata.');
        return;
    }

    // --- Rifattorizzazione del loop di duplicazione ---
    // Duplichiamo un numero fisso di volte (es. 2 o 3) per assicurare un loop fluido
    // indipendentemente dalla larghezza del wrapper.
    // L'animazione poi scrollerà la larghezza di un singolo set originale.
    const numberOfCopies = 2; // Duplica gli elementi due volte. Puoi aumentarlo se necessario.
    for (let i = 0; i < numberOfCopies; i++) {
        clientsList.innerHTML += originalContent;
    }
    // Ora clientsList contiene 3 set di elementi (1 originale + 2 copie)

    // Calcola la larghezza totale del SET ORIGINALE di elementi.
    // Questa è la distanza che l'animazione deve coprire prima del reset.
    // Assumiamo che il gap sia uniforme tra tutti gli elementi.
    let widthOfOriginalBlock = 0;
    if (originalItemsCount > 0) {
        // Larghezza di tutti gli elementi originali
        widthOfOriginalBlock = (singleItemAndGapWidth * originalItemsCount) - (parseFloat(getComputedStyle(clientsList).gap || '0'));
    } else {
        widthOfOriginalBlock = clientsList.scrollWidth / (numberOfCopies + 1); // Fallback se originalItemsCount è 0
    }

    // Aggiusta il calcolo di widthOfOriginalBlock se la lista è molto corta o molto lunga.
    // L'idea è che sia la larghezza del PRIMO set completo di elementi.
    // Se hai solo 1-2 elementi e la larghezza del wrapper è grande, potresti aver bisogno di più copie.

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

    clientsListWrapper.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    clientsListWrapper.addEventListener('mouseleave', () => {
        isPaused = false;
    });
});