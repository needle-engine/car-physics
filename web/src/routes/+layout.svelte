<script lang="ts">
    import "../global.css";
    import Menubar from "../components/Menubar.svelte";
</script>

<div class="app">
    <Menubar />
    <main>
        <slot />
    </main>
</div>

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
