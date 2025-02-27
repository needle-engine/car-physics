<script lang="ts">
    import "../global.css";
    import Menubar from "../components/Menubar.svelte";
    import NeedleEngine from "../components/NeedleEngine.svelte";
    import MainMenu from "../components/MainMenu.svelte";
    import LoadingScreen from "../components/LoadingScreen.svelte";
    import CarSelection from "../components/CarSelection.svelte";

    let loading_promise: Promise<any> | null = null;
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    />
</svelte:head>

<div class="app">
    <MainMenu bind:loading={loading_promise} />
    <main>
        <NeedleEngine />
        <!-- <Menubar /> -->
        <slot></slot>
        <CarSelection />
    </main>
</div>

<LoadingScreen loading={loading_promise} />

<style>
    .app {
        position: relative;
        display: flex;
        flex-flow: column;
        height: 100%;
    }

    main {
        position: absolute;
        z-index: 1;

        --padding: 0rem;
        left: var(--padding);
        right: var(--padding);
        top: calc(var(--padding));
        bottom: var(--padding);

        flex: 1 1 auto;
        flex-flow: column;
        display: flex;
    }
</style>
