<script lang="ts">
  import { page } from '$app/stores';  
  
  export let breeds: [string, string[]][] = [];
  let search = "";
  $: path = $page.url.pathname.split("/");
  $: filtered = breeds.filter(([breed, subBreeds]) => {
    if (breed.includes(search)) return true;
    if (subBreeds.some(subBreed => subBreed.includes(search))) return true;
    return false;
  });
</script>

<nav class="sticky top-0 min-w-fit max-w-fit">
  <div class="flex h-screen flex-col gap-4 overflow-scroll py-8 pr-4">
  <h1 class="text-lg font-semibold">Breeds</h1>
  <input type="search" placeholder="Search" bind:value={search} 
    class="w-32 rounded-md border border-gray-300 bg-white p-2 text-gray-800 md:w-44 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-200"/>
  
  <ul class="flex flex-col gap-2">
  {#each filtered as [breed, subBreeds]}
    <li>
      {#if subBreeds.length == 0}
        <a href={`/${breed}`} class={`
          ${path.includes(breed) ? "text-blue-500 dark:text-blue-300" : 
          "text-gray-800 dark:text-gray-200"}`}>
            {breed[0].toUpperCase() + breed.slice(1)}
        </a>

      {:else}
      <details open={path.includes(breed) || Boolean(search)}>
        <summary>
          <a href={`/${breed}`} class={`
            ${path.includes(breed) ? "text-blue-500 dark:text-blue-300" : 
            "text-gray-800 dark:text-gray-200"}`}>
              {breed[0].toUpperCase() + breed.slice(1)}
          </a>
        </summary>
        <ul class="pl-4">
        {#each subBreeds as subBreed}
          <li>
            <a href={`/${breed}/${subBreed}`} class={`
              ${path.includes(breed) && path.includes(subBreed) ? "text-blue-500 dark:text-blue-300" : 
              "text-gray-800 dark:text-gray-200"}`}>
                {subBreed[0].toUpperCase() + subBreed.slice(1)}
            </a>
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