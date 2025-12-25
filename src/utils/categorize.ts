const CATEGORY_KEYWORDS: Record<string, string[]> = {
  food: ['food', 'grocery', 'restaurant', 'meal', 'snack', 'beverage', 'drink', 'coffee', 'tea', 'wine', 'beer'],
  health: ['vitamin', 'supplement', 'medicine', 'pharmacy', 'health', 'wellness', 'fitness', 'protein', 'organic'],
  home: ['home', 'furniture', 'decor', 'kitchen', 'bath', 'bedding', 'lighting', 'storage', 'organizer', 'cleaning'],
  electronics: ['electronics', 'computer', 'phone', 'tablet', 'camera', 'headphone', 'speaker', 'charger', 'cable', 'tech'],
  subscriptions: ['subscription', 'prime', 'music', 'video', 'streaming', 'service', 'membership'],
  clothing: ['clothing', 'clothes', 'shirt', 'pants', 'shoes', 'dress', 'jacket', 'accessory', 'jewelry', 'watch'],
  kids_pets: ['toy', 'baby', 'child', 'kid', 'pet', 'dog', 'cat', 'animal', 'diaper', 'stroller'],
  travel: ['travel', 'luggage', 'suitcase', 'hotel', 'flight', 'car rental', 'passport'],
  discretionary: ['book', 'game', 'entertainment', 'hobby', 'craft', 'art', 'music', 'movie'],
};

export function inferCategory(items: string, existingCategory?: string): string {
  if (existingCategory && existingCategory.trim()) {
    return existingCategory.trim().toLowerCase();
  }
  
  if (!items || items.trim() === '') {
    return 'other';
  }
  
  const itemsLower = items.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (itemsLower.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'other';
}

