<script lang="ts">
    import { bestlap, laptime, lastlap } from "$lib";
</script>

{#if $laptime >= 0}
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
{/if}

<style>
    .laptime {
        position: absolute;
        left: 1.2rem;
        top: 2rem;
        backdrop-filter: blur(10px);
        border-radius: 0.5em;

        line-height: 1.3em;

        display: flex;
        flex-direction: column;
        gap: 0.3em;

        & .current {
            font-size: 2rem;
            padding-bottom: 0.3em;
            font-weight: bold;
        }
    }
</style>
