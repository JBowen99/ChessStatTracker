<!-- Main page component for Chess.com stats tracking application -->
<script>
	// Import logo asset
	import logo from '$lib/assets/logo3Black.svg';

	import { onMount } from 'svelte';

	// Import custom components and UI elements
	import RatingChart from '$lib/RatingChart.svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import ActivityGrid from '$lib/ActivityGrid.svelte';
	import BestOpenings from '$lib/BestOpenings.svelte';
	import Rivals from '$lib/Rivals.svelte';
	import PromoCard from '$lib/PromoCard.svelte';

	// Import API utility functions for fetching and processing chess data
	import {
		fetchMonthlyGames,
		fetchUserStats,
		processOpenings,
		processRecentGames,
		fetchUserProfile,
		processResults,
		processRivals
	} from '$lib/api';

	// Import icons from Lucide
	import { ChartNoAxesColumnDecreasing, History, TrendingUp, Trophy, Swords, Award } from 'lucide-svelte';

	// Import additional chart components
	import WinChart from '$lib/WinChart.svelte';
	import OpeningChart from '$lib/OpeningChart.svelte';
	import OpeningChartHorizontal from '$lib/OpeningChartHorizontal.svelte';
	import { fetchGameData } from '$lib/api';
	import { processRatingData } from '$lib/api';

	// Get current date for data filtering
	const currentDate = new Date();

	// State variables for user input and error handling
	let username = '';
	let site_error = '';

	// Loading state for API calls
	let loading = false;

	// Time period for chart data display
	let chartDataTime = 'month';

	// Chart configuration options
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

	// Chart dimension settings
	let chartWidth = 300;
	let chartHeight = 400;

	// Game time control settings
	let time_class = 'bullet';
	let time_length = 30;

	// Function to update time period for data display
	function setTimeLength(buttonId) {
		time_length = buttonId;
		updateData();
		console.log('set time length to ', time_length);
	}

	// Function to update game time control type
	function setActive(buttonId) {
		time_class = buttonId;
		updateData();
		console.log('set time class to ', time_class);
	}

	// Store for game data and current filtered data
	let gameData = {};
	let currentData = [];

	// Reactive statement to update current data based on selected time period
	$: if (time_length == 30) currentData = gameData?.currentMonth;
	else if (time_length == 90) currentData = gameData?.threeMonths;
	else if (time_length == 180) currentData = gameData?.sixMonths;
	else if (time_length == 360) currentData = gameData?.year;

	// Import store for user stats
	import { userStats } from '../stores/dataStore';

	// State variables for various data displays
	let stats = [];
	let activity = [];
	let chartData = {};
	let initialized = false;

	// Import additional stores and components
	import { results } from '../stores/dataStore';
	import RecentMatchesTable from '$lib/RecentMatchesTable.svelte';
	import InfoButton from '$lib/InfoButton.svelte';

	// Arrays to store processed game data
	let resultsData = [];
	let openingData = [];
	let recentGames = [];

	// Add new state variables for rivals data
	let rivalsData = [];

	// Function to update all data displays based on current filters
	async function updateData() {
		// Process and update activity data
		let activityData = await processRatingData(username, gameData.currentMonth ?? null, time_class);
		if (activityData) {
			activity = activityData.map((data) => {
				const day = new Date(data.date).getDate();
				const activity = data.activity;
				const winRate = data.winRate;
				const drawRate = data.drawRate;
				const lossRate = data.lossRate;
				return { day, activity, winRate, drawRate, lossRate };
			});
		}

		// Update recent games, results, and opening data
		recentGames = await processRecentGames(username, currentData ?? null, time_class);
		console.log('recent games2:', recentGames);
		resultsData = await processResults(username, currentData ?? null, time_class);

		openingData = await processOpenings(username, currentData ?? null, time_class);
		console.log('opening data, ', openingData);

		// Process and update rating stats
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

		// Add rivals data processing
		rivalsData = await processRivals(username, currentData ?? null, time_class);
	}

	// Function to fetch and update game data
	async function updateGameData() {
		gameData = await fetchGameData(username);
		console.log(gameData);
	}

	// Reactive statement to update data when game data changes
	$: {
		console.log('game data updated: ', gameData);
		updateData();
	}

	// Main function to fetch user data and initialize the dashboard
	async function getGameData() {
		if (!loading) {
			loading = true;
			site_error = null;
			initialized = false;

			// Fetch user profile and validate existence
			let userProfile = {};
			try {
				userProfile = await fetchUserProfile(username);
			} catch (error) {
				console.log(error);
				site_error = 'User does not exist';
				loading = false;
				initialized = true;
				return;
			}

			// Fetch game data and user stats
			gameData = await fetchGameData(username);
			userStats.set(await fetchUserStats(username));

			loading = false;
			initialized = true;
			console.log('game data: ', gameData);
		}
	}
