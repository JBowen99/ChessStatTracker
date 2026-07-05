<script>
	export let data = [];
</script>

<div class="table-container">
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Date</th>
				<th>Result</th>
				<th>Rating</th>
				<th class="text-wrap">Opponent Rating</th>
				<th>Type</th>
				<th>Color</th>
				<th>Opening</th>
			</tr>
		</thead>
		<tbody>
			{#each data as row (`${row.date}-${row.rating}-${row.ratingOpponent}`)}
				<tr>
					<td>{row.date}</td>
					<td class={row.result === 'win' ? 'text-secondary-700' : 'text-primary-500'}
						>{row.result}</td
					>
					<td>{row.rating}</td>
					<td>{row.ratingOpponent}</td>
					<td>{row.time_class}</td>
					<td>{row.color}</td>
					<td>{row.opening}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
