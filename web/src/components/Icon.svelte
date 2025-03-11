<script lang="ts">
    export let name;
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
    />
</svelte:head>

<span class="material-symbols-outlined">
    {name}
</span>

<style>
    .material-symbols-outlined {
        font-size: inherit;
        font-variation-settings:
            "FILL" 1,
            "wght" 400,
            "GRAD" 0,
            "opsz" 24;
    }
</style>
