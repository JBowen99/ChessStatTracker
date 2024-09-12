<script>
	import { Bar } from 'svelte-chartjs';

	export let data = {};

	let options = {
		//maintainAspectRatio: false,
		responsive: true,
		plugins: {
			legend: {
				display: false
			}
		}
	};

	function getColor(value) {
		// Ensure the value is between 0 and 100
		const clampedValue = Math.min(100, Math.max(0, value));

		// Define the start (red) and end (green) colors
		const startColor = { r: 184, g: 15, b: 66 }; // #b80f42
		const endColor = { r: 168, g: 230, b: 76 }; // #a8e64c

		// Calculate the interpolated RGB values
		const r = Math.floor(startColor.r + (endColor.r - startColor.r) * (clampedValue / 100));
		const g = Math.floor(startColor.g + (endColor.g - startColor.g) * (clampedValue / 100));
		const b = Math.floor(startColor.b + (endColor.b - startColor.b) * (clampedValue / 100));

		// Return the interpolated color as an RGB string
		return `rgb(${r},${g},${b})`;
	}

	$: top10Data = data?.slice(0, 15) ?? {};

	$: chartData = {
		labels: top10Data?.map((item) => item.opening) ?? [],
		datasets: [
			{
				data: top10Data?.map((item) => item.winRate) ?? [],
				backgroundColor: top10Data?.map((item) => getColor(item.winRate)),
				legend: false
			}
		]
	};

	import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
	import Page from '../routes/+page.svelte';

	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
</script>

<Bar data={chartData} {options} />
