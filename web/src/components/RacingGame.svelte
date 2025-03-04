<script lang="ts">
    import { currentRaceStartCountDown, gamestate } from "$lib";
    import { onMount } from "svelte";
    import Countdown from "./Countdown.svelte";
</script>

{#if $gamestate === "race-idle" || $gamestate === "race-finished"}
    <button
        class="start-button"
        on:click={() => {
            gamestate.set("race-in-progress");
        }}
    >
        {#if $gamestate === "race-finished"}
            RACE AGAIN
        {:else}
            START RACE
        {/if}
    </button>
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
{/if}

<!-- {#if $laptime >= 0}
    <div class="laptime">
        <div class="current">
            {$laptime.toFixed(2)}
        </div>
        <div class="last">
            Last time: {$lastlap > 0 ? $lastlap.toFixed(2) : "-"}
        </div>
        <div class="best">
            Best time: {$bestlap > 0 ? $bestlap.toFixed(2) : "-"}
        </div>
    </div>
{/if} -->

<style>
    .start-button {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 1rem 2rem;
        font-size: 2rem;
        font-weight: bold;
        background: rgb(0, 0, 0);
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background 0.2s;
        &:hover {
            background: rgb(138, 255, 177);
        }
    }
    .laptime {
        position: absolute;
        left: 1.2rem;
        top: 2rem;
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.3);
        border-radius: 0.5em;

        line-height: 1.3em;

        display: flex;
        flex-direction: column;
        padding: 0.25rem;
        gap: 0.3em;

        & .current {
            font-size: 2rem;
            line-height: 1em;
            padding-bottom: 0.1em;
            font-weight: bold;
        }
    }
</style>
