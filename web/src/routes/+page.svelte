<script>
    import { gamestate } from "$lib";
    import { derived } from "svelte/store";
    import RacingGame from "../components/RacingGame.svelte";
    import NeedleEngine from "../components/NeedleEngine.svelte";

    const inRace = derived(
        gamestate,
        ($gamestate) =>
            $gamestate === "race-idle" ||
            $gamestate === "race-in-progress" ||
            $gamestate === "race-finished",
    );
</script>

<div class="engine">
    <NeedleEngine />
</div>

<div class="ui">
    {#if $inRace}
        <RacingGame />
    {:else}
        {$gamestate}
    {/if}
</div>

<style>
    .engine {
        position: absolute;

        --padding: 0rem;
        left: var(--padding);
        right: var(--padding);
        top: calc(var(--padding));
        bottom: var(--padding);

        flex: 1 1 auto;
        flex-flow: column;
        display: flex;
    }

    .ui {
        z-index: 1000;
        & > * {
            pointer-events: all;
        }
    }
</style>
