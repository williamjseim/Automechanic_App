import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Add item to local storage
  addToLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Get item from local storage
  getFromLocalStorage(key: string) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  // Remove item from local storage
  removeFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  // Clear all items from local storage
  clearLocalStorage() {
    localStorage.clear();
  }
}
