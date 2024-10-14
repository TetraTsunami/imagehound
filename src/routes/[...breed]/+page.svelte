<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	export let data: PageData;

	$: images = data.images;
	$: breed = $page.params.breed.split('/').map((b) => b[0].toUpperCase() + b.slice(1));
</script>

<div class="w-full">
	<h1 class="my-8 text-center text-2xl font-semibold">{breed.join(', ')}</h1>
	<div class="images-grid">
		{#each images as image, i (image)}
			<a
				in:fade={{ delay: 300, duration: 450 }}
				out:fade={{ duration: 450 }}
				href={image}
				target="_blank"
				rel="noopener noreferrer"
				class="w-[min(100%, 20rem)]"
			>
				<img
					src={image}
					alt={breed.join(', ')}
					class="aspect-[3/2] w-full rounded-lg object-cover shadow-i-lg"
					loading={i > 20 ? 'lazy' : 'eager'}
				/>
			</a>
		{/each}
	</div>
</div>

<style lang="scss">
	.images-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
		gap: 0.5rem;
	}
</style>
