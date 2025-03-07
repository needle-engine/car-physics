<script>
    import { settings, updateSettings } from "$lib";
    import { get } from "svelte/store";
    import Icon from "./Icon.svelte";
</script>

<button
    on:click={() => {
        updateSettings({
            postprocessing: !get(settings).postprocessing,
        });
    }}
>
    {#if $settings.postprocessing}
        <Icon name="check" />
        Postprocessing ON
    {:else}
        <Icon name="close" />
        Postprocessing OFF
    {/if}
</button>

<input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value="{$settings.musicVolume}"
    on:input={(evt) => {
        /** @ts-ignore */
        const newValue = parseFloat(evt.target.value);
        updateSettings({
            musicVolume: newValue,
        });
    }}
/>
