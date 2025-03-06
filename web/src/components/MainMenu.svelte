<script lang="ts">
    import { tracks, gamestate } from "$lib";
    import { derived, get } from "svelte/store";
    import LargeTrackButton from "./LargeTrackButton.svelte";

    let open = true;

    const isInGameScene = derived(
        gamestate,
        ($gamestate) => $gamestate !== "main-menu" && $gamestate !== "loading",
    );
</script>

{#if $gamestate !== "loading"}
    <div class="track_options" class:hidden={$isInGameScene}>
        {#each $tracks as scene, index}
            <div
                class="slide_in"
                style="--delay: {index * 0.1}s; --index: {index}"
            >
                <LargeTrackButton
                    onClick={() => {
                        open = false;
                        scene.select();
                    }}
                >
                    {scene.name}
                </LargeTrackButton>
            </div>
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
        justify-content: flex-end;
        gap: 0.2rem;

        pointer-events: none;
        user-select: none;

        padding-left: 30vw;
        padding-bottom: 5vh;

        width: 100%;
        height: 100%;
        overflow: hidden;
        /* outline: 1px solid red; */

        & button {
            pointer-events: all;
        }
        /* background: linear-gradient(
            90deg,
            rgba(0, 10, 20, 1) 0%,
            rgba(0, 0, 0, 0) 100%
        ) !important; */

        /* backdrop-filter: blur(10px); */
        /* outline: 1px solid red; */
    }

    @keyframes slide_in {
        from {
            transform: translateX(-100%);
        }
        .5% {
            transform: translateX(calc(var(--index) * 1rem));
        }
        to {
            transform: translateX(calc(var(--index) * 10vw));
        }
    }

    .slide_in {
        transform: translateX(-100%);
        animation: slide_in 200s ease-in-out forwards var(--delay);
    }
</style>
