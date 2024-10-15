<script lang="ts">
	import { selectedBreeds } from '../stores';

	/**
	 * Contains the filtered breeds
	 */
	let selected: string[][] = [];
	selectedBreeds.subscribe((value) => {
		selected = value;
	});
	export let breed: string;
	export let subBreed = "";
  export let summary = false;

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
	 * Sets the selection state of the breed and subBreed
	 * @param state
	 */
	const setSelection = (state: boolean) => {
		selectedBreeds.update((value) => {
			if (subBreed) {
				// If there's a sub-breed, add it to the selected breeds
				// We are trusting that the desired state is the opposite of the current state
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
					// If the main breed is unchecked, remove all sub-breeds too
					value = value.filter(([b, sb]) => b !== breed);
				}
			}
			return value;
		});
	};
	/**
	 * Handles the change event on a checkbox
	 * @param e
	 */
	const checkboxEvent = (e: Event) => {
		setSelection((e.target as HTMLInputElement).checked);
	};
</script>

<label
	for={subBreed || breed}
	class={`${!summary && "w-full"} inline-block cursor-pointer ${
		isSelected(selected, breed, subBreed)
			? 'text-blue-500 dark:text-blue-300 font-bold'
			: 'text-gray-800 dark:text-gray-200'
	}`}
>
	<input
		type="checkbox"
		checked={isSelected(selected, breed, subBreed)}
		id={subBreed || breed}
		class="hidden"
		on:change={(e) => checkboxEvent(e)}
	/>
	{subBreed ? subBreed[0].toUpperCase() + subBreed.slice(1) : breed[0].toUpperCase() + breed.slice(1)}
</label>
