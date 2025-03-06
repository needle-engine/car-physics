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

<div class="menu-wrapper" class:is_open={open}>
    <div class="menu">
        <button
            class="toggle_open"
            on:click={(_) => {
                open = !open;
            }}
        >
            {#if open}
                <Icon name="close" />
            {:else}
                <Icon name="menu" />
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

        &.is_open {
            pointer-events: all;
            /* background-color: rgba(0, 0, 0, 0.3); */
            /* backdrop-filter: blur(5px); */
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

            background: var(--button-bg);
            backdrop-filter: blur(5px);
        }
        
        & .menu {
            gap: 1px;
            & button {
                pointer-events: all;
            }
        }
    }
    .menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;

        &.open {
            background: rgba(20, 0, 50, 0.12);
        }
        
        & .menu_options {
            display: flex;
            flex-direction: column;
            font-size: 1.5rem;
            width: min(90vw, 30ch);
        }

        & .menu_options button {
            margin: 0;

            &:disabled {
                cursor: not-allowed;
                pointer-events: none !important;
            }
        }
    }
</style>
