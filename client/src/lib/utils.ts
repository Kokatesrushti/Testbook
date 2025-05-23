import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price with currency symbol
export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null) return "";
  return `₹${price.toLocaleString('en-IN')}`;
}

// Format rating to display stars (e.g., 47 -> 4.7)
export function formatRating(rating: number | undefined | null): number {
  if (rating === undefined || rating === null) return 0;
  return rating / 10;
}

// Format count with abbreviation (e.g., 1500 -> 1.5k)
export function formatCount(count: number | undefined | null): string {
  if (count === undefined || count === null) return "0";
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  
  return count.toString();
}

// Format date to readable string
export function formatDate(date: Date | string | undefined | null): string {
  if (!date) return "";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format duration (minutes) to display as HH:MM:SS
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  
  return `${mins}m`;
}

// Format time remaining (seconds) to display as MM:SS
export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Check if an object is empty
export function isEmptyObject(obj: unknown): boolean {
  return obj !== null &&
         typeof obj === 'object' &&
         Object.keys(obj).length === 0;
}

// Generate initials from name
export function getInitials(name: string): string {
  if (!name) return "";
  
  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Remove HTML tags from string
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
