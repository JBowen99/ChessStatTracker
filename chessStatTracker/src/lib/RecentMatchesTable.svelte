<script>
	export let data = [];
	const testdata = [
		{
			win: 'checkmate',
			type: 'blitz',
			color: 'white',
			opening: 'Fianchetto'
		},
		{
			win: 'checkmate',
			type: 'blitz',
			color: 'white',
			opening: 'Fianchetto'
		},
		{
			win: 'checkmate',
			type: 'blitz',
			color: 'white',
			opening: 'Fianchetto'
		},
		{
			win: 'checkmate',
			type: 'blitz',
			color: 'white',
			opening: 'Fianchetto'
		}
	];
</script>

<div class="table-container">
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Result</th>
				<th>Rating</th>
				<th class="text-wrap">Opponent Rating</th>
				<th>Type</th>
				<th>Color</th>
				<th>Opening</th>
			</tr>
		</thead>
		<tbody>
			{#each data as row, i}
				<tr>
					<td class="text-secondary-500">{row.win}</td>
					<td>{row.type}</td>
					<td>{row.color}</td>
					<td>{row.opening}</td>
					<td>{row.opening}</td>
					<td>{row.opening}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
