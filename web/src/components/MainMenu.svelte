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
    <div class="main_menu" class:hidden={$isInGameScene}>
        <div class="title_container">
            <h1 class="title">Needle Racing</h1>
        </div>

        <div class="track_options">
            {#each $tracks as scene, index}
                <div
                    class="slide_in"
                    style="--delay: {index * 0.1}s; --index: {index}"
                >
                    <LargeTrackButton
                        t01={index / ($tracks.length - 1)}
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
    </div>
{/if}

<style>
    .main_menu {
        position: fixed;
        z-index: 100;
    }

    .hidden {
        display: none !important;
    }

    @keyframes title_intro {
        from {
            transform: translateX(40ch);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .title_container {
        position: absolute;
        padding: 2rem;
        padding-left: calc(20vw - 10ch);
        overflow: hidden;
        white-space: nowrap;

        animation: title_intro 3s forwards 0.5s;
        opacity: 0;

        & .title {
            font-size: 10rem;
            line-height: 0.8em;
        }
    }

    @keyframes slide_in {
        from {
            transform: translateX(-100%);
        }
        20% {
            transform: translateX(calc(var(--index) * 2rem + 1rem));
        }
        to {
            transform: translateX(calc(var(--index) * 3rem + 1rem));
        }
    }

    .slide_in {
        transform: translateX(-100%);
        animation: slide_in 6s forwards var(--delay);
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
        gap: 1px;

        pointer-events: none;
        user-select: none;

        padding-left: 30vw;
        padding-bottom: 8vh;

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


    @media (width <= 1200px) {
        .title {
            white-space: initial;
            font-size: 8rem !important;
        }
        
        /* padding-bottom: 5vh; {

        } */
    }
</style>
