# voiced-rolls-module
Foundry VTT module for explicit voiced dice rolls and accessibility.

## Overview
**Voiced Rolls** vocalizes dice rolls using the browser's Web Speech API. It detects chat rolls natively, captures dice, modifiers, and totals, and announces special system outcomes (criticals, opportunities, complications, move tiers).

- **System Agnostic**: Works out of the box with any Foundry VTT system.
- **Dedicated System Adapters**:
  - **D&D 5e (`dnd5e`)**: Captures d20 tests, advantage/disadvantage, modifiers, and Critical Hits / Fumbles.
  - **Cosmere RPG (`cosmere-rpg`)**: Captures skill tests, modifiers, and **Plot Die** results (Opportunities and Complications).
  - **PbtA / Dungeon World (`pbta`)**: Captures 2d6 move rolls and announces outcome tiers (10+ full success, 7-9 mixed success, 6- miss).
- **Decoupled from 3D Dice**: Dice So Nice (`dice-so-nice`) is **not required**. If installed, an optional setting synchronizes speech with 3D dice animations.
- **Privacy & Permission Aware**: Respects Foundry visibility permissions (`isContentVisible`). Hidden/blind GM rolls will never be vocalized to players.

## Installation
1. Visit the [GitHub page](https://github.com/luisjodiez/voiced-rolls).
2. Download the release or clone the repository into your Foundry `Data/modules/voiced-rolls` directory.
3. Launch Foundry VTT and enable **Voiced Rolls** in **Manage Modules**.

## Usage
- This module voices dice rolls using the browser's Web Speech API (`SpeechSynthesis`).
- On Linux, speech synthesis works out of the box in Google Chrome and Chromium-based browsers.
- Ensure audio is enabled and permitted in your browser tab.

## Configuration
Configure the module settings via **Configure Settings -> Module Settings -> Voiced Rolls**:

- **Speech Language**: Language for speech synthesis and text formatting (Default: `es` / Spanish).
- **Speech Rate**: Speech playback speed (Default: `1.5`, range `0.1` to `3.0`).
- **Voice Scope**:
  - `Only My Rolls` (Default): Only vocalizes rolls made by your client.
  - `All Visible Rolls`: Vocalizes all rolls visible in the chat log.
  - `My Rolls & Public GM Rolls`: Vocalizes your own rolls plus public GM rolls.
- **Detail Level**:
  - `Detailed` (Default): Announces dice results, modifiers, and total (e.g. *"Dado: 14, más 3. Total: 17."*).
  - `Standard`: Announces dice results and total.
  - `Minimal`: Announces total only (e.g. *"Total: 17."*).
- **Announce Special Outcomes**: When enabled, announces critical hits, fumbles, opportunities, and complications.
- **Sync with Dice So Nice**: If Dice So Nice is active, delays speech start until 3D dice roll on screen.

## Contributing
- All source code, identifiers, and comments must be in **English**.
- Spoken strings and UI settings are translated via Foundry i18n files (`languages/es.json` and `languages/en.json`), with Spanish as the default.
- Submit a pull request with a clear description of your changes.

## License
This project is licensed under the GNU General Public License v3.0. See [LICENSE](LICENSE) for details.
