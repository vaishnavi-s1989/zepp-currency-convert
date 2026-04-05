# Currency Converter for ZeppOS (API 3.0)

A fully functional currency conversion app compatible with Amazfit Bip 6 and other ZeppOS 3.0 devices.

## Features

- **10 Major Currencies**: USD, EUR, GBP, JPY, CNY, INR, AUD, CAD, CHF, SGD
- **Real-time Conversion**: Instant currency conversion with hardcoded exchange rates
- **Picker-based Input**: Easy amount entry using PICKER widget (API 3.0 compatible)
- **Currency Selection**: Pick currencies using an intuitive picker widget
- **Swap Function**: Quickly swap between source and target currencies
- **Persistent State**: Remembers your last conversion settings
- **Clean UI**: Modern, easy-to-use interface optimized for watch screens

## Compatibility

- **API Level**: 3.0 (Compatible with Amazfit Bip 6)
- **Target Version**: 3.0.0
- **Minimum Version**: 3.0

## How to Use

1. **Enter Amount**: Tap the "Edit" button to select amount using the picker (integer and decimal parts)
2. **Select From Currency**: Tap the "From" currency button to choose your source currency
3. **Select To Currency**: Tap the "To" currency button to choose your target currency
4. **Swap Currencies**: Tap the swap button (⇅) to quickly reverse the conversion
5. **Convert**: Tap the "Convert" button to see the result (or it converts automatically)

## Currency Exchange Rates

The app uses hardcoded exchange rates with USD as the base currency:

- USD (US Dollar) - Base rate: 1.0
- EUR (Euro) - Rate: 0.92
- GBP (British Pound) - Rate: 0.79
- JPY (Japanese Yen) - Rate: 149.50
- CNY (Chinese Yuan) - Rate: 7.24
- INR (Indian Rupee) - Rate: 83.12 ⭐
- AUD (Australian Dollar) - Rate: 1.53
- CAD (Canadian Dollar) - Rate: 1.36
- CHF (Swiss Franc) - Rate: 0.88
- SGD (Singapore Dollar) - Rate: 1.34

**Note**: These are sample rates. For production use, you would need to integrate with a currency API or update rates regularly.

## Key Differences from v4.0

This version is specifically designed for API 3.0 compatibility:

1. **Amount Input**: Uses PICKER widget instead of SYSTEM_KEYBOARD (not available in API 3.0)
   - Two-column picker for integer and decimal parts
   - Supports amounts from 1 to 9999.99

2. **API Compatibility**: All widgets and APIs are compatible with ZeppOS 3.0
   - No API 4.0+ features used
   - Tested for Amazfit Bip 6 compatibility

## Technical Details

### API Level
- Requires ZeppOS API Level 3.0
- Compatible with Amazfit Bip 6 and similar devices

### Permissions
- `device:os.local_storage` - For saving user preferences

### Key Components

1. **UI Widgets**:
   - TEXT widgets for labels and displays
   - BUTTON widgets for interactions
   - WIDGET_PICKER for amount and currency selection (API 3.0)

2. **Storage**:
   - LocalStorage for persisting user settings
   - Saves last used amount and currency selections

3. **Conversion Logic**:
   - Converts through USD as base currency
   - Formula: `(amount / fromRate) * toRate`

## File Structure

```
currency-convert-app-v3/
├── app.js                 # App lifecycle management
├── app.json              # App configuration (API 3.0)
├── package.json          # Dependencies
├── assets/               # App icons
│   ├── default.b/
│   ├── default.r/
│   └── default.s/
├── page/
│   ├── index.js          # Main page implementation
│   ├── index.r.layout.js # Layout configuration
│   └── i18n/
│       └── en-US.po      # Internationalization strings
└── README.md             # This file
```

## Building and Testing

1. Install ZeppOS CLI tools
2. Open the project in VS Code with ZeppOS extension
3. Use the simulator to test the app (select API 3.0 compatible device)
4. Build and deploy to your Amazfit Bip 6 or compatible watch

## Example Conversions

- $100 USD → ₹8,312.00 INR
- ₹1,000 INR → $12.03 USD
- €100 EUR → ₹9,034.78 INR
- £50 GBP → ₹5,260.76 INR

## Future Enhancements

- Add more currencies
- Integrate with live exchange rate API
- Add currency rate update functionality
- Support for cryptocurrency conversions
- Historical rate charts
- Favorite currency pairs
- Quick conversion presets

## License

This is a sample application for ZeppOS development.