<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { selectedBreeds, popupImage } from '../stores';
	import Popup from './popup.svelte';
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quartOut } from 'svelte/easing';

	// Contains the selected breeds and sub-breeds
	let selected: string[][] = [];
	// Contains the images for each breed
	let photos: Record<string, string[]> = {};
	// Contains the src and alt for the popup image, if any
	let popup: { src: string; alt: string } | null = null;
	
	/**
	 * Calculates the key for the photos object, so we can cache the photos for each breed
	 * @param breed
	 * @param subBreed
	 */
	const breedKey = (breed: string, subBreed?: string) =>
		subBreed ? `${breed}/${subBreed}` : breed;
	/**
	 * Combines multiple arrays into one, spreading the elements in a round-robin fashion
	 * @example combine([1, 4], [2, 5], [3, 6]) == [1, 2, 3, 4, 5, 6]
	 * @param ...arrays: any[] - The arrays to combine
	 */
	const combine = (...arrays: any[][]) =>
		Array.from(
			{ length: Math.max(...arrays.map((a) => a.length)) * arrays.length },
			(_, i) => arrays[i % arrays.length][Math.floor(i / arrays.length)]
		).filter((x) => x !== undefined);
	/**
	 * Download photos from the API for a breed and sub-breed
	 * @param breed
	 * @param subBreed
	 */
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
	/**
	 * Handles the click event on an image, showing the popup
	 * @param src
	 * @param alt
	 */
	const handleClick = (src: string, alt: string) => {
		popupImage.update(() => {
			return { src, alt };
		});
	};

	selectedBreeds.subscribe(async (value) => {
		let promises = [];
		// Download photo URLs for each breed and sub-breed before showing them
		for (const [breed, subBreed] of value) {
			promises.push(downloadPhotos(breed, subBreed));
		}
		await Promise.all(promises);
		selected = value.sort(([b1], [b2]) => b1.localeCompare(b2));
	});

	popupImage.subscribe((value) => {
		// If the popup is closed, set the popup to null
		popup = value;
	});

	$: images = combine(
		...selected.map(([breed, subBreed]) =>
			photos[breedKey(breed, subBreed)].map((e) => [e, breedKey(breed, subBreed)])
		)
	);
	// For performance reasons, we only apply the flip animation to the first 30 images
	$: first30 = images.slice(0, 30); 
	$: rest = images.slice(30);
</script>

{#if popup}
	<Popup src={popup.src} alt={popup.alt} />
{/if}
<div class="h-full w-full overflow-y-auto">
	<div class="images-grid">
		{#each first30 as [src, alt] (src)}
			<button
				animate:flip={{ delay: 100, duration: 300, easing: quartOut }}
				transition:fade
				on:click={() => handleClick(src, alt)}
				on:keydown={(e) => e.key === 'Enter' && handleClick(src, alt)}
				class="w-[min(100%, 20rem)] relative overflow-clip rounded-lg"
				aria-label={alt}
			>
				<img
					{src}
					{alt}
					class="aspect-[3/2] w-full object-cover"
					loading="lazy"
				/>
				<div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-sm text-white">
					{alt}
				</div>
			</button>
		{/each}
		<!-- see `rest` declaration for why this is duplicating the above code -->
		{#each rest as [src, alt] (src)}
			<button
				transition:fade
				on:click={() => handleClick(src, alt)}
				on:keydown={(e) => e.key === 'Enter' && handleClick(src, alt)}
				class="w-[min(100%, 20rem)] relative overflow-clip rounded-lg"
				aria-label={alt}
			>
				<img
					{src}
					{alt}
					class="aspect-[3/2] w-full object-cover"
					loading="lazy"
				/>
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
