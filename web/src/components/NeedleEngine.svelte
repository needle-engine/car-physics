<script lang="ts">
    import { onMount } from "svelte";

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

<needle-engine loading-style="light" {src} {...$$props} />
