// Main application logic
import { initializeData, loadData } from './firebase.js';
import { Carousel } from './carousel.js';
import { AdminManager } from './admin.js';

const defaultData = {
  '2024': {
    eventDate: 'December 20, 2024',
    categories: [
      { 
        name: "MOST ACTIVE VIEWER", 
        icon: "👑", 
        winner: "Axiel_TM", 
        nominees: ["Axiel_TM", "Peeks", "Snazz", "Muzwt"] 
      },
      { 
        name: "BEST VIEWER BUILD", 
        icon: "🏗️", 
        winner: "Elliot's Little Pond", 
        nominees: ["Elliot's Little Pond", "OGBuildz's Megabase", "Muzwt's Cafe", "Water's Boss Arena"] 
      },
      { 
        name: "BEST WIXCELO MOMENT", 
        icon: "✨", 
        winner: "Halftime show", 
        nominees: ["Halftime show", "Wixcelo saying \"Sheep come give me the meat.\"", "VC Revolution", "Wixcelo playing on the Minecraft server"] 
      },
      { 
        name: "BEST MODERATOR", 
        icon: "🛡️", 
        winner: "EReaso", 
        nominees: ["EReaso", "Peeks", "Axiel_TM", "Muzwt"] 
      },
      { 
        name: "BEST WIXCELO LIVESTREAM", 
        icon: "🎥", 
        winner: "Building Treehouse", 
        nominees: ["Building Treehouse", "Zombie Survival", "Hypixel Build Battle", "Playing Minecraft server"] 
      },
      { 
        name: "BEST WIXCELO SHORT", 
        icon: "📱", 
        winner: "The 7 steps to paths", 
        nominees: ["The 7 steps to paths", "The 6 steps to a pond", "The 6 steps to a Basement", "The 5 steps to bridges"] 
      },
      { 
        name: "BEST WIXCELO VIDEO", 
        icon: "🎬", 
        winner: "17 build ideas for your Minecraft survival world", 
        nominees: [
          "17 build ideas for your Minecraft survival world", 
          "The problem with \"starter houses\" in minecraft", 
          "These 4 mods REVOLUTIONIZE first person Minecraft", 
          "7 Practical resource packs for Survival Minecraft"
        ] 
      },
      { 
        name: "MOST LIKELY TO BECOME A MODERATOR", 
        icon: "⭐", 
        winner: "Snazz", 
        nominees: ["Snazz", "Sensei", "Elliot", "Jacer11"] 
      },
      { 
        name: "BEST WIXCELO BUILD", 
        icon: "🏛️", 
        winner: "Bill Cypher", 
        nominees: ["Bill Cypher", "Treehouse", "Cave", "Medieval Kitchen"] 
      }
    ]
  },
  '2025': {
    eventDate: 'December 20, 2025',
    categories: [
      { 
        name: "MOST ACTIVE VIEWER", 
        icon: "👑", 
        winner: "Axiel_TM", 
        nominees: ["Axiel_TM", "Peeks", "Snazz", "Muzwt"] 
      },
      { 
        name: "BEST VIEWER BUILD", 
        icon: "🏗️", 
        winner: "Elliot's Little Pond", 
        nominees: ["Elliot's Little Pond", "OGBuildz's Megabase", "Muzwt's Cafe", "Water's Boss Arena"] 
      }
    ]
  }
};

// Sample build images - replace with actual image URLs
const sampleBuildImages = [
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%23dc2626" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="48" fill="white"%3EBuild 1: Forest Cottage%3C/text%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%23991b1b" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="48" fill="white"%3EBuild 2: Mountain Base%3C/text%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%237f1d1d" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="48" fill="white"%3EBuild 3: Castle%3C/text%3E%3C/svg%3E'
];

class App {
  constructor() {
    this.selectedYear = '2025';
    this.adminManager = new AdminManager();
    this.carousel = null;
    this.allData = null;
  }

  async init() {
    await initializeData(defaultData);
    loadData((data) => this.onDataLoaded(data));
    this.setupParallax();
    this.setupEventListeners();
  }

  onDataLoaded(data) {
    this.allData = data;
    this.adminManager.setCurrentData(data);
    this.render();
  }

