// Admin functionality
import { saveData, validatePassword } from './firebase.js';

export class AdminManager {
  constructor() {
    this.isAdmin = false;
    this.adminToken = null;
    this.editingCategory = null;
    this.currentData = null;
    this.onDataChange = null;
  }

  async login(password) {
    try {
      const result = await validatePassword(password);
      if (result.success) {
        this.isAdmin = true;
        this.adminToken = result.token;
        return { success: true };
      } else {
        return { success: false, error: 'Incorrect password' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  logout() {
    this.isAdmin = false;
    this.adminToken = null;
    this.editingCategory = null;
  }

  async updateCategoryName(yearData, categoryIdx, name) {
    yearData.categories[categoryIdx].name = name;
    await this.saveChanges(yearData);
  }

  async updateWinner(yearData, categoryIdx, winner) {
    yearData.categories[categoryIdx].winner = winner;
    await this.saveChanges(yearData);
  }

  async updateNominees(yearData, categoryIdx, nomineesText) {
    const nominees = nomineesText.split('\n').filter(n => n.trim());
    yearData.categories[categoryIdx].nominees = nominees;
    await this.saveChanges(yearData);
  }

  async deleteCategory(yearData, categoryIdx) {
    yearData.categories.splice(categoryIdx, 1);
    await this.saveChanges(yearData);
  }

  async addCategory(yearData) {
    yearData.categories.push({
      name: "New Category",
      icon: "🏆",
      winner: "",
      nominees: []
    });
    await this.saveChanges(yearData);
  }

  async saveChanges(data) {
    if (!this.isAdmin || !this.adminToken) {
      throw new Error('Must be logged in as admin');
    }

    try {
      const allData = { ...this.currentData, ...data };
      await saveData(allData, this.adminToken);
    } catch (error) {
      this.isAdmin = false;
      this.adminToken = null;
      throw error;
    }
  }

  toggleEditCategory(idx) {
    this.editingCategory = this.editingCategory === idx ? null : idx;
  }

  setCurrentData(data) {
    this.currentData = data;
  }
}
