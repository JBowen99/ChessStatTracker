<script>
	import { Calendar } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Page from '../routes/+page.svelte';
	import InfoButton from './InfoButton.svelte';

	export let activity = [];

	let active = 'games';

	function setActive(buttonId) {
		active = buttonId;
	}

	/*
	// Create a date object for the first day of the current month
	const now = new Date();
	const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	// Get the day of the week for the first day of the current month
	const dayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

	// Create a date object for the first day of the next month
	const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

	// Get the total number of days in the current month
	const totalDays = new Date(nextMonth - 1).getDate();
	*/

	let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	let days = [];
	let calendar = [];

	$: updateData(activity);

	function updateData(dataset) {
		// Get the current date info
		const now = new Date();
		const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
		const startDay = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

		// Create empty blocks until the first day of the month
		let calendarDays = Array(startDay).fill(null);

		// Convert the array of days to a Map for quick lookup
		const daysWithActivities = new Map(
			activity.map((item) => [item.day, { activity: item.activity, winRate: item.winRate }])
		);

		// Create day blocks for the days of the month
		for (let day = 1; day <= totalDays; day++) {
			let newData = daysWithActivities.get(day);
			calendarDays.push({ day, data: newData || { activity: 0, winRate: 0 } });
		}

		// Fill the remaining cells to complete the last week
		while (calendarDays.length % 7 !== 0) {
			calendarDays.push(null);
		}

		// Rearrange days into columns under each day of the week
		calendar = daysOfWeek.map((_, i) =>
			calendarDays.filter((_, index) => (index - startDay) % 7 === i)
		);
	}

	onMount(() => {
		// Get the current date info
		const now = new Date();
		const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
		const startDay = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

		// Create empty blocks until the first day of the month
		let calendarDays = Array(startDay).fill(null);

		// Convert the array of days to a Map for quick lookup
		const daysWithActivities = new Map(
			activity.map((item) => [item.day, { activity: item.activity, winRate: item.winRate }])
		);

		// Create day blocks for the days of the month
		for (let day = 1; day <= totalDays; day++) {
			let newData = daysWithActivities.get(day);
			calendarDays.push({ day, data: newData || { activity: 0, winRate: 0 } });
		}

		// Fill the remaining cells to complete the last week
		while (calendarDays.length % 7 !== 0) {
			calendarDays.push(null);
		}

		// Rearrange days into columns under each day of the week
		calendar = daysOfWeek.map((_, i) =>
			calendarDays.filter((_, index) => (index - startDay) % 7 === i)
		);
	});
</script>

<div class="flex flex-row items-center space-x-2 mt-3 mb-5">
	<Calendar color="#b80f42" />
	<h1 class="h4">Monthly Activity</h1>
	<InfoButton infoText="Shows your activity and win rate during the current month" />
</div>

<div class="flex flex-row justify-center space-x-2 my-5">
	<button
		on:click={() => setActive('games')}
		class={active == 'games' ? 'btn btn-md variant-filled-primary' : 'btn btn-md'}>Games</button
	>
	<button
		on:click={() => setActive('wins')}
		class={active == 'wins' ? 'btn btn-md variant-filled-primary' : 'btn btn-md'}>Wins</button
	>
</div>

<div class="grid grid-cols-6 gap-2">
	<!-- Days of the Week (header) -->
	<div class="grid grid-rows-7 gap-2">
		{#each daysOfWeek as day}
			<div class="text-center font-bold">{day}</div>
		{/each}
	</div>
	<div class="grid grid-rows-7 gap-2 grid-flow-col col-span-5">
		{#each calendar as row}
			<div class="grid grid-cols-5">
				{#each row as day}
					{#if day != null}
						<!--
						{#if day.activity > 0}
							<div class="w-[24px] h-[24px] bg-primary-500 rounded-md"></div>
						{:else}
							<div class="w-[24px] h-[24px] bg-surface-500 rounded-md"></div>
						{/if}
					-->
						{#if active == 'games'}
							<div
								class={`w-[24px] h-[24px] rounded-md ${
									day.data.activity === 1
										? 'bg-primary-900'
										: day.data.activity === 2
											? 'bg-primary-800'
											: day.data.activity === 3
												? 'bg-primary-700'
												: day.data.activity >= 5
													? 'bg-primary-500'
													: 'bg-surface-500'
								}`}
							></div>
						{:else}
							<div
								class={`w-[24px] h-[24px] rounded-md ${
									day.data.winRate <= 25 && day.data.winRate > 0
										? 'bg-secondary-900'
										: day.data.winRate >= 25 && day.data.winRate <= 50
											? 'bg-secondary-800'
											: day.data.winRate >= 50 && day.data.winRate <= 100
												? 'bg-secondary-700'
												: day.data.winRate == 100
													? 'bg-secondary-500'
													: 'bg-surface-500'
								}`}
							></div>
						{/if}
					{:else}
						<div class="w-[24px] h-[24px] bg-surface-800 rounded-md"></div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>
{#if active == 'games'}
	<div class="grid grid-cols-5 mt-5">
		<h1 class="h5">Games Played:</h1>
		<div class="flex flex-col items-center justify-center">
			<div class="w-[24px] h-[24px] bg-primary-900 rounded-md"></div>
			<h1 class="h6">1</h1>
		</div>
		<div class="flex flex-col items-center justify-center">
			<div class="w-[24px] h-[24px] bg-primary-800 rounded-md"></div>
			<h1 class="h6">2</h1>
		</div>
		<div class="flex flex-col items-center justify-center">
			<div class="w-[24px] h-[24px] bg-primary-700 rounded-md"></div>
			<h1 class="h6">3</h1>
		</div>
		<div class="flex flex-col items-center justify-center">
			<div class="w-[24px] h-[24px] bg-primary-500 rounded-md"></div>
			<h1 class="h6">5+</h1>
		</div>
	</div>
{:else}
	<div class="grid grid-cols-5 space-x-2 mt-5">
		<h1 class="h5">Win Rate:</h1>
		<div class="flex flex-col items-center justify-center">
			<div class="w-[24px] h-[24px] bg-secondary-900 rounded-md"></div>
			<h1 class="h6">25%</h1>
		</div>
		<div class="flex flex-col items-center justify-center">
			<div class="w-[24px] h-[24px] bg-secondary-800 rounded-md"></div>
			<h1 class="h6">50%</h1>
		</div>
		<div class="flex flex-col items-center justify-center">
			<div class="w-[24px] h-[24px] bg-secondary-700 rounded-md"></div>
			<h1 class="h6">75%</h1>
		</div>
		<div class="flex flex-col items-center justify-center">
			<div class="w-[24px] h-[24px] bg-secondary-500 rounded-md"></div>
			<h1 class="h6">100%</h1>
		</div>
	</div>
{/if}
