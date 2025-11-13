// Main application logic
import { initializeData, loadData } from './firebase.js';
import { AdminManager } from './admin.js';

// Markdown link parser - converts [text](url) to HTML links
function parseMarkdownLinks(text) {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

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
      const heroSection = document.querySelector('.hero');
      const trophy = document.querySelector('.trophy-container');
      const parallaxBg = document.getElementById('carousel-container');
      
      if (parallaxBg) {
        // Background parallax - moves slower
        parallaxBg.style.transform = `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0005})`;
      }
      
      if (heroSection) {
        // Hero scales down as you scroll
        const scale = Math.max(0.7, 1 - scrollY * 0.0015);
        const opacity = Math.max(0.3, 1 - scrollY * 0.003);
        heroSection.style.transform = `scale(${scale})`;
        heroSection.style.opacity = opacity;
      }
      
      if (trophy) {
        // Trophy moves up and scales
        const trophyMove = scrollY * 0.3;
        const trophyScale = Math.min(1.3, 1 + scrollY * 0.0008);
        trophy.style.transform = `translateY(-${trophyMove}px) scale(${trophyScale})`;
      }
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

      <!-- Parallax Base Layer -->
      <div class="parallax-layer base" id="carousel-container"></div>

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

      <!-- Content -->
      <div class="content">
        <!-- Trophy at Top -->
        <div class="trophy-container">
          <div style="font-size: 8rem; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));">🏆</div>
        </div>

        <!-- Hero Section -->
        <div class="hero">
          <h2>${this.selectedYear} Wixin Awards</h2>
          <p>Celebrating Excellence in the Wixcelo Community</p>
        </div>

        <!-- Event Info Bar -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 3rem; padding: 1.5rem; background: rgba(0, 0, 0, 0.3); border-radius: 0.75rem; border-left: 4px solid rgba(239, 68, 68, 0.8);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <svg style="width: 1.5rem; height: 1.5rem; color: rgba(239, 68, 68, 0.8);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <div>
              <p style="font-size: 0.875rem; color: rgba(229, 231, 235, 0.7); margin-bottom: 0.25rem;">Event Date</p>
              <p style="color: rgba(234, 179, 8, 1); font-weight: bold;">${currentYearData.eventDate}</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">▶️</span>
            <div>
              <p style="font-size: 0.875rem; color: rgba(229, 231, 235, 0.7); margin-bottom: 0.25rem;">Hosted By</p>
              <p style="color: rgba(234, 179, 8, 1); font-weight: bold;">Wixcelo</p>
            </div>
          </div>
        </div>

        <!-- Winners Section Header -->
        <div style="margin-top: 4rem; margin-bottom: 2.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <h2 style="font-size: 2rem; font-weight: bold; color: rgba(234, 179, 8, 1);">🏅 ${this.selectedYear} Winners</h2>
            ${this.adminManager.isAdmin ? `
            <button class="btn btn-primary" onclick="addCategory()" style="margin: 0;">
              + Add Award
            </button>
            ` : ''}
          </div>
          <div style="height: 2px; background: linear-gradient(90deg, rgba(239, 68, 68, 0.8), transparent); border-radius: 1px;"></div>
        </div>

        ${this.adminManager.isAdmin ? `
        <div class="admin-dashboard" style="margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem; color: rgba(239, 68, 68, 0.8);">
            <span style="font-size: 1.25rem;">⚙️</span>
            <p style="margin: 0; color: rgba(229, 231, 235, 0.8);">You are in <strong>Admin Mode</strong> for ${this.selectedYear}</p>
          </div>
        </div>
        ` : ''}

        <!-- Winners Grid -->
        <div class="winners-grid">
          ${currentYearData.categories.map((category, idx) => `
            <div class="winner-card">
              ${this.adminManager.isAdmin ? `
              <button class="btn btn-danger" style="position: absolute; top: 1rem; right: 1rem; width: auto; padding: 0.5rem;" onclick="deleteCategory(${idx})">
                ✕
              </button>
              ` : ''}
              
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                <span style="font-size: 2.5rem;">${category.icon}</span>
                ${this.adminManager.isAdmin && this.adminManager.editingCategory === idx ? `
                  <input
                    type="text"
                    value="${category.name}"
                    onchange="updateCategoryName(${idx}, this.value)"
                    class="form-input"
                    placeholder="Award name"
                    style="flex: 1;"
                  />
                ` : `
                  <h3 style="margin: 0; font-size: 1.125rem; font-weight: bold; color: white;" data-markdown>${category.name}</h3>
                `}
              </div>
              
              <div style="padding: 1rem; background: rgba(0, 0, 0, 0.4); border-radius: 0.5rem; margin-bottom: 1rem;">
                <p style="font-size: 0.75rem; color: rgba(239, 68, 68, 0.8); margin: 0 0 0.5rem 0; font-weight: 600;">🏆 WINNER</p>
                ${this.adminManager.isAdmin && this.adminManager.editingCategory === idx ? `
                  <input
                    type="text"
                    value="${category.winner}"
                    onchange="updateWinner(${idx}, this.value)"
                    class="form-input"
                    placeholder="Nominee name or [Link Text](URL)"
                  />
                ` : `
                  <p style="margin: 0; font-size: 1.125rem; font-weight: bold; color: rgba(234, 179, 8, 1);" data-markdown>${category.winner}</p>
                `}
              </div>

              <div style="margin-bottom: 1rem;">
                <p style="font-size: 0.75rem; color: rgba(229, 231, 235, 0.7); margin: 0 0 0.5rem 0; font-weight: 600;">Nominees</p>
                ${this.adminManager.isAdmin && this.adminManager.editingCategory === idx ? `
                  <textarea
                    onchange="updateNominees(${idx}, this.value)"
                    class="form-input"
                    placeholder="One nominee per line (supports [Link](URL))"
                    style="min-height: 100px; resize: vertical;"
                  >${category.nominees.join('\n')}</textarea>
                ` : `
                  <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
                    ${category.nominees.map(nominee => `
                      <li style="font-size: 0.875rem; color: rgba(229, 231, 235, 0.8); display: flex; align-items: center; gap: 0.5rem;" data-markdown-item>
                        <span style="color: rgba(239, 68, 68, 0.6);">▸</span>
                        <span data-markdown>${nominee}</span>
                      </li>
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
                ${this.adminManager.editingCategory === idx ? '✓ Done Editing' : '✏️ Edit'}
              </button>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Community Section -->
        <div style="margin-top: 5rem; padding: 3rem; background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1)); border: 2px solid rgba(239, 68, 68, 0.4); border-radius: 1.5rem; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">🎮</div>
          <h2 style="font-size: 2rem; color: rgba(234, 179, 8, 1); margin-bottom: 0.75rem;">Join the Wixcelo Community</h2>
          <p style="font-size: 1.125rem; color: rgba(229, 231, 235, 0.8); margin-bottom: 2rem;">Experience one of Minecraft's most creative and welcoming communities</p>
          <a href="https://www.youtube.com/@WixceloMC" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.75rem; padding: 1rem 2rem; background: rgba(239, 68, 68, 0.9); color: white; border: none; border-radius: 0.75rem; font-weight: bold; cursor: pointer; transition: all 0.3s ease; text-decoration: none;">
            <span style="font-size: 1.25rem;">▶️</span>
            Subscribe on YouTube
          </a>
        </div>
      </div>

      <!-- Footer -->
      <footer>
        <div class="container">
          <p>© ${this.selectedYear} Wixin Awards - Wixcelo Community</p>
          <p class="copyright">Made with ❤️ for the Wixcelo Community</p>
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
    
    // Parse markdown links after rendering
    document.querySelectorAll('[data-markdown]').forEach(el => {
      el.innerHTML = parseMarkdownLinks(el.textContent);
    });
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
