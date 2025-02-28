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

<div class="engine">
    <NeedleEngine />
</div>
<div class="layout">
    <div class="top">
        <MainMenu bind:loading={loading_promise} />
    </div>
    <slot></slot>
    <div class="bottom">
        <CarSelection />
    </div>
</div>

<LoadingScreen loading={loading_promise} />

<style>
    .engine {
        position: absolute;

        --padding: 0rem;
        left: var(--padding);
        right: var(--padding);
        top: calc(var(--padding));
        bottom: var(--padding);

        flex: 1 1 auto;
        flex-flow: column;
        display: flex;
    }

    .layout {
        position: relative;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        height: 100%;
        pointer-events: none; /** this overlays the 3D canvas and we don't want to block all pointer events by default */
    }

    .bottom {
        bottom: 0;
        justify-self: flex-end;
    }
</style>
