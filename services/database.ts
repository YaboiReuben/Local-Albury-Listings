
import { BusinessListing, TierPassword, TierType } from '../types';

/**
 * Mock Firestore Implementation
 * In a real app, you would replace these methods with actual firebase/firestore SDK calls.
 */
class MockDatabase {
  private STORAGE_KEYS = {
    LISTINGS: 'albury_listings',
    PASSWORDS: 'albury_passwords'
  };

  private async getListings(): Promise<BusinessListing[]> {
    const data = localStorage.getItem(this.STORAGE_KEYS.LISTINGS);
    return data ? JSON.parse(data) : [];
  }

  private async saveListings(listings: BusinessListing[]) {
    localStorage.setItem(this.STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  }

  async getPendingListings(): Promise<BusinessListing[]> {
    const listings = await this.getListings();
    return listings.filter(l => l.status === 'pending');
  }

  async getApprovedListings(includePrivate: boolean = false): Promise<BusinessListing[]> {
    const listings = await this.getListings();
    const now = Date.now();
    // Auto-expiry logic for Free Tier
    return listings.filter(l => {
        if (l.status !== 'approved') return false;
        if (!includePrivate && l.isPrivate) return false;
        if (l.tier === TierType.SMALL && l.expiresAt < now) return false;
        return true;
    });
  }

  async submitListing(listing: Omit<BusinessListing, 'id' | 'status' | 'createdAt' | 'expiresAt' | 'isPrivate'>): Promise<void> {
    const listings = await this.getListings();
    const createdAt = Date.now();
    let durationMs = 0;
    switch(listing.tier) {
      case TierType.SMALL: durationMs = 2 * 24 * 60 * 60 * 1000; break;
      case TierType.MEDIUM: durationMs = 30 * 24 * 60 * 60 * 1000; break;
      case TierType.BIG: durationMs = 90 * 24 * 60 * 60 * 1000; break;
      case TierType.MASSIVE: durationMs = 180 * 24 * 60 * 60 * 1000; break;
    }

    const newListing: BusinessListing = {
      ...listing,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt,
      expiresAt: createdAt + durationMs,
      isPrivate: false
    };
    listings.push(newListing);
    await this.saveListings(listings);
  }

  async approveListing(id: string): Promise<void> {
    const listings = await this.getListings();
    const index = listings.findIndex(l => l.id === id);
    if (index > -1) {
      listings[index].status = 'approved';
      await this.saveListings(listings);
    }
  }

  async togglePrivate(id: string): Promise<void> {
    const listings = await this.getListings();
    const index = listings.findIndex(l => l.id === id);
    if (index > -1) {
      listings[index].isPrivate = !listings[index].isPrivate;
      await this.saveListings(listings);
    }
  }

  async rejectListing(id: string): Promise<void> {
    const listings = await this.getListings();
    const index = listings.findIndex(l => l.id === id);
    if (index > -1) {
      listings.splice(index, 1);
      await this.saveListings(listings);
    }
  }

  async deleteListing(id: string): Promise<void> {
    const listings = await this.getListings();
    await this.saveListings(listings.filter(l => l.id !== id));
  }

  // Password Management
  async getUserPasswords(): Promise<TierPassword[]> {
    const data = localStorage.getItem(this.STORAGE_KEYS.PASSWORDS);
    if (!data) {
        // Seed default
        const seed = [{ id: '1', username: 'demo_user', tier: TierType.MEDIUM, password: '123', status: 'Active' as const }];
        localStorage.setItem(this.STORAGE_KEYS.PASSWORDS, JSON.stringify(seed));
        return seed;
    }
    return JSON.parse(data);
  }

  async addPassword(entry: Omit<TierPassword, 'id' | 'status'>): Promise<void> {
    const passwords = await this.getUserPasswords();
    passwords.push({ ...entry, id: Date.now().toString(), status: 'Active' });
    localStorage.setItem(this.STORAGE_KEYS.PASSWORDS, JSON.stringify(passwords));
  }

  async deletePassword(id: string): Promise<void> {
    const passwords = await this.getUserPasswords();
    localStorage.setItem(this.STORAGE_KEYS.PASSWORDS, JSON.stringify(passwords.filter(p => p.id !== id)));
  }

  async verifyTierPassword(tier: TierType, password: string): Promise<boolean> {
    if (tier === TierType.SMALL) return true;
    const passwords = await this.getUserPasswords();
    return passwords.some(p => p.tier === tier && p.password === password && p.status === 'Active');
  }
}

export const db = new MockDatabase();
