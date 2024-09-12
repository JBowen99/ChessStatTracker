<script>
	import { Doughnut } from 'svelte-chartjs';

	let options = {
		//maintainAspectRatio: false,
		responsive: true,
		plugins: {
			legend: {
				display: false
			}
		}
	};

	export let data = [];

	$: chartData = {
		labels: data?.map((item) => item.type) ?? [],
		datasets: [
			{
				data: data?.map((item) => item.count) ?? [],
				//borderColor: '#444444',
				borderWidth: 0,
				backgroundColor: data?.map((item) => item.color.backgroundColor) ?? [],
				hoverBackgroundColor: data?.map((item) => item.color.hoverBackgroundColor) ?? [],
				hoverOffset: 25
			}
		]
	};

	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
	import { Trophy } from 'lucide-svelte';
	import InfoButton from './InfoButton.svelte';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
</script>

<div class="flex flex-col">
	<div class="flex flex-row items-center justify-start space-x-2 mt-3 mb-5">
		<Trophy color="#b80f42" />
		<h1 class="h4">Game Results</h1>
		<InfoButton
			infoText="Shows a break down of the game results for the selected game mode and time frame"
		/>
	</div>
	<div class="my-3">
		<Doughnut data={chartData} {options} />
	</div>
	<div class="grid grid-cols-4 mt-5 space-y-3 px-5">
		<h1 class="mt-3">win:</h1>
		<div class="w-[24px] h-[24px] bg-secondary-500 rounded-md"></div>
		<h1>loss:</h1>
		<div class="w-[24px] h-[24px] bg-primary-500 rounded-md"></div>
		<h1>draw:</h1>
		<div class="w-[24px] h-[24px] bg-warning-500 rounded-md"></div>
		<h1>other:</h1>
		<div class="w-[24px] h-[24px] bg-tertiary-500 rounded-md"></div>
	</div>
</div>
