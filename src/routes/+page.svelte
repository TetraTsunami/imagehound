<div class="grid">
  {#each Array( 10).map((e, i) => i) as i}
    <div class="h-10 w-10 rounded-md bg-slate-400 shadow-i-md">
      <h2>i</h2>
    </div>
  {/each}
</div>
