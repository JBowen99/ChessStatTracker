<script lang="ts">
	import '../app.postcss';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { AppBar } from '@skeletonlabs/skeleton';
	import logo from '$lib/assets/logo3.svg';
	import { LightSwitch } from '@skeletonlabs/skeleton';

	import type { PopupSettings } from '@skeletonlabs/skeleton';

	const popupFeatured: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupFeatured',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};
</script>

<AppBar
	><svelte:fragment slot="lead"
		><div style="width: 24px; height: 24px;">
			<img src={logo} alt="Logo" style="width: 100%; height: 100%; object-fit: contain;" />
		</div></svelte:fragment
	>
	<div class="flex flex-row items-center">
		<h1 class="h5 mx-3">Chess Stat Tracker</h1>
	</div>
	<svelte:fragment slot="trail"
		><div class="flex flex-row">
			<LightSwitch />
		</div>
	</svelte:fragment>
</AppBar>

<slot />
