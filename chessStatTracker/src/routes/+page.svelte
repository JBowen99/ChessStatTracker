<!-- Main page component for Chess.com stats tracking application -->
<script>
	// Import logo asset
	import logo from '$lib/assets/logo3Black.svg';

	// Import custom components and UI elements
	import RatingChart from '$lib/RatingChart.svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import ActivityGrid from '$lib/ActivityGrid.svelte';
	import BestOpenings from '$lib/BestOpenings.svelte';
	import Rivals from '$lib/Rivals.svelte';
	import PromoCard from '$lib/PromoCard.svelte';

	// Import API utility functions for fetching and processing chess data
	import {
		fetchGameData,
		fetchUserStats,
		processOpenings,
		processRecentGames,
		fetchUserProfile,
		processResults,
		processRivals,
		processRatingData,
		ChessApiError
	} from '$lib/api';

	// Import icons from Lucide
	import { ChartNoAxesColumnDecreasing, History, TrendingUp, Swords, Award } from 'lucide-svelte';

	// Import additional chart components
	import WinChart from '$lib/WinChart.svelte';
	import OpeningChart from '$lib/OpeningChart.svelte';
	import OpeningChartHorizontal from '$lib/OpeningChartHorizontal.svelte';

	// State variables for user input and error handling
	let username = '';
	let site_error = null;
	let loadRequestId = 0;
	let activeController = null;

	// Loading state for API calls
	let loading = false;

	$: showDashboard = initialized && !site_error;
	$: trimmedUsername = username.trim();
	$: hasRecentGames =
		(gameData?.currentMonth?.length ?? 0) > 0 ||
		(gameData?.threeMonths?.length ?? 0) > 0 ||
		(gameData?.sixMonths?.length ?? 0) > 0 ||
		(gameData?.year?.length ?? 0) > 0;

	function getRating(category) {
		return $userStats?.[category]?.last?.rating ?? '—';
	}

	function clearError() {
		if (site_error) {
			site_error = null;
		}
	}

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
	let initialized = false;

	// Import additional stores and components
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
		try {
			const activityData = await processRatingData(
				username,
				gameData.currentMonth ?? null,
				time_class
			);
			if (activityData) {
				activity = activityData.map((data) => {
					const day = new Date(data.date).getDate();
					return {
						day,
						activity: data.activity,
						winRate: data.winRate,
						drawRate: data.drawRate,
						lossRate: data.lossRate
					};
				});
			} else {
				activity = [];
			}

			recentGames = (await processRecentGames(username, currentData ?? null, time_class)) ?? [];
			resultsData = (await processResults(username, currentData ?? null, time_class)) ?? [];
			openingData = (await processOpenings(username, currentData ?? null, time_class)) ?? [];

			stats = (await processRatingData(username, currentData ?? null, time_class)) ?? [];
			if (!stats.length) {
				const statsKey = `chess_${time_class}`;
				const tempData = $userStats?.[statsKey];
				if (tempData?.last) {
					stats = [
						{ date: tempData.last.date, rating: tempData.last.rating },
						{ date: tempData.last.date, rating: tempData.last.rating }
					];
				}
			}

			rivalsData = await processRivals(username, currentData ?? null, time_class);
		} catch (error) {
			console.error('Failed to process game data', error);
		}
	}

	// Reactive statement to update data when game data changes
	$: if (showDashboard) {
		updateData();
	}

	function getErrorMessage(error) {
		if (error instanceof ChessApiError) {
			return error.message;
		}
		if (
			error &&
			typeof error === 'object' &&
			'name' in error &&
			error.name === 'ChessApiError' &&
			'message' in error
		) {
			return String(error.message);
		}
		return 'Something went wrong while loading stats. Please try again.';
	}

	function cancelActiveRequest() {
		activeController?.abort();
		activeController = null;
	}

	// Main function to fetch user data and initialize the dashboard
	async function getGameData() {
		if (!trimmedUsername) {
			site_error = 'Please enter a Chess.com username.';
			initialized = false;
			return;
		}

		cancelActiveRequest();
		const controller = new AbortController();
		activeController = controller;
		const requestId = ++loadRequestId;

		loading = true;
		site_error = null;
		initialized = false;

		try {
			await fetchUserProfile(trimmedUsername, controller.signal);
			if (requestId !== loadRequestId) return;

			username = trimmedUsername;
			gameData = await fetchGameData(trimmedUsername, controller.signal);
			if (requestId !== loadRequestId) return;

			userStats.set(await fetchUserStats(trimmedUsername, controller.signal));
			if (requestId !== loadRequestId) return;

			initialized = true;
		} catch (error) {
			if (requestId !== loadRequestId) return;
			if (error instanceof DOMException && error.name === 'AbortError') return;

			gameData = {};
			userStats.set({});
			site_error = getErrorMessage(error);
			initialized = false;
		} finally {
			if (requestId === loadRequestId) {
				loading = false;
				activeController = null;
			}
		}
	}
</script>

<!-- Main container -->
<div
	class="h-screen w-full flex justify-center items-center relative overflow-hidden scrollbar-hide"
