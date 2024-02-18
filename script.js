const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);


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

  // Function to dynamically generate project cards
  function generateProjectCards() {
    const container = document.getElementById("projects-container");
    container.innerHTML = ""; // Clear existing content

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

  // Call the function to generate project cards
  generateProjectCards();

  function handleViewProjectClick(event) {
    if (event.target.classList.contains("view-project")) {
      const projectIndex = Array.from(event.target.parentNode.parentNode.children).indexOf(event.target.parentNode);
      const project = projectsData[projectIndex];
      
      // Create and display modal
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

  // Event delegation to handle click on dynamically generated "View Project" buttons
  document.addEventListener("click", handleViewProjectClick);

  function handleCloseModalClick(event) {
    if (event.target.classList.contains("fa-xmark")) {
      const modal = event.target.closest(".project-modal");
      if (modal) {
        modal.remove(); // Remove the modal from the DOM
      }
    }
  }

  // Event listener to handle click on the X-mark icon
  document.addEventListener("click", handleCloseModalClick);