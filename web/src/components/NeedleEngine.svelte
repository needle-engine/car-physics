<script lang="ts">
    import { onMount } from "svelte";

    /**
     * By default we rely on codegen (gen.js) which is produced by Unity and automatically sets the src url to the last root scene that was exported.
     * This can also be hardcoded by setting the src prop to a local (or remote) glb url that contains your root game scene
     */

    export let src = "";

    onMount(async () => {
        await import("@needle-tools/engine");
        await import("../generated/gen.js");
        if (!src) {
            // in case no src is defined we use the global variable that is set inside of the codegen file gen.js
            src = globalThis["needle:codegen_files"] as any;
        }
    });
</script>

<needle-engine {src} {...$$props} />
