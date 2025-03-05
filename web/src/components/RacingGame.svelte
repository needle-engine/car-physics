<script lang="ts">
    import {
        currentCarSpeed,
        currentRaceStartCountDown,
        currentRaceTimings,
        gamestate,
    } from "$lib";
    import { derived } from "svelte/store";
    import Countdown from "./Countdown.svelte";
    import Menu from "./Menu.svelte";
    import SpeedoMeter from "./SpeedoMeter.svelte";
    import RaceTimePanel from "./RaceTimePanel.svelte";
    import { onMount } from "svelte";

    let menu_open = true;

    onMount(() => {
        menu_open = true;
    });

    $: raceFinished = $gamestate === "race-finished";
</script>

{#if $gamestate === "race-idle" || $gamestate === "race-finished"}
    <!-- -->
{:else if $gamestate === "race-in-progress"}
    {#if $currentRaceStartCountDown >= 0}
        <div>
            <Countdown
                text={$currentRaceStartCountDown > 0
                    ? $currentRaceStartCountDown
                    : "GO"}
            />
        </div>
    {/if}
    <RaceTimePanel />
    <SpeedoMeter />
{/if}

<Menu bind:open={menu_open}>
    <div class="menu">
        <button
            on:click={() => {
                menu_open = false;
                if ($gamestate === "race-in-progress") {
                    $gamestate = "race-idle";
                    window.requestAnimationFrame(
                        () => ($gamestate = "race-in-progress"),
                    );
                } else gamestate.set("race-in-progress");
            }}
            class="start-button"
            class:restart={raceFinished}
        >
            {#if raceFinished}
                RACE AGAIN
            {:else}
                START RACE
            {/if}
        </button>
        {#if $gamestate === "race-in-progress"}
            <button
                on:click={() => {
                    menu_open = false;
                }}
            >
                Close menu
            </button>
        {/if}
        <button
            on:click={() => {
                gamestate.set("main-menu");
            }}
        >
            Back to menu
        </button>
    </div>
</Menu>

<style>
    .menu {
        display: flex;
        flex-direction: column;
    }

    .start-button {
        background: rgba(0, 0, 0, 0.6);
        box-shadow: inset 0 0 3rem rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        border: none;
        outline: none;
        color: white;
        font-size: 3rem;
        padding: 1rem 2rem;
    }
</style>
