<script lang="ts">
    export let text : string | number;
</script>

{#key text}
    <div class="countdown">
        <span>
            {text}
        </span>
    </div>
{/key}

<style>
    @keyframes fadeinBig {
        from {
            opacity: 0;
            transform: scale(1.5);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    .countdown {
        pointer-events: none;

        position: absolute;
        left: 50%;
        top: 50%;

        font-size: 7rem;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 1rem black;

        transform: translate(-50%, -50%);
    }

    span {
        display: block;
        animation: fadeinBig 0.5s forwards;
    }
</style>
