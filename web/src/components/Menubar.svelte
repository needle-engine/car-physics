<script>
    import CarSelection from "./CarSelection.svelte";


</script>

<header>
    <CarSelection />
</header>

<style>
    header {
        position: sticky;
        z-index: 999;

        max-width: fit-content;
        margin: 0 auto;

        display: flex;
        flex-wrap: wrap;
        background: rgba(250, 250, 250, .0);
        border-radius: 1rem;
        /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
        /* backdrop-filter: blur(10px); */
        
        /* padding: .3rem .5rem; */
        margin-top: 1em;

        & a {
            margin: 0 1rem;
            font-weight: bold;
        }
    }
</style>