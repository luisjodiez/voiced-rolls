# voiced-rolls-module
FoundryVTT Module for explicit voiced rolls

## Installation
1. Visit the [GitHub page](https://github.com/luisjodiez/voiced-rolls).
2. Click the green **Code** button and select **Download ZIP**.
3. Extract the ZIP file to access the `voiced-rolls` folder.
4. Copy the `voiced-rolls` folder.
5. Navigate to your FoundryVTT installation directory.
6. Open the `modules` folder inside your FoundryVTT directory.
7. Paste the `voiced-rolls` folder into the `modules` directory.
8. Launch FoundryVTT, open your game, and go to **Manage Modules** to enable **Voiced Rolls**.

## Usage
- This module voices dice rolls using the browser's speech synthesis API.
  - In linux this only works out of the box with the Google Chrome browser.
- Ensure your browser supports speech synthesis and has audio enabled.

## Configuration
You can configure the module settings via the FoundryVTT settings menu:

### Speech Language
- **Description**: The language to use for speech synthesis.
- **Default**: `es` (Spanish)
- **Valid Options**: `en` (English), `es` (Spanish), `fr` (French), `de` (German), `it` (Italian), `ja` (Japanese), `ko` (Korean), `zh` (Chinese), `ru` (Russian), `pt` (Portuguese)

### Speech Rate
- **Description**: The rate of speech synthesis.
- **Default**: `1.5`
- **Valid Range**: `0.1` to `10`

If invalid values are provided, the module will display a warning and fall back to the default settings.

## Contributing
- Fork the repository and create a new branch for your feature or fix.
- Submit a pull request with a clear description of your changes.

## License
This project is licensed under the GNU General Public License v3.0. See the [LICENSE](https://github.com/luisjodiez/voiced-rolls/blob/master/LICENSE) file for details.
