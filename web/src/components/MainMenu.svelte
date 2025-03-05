<script lang="ts">
    import { tracks, gamestate } from "$lib";
    import { derived, get } from "svelte/store";
    import LargeTrackButton from "./LargeTrackButton.svelte";

    let open = true;

    // assumign the first scene is the main menu - we then want to open the menu always
    const isMenuScene = derived(
        gamestate,
        ($gamestate) => $gamestate === "main-menu",
    );
    const isInGameScene = derived(
        gamestate,
        ($gamestate) => $gamestate !== "main-menu" && $gamestate !== "loading",
    );
</script>

{#if $gamestate !== "loading"}
    <div class="track_options" class:hidden={$isInGameScene}>
        {#each $tracks as scene}
            <LargeTrackButton
                onClick={() => {
                    open = false;
                    scene.select();
                }}
            >
                {scene.name}
            </LargeTrackButton>
        {/each}
    </div>
{/if}

<style>
    .hidden {
        display: none !important;
    }

    .track_options {
        position: fixed;
        left: 0;
        top: 0;
        padding: 0;
        z-index: 9999;

        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        gap: 1rem;
        padding-bottom: 25vh;

        pointer-events: all;

        /* outline: 1px solid red; */
    }

</style>
