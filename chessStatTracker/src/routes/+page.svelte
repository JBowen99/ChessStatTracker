<script>
	import logo from '$lib/assets/logo3Black.svg';

	import { onMount } from 'svelte';

	import RatingChart from '$lib/RatingChart.svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import ActivityGrid from '$lib/ActivityGrid.svelte';
	import { getPlayerStats } from '$lib/chessPlayer';
	import { fetchMonthlyGames, fetchUserStats, processOpenings, processResults } from '$lib/api';
	import { ChartNoAxesColumnDecreasing, History, TrendingUp } from 'lucide-svelte';
	import WinChart from '$lib/WinChart.svelte';
	import OpeningChart from '$lib/OpeningChart.svelte';
	import { fetchGameData } from '$lib/api';
	import { processRatingData } from '$lib/api';

	// Get current date
	const currentDate = new Date();

	let username = '';
	let error = '';

	let loading = false;

	let chartDataTime = 'month';

	let options = {
		maintainAspectRatio: false,
		responsive: true,
		scales: {
			y: {
				beginAtZero: true,
				min: 0
			}
		},
		plugins: {
			legend: {
				display: false
			}
		}
	};

	let chartWidth = 300;
	let chartHeight = 400;

	let time_class = 'bullet';
	let time_length = 30;

	function setTimeLength(buttonId) {
		time_length = buttonId;
		//updateGameData();
		updateData();
		console.log('set time length to ', time_length);
	}

	function setActive(buttonId) {
		time_class = buttonId;
		//updateGameData();
		updateData();
		console.log('set time class to ', time_class);
	}

	let gameData = {};
	let currentData = [];
	$: if (time_length == 30) currentData = gameData?.currentMonth;
	else if (time_length == 90) currentData = gameData?.threeMonths;
	else if (time_length == 180) currentData = gameData?.sixMonths;
	else if (time_length == 360) currentData = gameData?.year;

	//let userStats = [];
	import { userStats } from '../stores/dataStore';
	/* let userStats = [];
	playerStats.subscribe((value) => {
		userStats = value;
	}); */

	let stats = [];
	let activity = [];
	let chartData = {};
	let initialized = false;

	import { results } from '../stores/dataStore';
	import RecentMatchesTable from '$lib/RecentMatchesTable.svelte';
	let resultsData = [];
	let openingData = [];

	async function updateData() {
		let activityData = await processRatingData(username, gameData.currentMonth ?? null, time_class);
		if (activityData) {
			activity = activityData.map((data) => {
				// Extract the day from the date string
				const day = new Date(data.date).getDate();
				const activity = data.activity;
				const winRate = data.winRate;
				const drawRate = data.drawRate;
				const lossRate = data.lossRate;
				return { day, activity, winRate, drawRate, lossRate };
			});
		}

		resultsData = await processResults(username, currentData ?? null, time_class);

		openingData = await processOpenings(username, currentData ?? null, time_class);

		stats = await processRatingData(username, currentData ?? null, time_class);
		if (stats?.length == 0) {
			let tempData = [];
			if (time_class == 'bullet') tempData = $userStats.chess_bullet;
			else if (time_class == 'blitz') tempData = $userStats.chess_blitz;
			else if (time_class == 'rapid') tempData = $userStats.chess_rapid;
			else if (time_class == 'daily') tempData = $userStats.chess_daily;
			let tempStats = [
				{ date: tempData.last.date, rating: tempData.last.rating },
				{ date: tempData.last.date, rating: tempData.last.rating }
			];
			stats = tempStats;
		}
		console.log('stats: ', stats);
	}

	async function updateGameData() {
		gameData = await fetchGameData(username);
		console.log(gameData);
	}

	$: {
		console.log('game data updated: ', gameData);
		updateData();
	}

	async function getGameData() {
		if (!loading) {
			loading = true;
			gameData = await fetchGameData(username);
			//userStats = await fetchUserStats(username);
			//let statData = await fetchUserStats(username);
			userStats.set(await fetchUserStats(username));

			loading = false;
			initialized = true;
			console.log('game data: ', gameData);
		}
	}
</script>

