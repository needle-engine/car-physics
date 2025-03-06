<script lang="ts">
    import Icon from "./Icon.svelte";
    import { gamestate } from "$lib";

</script>

<!-- {#if $gamestate === "loading"} -->
    <div class="loading_ovelay" class:hidden={$gamestate !== "loading"}>
        <div class="content">
            <div class="loading_spinner">
                <Icon name="progress_activity"/>
            </div>
            <!-- <span> Loading...</span> -->
        </div>
    </div>
<!-- {/if} -->

<style>
    .loading_ovelay {
        position: absolute;
        z-index: 9000;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(10, 10, 10, 1);
        color: white;

        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 1;
        backdrop-filter: blur(5px);

        transition-behavior: allow-discrete;
        transition-duration: 1s;

        &.hidden {
            display: none;
            opacity: 0;
            backdrop-filter: blur(0px);
        }
        
    }

    .content {
        display: flex;
        flex-flow: column;
        gap: 1rem;
    }

    .loading_spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
