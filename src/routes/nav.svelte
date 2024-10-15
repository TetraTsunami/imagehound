<script lang="ts">
	import { selectedBreeds } from '../stores';
	import BreedCheckbox from './breedCheckbox.svelte';

	export let breeds: [string, string[]][] = [];

	/**
	 * Contains the search query
	 */
	let search = '';
	/**
	 * Contains the filtered breeds
	 */
	let selected: string[][] = [];
	selectedBreeds.subscribe((value) => {
		selected = value;
	});
	/**
	 * Checks if a breed or sub-breed is selected
	 * @param selected - The selected breeds
	 * @param breed - The breed to check
	 * @param subBreed - The sub-breed to check, optional
	 */
	const isSelected = (selected: string[][], breed: string, subBreed?: string) => {
		if (subBreed) {
			return selected.some(([b, sb]) => b === breed && (sb === subBreed || !sb));
		}
		return selected.some(([b, sb]) => b === breed && !sb);
	};
	/**
	 * Filters the breeds based on the search query, if there is one
	 */
	$: filtered = breeds.filter(([breed, subBreeds]) => {
		if (breed.includes(search)) return true;
		if (subBreeds.some((subBreed) => subBreed.includes(search))) return true;
		return false;
	});
</script>

<nav class="sticky top-0 min-w-fit max-w-fit">
	<div class="flex h-screen flex-col gap-4 overflow-scroll py-8 pr-4">
		<h1 class="text-lg font-semibold">Breeds</h1>
		<input
			type="search"
			placeholder="Search"
			bind:value={search}
			class="w-32 rounded-md border border-gray-300 bg-white p-2 text-gray-800 md:w-44 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-200"
		/>

		<ul class="flex flex-col gap-2">
			{#each filtered as [breed, subBreeds]}
				<li>
					{#if subBreeds.length == 0}
						<BreedCheckbox {breed} />
					{:else}
						<details open={isSelected(selected, breed) || Boolean(search)}>
							<summary>
								<BreedCheckbox {breed} />
							</summary>
							<ul class="pl-4">
								{#each subBreeds as subBreed}
									<li>
										<BreedCheckbox {breed} {subBreed} />
									</li>
								{/each}
							</ul>
						</details>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</nav>
