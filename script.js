// Selecting necessary elements from the DOM
const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

// Variables to track dragging and autoplay state
let isDragging = false;
let isAutoPlay = true;
let startX, startScrollLeft, timeoutId;

// Calculating the number of cards that fit in the carousel viewport
let cardPerView = Math.round(carousel.offsetWidth / carousel.querySelector(".card").offsetWidth);

// Inserting copies of cards for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Handling initial scroll position for Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Adding event listeners for arrow buttons to scroll carousel
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -carousel.querySelector(".card").offsetWidth : carousel.querySelector(".card").offsetWidth;
    });
});

// Event listeners for drag functionality
const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

// Function to handle infinite scrolling
const infiniteScroll = () => {
    if (carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }
    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
}

// Function for autoplay
const autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return;
    timeoutId = setTimeout(() => carousel.scrollLeft += carousel.querySelector(".card").offsetWidth, 2500);
}
autoPlay();

// Event listeners for drag and autoplay
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);

// Project data

const projectsData = [
  {
    name: "RC Car",
    imageSrc: "./images/sven-d-a4S6KUuLeoM-unsplash.jpg",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    name: "RC Excavator",
    imageSrc: "./images/sven-d-a4S6KUuLeoM-unsplash.jpg",
    description: "Ith oru adipoli jcb annu. doh[odj[uvhrekjvnr8vjkd[8hwep ljoefgeurbgaper;jgkqgiguriug9ega",
  },
  // Add more project objects as needed
];

// Function to generate project cards dynamically
function generateProjectCards() {
    const container = document.getElementById("projects-container");
    container.innerHTML = "";

    projectsData.forEach(project => {
        const card = document.createElement("div");
        card.classList.add("project-card");

        const image = document.createElement("img");
        image.src = project.imageSrc;
        image.classList.add("project");

        const overlay = document.createElement("div");
        overlay.classList.add("project-overlay");

        const projectName = document.createElement("div");
        projectName.classList.add("project-name");
        projectName.textContent = project.name;

        const viewProject = document.createElement("a");
        viewProject.classList.add("view-project");
        viewProject.textContent = "View Project";

        card.appendChild(image);
        card.appendChild(overlay);
        card.appendChild(projectName);
        card.appendChild(viewProject);

        container.appendChild(card);
    });
}

// Calling the function to generate project cards
generateProjectCards();

// Event delegation to handle clicks on dynamically generated "View Project" buttons
function handleViewProjectClick(event) {
    if (event.target.classList.contains("view-project")) {
        const projectIndex = Array.from(event.target.parentNode.parentNode.children).indexOf(event.target.parentNode);
        const project = projectsData[projectIndex];
        
        // Creating and displaying modal
        const modal = document.createElement("div");
        modal.classList.add("project-modal");

        const modalContent = `
            <h2 class="project-modal-name">${project.name}</h2>
            <i class="fa-solid fa-xmark fa-xl" style="color: #ffffff;"></i>
            <img src="${project.imageSrc}" class="project-modal-img">
            <div class="description">
                <h2 class="section-head">Description</h2>
                <p class="project-description">${project.description}</p>
            </div>
        `;
        
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
    }
}

// Event listener to handle clicks on the X-mark icon to close modal
document.addEventListener("click", handleViewProjectClick);

function handleCloseModalClick(event) {
    if (event.target.classList.contains("fa-xmark")) {
        const modal = event.target.closest(".project-modal");
        if (modal) {
            modal.remove();
        }
    }
}

// Event listener to handle click on the X-mark icon
document.addEventListener("click", handleCloseModalClick);
