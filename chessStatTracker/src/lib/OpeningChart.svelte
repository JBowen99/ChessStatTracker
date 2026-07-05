<script>
	import { Bar } from 'svelte-chartjs';

	export let data = {};

	let options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false
			}
		},
		scales: {
			x: {
				ticks: {
					maxRotation: 45,
					minRotation: 45,
					callback: function (value) {
						const label = this.getLabelForValue(value);
						// Truncate long opening names
						return label.length > 15 ? label.substr(0, 13) + '...' : label;
					}
				}
			},
			y: {
				min: 0,
				max: 100,
				ticks: {
					callback: function (value) {
						return value + '%';
					}
				}
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

	$: top10Data = data?.slice(0, 8) ?? {}; // Reduced to top 8 for better readability

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

	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
</script>

<div class="w-full h-[400px]">
	<Bar data={chartData} {options} />
</div>
