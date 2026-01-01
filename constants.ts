
import { TierType, BusinessTierInfo } from './types';

export const ADMIN_PASSWORD = 'reuben2026yay';

export const BUSINESS_TIERS: Record<TierType, BusinessTierInfo> = {
  [TierType.SMALL]: {
    name: TierType.SMALL,
    price: 'Free',
    duration: '2 days',
    requiresPassword: false,
    features: ['Name', 'Logo', 'Short Description', 'Contact Email', 'Appears in search']
  },
  [TierType.MEDIUM]: {
    name: TierType.MEDIUM,
    price: '$5',
    duration: '1 month',
    requiresPassword: true,
    features: ['Everything in Small', 'Featured Listing', 'Larger Logo', 'Social Links', 'Priority Search']
  },
  [TierType.BIG]: {
    name: TierType.BIG,
    price: '$10',
    duration: '3 months',
    requiresPassword: true,
    features: ['Everything in Medium', 'Top Category Placement', 'Weekly Newsletter Highlight', 'Custom Banner']
  },
  [TierType.MASSIVE]: {
    name: TierType.MASSIVE,
    price: '$21',
    duration: '6 months',
    requiresPassword: true,
    features: ['Everything in Big', 'Homepage Rotation', 'Analytics', 'Special Badge/Icon']
  }
};

export const POSTING_RULES = [
  "Accurate Info",
  "Respectful Content",
  "No Spam/Ads Outside Listing",
  "Relevant Categories",
  "Images Reflect Business Only",
  "One Listing per Business",
  "Free Tier Limitations (2 days)",
  "Clear Description Guidelines",
  "Accurate Pricing & Offers",
  "No Illegal Services",
  "No Porn or NSFW Content",
  "Respect Privacy",
  "Update Listings When Needed",
  "Follow Tier Perks Rules",
  "Compliance: Violations may lead to removal/banning",
  "Report Issues to Admins",
  "Posting Frequency: Limit free tier",
  "Focus on Albury Businesses Only",
  "Professional Tone"
];