>
	<div
		class="z-0 absolute bottom-0 left-0 w-full h-3/4 rounded-full bg-gradient-to-b dark:from-red-500 dark:to-rose-200 from-rose-200 to-red-500 blur-3xl animate-gradient"
	></div>
	<div
		class="z-50 absolute top-0 left-0 flex flex-col items-center w-full h-full overflow-y-auto scrollbar-hide"
	>
		<!-- Username input section -->
		<form
			class="flex flex-col items-center w-full max-w-lg px-4 pt-10 shrink-0"
			on:submit|preventDefault={getGameData}
		>
			<h1 class="h3 mb-5">Enter your Chess.com Username</h1>
			<div class="flex flex-row items-center w-full gap-2">
				<label class="label flex-1">
					<input
						class="input {site_error ? 'border-primary-500 ring-2 ring-primary-500/50' : ''}"
						type="text"
						name="username"
						bind:value={username}
						on:input={clearError}
						placeholder="username"
						autocomplete="username"
						aria-invalid={site_error ? 'true' : 'false'}
						aria-describedby={site_error ? 'username-error' : undefined}
					/>
				</label>

				<button
					type="submit"
					class="btn-icon variant-filled-primary shrink-0 {loading ? 'opacity-70' : ''}"
					aria-label={loading ? 'Loading player stats' : 'Load player stats'}
					aria-busy={loading}
				>
					{#if loading}
						<span class="text-xs font-bold animate-pulse">...</span>
					{:else}
						<img
							src={logo}
							alt=""
							style="width: 100%; height: 100%; object-fit: contain;"
							class="p-2"
						/>
					{/if}
				</button>
			</div>

			{#if loading}
				<div class="flex flex-col w-full mt-4">
					<p class="text-center text-sm opacity-80">Loading stats for {trimmedUsername}...</p>
					<ProgressBar value={undefined} />
				</div>
			{/if}

			{#if site_error}
				<div
					id="username-error"
					role="alert"
					class="w-full mt-4 p-4 text-center rounded-container-token bg-primary-500/15 border-2 border-primary-500 text-primary-700 dark:text-primary-300 font-medium"
				>
					{site_error}
				</div>
			{/if}
		</form>

		<!-- Main dashboard content -->
		{#if showDashboard}
			<div class="flex flex-col w-full">
				{#if !hasRecentGames}
					<div
						class="w-full max-w-3xl mx-auto mt-6 px-4 py-3 text-center rounded-container-token bg-surface-200/60 dark:bg-surface-700/40 border border-surface-400/30"
					>
						No games found in the last 12 months. Rating cards below use historical Chess.com stats.
					</div>
				{/if}
				<!-- User info and filter controls -->
				<div
					class="w-full flex flex-col space-y-3 space-x-0 xl:space-x-3 xl:space-y-0 xl:flex-row justify-center xl:justify-start items-center px-10 mt-10"
				>
					<!-- User ratings display -->
					<div
						class=" flex flex-col space-y-3 space-x-0 sm:flex-row justify-start items-center sm:space-y-0 sm:space-x-3"
					>
						<div class="flex flex-row justify-start items-center space-x-3">
							<div class="glass-card p-3 flex flex-row justify-start items-center">
								<h1 class="mr-3">Bullet</h1>
								<h1 class="code">{getRating('chess_bullet')}</h1>
							</div>
							<div class="glass-card p-3 flex flex-row justify-start items-center">
								<h1 class="mr-3">Blitz</h1>
								<h1 class="code">{getRating('chess_blitz')}</h1>
							</div>
						</div>
						<div class="flex flex-row justify-start items-center space-x-3">
							<div class="glass-card p-3 flex flex-row justify-start items-center">
								<h1 class="mr-3">Rapid</h1>
								<h1 class="code">{getRating('chess_rapid')}</h1>
							</div>
							<div class="glass-card p-3 flex flex-row justify-start items-center">
								<h1 class="mr-3">Daily</h1>
								<h1 class="code">{getRating('chess_daily')}</h1>
							</div>
						</div>
					</div>
					<div
						class="w-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-center xl:justify-end items-center"
					>
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
						<div
							class="h-full min-h-[300px] glass-card p-3 col-span-1 md:col-span-2 md:row-start-2 lg:row-start-auto lg:col-span-3"
						>
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
						<div class="h-full min-h-[300px] glass-card p-3 col-span-1 md:hidden lg:block">
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
					<div
						class="z-50 pb-4 px-4 mt-auto flex flex-row justify-center items-center text-center text-sm text-gray-800"
					>
						<p>
							ChessStatTracker <br class="block md:hidden" /> by Silver Stag Studios, LLC -
							Copyright {new Date().getFullYear()}
						</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
	{#if !showDashboard}
		<!-- Footer section -->
		<div
			class="z-50 pb-4 px-4 mt-auto flex flex-row justify-center items-center text-center text-sm text-gray-800"
		>
			<p>
				ChessStatTracker <br class="block md:hidden" /> by Silver Stag Studios, LLC - Copyright {new Date().getFullYear()}
			</p>
		</div>
	{/if}
</div>
