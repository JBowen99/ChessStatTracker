<script lang="ts">
	import { Info } from 'lucide-svelte';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	export let infoText = '';

	const popupClick: PopupSettings = {
		event: 'click',
		target: infoText,
		placement: 'bottom'
	};
</script>

<div use:popup={popupClick}><Info size={16} /></div>
<div class="card p-4 variant-filled-primary" data-popup={infoText}>
	<p>{infoText}</p>
	<div class="arrow variant-filled-primary" />
</div>
