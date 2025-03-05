<script lang="ts">
    import { currentCarSpeed } from "$lib";
</script>

<div class="speedometer">
    {Math.abs($currentCarSpeed).toFixed(0)} km/h
</div>

<style>
    .speedometer {
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 1rem;
        font-size: 2rem;
        color: white;
        text-shadow: 0 0 1rem rgba(0, 0, 0, 0.4);
        z-index: 1000;
    }
</style>
