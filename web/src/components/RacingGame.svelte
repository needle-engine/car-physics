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
    import RacingOptions from "./Options/RacingOptions.svelte";
    import SettingsOptions from "./Options/SettingsOptions.svelte";
    import OptionSeparator from "./Options/OptionSeparator.svelte";

    onMount(() => {
        menuOpen.set(false);
        // Open the menu when the race finishes
        const unsub = gamestate.subscribe((newstate) => {
            if (newstate === "race-finished") {
                menuOpen.set(true);
            }
        });
        return () => {
            unsub();
        };
    });
</script>

{#if $gamestate !== "race-idle"}
    <Menu bind:open={$menuOpen}>
        <RacingOptions />
        <OptionSeparator />
        <SettingsOptions />
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
        line-height: .85em;
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
</style>
