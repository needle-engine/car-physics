<script lang="ts">
    export let onClick: (evt: Event) => void;
    export let t01;
</script>

<button class="largebutton" on:click={onClick} style="--t01: {t01}">
    <span class="text">
        <slot></slot>
    </span>
</button>

<style>
    .largebutton {
        border: none;
        outline: none;
        box-shadow: none;
        margin: 0;

        display: flex;
        pointer-events: all;
        white-space: nowrap;

        color: white;
        font-size: 3rem;

        padding: 0.8rem;

        transition: all .5s ease-in-out;

        /* box-shadow: 0rem 1rem 5rem rgba(0, 0, 0, 0.3); */

        width: 100%;
        background-color: rgba(10, 10, 10, calc((.3 - var(--t01) * 0.2)));
        backdrop-filter: blur(20px);
        outline: 1px solid rgba(200, 200, 200, .1);

        padding: .7rem 1rem;
        padding-bottom: 1rem;
        border-radius: 0.3rem;


        /* padding-right: 10rem; */
        /* background: linear-gradient(
            120deg,
            rgba(0, 10, 20, 1) 10%,
            rgba(0, 0, 0, 0) 90%
        ) !important; */

        &:hover {
            transition: all 0.2s ease-in-out;
            transform: translateX(-1rem);
        }
    }
    .text {
        margin-left: 1rem;
        text-shadow: 0 0 5px rgba(200, 200, 200, 0.5);
        transition: all 0.2s;
        text-transform: capitalize;
    }
</style>
