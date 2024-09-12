

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.D9otHEV4.js","_app/immutable/chunks/scheduler.3q3s62UL.js","_app/immutable/chunks/index.DgewMqUA.js","_app/immutable/chunks/ProgressBar.svelte_svelte_type_style_lang.DZlyklBO.js","_app/immutable/chunks/index.BIZQkIVS.js"];
export const stylesheets = ["_app/immutable/assets/ProgressBar.Cirlo5Z8.css"];
export const fonts = [];
