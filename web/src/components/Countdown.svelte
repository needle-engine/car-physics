<script lang="ts">
    export let text = 5;
</script>

{#key text}
    <div class="countdown">
        {text}
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
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 5rem;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 10px black;
    }
</style>
