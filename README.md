# voiced-rolls-module

FoundryVTT Module for explicit voiced rolls

## Installation

### Manifest URL

To install the module using the Foundry VTT Setup menu, use the following Manifest URL:
`https://github.com/luisjodiez/voiced-rolls/releases/latest/download/module.json`

### Manual Installation

1. Visit the [Releases page](https://github.com/luisjodiez/voiced-rolls/releases).
2. Download the `module.zip` for the latest release.
3. Extract the contents into your Foundry VTT `Data/modules/voiced-rolls` directory.

## Usage

- This module voices dice rolls using the browser's speech synthesis API.
- Ensure your browser supports speech synthesis and has audio enabled.
- **Note**: In Linux, this works most reliably with the Google Chrome browser.

## Configuration

Settings can be adjusted in the **Module Settings** menu within Foundry VTT:

### Speech Language

- **Default**: `es` (Spanish)
- **Supported**: `en`, `es`, `fr`, `de`, `it`, `ja`, `ko`, `zh`, `ru`, `pt`.

### Speech Rate

- **Default**: `1.5`
- **Range**: `0.1` (slow) to `10` (very fast).

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](https://github.com/luisjodiez/voiced-rolls/blob/master/LICENSE) file for details.