  setupParallax() {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const layer2 = document.querySelector('.parallax-layer.layer-2');
      const layer3 = document.querySelector('.parallax-layer.layer-3');
      
      if (layer2) layer2.style.setProperty('--parallax-offset-2', `${scrollY * 0.3}px`);
      if (layer3) layer3.style.setProperty('--parallax-offset-3', `${scrollY * 0.5}px`);
    });
  }

  setupEventListeners() {
    window.toggleAdmin = () => this.toggleAdmin();
    window.toggleYearDropdown = () => this.toggleYearDropdown();
    window.selectYear = (year) => this.selectYear(year);
    window.closePasswordModal = () => this.closePasswordModal();
    window.handlePasswordSubmit = (e) => this.handlePasswordSubmit(e);
    window.toggleEdit = (idx) => this.toggleEdit(idx);
    window.updateCategoryName = (idx, value) => this.updateCategoryName(idx, value);
    window.updateWinner = (idx, value) => this.updateWinner(idx, value);
    window.updateNominees = (idx, value) => this.updateNominees(idx, value);
    window.deleteCategory = (idx) => this.deleteCategory(idx);
    window.addCategory = () => this.addCategory();
  }

  render() {
    const currentYearData = this.allData[this.selectedYear] || { categories: [], eventDate: 'TBA' };
    const years = Object.keys(this.allData || {}).sort().reverse();

    const html = `
      <!-- Password Modal -->
      <div id="passwordModal" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Admin Access</h3>
            <button class="modal-close" onclick="closePasswordModal()">✕</button>
          </div>
          <form onsubmit="handlePasswordSubmit(event)">
            <input
              type="password"
              id="passwordInput"
              placeholder="Enter admin password"
              class="form-input"
            />
            <button type="submit" class="btn btn-primary" style="width: 100%;">
              Enter Admin Mode
            </button>
          </form>
        </div>
      </div>

      <!-- Navigation -->
      <nav>
        <div class="container">
          <div class="logo-section">
            <svg class="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 17l10 5 10-5"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12l10 5 10-5"></path>
            </svg>
            <div class="logo-text">
              <h1>WIXIN AWARDS</h1>
              <p>Wixcelo Community</p>
            </div>
          </div>
          
          <div class="nav-controls">
            <div class="dropdown">
              <button class="dropdown-btn" onclick="toggleYearDropdown()">
                <span>${this.selectedYear}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div id="yearDropdown" class="dropdown-menu hidden">
                ${years.map(year => `
                  <button class="dropdown-item ${year === this.selectedYear ? 'active' : ''}" onclick="selectYear('${year}')">
                    ${year}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Parallax Background -->
      <div class="parallax-layer layer-1"></div>
      <div class="parallax-layer layer-2"></div>
      <div class="parallax-layer layer-3"></div>

      <!-- Content -->
      <div class="content">
        <!-- Hero Section -->
        <div class="hero">
          <svg class="hero-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2>${this.selectedYear} Wixin Awards</h2>
          <p>Celebrating the Wixcelo Community</p>
          <div class="hero-info">
            <div class="hero-info-item">
              <svg class="hero-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>${currentYearData.eventDate}</span>
            </div>
            <div class="hero-info-item">
              <svg class="hero-info-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
              </svg>
              <span>Hosted by Wixcelo</span>
            </div>
          </div>
        </div>

        <!-- Carousel Section -->
        <div id="carousel-container"></div>

        ${this.adminManager.isAdmin ? `
        <div class="admin-dashboard">
          <div class="admin-dashboard-header">
            <h3>Admin Dashboard</h3>
            <button class="btn btn-primary" onclick="addCategory()">
              + Add Category
            </button>
          </div>
          <p>Edit categories, winners, and nominees for ${this.selectedYear}</p>
        </div>
        ` : ''}

        <!-- Winners Grid -->
        <div>
          <h3 style="text-align: center; font-size: 2.25rem; font-weight: bold; color: rgb(234, 179, 8); margin-bottom: 2rem;">
            ${this.selectedYear} Winners
          </h3>
          <div class="winners-grid">
            ${currentYearData.categories.map((category, idx) => `
              <div class="winner-card">
                ${this.adminManager.isAdmin ? `
                <button class="btn btn-danger" style="position: absolute; top: 1rem; right: 1rem; width: auto; padding: 0.5rem;" onclick="deleteCategory(${idx})">
                  ✕
                </button>
                ` : ''}
                <div class="winner-card-icon">${category.icon}</div>
                ${this.adminManager.isAdmin && this.adminManager.editingCategory === idx ? `
                  <input
                    type="text"
                    value="${category.name}"
                    onchange="updateCategoryName(${idx}, this.value)"
                    class="form-input"
                  />
                ` : `
                  <h3 class="winner-card">${category.name}</h3>
                `}
                
                <div class="winner-card-section">
                  <p class="winner-card-label">🏆 WINNER</p>
                  ${this.adminManager.isAdmin && this.adminManager.editingCategory === idx ? `
                    <input
                      type="text"
                      value="${category.winner}"
                      onchange="updateWinner(${idx}, this.value)"
                      class="form-input"
                    />
                  ` : `
                    <p class="winner-card-winner">${category.winner}</p>
                  `}
                </div>

                <div class="winner-card-section">
                  <p class="winner-card-label">Nominees:</p>
                  ${this.adminManager.isAdmin && this.adminManager.editingCategory === idx ? `
                    <textarea
                      onchange="updateNominees(${idx}, this.value)"
                      placeholder="One nominee per line"
                      style="min-height: 100px;"
                    >${category.nominees.join('\n')}</textarea>
                  ` : `
                    <ul class="winner-card-nominees">
                      ${category.nominees.map(nominee => `
                        <li>${nominee}</li>
                      `).join('')}
                    </ul>
                  `}
                </div>

                ${this.adminManager.isAdmin ? `
                <button
                  class="btn btn-secondary"
                  style="width: 100%; margin-top: 1rem;"
                  onclick="toggleEdit(${idx})"
                >
                  ${this.adminManager.editingCategory === idx ? '✓ Done' : '✎ Edit'}
                </button>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Community Section -->
        <div class="community-section">
          <h3>Join the Wixcelo Community!</h3>
          <p>Be part of the most creative Minecraft community</p>
          <button class="btn btn-primary">
            <svg class="hero-info-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
            </svg>
            Subscribe to Wixcelo
          </button>
        </div>
      </div>

      <!-- Footer -->
      <footer>
        <div class="container">
          <p>© ${this.selectedYear} Wixin Awards - Wixcelo Community</p>
          <p class="copyright">Not affiliated with Mojang Studios or Microsoft</p>
        </div>
      </footer>

      <!-- Admin Toggle Button -->
      <button
        class="admin-toggle"
        onclick="toggleAdmin()"
        title="${this.adminManager.isAdmin ? 'Exit Admin Mode' : 'Admin Mode'}"
      >
        ${this.adminManager.isAdmin ? '🔓' : '🔒'}
      </button>
    `;

    document.getElementById('app').innerHTML = html;
    
    // Initialize carousel after rendering
    this.carousel = new Carousel('carousel-container', sampleBuildImages);
  }

  toggleYearDropdown() {
    const dropdown = document.getElementById('yearDropdown');
    if (dropdown) {
      dropdown.classList.toggle('hidden');
    }
  }

  selectYear(year) {
    this.selectedYear = year;
    const dropdown = document.getElementById('yearDropdown');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
    this.render();
  }

  toggleAdmin() {
    if (this.adminManager.isAdmin) {
      this.adminManager.logout();
      this.render();
    } else {
      const modal = document.getElementById('passwordModal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    }
  }

  closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    const input = document.getElementById('passwordInput');
    if (modal) modal.classList.add('hidden');
    if (input) input.value = '';
  }

  async handlePasswordSubmit(e) {
    e.preventDefault();
    const password = document.getElementById('passwordInput').value;
    
    try {
      const result = await this.adminManager.login(password);
      if (result.success) {
        this.closePasswordModal();
        this.render();
      } else {
        alert(result.error || 'Incorrect password');
        document.getElementById('passwordInput').value = '';
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }

  toggleEdit(idx) {
    this.adminManager.toggleEditCategory(idx);
    this.render();
  }

  async updateCategoryName(idx, value) {
    try {
      const yearData = this.allData[this.selectedYear];
      await this.adminManager.updateCategoryName(yearData, idx, value);
    } catch (error) {
      alert('Error: ' + error.message);
      this.render();
    }
  }

  async updateWinner(idx, value) {
    try {
      const yearData = this.allData[this.selectedYear];
      await this.adminManager.updateWinner(yearData, idx, value);
    } catch (error) {
      alert('Error: ' + error.message);
      this.render();
    }
  }

  async updateNominees(idx, value) {
    try {
      const yearData = this.allData[this.selectedYear];
      await this.adminManager.updateNominees(yearData, idx, value);
    } catch (error) {
      alert('Error: ' + error.message);
      this.render();
    }
  }

  async deleteCategory(idx) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const yearData = this.allData[this.selectedYear];
      await this.adminManager.deleteCategory(yearData, idx);
    } catch (error) {
      alert('Error: ' + error.message);
      this.render();
    }
  }

  async addCategory() {
    try {
      const yearData = this.allData[this.selectedYear];
      if (!yearData) {
        this.allData[this.selectedYear] = { eventDate: 'TBA', categories: [] };
      }
      await this.adminManager.addCategory(this.allData[this.selectedYear]);
    } catch (error) {
      alert('Error: ' + error.message);
      this.render();
    }
  }
}

// Initialize app
const app = new App();
app.init();
