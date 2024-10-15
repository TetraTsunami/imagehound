import { writable } from 'svelte/store';

export const selectedBreeds = writable<string[][]>([]);
export const popupImage = writable<{src: string, alt: string} | null>(null);
