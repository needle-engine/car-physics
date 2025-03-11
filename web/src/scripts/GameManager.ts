import { currentCarInstance, tracks, type Gamestate, gamestate, settings } from "$lib";
import { get } from "svelte/store";
import { AssetReference, AudioSource, Behaviour, BloomEffect, Camera, FileReference, findObjectOfType, findObjectsOfType, PostProcessingManager, ScreenSpaceAmbientOcclusion, ScreenSpaceAmbientOcclusionN8, serializable } from "@needle-tools/engine";
import { Object3D } from "three";
import { NEEDLE_ENGINE_MODULES } from "@needle-tools/engine";

class GameOption {
    @serializable()
    name: string = "";
    @serializable(FileReference)
    thumbnail!: FileReference;
    @serializable(AssetReference)
    asset!: AssetReference;
}

export class GameManager extends Behaviour {

    static get instance() {
        return this._instance;
    }
    private static _instance?: GameManager;

    static get state() {
        return get(gamestate)
    }
    static set state(value: Gamestate) {
        gamestate.set(value);
    }

    /**
     * Available cars to load
     */
    @serializable(GameOption)
    cars: GameOption[] = [];

    /**
     * Available levels to load
     */
    @serializable(GameOption)
    level: GameOption[] = [];

    get currentCar() {
        return this.cars[0];
    }

    private readonly _menuContent: Array<Object3D> = [];
    private readonly _instances: Array<Object3D | null> = [];

    awake() {
        // initialize state
        GameManager.state = "main-menu";
        this._menuContent.push(...this.gameObject.children);
        const opts = get(tracks);
        opts.length = 0;
        for (let i = 0; i < this.level.length; i++) {
            const level = this.level[i];
            opts.push({
                name: level.name,
                thumbnail: level.thumbnail.url,
                select: () => this.loadLevel(i)
            });
        }
        tracks.set(opts);
        NEEDLE_ENGINE_MODULES.POSTPROCESSING.ready().then(this.applySettings);
    }

    private _unsubscribeStateChanged?: (() => void);
    private _unsubscribeSettings?: (() => void);

    onEnable(): void {
        GameManager._instance = this;
        this._unsubscribeStateChanged = gamestate.subscribe(this.onGameStateChanged);
        this._unsubscribeSettings = settings.subscribe(this.applySettings);
    }
    onDisable(): void {
        GameManager._instance = undefined;
        this._unsubscribeStateChanged?.();
        this._unsubscribeSettings?.();
    }

    returnToMainMenu() {
        this.unloadPrevious();
        GameManager.state = "main-menu";
        this.context.time.timeScale = 1;
        for (const menu of this._menuContent) {
            menu.visible = true;
        }
        this.applySettings();
    }

    async loadLevel(index: number) {
        const level = this.level[index];

        if (!level) {
            console.error("Level not found");
            return false;
        }
        if (GameManager.state === "loading") {
            console.error("Already loading");
            return false;
        }

        this.unloadPrevious();

        GameManager.state = "loading";
        const carInstancePromise = this.currentCar.asset.instantiate();
        const levelPromise = level.asset.instantiate();

        const [carInstance, levelInstance] = await Promise.all([carInstancePromise, levelPromise]);
        this._instances.push(carInstance, levelInstance);

        if (!carInstance || !levelInstance) {
            GameManager.state = "main-menu";
            return false;
        }

        // Hide menu objects
        for (const menu of this._menuContent) {
            menu.visible = false;
        }
        // Add the loaded objects to the scene
        currentCarInstance.set(carInstance);
        this.context.scene.add(levelInstance);
        this.context.scene.add(carInstance);
        // Update state
        GameManager.state = "race-idle";
        this.applySettings();
        return true;

    }

    private unloadPrevious() {
        currentCarInstance.set(null);
        this._instances.forEach(i => {
            i?.destroy();
        });
        this._instances.length = 0;
    }

    private onGameStateChanged = (newState: Gamestate) => {
        switch (newState) {
            case "main-menu":
                this.returnToMainMenu();
                break;
        }
    }

    private applySettings = () => {
        console.debug("[GameManager] Applying settings");

        const value = get(settings);


        const postprocessing = findObjectsOfType(PostProcessingManager);
        for (const post of postprocessing) {
            post.enabled = value.postprocessing;
        }

        const bloomEffects = findObjectsOfType(BloomEffect);
        for (const effect of bloomEffects) {
            effect.enabled = value.bloom;
        }

        const aoEffects = [...findObjectsOfType(ScreenSpaceAmbientOcclusion), ...findObjectsOfType(ScreenSpaceAmbientOcclusionN8)];
        for (const effect of aoEffects) {
            effect.enabled = value.ao;
        }

        const audioSources = findObjectsOfType(AudioSource);
        if (audioSources?.length) {
            for (const audio of audioSources) {
                audio.volume = value.musicVolume;
            }
        }
    }
}
