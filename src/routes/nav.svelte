<script lang="ts">
	import { selectedBreeds } from '../stores';

	export let breeds: [string, string[]][] = [];

	let search = '';
	let selected: string[][] = [];
	selectedBreeds.subscribe((value) => {
		selected = value;
	});
	$: filtered = breeds.filter(([breed, subBreeds]) => {
		if (breed.includes(search)) return true;
		if (subBreeds.some((subBreed) => subBreed.includes(search))) return true;
		return false;
	});
	const isSelected = (selected: string[][], breed: string, subBreed?: string) => {
		if (subBreed) {
			return selected.some(([b, sb]) => b === breed && (sb === subBreed || !sb));
		}
		return selected.some(([b, sb]) => b === breed && !sb);
	};
	const checkboxEvent = (e: Event, breed: string, subBreed?: string) => {
		setSelection((e.target as HTMLInputElement).checked, breed, subBreed);
	};
  // Sets the selection state of the breed and subBreed
	const setSelection = (state: boolean, breed: string, subBreed?: string) => {
		selectedBreeds.update((value) => {
			if (subBreed) {
				if (state) {
					value.push([breed, subBreed]);
				} else {
					const index = value.findIndex(([b, sb]) => b === breed && sb === subBreed);
					value.splice(index, 1);
				}
			} else {
				if (state) {
					value.push([breed, '']);
				} else {
					value = value.filter(([b, sb]) => b !== breed);
				}
			}
			return value;
		});
	};
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
						<label
							for={breed}
							class={`w-full inline-block cursor-pointer ${
								isSelected(selected, breed)
									? 'text-blue-500 dark:text-blue-300'
									: 'text-gray-800 dark:text-gray-200'
							}`}
						>
							<input
								type="checkbox"
								checked={isSelected(selected, breed)}
								id={breed}
								class="hidden"
								on:change={(e) => checkboxEvent(e, breed)}
							/>
							{breed[0].toUpperCase() + breed.slice(1)}
						</label>
					{:else}
						<details open={isSelected(selected, breed) || Boolean(search)}>
							<summary>
								<label
									for={breed}
									class={`inline-block cursor-pointer ${
										isSelected(selected, breed)
											? 'text-blue-500 dark:text-blue-300'
											: 'text-gray-800 dark:text-gray-200'
									}`}
								>
									<input
										type="checkbox"
										checked={isSelected(selected, breed)}
										id={breed}
										class="hidden"
										on:change={(e) => checkboxEvent(e, breed)}
									/>
									{breed[0].toUpperCase() + breed.slice(1)}
								</label>
							</summary>
							<ul class="pl-4">
								{#each subBreeds as subBreed}
									<li>
										<label
											for={subBreed}
											class={`w-full inline-block cursor-pointer ${
												isSelected(selected, breed, subBreed)
													? 'text-blue-500 dark:text-blue-300'
													: 'text-gray-800 dark:text-gray-200'
											}`}
										>
											<input
												type="checkbox"
												checked={isSelected(selected, breed, subBreed)}
												id={subBreed}
												class="hidden"
												on:change={(e) => checkboxEvent(e, breed, subBreed)}
											/>
											{subBreed[0].toUpperCase() + subBreed.slice(1)}
										</label>
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
