<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { selectedBreeds, popupImage } from '../stores';
	import Popup from './popup.svelte';
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { linear, quartOut } from 'svelte/easing';

	let selected: string[][] = [];
	let photos: Record<string, string[]> = {};
	let popup: any;

	const breedKey = (breed: string, subBreed?: string) =>
		subBreed ? `${breed}/${subBreed}` : breed;
	const combine = (...arrays: any[][]) =>
		Array.from(
			{ length: Math.max(...arrays.map((a) => a.length)) * arrays.length },
			(_, i) => arrays[i % arrays.length][Math.floor(i / arrays.length)]
		).filter((x) => x !== undefined);
	const downloadPhotos = async (breed: string, subBreed?: string) => {
		if (photos[breedKey(breed, subBreed)]) return;
		await fetch(`https://dog.ceo/api/breed/${breed}/${subBreed ? subBreed + '/' : ''}images`, {
			cache: 'force-cache'
		})
			.then((res) => res.json())
			.then((data) => {
				photos[breedKey(breed, subBreed)] = data.message;
			})
			.catch((err) => error(500, err.message));
	};
	const handleClick = (src: string, alt: string) => {
		popupImage.update((value) => {
			return { src, alt };
		});
	};

	selectedBreeds.subscribe(async (value) => {
		let promises = [];
		for (const [breed, subBreed] of value) {
			promises.push(downloadPhotos(breed, subBreed));
		}
		await Promise.all(promises);
		selected = value.sort(([b1], [b2]) => b1.localeCompare(b2));
	});
	popupImage.subscribe((value) => {
		popup = value;
	});

	$: images = combine(
		...selected.map(([breed, subBreed]) =>
			photos[breedKey(breed, subBreed)].map((e) => [e, breedKey(breed, subBreed)])
		)
	);
	$: first30 = images.slice(0, 30); // For animation, only flip the first 30 images
	$: rest = images.slice(30);
</script>

{#if popup}
	<Popup src={popup.src} alt={popup.alt} />
{/if}
<div class="w-full">
	<div class="images-grid">
		{#each first30 as [src, alt] (src)}
			<button
				animate:flip={{ delay: 100, duration: 300, easing: quartOut }}
				transition:fade
				on:click={() => handleClick(src, alt)}
				on:keydown={(e) => e.key === 'Enter' && handleClick(src, alt)}
				class="w-[min(100%, 20rem)] relative"
				aria-label={alt}
			>
				<img {src} {alt} class="aspect-[3/2] w-full rounded-lg object-cover shadow-i-lg" loading="lazy" />
				<div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-sm text-white">
					{alt}
				</div>
			</button>
		{/each}
		{#each rest as [src, alt] (src)}
			<button
				transition:fade
				on:click={() => handleClick(src, alt)}
				on:keydown={(e) => e.key === 'Enter' && handleClick(src, alt)}
				class="w-[min(100%, 20rem)] relative"
				aria-label={alt}
			>
				<img {src} {alt} class="aspect-[3/2] w-full rounded-lg object-cover shadow-i-lg" loading="lazy" />
				<div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-sm text-white">
					{alt}
				</div>
			</button>
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
