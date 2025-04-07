import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MessageRole } from "../types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate avatar URL using DiceBear API
 * @param role - The role of the user ('user' or 'assistant')
 * @returns URL string for the avatar
 */
export function getAvatarUrl(role: MessageRole): string {
  if (role === 'user') {
    // Generate user avatar - different style for the user
    return `https://api.dicebear.com/7.x/bottts/svg?seed=user123`
  } else if (role === 'assistant') {
    // Generate assistant avatar - medical style
    return `https://api.dicebear.com/7.x/thumbs/svg?seed=medical-assistant&backgroundColor=b6e3f4`
  } else {
    // Default system avatar if needed
    return `https://api.dicebear.com/7.x/identicon/svg?seed=system`
  }
}
