import { c as create_ssr_component, e as escape } from "../../../chunks/ssr.js";
import { w as writable } from "../../../chunks/index2.js";
import { ID } from "appwrite";
import { g as goto } from "../../../chunks/client.js";
import { a as account } from "../../../chunks/appwrite.js";
const isBrowser = typeof window !== "undefined";
const createUser = () => {
  const store = writable(null);
  async function init() {
    if (!isBrowser) return;
    try {
      store.set(await account.get());
    } catch (e) {
      store.set(null);
    }
  }
  init();
  async function register(email, password, name) {
    if (!isBrowser) return;
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
  }
  async function login(email, password) {
    if (!isBrowser) return;
    await account.createEmailPasswordSession(email, password);
    await init();
    goto();
  }
  async function logout() {
    await account.deleteSession("current");
    store.set(null);
  }
  return {
    // Exposes the store's value with $user
    subscribe: store.subscribe,
    register,
    login,
    logout,
    init
  };
};
createUser();
const css = {
  code: "form.svelte-1wvmbt9{display:flex;flex-direction:column;align-items:flex-start;gap:0.25rem;margin-block-end:2rem}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\r\\n\\timport { user } from '$lib/user';\\r\\n\\r\\n\\tconst login = async (e) => {\\r\\n\\t\\te.preventDefault();\\r\\n\\t\\tconst formData = new FormData(e.target);\\r\\n\\t\\tawait user.login(formData.get('email'), formData.get('password'));\\r\\n\\t};\\r\\n\\r\\n\\tconst register = async (e) => {\\r\\n\\t\\te.preventDefault();\\r\\n\\t\\tconst formData = new FormData(e.target);\\r\\n\\t\\tawait user.register(formData.get('email'), formData.get('password'), formData.get('name'));\\r\\n\\t};\\r\\n\\r\\n\\tlet hasAccount = true;\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"flex flex-col justify-center items-center\\">\\r\\n\\t<h1 class=\\"h3 my-3\\">{hasAccount ? 'Login' : 'Register'}</h1>\\r\\n\\r\\n\\t{#if hasAccount}\\r\\n\\t\\t<div class=\\"card p-3\\">\\r\\n\\t\\t\\t<form on:submit={login}>\\r\\n\\t\\t\\t\\t<div class=\\"flex flex-col space-y-3\\">\\r\\n\\t\\t\\t\\t\\t<label>\\r\\n\\t\\t\\t\\t\\t\\tEmail\\r\\n\\t\\t\\t\\t\\t\\t<input class=\\"input\\" type=\\"email\\" placeholder=\\"Email\\" name=\\"email\\" required />\\r\\n\\t\\t\\t\\t\\t</label>\\r\\n\\t\\t\\t\\t\\t<label>\\r\\n\\t\\t\\t\\t\\t\\tPassword:\\r\\n\\t\\t\\t\\t\\t\\t<input class=\\"input\\" type=\\"password\\" placeholder=\\"Password\\" name=\\"password\\" required />\\r\\n\\t\\t\\t\\t\\t</label>\\r\\n\\t\\t\\t\\t\\t<button class=\\"btn variant-ghost hover:variant-filled-primary\\" type=\\"submit\\">\\r\\n\\t\\t\\t\\t\\t\\tLogin\\r\\n\\t\\t\\t\\t\\t</button>\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t</form>\\r\\n\\t\\t</div>\\r\\n\\r\\n\\t\\t<div class=\\"flex flex-col items-center space-y-2 mt-2\\">\\r\\n\\t\\t\\t<h1 class=\\"h6\\">Don't have an account?</h1>\\r\\n\\t\\t\\t<button\\r\\n\\t\\t\\t\\ton:click={() => (hasAccount = false)}\\r\\n\\t\\t\\t\\tclass=\\"btn btn-sm variant-ghost hover:variant-filled-primary\\">Register</button\\r\\n\\t\\t\\t>\\r\\n\\t\\t</div>\\r\\n\\t{:else}\\r\\n\\t\\t<div class=\\"card p-3\\">\\r\\n\\t\\t\\t<form on:submit={register}>\\r\\n\\t\\t\\t\\t<div class=\\"flex flex-col space-y-3\\">\\r\\n\\t\\t\\t\\t\\t<label>\\r\\n\\t\\t\\t\\t\\t\\tName:\\r\\n\\t\\t\\t\\t\\t\\t<input class=\\"input\\" type=\\"text\\" placeholder=\\"Name\\" name=\\"name\\" required />\\r\\n\\t\\t\\t\\t\\t</label>\\r\\n\\t\\t\\t\\t\\t<label>\\r\\n\\t\\t\\t\\t\\t\\tEmail:\\r\\n\\t\\t\\t\\t\\t\\t<input class=\\"input\\" type=\\"email\\" placeholder=\\"Email\\" name=\\"email\\" required />\\r\\n\\t\\t\\t\\t\\t</label>\\r\\n\\t\\t\\t\\t\\t<label>\\r\\n\\t\\t\\t\\t\\t\\tPassword:\\r\\n\\t\\t\\t\\t\\t\\t<input\\r\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"input\\"\\r\\n\\t\\t\\t\\t\\t\\t\\ttype=\\"password\\"\\r\\n\\t\\t\\t\\t\\t\\t\\tplaceholder=\\"Password\\"\\r\\n\\t\\t\\t\\t\\t\\t\\tname=\\"password\\"\\r\\n\\t\\t\\t\\t\\t\\t\\trequired\\r\\n\\t\\t\\t\\t\\t\\t\\tminlength=\\"8\\"\\r\\n\\t\\t\\t\\t\\t\\t/>\\r\\n\\t\\t\\t\\t\\t</label>\\r\\n\\t\\t\\t\\t\\t<button class=\\"btn variant-ghost hover:variant-filled-primary\\" type=\\"submit\\">\\r\\n\\t\\t\\t\\t\\t\\tRegister\\r\\n\\t\\t\\t\\t\\t</button>\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t</form>\\r\\n\\t\\t</div>\\r\\n\\r\\n\\t\\t<div class=\\"flex flex-col items-center space-y-2 mt-2\\">\\r\\n\\t\\t\\t<h1 class=\\"h6\\">Already have an account?</h1>\\r\\n\\t\\t\\t<button\\r\\n\\t\\t\\t\\ton:click={() => (hasAccount = true)}\\r\\n\\t\\t\\t\\tclass=\\"btn btn-sm variant-ghost hover:variant-filled-primary\\">Login</button\\r\\n\\t\\t\\t>\\r\\n\\t\\t</div>\\r\\n\\t{/if}\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n\\tform {\\r\\n\\t\\tdisplay: flex;\\r\\n\\t\\tflex-direction: column;\\r\\n\\t\\talign-items: flex-start;\\r\\n\\t\\tgap: 0.25rem;\\r\\n\\r\\n\\t\\tmargin-block-end: 2rem;\\r\\n\\t}\\r\\n</style>\\r\\n"],"names":[],"mappings":"AAwFC,mBAAK,CACJ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,UAAU,CACvB,GAAG,CAAE,OAAO,CAEZ,gBAAgB,CAAE,IACnB"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="flex flex-col justify-center items-center"><h1 class="h3 my-3">${escape("Login")}</h1> ${`<div class="card p-3"><form class="svelte-1wvmbt9" data-svelte-h="svelte-6hbrg1"><div class="flex flex-col space-y-3"><label>Email
						<input class="input" type="email" placeholder="Email" name="email" required></label> <label>Password:
						<input class="input" type="password" placeholder="Password" name="password" required></label> <button class="btn variant-ghost hover:variant-filled-primary" type="submit">Login</button></div></form></div> <div class="flex flex-col items-center space-y-2 mt-2"><h1 class="h6" data-svelte-h="svelte-1gy71s4">Don&#39;t have an account?</h1> <button class="btn btn-sm variant-ghost hover:variant-filled-primary" data-svelte-h="svelte-129caku">Register</button></div>`} </div>`;
});
export {
  Page as default
};
