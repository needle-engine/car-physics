<script>
    import { settings, updateSettings } from "$lib";
    import { get } from "svelte/store";
    import Icon from "../Icon.svelte";
</script>

<input
    id="musicVolume"
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={$settings.musicVolume}
    data-label="Music Volume"
    on:input={(evt) => {
        /** @ts-ignore */
        const newValue = parseFloat(evt.target.value);
        updateSettings({
            musicVolume: newValue,
        });
    }}
/>

<button
    on:click={() => {
        updateSettings({
            postprocessing: !get(settings).postprocessing,
        });
    }}
>
    {#if $settings.postprocessing}
        <Icon name="filter_tilt_shift" />
        Postprocessing ON
    {:else}
        <Icon name="filter_tilt_shift" />
        Postprocessing OFF
    {/if}
</button>

<label class="form-control" data-disabled={!$settings.postprocessing}>
    <input type="checkbox" bind:checked={$settings.bloom} />
    <span>
        <!-- <Icon name="wb_iridescent" /> -->
        Bloom
    </span>
</label>

<label class="form-control" data-disabled={!$settings.postprocessing}>
    <input type="checkbox" bind:checked={$settings.ao} />
    <span>
        Ambient Occlusion
    </span>
</label>

<!-- <button
    disabled={!$settings.postprocessing}
    on:click={() => {
        updateSettings({
            bloom: !get(settings).bloom,
        });
    }}
>
    {#if $settings.bloom}
        <Icon name="wb_iridescent" />
        Bloom ON
    {:else}
        <Icon name="wb_iridescent" />
        Bloom OFF
    {/if}
</button>

<button
    disabled={!$settings.postprocessing}
    on:click={() => {
        updateSettings({
            ao: !get(settings).ao,
        });
    }}
>
    {#if $settings.ao}
        <Icon name="gradient" />
        Ambient Occlusion ON
    {:else}
        <Icon name="gradient" />
        Ambient Occlusion OFF
    {/if}
</button> -->
