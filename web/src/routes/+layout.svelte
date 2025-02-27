<script lang="ts">
    import "../global.css";
    import { base } from "$app/paths";
</script>

<div class="app">
    <header>
        <a href="{base}/">Home</a>
        <a href="https://needle.tools">Needle</a>
        <a href="https://github.com/needle-engine/sveltekit-sample">Github</a>
    </header>
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

    header {
        position: sticky;
        z-index: 999;

        max-width: fit-content;
        margin: 0 auto;

        display: flex;
        background: #eee;
        border: 1px solid #ccc;
        border-radius: 50px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        
        padding: 1rem;
        margin-top: 1em;
    }
    header a {
        margin: 0 1rem;
        font-weight: bold;
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
