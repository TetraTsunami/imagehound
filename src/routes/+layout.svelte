<script lang="ts">
	import '../app.css';
	import Nav from './nav.svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
</script>

<div class="flex min-h-screen w-full justify-center px-2">
	<div class="container max-h-screen gap-4 overflow-auto md:flex">
		<div class="h-[33vh] sm:h-auto">
			<Nav breeds={data.breeds} />
		</div>
		<div class="h-[66vh] flex-1 sm:h-auto">
			<slot></slot>
		</div>
	</div>
</div>

<style lang="scss">
	:root {
		--color-bkg: 250deg 100% 98%; // violet-200
		--color-content: 222deg 47% 11%; // slate-900
		--color-accent: 255deg 92% 76%; // violet-400
	}
	@media (prefers-color-scheme: dark) {
		:global(html) {
			color: white;
		}
		:root {
			--color-bkg: 222deg 47% 11%; // slate-900
			--color-content: 210deg 40% 96%; //slate-100
			--color-accent: 258deg 90% 66%; // violet-500
		}
	}
	:global(html) {
		background: hsl(var(--color-bkg));
	}
</style>
