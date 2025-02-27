<script lang="ts">
    import Icon from "./Icon.svelte";

    export let loading: Promise<any> | null = null;
</script>

{#await loading}
    <div class="loading_ovelay">
        <div class="content">
            <div class="loading_spinner">
                <Icon>progress_activity</Icon>
            </div>
            <span> Loading...</span>
        </div>
    </div>
{/await}

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
        font-size: 4rem;
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
