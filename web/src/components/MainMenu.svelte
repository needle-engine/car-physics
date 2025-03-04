<script lang="ts">
    import { gameoptions, gamestate } from "$lib";
    import { onMount } from "svelte";
    import Icon from "./Icon.svelte";
    import { derived, get } from "svelte/store";
    import { GameManager } from "../scripts/GameManager";

    export let open = true;

    // assumign the first scene is the main menu - we then want to open the menu always
    const isMenuScene = derived(
        gamestate,
        ($gamestate) => $gamestate === "main-menu",
    );
    const isInGameScene = derived(
        gamestate,
        ($gamestate) => $gamestate !== "main-menu" && $gamestate !== "loading",
    );

    // activeScene.subscribe(() => {
    //     open = false;
    // });

    onMount(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                open = !open;
            }
        });
    });
</script>

{#if $gamestate !== "loading"}
    <div class="wrapper">
        <div
            class="menu"
            class:open={open || $isMenuScene}
            class:in_race={!$isMenuScene}
        >
            <button
                class="toggle_open"
                class:hidden={$isMenuScene}
                on:click={(_) => {
                    open = !open;
                }}
            >
                {#if open}
                    <Icon>close</Icon>
                {:else}
                    <Icon>menu</Icon>
                {/if}
            </button>

            {#if open || $isMenuScene}
                <div class="options">
                    {#if $isInGameScene}
                        <button
                            on:click={() => {
                                open = false;
                                gamestate.set("main-menu");
                            }}
                        >
                            Main Menu
                        </button>
                    {:else}
                        {#each $gameoptions as scene, index}
                            <button
                                disabled={false}
                                on:click={() => {
                                    open = false;
                                    scene.select();
                                }}
                            >
                                {scene.name}
                            </button>
                        {/each}
                    {/if}
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .wrapper {
        position: fixed;
        margin: auto;
        z-index: 1000;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;

        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;

        & button {
            pointer-events: all;
        }

        & .hidden {
            display: none;
        }

        & .toggle_open {
            position: absolute;
            top: 1rem;
            right: 1rem;
            border-radius: 3rem;
            padding: 0.5rem;
            margin: 0;
            font-size: 1.5rem;
            line-height: 0rem;
        }

        & .menu {
            position: fixed;
            width: 100%;
            height: 100%;

            display: flex;
            justify-content: center;
            align-items: center;

            &.open {
                pointer-events: all;
                background: rgba(20, 0, 50, 0.12);
            }
            &.in_race.open {
                backdrop-filter: blur(5px);
            }

            & .options {
                font-size: 1.5rem;

                width: min(360px, 90%);
                display: flex;
                flex-direction: column;
                gap: 0.2rem;

                & button {
                    padding: 0.6rem 0.2rem;

                    &:hover {
                        background-color: black;
                        color: white;
                    }

                    &:disabled {
                        /* background: grey; */
                        color: grey;
                        cursor: not-allowed;
                        pointer-events: none !important;
                    }
                }
            }
        }
    }
</style>
