<script lang="ts">
    import { currentRaceStartCountDown, gamestate, menuOpen } from "$lib";
    import Countdown from "./Countdown.svelte";
    import Menu from "./Menu.svelte";
    import SpeedoMeter from "./SpeedoMeter.svelte";
    import RaceTimePanel from "./RaceTimePanel.svelte";
    import { onMount } from "svelte";
    import Icon from "./Icon.svelte";

    onMount(() => {
        menuOpen.set(true);
        // Open the menu when the race finishes
        return gamestate.subscribe((newstate) => {
            if (newstate === "race-finished") {
                menuOpen.set(true);
            }
        });
    });
</script>

<Menu bind:open={$menuOpen}>
    <div class="menu">
        {#if $gamestate === "race-in-progress"}
            <button
                on:click={() => {
                    menuOpen.set(false);
                }}
            >
                Continue Race
            </button>
        {/if}

        {#if $gamestate != "race-idle"}
            <button
                on:click={() => {
                    gamestate.set("main-menu");
                }}
            >
                Back to Main Menu
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
                race again
            {:else if $gamestate === "race-in-progress"}
                restart race
            {:else}
                start race
            {/if}
        </button>
    </div>
</Menu>

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

<style>
    .menu {
        display: flex;
        flex-direction: column;
        pointer-events: none;

        & button {
            background: var(--button-bg);
            backdrop-filter: blur(10px);
            box-shadow:
                inset 0 0 3rem rgba(0, 0, 0, 0.5),
                0 0 5rem rgba(150, 150, 150, 0.2);

            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            border-radius: 0.2rem;

            padding: 1rem;

            transition: all 0.2s;

            &:hover {
                background: rgba(20, 20, 20, 0.8);
            }
        }
    }

    button.start-button {
        /* font-size: 4rem;
        padding: 2rem;
        font-weight: bold; */
        text-transform: capitalize;
    }
</style>
