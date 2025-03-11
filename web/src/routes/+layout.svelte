<script lang="ts">
    import "../global.css";
    import LoadingScreen from "../components/LoadingScreen.svelte";
</script>

<div class="wrapper">
    <div class="top"></div>

    <div class="layout">
        <slot></slot>
    </div>

    <div class="bottom">
        <!-- -->
    </div>
</div>

<LoadingScreen />

<style>
    .wrapper {
        position: relative;
        background-color: rgb(255, 199, 161);
        display: flex;
        flex-flow: column;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        color: white;
    }

    .layout {
        position: relative;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        height: 100%;
        pointer-events: none; /** this overlays the 3D canvas and we don't want to block all pointer events by default */
    }

    .bottom {
        bottom: 0;
        justify-self: flex-end;
    }
</style>
