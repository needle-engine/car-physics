# Needle Engine Car Physics

This repository contains the Needle Engine car physics package as published to NPM as well as an example project with Unity and sveltekit.

⚠️ Note: This project uses Needle Engine 4.4 alpha and might change in future updates.

# Features
- **Physical Car Model** for Needle Engine (three.js)
- **Works with any model** thanks for our automatic car detection:   
    *The CarPhysics component does automatically search for wheel objects and if none are found a default car rig is created*
- **Car Controller** component to quickly get started with keyboard and gamepad support
- **Car Radio** component to stream music (e.g. from lastfm)
- **Drag-Drop** component to drop any model on your website to drive around
- *Can be used with Unity to create filters, animations, materials...*


# Demo

https://github.com/user-attachments/assets/56ab8a16-b4ef-4078-951e-ba8cd60af692

## Live Examples
- [Car Example: Basic Car (Stackblitz)](https://stackblitz.com/edit/needle-engine-car-physics?file=src%2Fmain.ts,README.md)
- [Car Example: Suzanna (Stackblitz)](https://stackblitz.com/edit/needle-engine-suzanna-car?file=src%2Fmain.ts)



# Getting Started

1) Run `npm i @needle-tools/car-physics` in your web project.
2) Add the `CarPhysics` component to the root of your car model in your needle engine scene
3) Optional: Add the `CarController` component to the root of your car model   

If you're using Unity with Needle Engine 4.4 or newer the necessary Unity components will be installed as an immutable package to your Unity project so you can get started immediately.


# Contributing
The source for car physics can be found in the [npm car physics folder](./npm-car-physics). Instead of installing the package from NPM you can install this folder in your web project to modify it.    

# Contact

<b>[needle — tools for unity](https://needle.tools)</b> •
[@NeedleTools](https://twitter.com/NeedleTools) •
[Forum](https://forum.needle.tools) •
[Youtube](https://www.youtube.com/@needle-tools)
