
export enum TierType {
  SMALL = 'Small',
  MEDIUM = 'Medium',
  BIG = 'Big',
  MASSIVE = 'Massive'
}

export interface BusinessListing {
  id: string;
  name: string;
  logo: string;
  description: string;
  email: string;
  address: string;
  tier: TierType;
  createdAt: number;
  expiresAt: number;
  status: 'pending' | 'approved' | 'rejected';
  isPrivate?: boolean;
  socialLinks?: string;
  banner?: string;
}

export interface TierPassword {
  id: string;
  username: string;
  tier: TierType;
  password: string;
  status: 'Active' | 'Inactive';
}

export interface BusinessTierInfo {
  name: TierType;
  price: string;
  duration: string;
  features: string[];
  requiresPassword: boolean;
}
