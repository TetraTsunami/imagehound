<script lang="ts">
  import { page } from "$app/stores";
  import type { PageData } from './$types';
  // import { error } from '@sveltejs/kit';
  
	export let data: PageData;
  console.log(data)
  $: images = data.images;
  
  // if (breed[0] !in breeds || 
  //   breed.length > 1 && !breeds[breed[0]].includes(breed[1])) {
  //   error(404, "Breed not found");
  // }
  // const images: string[] = [];
</script>

<div class="flex flex-wrap gap-4">
  {#each images as image}
    <img src={image} alt={"dog"} class="rounded-lg shadow-lg"/>
  {/each}
</div>