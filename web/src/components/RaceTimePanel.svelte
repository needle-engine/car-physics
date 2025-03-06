<script lang="ts">
    import { currentRaceTimings } from "$lib";

    function formatLapTime(time: number) {
        const date = new Date(time);
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
        const seconds = String(date.getUTCSeconds()).padStart(2, "0");
        const millies = String(date.getUTCMilliseconds()).padStart(3, "0");
        if (date.getUTCHours() === 0) {
            return `${minutes}:${seconds}.${millies}`;
        }
        const hours = String(date.getUTCHours()).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}.${millies}`;
    }
</script>

{#if $currentRaceTimings}
    {@const timings = $currentRaceTimings}

    <div class="current_time">
        {formatLapTime($currentRaceTimings.currentLapTime * 1000)}
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
        background: var(--button-bg);
        backdrop-filter: blur(10px);

        min-width: 5ch;
        border-radius: 0.4rem;
        padding: 0.2rem 0.5rem;
        text-align: center;

        /* font-family: "Source Sans Pro"; */
        font-size: 2rem;
        font-variant-numeric: tabular-nums;
        /* font-variant-numeric: slashed-zero; */
    }

    .timings {
        position: absolute;
        left: 1.2rem;
        top: 1rem;

        background: var(--button-bg);
        backdrop-filter: blur(10px);
        border-radius: 0.4em;

        display: grid;
        grid-template-columns: auto auto;
        flex-direction: column;
        gap: 0.2rem 2rem;

        padding: 0.7rem;
        padding-top: 0.5rem;

        & .best {
            font-weight: bold;
        }
    }
</style>
