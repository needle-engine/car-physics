<script lang="ts">
    import {
        currentRaceStartCountDown,
        gamestate,
        menuOpen,
        screenshot,
    } from "$lib";
    import Countdown from "./Countdown.svelte";
    import Menu from "./Menu.svelte";
    import SpeedoMeter from "./SpeedoMeter.svelte";
    import RaceTimePanel from "./RaceTimePanel.svelte";
    import { onMount } from "svelte";
    import Icon from "./Icon.svelte";

    onMount(() => {
        menuOpen.set(false);
        // Open the menu when the race finishes
        return gamestate.subscribe((newstate) => {
            if (newstate === "race-finished") {
                menuOpen.set(true);
            }
        });
    });
</script>

{#if $gamestate !== "race-idle"}
    <Menu bind:open={$menuOpen}>
        {#if $gamestate === "race-in-progress"}
            <button
                on:click={() => {
                    menuOpen.set(false);
                }}
            >
                <Icon name="pause" />
                Continue Race
            </button>
        {/if}

        <button
            on:click={() => {
                menuOpen.set(false);
                if ($gamestate === "race-in-progress") {
                    $gamestate = "race-idle";
                    window.requestAnimationFrame(
                        () => ($gamestate = "race-in-progress"),
                    );
                } else gamestate.set("race-in-progress");
            }}
            class="start-button"
        >
            {#if $gamestate === "race-finished"}
                <Icon name="flag" />
                race again
            {:else if $gamestate === "race-in-progress"}
                <Icon name="flag" />
                restart race
            {:else}
                <Icon name="flag" />
                start race
            {/if}
        </button>

        <button
            on:click={() => {
                menuOpen.set(false);
                screenshot().then(res => {
                    menuOpen.set(true);
                })
            }}
        >
            <Icon name="camera" />
            Take Screenshot
        </button>

        <button
            on:click={() => {
                gamestate.set("main-menu");
            }}
        >
            <Icon name="home" />
            Back to Main Menu
        </button>
    </Menu>

{/if}

{#if $gamestate === "race-idle"}
    <div class="before_race">
        <button on:click={() => [gamestate.set("race-in-progress")]}>
            Start Race
        </button>
    </div>
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

<style>
    .menu {
        display: flex;
        flex-direction: column;
        pointer-events: none;

        /* & button {
            background: var(--button-bg);
            border-radius: 0.2rem;
            padding: 1rem;
            transition: all 0.2s;
        } */
    }

    .before_race {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 5%;
    }

    .before_race button {
        pointer-events: all;
        font-size: 10rem;
        background: none !important;
        transition: all 0.5s;
        opacity: 0.8;
        transform: skewY(-5deg);
        font-weight: lighter;
        text-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.3);
        backdrop-filter: none;

        &:hover {
            opacity: 1;
            transform: skewY(0deg) scale(1.1);
            font-weight: bold;
            text-shadow: 0 0 3rem rgba(255, 255, 255, 0.5);
        }
    }

    button.start-button {
        /* font-size: 4rem;
        padding: 2rem;
        font-weight: bold; */
        text-transform: capitalize;
    }
</style>
