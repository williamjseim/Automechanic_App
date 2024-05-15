import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  // Add item to session storage
  addToSessionStorage(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  // Get item from session storage
  getFromSessionStorage(key: string) {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  // Remove item from session storage
  removeFromSessionStorage(key: string) {
    sessionStorage.removeItem(key);
  }

  // Clear all items from session storage
  clearSessionStorage() {
    sessionStorage.clear();
  }
}
