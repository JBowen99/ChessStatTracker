import { writable } from 'svelte/store';

export const activity = writable([]);
export const results = writable([]);
export const userStats = writable<Record<string, unknown>>({});
