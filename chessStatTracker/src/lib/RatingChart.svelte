<script>
	import { Line } from 'svelte-chartjs';

	export let data = [];
	export let options = {};
	export let width = 300;
	export let height = 400;

	$: chartData = {
		labels: data?.map((item) => item.date) ?? [],
		datasets: [
			{
				label: 'Rating',
				data: data?.map((entry) => entry.rating) ?? [],
				backgroundColor: 'rgba(184, 15, 66, .15)',
				borderColor: 'rgb(184, 15, 66)',
				fill: true,
				tension: 0.1,
				pointStyle: false,
				legend: false
			}
		]
	};

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler
	} from 'chart.js';

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler
	);
</script>

<Line data={chartData} {options} {width} {height} />
