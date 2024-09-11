<script>
	import { user } from '$lib/user';

	const login = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		await user.login(formData.get('email'), formData.get('password'));
	};

	const register = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		await user.register(formData.get('email'), formData.get('password'), formData.get('name'));
	};

	let hasAccount = true;
</script>

<div class="flex flex-col justify-center items-center">
	<h1 class="h3 my-3">{hasAccount ? 'Login' : 'Register'}</h1>

	{#if hasAccount}
		<div class="card p-3">
			<form on:submit={login}>
				<div class="flex flex-col space-y-3">
					<label>
						Email
						<input class="input" type="email" placeholder="Email" name="email" required />
					</label>
					<label>
						Password:
						<input class="input" type="password" placeholder="Password" name="password" required />
					</label>
					<button class="btn variant-ghost hover:variant-filled-primary" type="submit">
						Login
					</button>
				</div>
			</form>
		</div>

		<div class="flex flex-col items-center space-y-2 mt-2">
			<h1 class="h6">Don't have an account?</h1>
			<button
				on:click={() => (hasAccount = false)}
				class="btn btn-sm variant-ghost hover:variant-filled-primary">Register</button
			>
		</div>
	{:else}
		<div class="card p-3">
			<form on:submit={register}>
				<div class="flex flex-col space-y-3">
					<label>
						Name:
						<input class="input" type="text" placeholder="Name" name="name" required />
					</label>
					<label>
						Email:
						<input class="input" type="email" placeholder="Email" name="email" required />
					</label>
					<label>
						Password:
						<input
							class="input"
							type="password"
							placeholder="Password"
							name="password"
							required
							minlength="8"
						/>
					</label>
					<button class="btn variant-ghost hover:variant-filled-primary" type="submit">
						Register
					</button>
				</div>
			</form>
		</div>

		<div class="flex flex-col items-center space-y-2 mt-2">
			<h1 class="h6">Already have an account?</h1>
			<button
				on:click={() => (hasAccount = true)}
				class="btn btn-sm variant-ghost hover:variant-filled-primary">Login</button
			>
		</div>
	{/if}
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;

		margin-block-end: 2rem;
	}
</style>
