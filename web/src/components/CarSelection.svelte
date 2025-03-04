<script lang="ts">
    // import { carOptions, selectedCar } from "$lib";
</script>

<!-- {#if $carOptions.length > 1}
    <div class="selection">
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
{/if} -->

<style>

    .list {
        display: flex;
        flex-wrap: wrap;
        align-self: center;
        justify-content: center;

        padding-bottom: 1rem;

        gap: 0.3rem;

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
            pointer-events: all;

            &:hover {
                & img {
                    transform: scale(1.05);
                }
            }

            & .name {
                position: absolute;
                bottom: 1rem;
                text-transform: capitalize;
                backdrop-filter: blur(50px);
                width: fit-content;
                border-radius: 1rem;
                padding: 0 0.3em;
                font-size: 14px;
                opacity: 0.7;
                text-shadow: 0 0 5px rgba(255, 255, 255, 1);
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
                & .name {
                    font-weight: bold;
                    opacity: 1;
                }

                & .thumbnail {
                    /* outline: 2px solid black; */
                    outline: 4px solid rgba(255, 255, 255, 0.9);
                }
            }
        }
    }
</style>
