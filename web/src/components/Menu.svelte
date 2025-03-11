<script lang="ts">
    import { onMount } from "svelte";
    import Icon from "./Icon.svelte";
    import { type MenuOption, menuOptions } from "$lib";
    import { derived, get } from "svelte/store";
    import SettingsOptions from "./Options/SettingsOptions.svelte";

    export let open = false;
    export let contrast = false;

    onMount(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                open = !open;
            }
        });
    });

    // const menuOptionBlocks = derived(menuOptions, ($menuOptions) => {
    //     // we create nested arrays for each menu option category
    //     const options = get(menuOptions);
    //     const res = new Array<{
    //         category?: string;
    //         entries: Array<MenuOption>;
    //     }>();
    //     for (const opt of options) {
    //         const category = opt.category || "default";
    //         const cat = res.find((c) => c.category === category);
    //         if (cat) {
    //             cat.entries.push(opt);
    //         } else {
    //             res.push({ category, entries: [opt] });
    //         }
    //     }
    //     return res;
    // });
</script>

<div class="menu-wrapper" class:is_open={open} class:contrast>
    <div class="menu">
        <button
            class="toggle_open"
            class:hidden={false}
            on:click={(_) => {
                open = !open;
            }}
        >
            {#if open}
                <Icon name="close" />
                <span> Menu </span>
            {:else}
                <Icon name="menu" />
                <span> Menu </span>
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
            &.contrast {
                background-color: rgba(0, 0, 0, 0.6);
                /* backdrop-filter: blur(5px); */
            }
        }

        & .toggle_open {
            position: absolute;
            z-index: 100;
            top: 1rem;
            right: 1rem;
            /* border-radius: 3rem; */
            padding: 0.4rem 0.7rem;
            margin: 0;
            /* font-size: 1.5rem; */
            /* line-height: 0rem; */

            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;

            font-size: 1rem;
            /* background: var(--button-bg); */
            background: transparent;
            backdrop-filter: blur(5px);
        }

        & .menu {
            gap: 2px;

            & button,
            input {
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
            height: fit-content;
            overflow: hidden;
            backdrop-filter: blur(50px);
            gap: 2px;

            /* & .form-control input[type="checkbox"] {
                display: none;
            } */

            & button,
            .form-control {
                margin: 0;
                padding: 0.75rem 0.5rem;
                backdrop-filter: none;
                border-radius: 0.1rem;

                display: grid;
                grid-template-columns: auto 1fr;
                align-items: center;
                text-align: start;
                gap: 1rem;
                padding-left: 26%;
                /* padding-right: 20%; */

                & > * {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
            }
        }
    }
</style>
