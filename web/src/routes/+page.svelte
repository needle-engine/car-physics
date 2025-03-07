<script>
    import { gamestate, settings, updateSettings } from "$lib";
    import { derived, get } from "svelte/store";
    import RacingGame from "../components/RacingGame.svelte";
    import NeedleEngine from "../components/NeedleEngine.svelte";
    import MainMenu from "../components/MainMenu.svelte";
    import Menu from "../components/Menu.svelte";
    import Icon from "../components/Icon.svelte";
    import SettingsOptions from "../components/SettingsOptions.svelte";

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
    {#if $gamestate === "main-menu"}
        <MainMenu />
        <Menu contrast>
            <SettingsOptions />
        </Menu>
    {:else if $inRace}
        <RacingGame />
    {/if}
</div>

<style>
    .engine {
        position: absolute;
        pointer-events: all;

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
    }
</style>