<div class=" h-full w-full flex justify-center items-center">
	<div class="flex flex-col items-center w-full">
		<h1 class="h1 pt-10 mb-5">Enter your Chess.com Username</h1>
		<div class="flex flex-row">
			<label class="label">
				<input class="input" type="text" bind:value={username} placeholder="username" />
			</label>

			<button type="button" class="btn-icon variant-filled-primary mx-2" on:click={getGameData}>
				<img
					src={logo}
					alt="Logo"
					style="width: 100%; height: 100%; object-fit: contain;"
					class="p-2"
				/>
			</button>
		</div>
		{#if loading}
			<div class="flex flex-col w-1/2 mt-10">
				<p>Loading Stats...</p>
				<ProgressBar value={undefined} />
			</div>
		{/if}
		{#if error}
			<p>Error: {error}</p>
		{:else if initialized}
			<div class="flex flex-col">
				<div class="flex flex-row justify-start items-center px-10 mt-10">
					<div class=" flex flex-row justify-start items-center space-x-3">
						<h1 class="card h5 p-3">{username}</h1>
						<div class="card p-3 flex flex-row justify-start items-center">
							<h1 class="mr-3">Bullet</h1>
							<h1 class="code">{$userStats.chess_bullet.last.rating}</h1>
						</div>
						<div class="card p-3 flex flex-row justify-start items-center">
							<h1 class="mr-3">Blitz</h1>
							<h1 class="code">{$userStats.chess_blitz.last.rating}</h1>
						</div>
						<div class="card p-3 flex flex-row justify-start items-center">
							<h1 class="mr-3">Rapid</h1>
							<h1 class="code">{$userStats.chess_rapid.last.rating}</h1>
						</div>
						<div class="card p-3 flex flex-row justify-start items-center">
							<h1 class="mr-3">Daily</h1>
							<h1 class="code">{$userStats.chess_daily.last.rating}</h1>
						</div>
					</div>
					<h1 class="ml-auto h5 mx-3">Time Class:</h1>
					<div class="flex flex-row justify-center items-center card">
						<button
							on:click={() => setActive('bullet')}
							class={time_class == 'bullet' ? 'btn btn-md variant-filled-primary' : 'btn btn-md'}
							>Bullet</button
						>
						<button
							on:click={() => setActive('blitz')}
							class={time_class == 'blitz' ? 'btn btn-md variant-filled-primary' : 'btn btn-md'}
							>Blitz</button
						>
						<button
							on:click={() => setActive('rapid')}
							class={time_class == 'rapid' ? 'btn btn-md variant-filled-primary' : 'btn btn-md'}
							>Rapid</button
						>
						<button
							on:click={() => setActive('daily')}
							class={time_class == 'daily' ? 'btn btn-md variant-filled-primary' : 'btn btn-md'}
							>Daily</button
						>
					</div>

					<h1 class="h5 ml-5 mr-3">History:</h1>
					<div class="flex flex-row justify-center items-center card">
						<button
							on:click={() => setTimeLength(30)}
							class={time_length == 30 ? 'btn btn-md variant-filled-primary' : 'btn btn-md'}
							>30</button
						>
						<button
							on:click={() => setTimeLength(90)}
							class={time_length == 90 ? 'btn btn-md variant-filled-primary' : 'btn btn-md'}
							>90</button
						>
						<button
							on:click={() => setTimeLength(180)}
							class={time_length == 180 ? 'btn btn-md variant-filled-primary' : 'btn btn-md'}
							>180</button
						>
						<button
							on:click={() => setTimeLength(360)}
							class={time_length == 360 ? 'btn btn-md variant-filled-primary' : 'btn btn-md'}
							>360</button
						>
					</div>
				</div>

				<div class="grid grid-cols-4 gap-3 my-3 w-full px-10">
					<div class="h-full card p-3 mr-3 col-span-1">
						<ActivityGrid {activity} />
					</div>
					<div class="h-full card p-3 col-span-3">
						<div class="card-header flex flex-row justify-center items-center my-3">
							<TrendingUp class="mx-3" />
							<h1 class="h5">Rating</h1>
						</div>
						<div>
							{#if stats?.length >= 1}
								<RatingChart data={stats} {options} />
							{:else}
								<div class="flex flex-col justify-center items-center">
									<h1>Not Enough Data</h1>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<div class="grid grid-cols-4 gap-3 my-3 w-full px-10">
					<div class="h-full card p-3 mr-3 col-span-1">
						<WinChart data={resultsData} />
					</div>
					<div class="h-full card p-3 col-span-3">
						<div class="flex flex-row justify-center items-center my-3">
							<ChartNoAxesColumnDecreasing class="mx-3" />
							<h1 class="h5">Opening Performance</h1>
						</div>
						<div>
							<OpeningChart />
						</div>
					</div>
				</div>

				<div class="grid grid-cols-4 gap-3 my-3 w-full px-10">
					<div class="h-full card p-3 col-span-4">
						<div class="flex flex-row justify-center items-center my-3">
							<History class="mx-3" />
							<h1 class="h5">Recent Matches</h1>
						</div>
						<div>
							<RecentMatchesTable data={}/>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
