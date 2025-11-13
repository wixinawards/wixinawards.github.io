// Image Carousel Component
export class Carousel {
  constructor(containerId, images = []) {
    this.container = document.getElementById(containerId);
    this.images = images;
    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    if (this.images.length > 0) {
      this.startAutoPlay();
    }
  }

  render() {
    const html = `
      <div class="carousel-container">
        <div class="carousel-wrapper">
          <div class="carousel-inner" style="transform: translateX(-${this.currentIndex * 100}%)">
            ${this.images.length > 0 
              ? this.images.map(img => `
                  <div class="carousel-slide" style="background-image: url('${img}')"></div>
                `).join('')
              : `<div class="carousel-slide"><div class="carousel-slide-placeholder">📸 Viewer Builds Showcase<br>No builds uploaded yet</div></div>`
            }
          </div>
          ${this.images.length > 1 ? `
            <button class="carousel-nav prev" onclick="window.carouselInstance.prev()">❮</button>
            <button class="carousel-nav next" onclick="window.carouselInstance.next()">❯</button>
            <div class="carousel-controls">
              ${this.images.map((_, idx) => `
                <div class="carousel-dot ${idx === this.currentIndex ? 'active' : ''}" onclick="window.carouselInstance.goToSlide(${idx})"></div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
    this.container.innerHTML = html;
  }

  setupEventListeners() {
    window.carouselInstance = this;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateCarousel();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateCarousel();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }

  updateCarousel() {
    const inner = this.container.querySelector('.carousel-inner');
    if (inner) {
      inner.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }
    
    const dots = this.container.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentIndex);
    });
  }

  startAutoPlay() {
    setInterval(() => {
      this.next();
    }, 5000);
  }

  updateImages(images) {
    this.images = images;
    this.currentIndex = 0;
    this.init();
  }
}
