<script lang="ts">
    import { onMount } from "svelte";
    import Icon from "./Icon.svelte";

    export let open = true;
    export let allow_blur = false;

    onMount(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                open = !open;
            }
        });
    });
</script>

<div class="menu-wrapper" class:allow_blur={allow_blur && open}>
    <div class="menu">
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
            <div class="menu_options">
                <slot></slot>
            </div>
        {/if}
    </div>
</div>

<style>
    .menu-wrapper {
        position: fixed;
        margin: auto;
        z-index: 9999;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;

        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;

        &.allow_blur {
            backdrop-filter: blur(5px);
        }

        & .toggle_open {
            position: absolute;
            z-index: 100;
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
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: all;
            user-select: none;

            &.open {
                background: rgba(20, 0, 50, 0.12);
            }
            &.in_race.open {
                backdrop-filter: blur(5px);
            }

            & .menu_options {
                font-size: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 0.2rem;
            }

            & .menu_options button {
                &:disabled {
                    cursor: not-allowed;
                    pointer-events: none !important;
                }
            }
        }
    }
</style>
