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
      const heroSection = document.getElementById('heroSection');
      const trophy = document.querySelector('.trophy-container');
      const parallaxBg = document.getElementById('carousel-container');
      
      if (parallaxBg) {
        // Background parallax - bigger movement
        parallaxBg.style.transform = `translateY(${scrollY * 0.8}px) scale(${1 + scrollY * 0.001})`;
      }
      
      if (heroSection) {
        // Hero parallax effect - bigger movement (was 0.3, now 0.5)
        heroSection.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
      
      if (trophy) {
        // Trophy moves up and scales - more dramatic
        const trophyMove = scrollY * 0.6;
        const trophyScale = Math.min(1.5, 1 + scrollY * 0.0015);
        trophy.style.transform = `translateY(-${trophyMove}px) scale(${trophyScale})`;
      }

      // Award cards parallax effect - bigger movement (was 20, now 50)
      const cards = document.querySelectorAll('[data-card-index]');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - rect.top) / window.innerHeight;
        const parallaxAmount = (scrollProgress - 0.5) * 50;
        card.style.transform = `translateY(${parallaxAmount}px)`;
      });
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
    window.updateEventDate = (value) => this.updateEventDate(value);
  }

  render() {
    const currentYearData = this.allData[this.selectedYear] || { categories: [], eventDate: 'TBA' };
    const years = Object.keys(this.allData || {}).filter(key => /^\d{4}$/.test(key)).sort().reverse();

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
            <div style="font-size: 2rem;">🏆</div>
            <div class="logo-text">
              <h1>WIXIN AWARDS</h1>
              <p>Annual Community Celebration</p>
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
        <!-- Premium Hero -->
        <div style="text-align: center; margin-bottom: 4rem; padding: 3rem 0;" id="heroSection" class="parallax-hero">
          <div style="display: flex; justify-content: center; margin-bottom: 1.5rem;">
            <div style="font-size: 6rem; filter: drop-shadow(0 8px 16px rgba(239, 68, 68, 0.4));">🏆</div>
          </div>
          <h1 style="font-size: 4rem; font-weight: 900; color: rgba(234, 179, 8, 1); margin: 0 0 0.75rem 0; letter-spacing: -1px;">
            ${this.selectedYear} Awards
          </h1>
          <p style="font-size: 1.375rem; color: rgba(239, 68, 68, 0.9); margin: 0 0 2rem 0; font-weight: 300; letter-spacing: 0.5px;">
            Celebrating Excellence in the Wixcelo Community
          </p>
          
          <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
              <p style="font-size: 0.875rem; color: rgba(229, 231, 235, 0.6); text-transform: uppercase; letter-spacing: 1px; margin: 0;">Event Date</p>
              ${this.adminManager.isAdmin ? `
                <input
                  type="text"
                  value="${currentYearData.eventDate}"
                  onchange="updateEventDate(this.value)"
                  class="form-input"
                  style="font-size: 1.5rem; font-weight: bold; max-width: 250px; text-align: center;"
                  placeholder="e.g., December 20, 2024"
                />
              ` : `
                <p style="font-size: 1.5rem; color: rgba(234, 179, 8, 1); font-weight: bold; margin: 0;">${currentYearData.eventDate}</p>
              `}
            </div>
            <div style="width: 1px; background: rgba(239, 68, 68, 0.3);"></div>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
              <p style="font-size: 0.875rem; color: rgba(229, 231, 235, 0.6); text-transform: uppercase; letter-spacing: 1px; margin: 0;">Hosted By</p>
              <p style="font-size: 1.5rem; color: rgba(234, 179, 8, 1); font-weight: bold; margin: 0;">Wixcelo</p>
            </div>
          </div>
        </div>

        ${this.adminManager.isAdmin ? `
        <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1)); border: 2px dashed rgba(239, 68, 68, 0.5); border-radius: 1rem; padding: 1.5rem; margin-bottom: 3rem; text-align: center;">
          <p style="margin: 0; color: rgba(239, 68, 68, 1); font-weight: bold;">🔓 ADMIN MODE ACTIVE</p>
          <p style="margin: 0.5rem 0 0 0; color: rgba(229, 231, 235, 0.7); font-size: 0.875rem;">You can edit all awards for ${this.selectedYear}</p>
        </div>
        ` : ''}

        <!-- Awards Grid -->
        <div style="margin-bottom: 3rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
            <h2 style="font-size: 2.5rem; font-weight: 800; color: white; margin: 0;">
              ${currentYearData.categories.length} Awards
            </h2>
            ${this.adminManager.isAdmin ? `
            <button class="btn btn-primary" onclick="addCategory()">
              + Add Award
            </button>
            ` : ''}
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem;" id="awardsGrid">
            ${currentYearData.categories.map((category, idx) => `
              <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.08)); backdrop-filter: blur(10px); border: 2px solid rgba(239, 68, 68, 0.4); border-radius: 1.25rem; padding: 2rem; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden;" class="award-card-premium" data-card-index="${idx}">
                <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: radial-gradient(circle, rgba(239, 68, 68, 0.1), transparent); border-radius: 0 0 0 100%;"></div>
                
                ${this.adminManager.isAdmin ? `
                <button class="btn btn-danger" style="position: absolute; top: 1rem; right: 1rem; width: auto; padding: 0.5rem; z-index: 10;" onclick="deleteCategory(${idx})">
                  ✕
                </button>
                ` : ''}
                
                <div style="font-size: 3.5rem; margin-bottom: 1.25rem; display: inline-block;">
                  ${category.icon}
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                  ${this.adminManager.isAdmin && this.adminManager.editingCategory === idx ? `
                    <input
                      type="text"
                      value="${category.name}"
                      onchange="updateCategoryName(${idx}, this.value)"
                      class="form-input"
                      style="font-size: 1.25rem; font-weight: bold;"
                    />
                  ` : `
                    <h3 style="font-size: 1.25rem; font-weight: bold; color: white; margin: 0; letter-spacing: 0.5px;" data-markdown>${category.name}</h3>
                  `}
                </div>
                
                <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
                  <p style="font-size: 0.75rem; color: rgba(234, 179, 8, 0.9); text-transform: uppercase; font-weight: bold; letter-spacing: 1px; margin: 0 0 0.75rem 0;">🏆 Winner</p>
                  ${this.adminManager.isAdmin && this.adminManager.editingCategory === idx ? `
                    <input
                      type="text"
                      value="${category.winner}"
                      onchange="updateWinner(${idx}, this.value)"
                      class="form-input"
                    />
                  ` : `
                    <p style="font-size: 1.125rem; font-weight: 900; color: rgba(234, 179, 8, 1); margin: 0;" data-markdown>${category.winner}</p>
                  `}
                </div>

                <div style="margin-bottom: 1.5rem;">
                  <p style="font-size: 0.75rem; color: rgba(229, 231, 235, 0.6); text-transform: uppercase; font-weight: bold; letter-spacing: 1px; margin: 0 0 0.75rem 0;">Nominees</p>
                  ${this.adminManager.isAdmin && this.adminManager.editingCategory === idx ? `
                    <textarea
                      onchange="updateNominees(${idx}, this.value)"
                      class="form-input"
                      placeholder="One per line"
                      style="min-height: 100px;"
                    >${category.nominees.join('\n')}</textarea>
                  ` : `
                    <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
                      ${category.nominees.map(nominee => `
                        <li style="font-size: 0.9rem; color: rgba(229, 231, 235, 0.8);" data-markdown>
                          ${nominee}
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
                  ${this.adminManager.editingCategory === idx ? '✓ Done' : '✏️ Edit'}
                </button>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Premium CTA -->
        <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.15)); backdrop-filter: blur(10px); border: 2px solid rgba(239, 68, 68, 0.5); border-radius: 1.5rem; padding: 3rem 2rem; text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 2rem; color: white; margin: 0 0 1rem 0; font-weight: 800;">
            Join the Community
          </h2>
          <p style="font-size: 1.125rem; color: rgba(229, 231, 235, 0.8); margin: 0 0 2rem 0;">
            Watch more from Wixcelo and stay updated on future awards
          </p>
          <a href="https://www.youtube.com/@Wixcelo" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 1rem 2.5rem; background: rgba(239, 68, 68, 0.9); color: white; border: none; border-radius: 0.75rem; font-weight: bold; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; text-decoration: none;">
            ▶️ Subscribe on YouTube
          </a>
        </div>
      </div>

      <!-- Footer -->
      <footer>
        <div class="container">
          <p style="margin: 0; color: white;">© ${this.selectedYear} Wixin Awards</p>
          <p style="margin: 0.5rem 0 0 0; color: rgba(239, 68, 68, 0.8); font-size: 0.875rem;">A Wixcelo Community Production</p>
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

  async updateEventDate(value) {
    try {
      const yearData = this.allData[this.selectedYear];
      yearData.eventDate = value;
      await this.adminManager.saveData(this.allData);
    } catch (error) {
      alert('Error: ' + error.message);
      this.render();
    }
  }
}

// Initialize app
const app = new App();
app.init();
