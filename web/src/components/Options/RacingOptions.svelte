<script lang="ts">
    import { gamestate, menuOpen, screenshot } from "$lib";
    import { onMount } from "svelte";
    import Icon from "../Icon.svelte";
    
    $: state = $gamestate;
</script>

{#if state === "race-idle" || state === "race-in-progress" || state === "race-finished" || state === "race-menu"}

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
            Race Again
        {:else if $gamestate === "race-in-progress"}
            <Icon name="flag" />
            Restart Race
        {:else}
            <Icon name="flag" />
            Start Race
        {/if}
    </button>

    <button
        on:click={() => {
            menuOpen.set(false);
            screenshot().then((res) => {
                menuOpen.set(true);
            });
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
{/if}
