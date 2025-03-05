<script>
    import { currentRaceTimings } from "$lib";
    import { get } from "svelte/store";

    $: currentLapTimeFormatted = () => {
        const time = get(currentRaceTimings)?.currentLapTime || 0;
        return time.toFixed(2);
    }
</script>

{#if $currentRaceTimings}
    {@const timings = $currentRaceTimings}

    <div class="current_time">
        {currentLapTimeFormatted()}
    </div>

    <div class="timings">
        <span class="best"> Best lap </span>
        <span class="best">
            {timings.bestLapTime > 0 ? timings.bestLapTime.toFixed(2) : "-"}
        </span>

        <span> Last lap </span>
        <span>
            {timings.lastLapTime > 0 ? timings.lastLapTime.toFixed(2) : "-"}
        </span>
    </div>
{/if}

<style>
    .current_time {
        position: absolute;
        left: 50%;
        top: 1rem;
        transform: translateX(-50%);
        font-size: 2rem;
        font-weight: bold;
        color: white;
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        
        min-width: 5ch;
        border-radius: .4rem;
        padding: .2rem .5rem;
        text-align: center;
    }

    .timings {
        position: absolute;
        left: 1.2rem;
        top: 1rem;

        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 0.4em;

        display: grid;
        grid-template-columns: auto auto;
        flex-direction: column;
        gap: 0.5rem 2rem;

        padding: 0.7rem;
        padding-top: 0.5rem;

        & .best {
            font-weight: bold;
        }
    }
</style>
