<script lang="ts">
    import { scenes } from "$lib";
    import { onMount } from "svelte";
    import Icon from "./Icon.svelte";

    export let open = true;
    export let loading: Promise<any> | null = null;

    onMount(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                open = !open;
            }
        });
    });
</script>

<div class="wrapper">
    <div class="menu" class:open>
        <button
            class="toggle_open"
            on:click={(_) => {
                open = !open;
            }}
        >
            {#if open}
                <Icon>close</Icon>
            {:else}
                <Icon>menu</Icon>
            {/if}
        </button>

        {#if open}
            <div class="options">
                {#each $scenes as scene}
                    <button
                        on:click={() => {
                            open = !open;
                            loading = scene.load();
                        }}
                    >
                        {scene.name}
                    </button>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .wrapper {
        position: fixed;
        margin: auto;
        z-index: 1000;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;

        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;

        & button {
            pointer-events: all;
        }

        & .toggle_open {
            position: absolute;
            top: 1rem;
            right: 1rem;
            border-radius: 3rem;
            padding: 0.5rem;
            margin: 0;
            font-size: 1.5rem;
            line-height: 0rem;
        }

        & .menu {
            position: fixed;
            width: 100%;
            height: 100%;

            display: flex;
            justify-content: center;
            align-items: center;

            &.open {
                backdrop-filter: blur(5px);
                pointer-events: all;
                background: rgba(20, 0, 50, .12);;
            }

            & .options {
                font-size: 1.5rem;

                width: min(360px, 90%);
                display: flex;
                flex-direction: column;
                gap: .2rem;

                & button {
                    padding: .6rem .2rem;

                    &:hover {
                        background-color: black;
                        color: white;
                    }
                }
            }
        }
    }
</style>
