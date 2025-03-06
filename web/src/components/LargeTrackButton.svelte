<script lang="ts">
    export let onClick: (evt: Event) => void;
</script>

<button class="largebutton" on:click={onClick}>
    <span class="text">
        <slot></slot>
    </span>
</button>

<style>
    .largebutton {
        border: none;
        outline: none;
        box-shadow: none;
        border-radius: 0;
        margin: 0;

        display: flex;
        pointer-events: all;
        white-space: nowrap;

        color: white;
        font-size: 4rem;

        padding: 0.8rem;
        padding-left: 5rem;

        transition: all 1s;

        

        /* box-shadow: -10rem 0 5rem rgba(0, 0, 0, 0.8); */

        width: 100%;
        background-color: var(--button-bg);
        backdrop-filter: blur(10px);
        padding: .5rem 5rem;

        /* padding-right: 10rem; */
        /* background: linear-gradient(
            120deg,
            rgba(0, 10, 20, 1) 10%,
            rgba(0, 0, 0, 0) 90%
        ) !important; */

        &:hover {
            & > * {
                transform: translateX(0.5rem);
            }
        }
    }
    .text {
        margin-left: 1rem;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        transition: all 0.2s;
        text-transform: capitalize;
    }
</style>
