<script>
	import { flip } from 'svelte/animate';
	import { popupImage } from '../stores';
	import { fade } from 'svelte/transition';
	export let src = '';
	export let alt = '';

	const handleClick = () => {
		popupImage.update((value) => {
			return null;
		});
	};
</script>

<button
	class="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
	transition:fade={{ delay: 0, duration: 100 }}
	on:click={handleClick}
	aria-label="close popup"
>
	<img {src} {alt} class="h-full w-full object-contain p-2" />
</button>
