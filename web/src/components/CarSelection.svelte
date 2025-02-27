<script lang="ts">
    import { carOptions, selectedCar } from "$lib";
</script>

{#if $selectedCar || $carOptions.length > 0}
    <div class="selection">
        <!-- <select bind:value={$selectedCar}>
            {#each $carOptions as car}
                <option value={car}>{car.name}</option>
            {/each}
        </select> -->
        <div class="list">
            {#each $carOptions as car}
                <button
                    class="car"
                    on:click={() => selectedCar.set(car)}
                    class:active={$selectedCar?.instance === car.instance}
                >
                    <div class="thumbnail">
                        <img src={car.thumbnail} alt={car.name} />
                    </div>
                    <span class="name">
                        {car.name.replace("_", " ")}
                    </span>
                </button>
            {/each}
        </div>
    </div>
{/if}

<style>
    .selection {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        flex-wrap: wrap;
    }
    label {
        font-weight: bold;
    }

    .list {
        display: flex;
        gap: 1rem;

        & button.car {
            position: relative;
            border: none;
            background: none;
            cursor: pointer;
            padding: 0;
            border-radius: 0.5rem;

            display: flex;
            flex-direction: column;
            align-items: center;
            flex-wrap: wrap;

            gap: 0.5rem;
            font-size: 1.3rem;
            padding-bottom: 0.4rem;

            &:hover {
                & img {
                    transform: scale(1.05);
                }
            }

            & .name {
                text-transform: capitalize;
                backdrop-filter: blur(50px);
                width: fit-content;
                border-radius: 1rem;
                padding: 0 0.3em;
            }

            & .thumbnail {
                width: 130px;
                height: 160px;
                overflow: clip;
                border-radius: 0.5rem;
                box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.3);
                outline: 1px solid rgba(255, 255, 255, 0.7);

                & img {
                    transition: all 0.2s;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            &.active {
                /* & .name {
                    text-decoration: underline;
                } */

                & .thumbnail {
                    /* outline: 2px solid black; */
                    outline: 4px solid rgba(255, 255, 255, .9);
                }
            }
        }
    }
</style>