</script>

<!-- Main container -->
<div class="h-screen w-full flex justify-center items-center relative overflow-hidden scrollbar-hide">
	<div class="z-0 absolute bottom-0 left-0 w-full h-3/4 rounded-full bg-gradient-to-b dark:from-red-500 dark:to-rose-200 from-rose-200 to-red-500 blur-3xl animate-gradient"></div>
	<div class="z-50 absolute top-0 left-0 flex flex-col items-center w-full h-full {(initialized && site_error == null) ? '' : 'justify-center pb-10'} overflow-scroll scrollbar-hide">
		
		<!-- Username input section -->
		<h1 class="h3 pt-10 mb-5">Enter your Chess.com Username</h1>
		<div class="flex flex-row">
			<label class="label">
				<input class="input" type="text" bind:value={username} placeholder="username" />
			</label>

			<!-- Submit button with logo -->
			<button type="button" class="btn-icon variant-filled-primary mx-2" on:click={getGameData}>
				<img
					src={logo}
					alt="Logo"
					style="width: 100%; height: 100%; object-fit: contain;"
					class="p-2"
				/>
			</button>
		</div>

		<!-- Loading indicator -->
		{#if loading}
			<div class="flex flex-col w-1/2 mt-10">
				<p>Loading Stats...</p>
				<ProgressBar value={undefined} />
			</div>
		{/if}

		<!-- Error message or main dashboard content -->
		{#if site_error != null}
			<p class="pt-10">{site_error}</p>
		{:else if initialized}
			<div class="flex flex-col w-full">
				<!-- User info and filter controls -->
				<div class="w-full flex flex-col space-y-3 space-x-0 xl:space-x-3 xl:space-y-0 xl:flex-row justify-center xl:justify-start items-center px-10 mt-10">
					<!-- User ratings display -->
					<div class=" flex flex-col space-y-3 space-x-0 sm:flex-row justify-start items-center sm:space-y-0 sm:space-x-3">
						<div class="flex flex-row justify-start items-center space-x-3">
							<div class="glass-card p-3 flex flex-row justify-start items-center">
								<h1 class="mr-3">Bullet</h1>
								<h1 class="code">{$userStats.chess_bullet.last.rating}</h1>
							</div>
							<div class="glass-card p-3 flex flex-row justify-start items-center">
								<h1 class="mr-3">Blitz</h1>
								<h1 class="code">{$userStats.chess_blitz.last.rating}</h1>
							</div>
						</div>
						<div class="flex flex-row justify-start items-center space-x-3">
							<div class="glass-card p-3 flex flex-row justify-start items-center">
								<h1 class="mr-3">Rapid</h1>
								<h1 class="code">{$userStats.chess_rapid.last.rating}</h1>
							</div>
							<div class="glass-card p-3 flex flex-row justify-start items-center">
								<h1 class="mr-3">Daily</h1>
								<h1 class="code">{$userStats.chess_daily.last.rating}</h1>
							</div>
						</div>
					</div>					
					<div class="w-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-center xl:justify-end items-center">
						<!-- Time class filter buttons -->
						<h1 class="h5 mx-3 text-nowrap">Time Class:</h1>
						<div class="flex flex-row justify-center items-center glass-card">
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

						<!-- Time period filter buttons -->
						<h1 class="h5 ml-5 mr-3">History:</h1>
						<div class="flex flex-row justify-center items-center glass-card">
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
				</div>

				<!-- Charts section -->
				<div class="grid grid-cols-1 gap-3 my-3 w-full px-2 lg:px-10">
					<!-- Activity/Rating row -->
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
						<!-- Activity heatmap -->
						<div class="h-full min-h-[300px] glass-card p-3 col-span-1">
							<ActivityGrid {activity} />
						</div>
						<!-- Win rate chart - Only visible on md screens -->
						<div class="h-full min-h-[300px] glass-card p-3 col-span-1 hidden md:block lg:hidden">
							<WinChart data={resultsData} />
						</div>
						<!-- Rating chart -->
						<div class="h-full min-h-[300px] glass-card p-3 col-span-1 md:col-span-2 md:row-start-2 lg:row-start-auto lg:col-span-3">
							<div class="card-header flex flex-row justify-center items-center my-3">
								<TrendingUp color="#b80f42" class="mx-3" />
								<h1 class="h4 mr-2">Rating</h1>
								<InfoButton
									infoText="Shows your rating over time for the selected game mode and time frame"
								/>
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

					<!-- Win Rate/Opening row -->
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
						<!-- Win rate chart - Hidden on md screens -->
						<div class="h-full min-h-[300px] glass-card  p-3 col-span-1 md:hidden lg:block">
							<WinChart data={resultsData} />
						</div>
						<!-- Opening performance chart -->
						<div class="h-full min-h-[300px] glass-card p-3 col-span-1 md:col-span-2 lg:col-span-3">
							<div class="flex flex-row justify-center items-center my-3">
								<ChartNoAxesColumnDecreasing color="#b80f42" class="mx-3" />
								<h1 class="h4 mr-2">Opening Performance</h1>
								<InfoButton
									infoText="Shows the performance of your most played openings for the selected game mode and time frame"
								/>
							</div>
							<div>
								<!-- Horizontal chart for small and medium screens -->
								<div class="block lg:hidden">
									<OpeningChartHorizontal data={openingData} />
								</div>
								<!-- Vertical chart for large screens -->
								<div class="hidden lg:block">
									<OpeningChart data={openingData} />
								</div>
							</div>
						</div>
					</div>

					<!-- Best Openings and Rivals Cards -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
						<!-- Best Openings Card -->
						<div class="h-full min-h-[200px] glass-card p-3">
							<div class="flex flex-row justify-center items-center my-3">
								<Award color="#b80f42" class="mx-3" />
								<h1 class="h4 mr-2">Best Openings</h1>
								<InfoButton infoText="Shows your best performing openings as white and black" />
							</div>
							<BestOpenings data={openingData} />
						</div>

						<!-- Rivals Card -->
						<div class="h-full min-h-[200px] glass-card p-3">
							<div class="flex flex-row justify-center items-center my-3">
								<Swords color="#b80f42" class="mx-3" />
								<h1 class="h4 mr-2">Rivals</h1>
								<InfoButton infoText="Shows your toughest opponent and most defeated rival" />
							</div>
							<Rivals data={rivalsData} />
						</div>
					</div>

					<!-- Recent matches section -->
					<div class="grid grid-cols-1 gap-3">
						<div class="h-full min-h-[400px] glass-card p-3 col-span-1">
							<div class="flex flex-row justify-center items-center my-3">
								<History color="#b80f42" class="mx-3" />
								<h1 class="h4 mr-2">Recent Matches</h1>
								<InfoButton infoText="Shows recent games for the selected game mode" />
							</div>
							<div>
								<RecentMatchesTable data={recentGames} />
							</div>
						</div>
					</div>

					<!-- Promotional section -->
					<div class="grid grid-cols-1 gap-3">
						<PromoCard />
					</div>
					
					<!-- Footer section -->
					<div class="z-50 pb-4 px-4 mt-auto flex flex-row justify-center items-center text-center text-sm text-gray-800">
						<p> ChessStatTracker <br class="block md:hidden"/> by Silver Stag Studios, LLC - Copyright {new Date().getFullYear()}</p>
					</div>
					
				</div>
			</div>
		{/if}
		
	</div>
	{#if !initialized}
		<!-- Footer section -->
		<div class="z-50 pb-4 px-4 mt-auto flex flex-row justify-center items-center text-center text-sm text-gray-800">
			<p> ChessStatTracker <br class="block md:hidden"/> by Silver Stag Studios, LLC - Copyright {new Date().getFullYear()}</p>
		</div>
	{/if}
</div>
