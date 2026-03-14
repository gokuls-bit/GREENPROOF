/**
 * Common utility functions
 */

export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

export function formatPercentage(num: number): string {
  return `${(num * 100).toFixed(1)}%`;
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatCO2(amount: number): string {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)} t CO₂`;
  }
  return `${amount.toFixed(2)} kg CO₂`;
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "#00FF9C"; // Primary Green
  if (confidence >= 0.6) return "#0F5132"; // Secondary Emerald
  return "#FF6B6B"; // Red (low confidence)
}

export function getRiskColor(risk: "LOW" | "MEDIUM" | "HIGH"): string {
  switch (risk) {
    case "LOW":
      return "#00FF9C";
    case "MEDIUM":
      return "#FFD700";
    case "HIGH":
      return "#FF6B6B";
    default:
      return "#7D8B99";
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function clsx(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Calculate trend direction
export function calculateTrend(
  current: number,
  previous: number
): { direction: "up" | "down" | "same"; percentage: number } {
  if (current === previous) {
    return { direction: "same", percentage: 0 };
  }

  const percentage = ((current - previous) / Math.abs(previous)) * 100;
  const direction = current > previous ? "up" : "down";

  return { direction, percentage: Math.abs(percentage) };
}

// Validate email
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate URL
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Truncate text
export function truncateText(text: string, length: number): string {
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

// Random ID generator
export function generateId(prefix: string = ""): string {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Check if running on client side
export function isClient(): boolean {
  return typeof window !== "undefined";
}
