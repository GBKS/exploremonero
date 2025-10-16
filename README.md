# Monero Explorer

A modern, privacy-focused Monero blockchain explorer built with Nuxt 4. Verify transactions in the Monero payment network with an intuitive and responsive interface. The explorer provides read-only access to blockchain data and does not store or transmit any private information.

---

## Migration notes

This is a refactored version of the original exploremonero.com created in 2018. The old version was built on CodeKit and not very open-source-y at all because I simply wasn't that familiar or comfortable with these workflows and tools. Thanks to AI for helping some of the migration (and then it made a big mess, and I had to manually step in, but still).

It was also dependend on the API from xmrchain.net ([source](https://github.com/moneroexamples/onion-monero-blockchain-explorer)), which was disabled at some point. This new version directly loads data from one or more public Monero nodes. One of the downsides is that the functionality to verify sends and receives that the xmrchain explorer provided is not so simple. So it has not been ported yet.

There also likely to be a bunch of bugs and minor issues at this moment in time. But we'll get there.

## Features

- 🔍 **Transaction Search** - Look up transactions by hash, block height, or payment ID
- 📊 **Block Explorer** - Browse blocks and view detailed block information
- 💰 **Transaction Details** - View comprehensive transaction data including inputs, outputs, and mixins (**NOT MIGRATED YET**)
- 🔐 **Receipt Verification** - Verify Monero payments using transaction proofs (**NOT MIGRATED YET**)
- 📈 **Mempool Monitoring** - View pending transactions in the mempool
- 🌍 **Multi-language Support** - Available in 9 languages (English, German, Spanish, Hungarian, Dutch, Polish, Portuguese, Turkish, Chinese)
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🌐 **Testnet Support** - Switch between mainnet and testnet
- ⚡ **Mock Data Mode** - Development mode with sample data for testing

## Tech Stack

- **Framework**: Nuxt 4 (Vue.js 3 with Composition API)
- **Styling**: SCSS
- **State Management**: Pinia
- **Internationalization**: @nuxtjs/i18n
- **Date Handling**: Luxon
- **TypeScript**: Full TypeScript support

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GBKS/exploremonero.com.git
cd exploremonero.com
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start Nuxt development server with hot reload
- `npm run build` - Build the project for production
- `npm run generate` - Generate static site (SSG)
- `npm run preview` - Preview the production build locally
- `npm run postinstall` - Prepare Nuxt (runs automatically after install)

## Development

### Project Structure

```
app/
├── components/          # Auto-imported Vue components
├── pages/              # File-based routing (Nuxt pages)
├── layouts/            # Layout components
├── composables/        # Auto-imported composables (API, utilities)
├── stores/             # Pinia store files
└── assets/             # SCSS stylesheets and other assets
i18n/
└── locales/            # Internationalization files
server/
└── api/                # Server-side API routes
public/
└── mock_data/          # Mock data for development
```

### Mock Data Mode

For development and testing, you can enable mock data mode to work with sample data instead of making real API calls:

#### Enable via Browser Console:
```javascript
config.useMockData = true;
```

#### Enable via API:
```javascript
gbks.api.enableMockData();
```

Mock data files are located in `public/mock_data/` and include sample responses for:
- Block information
- Transaction details
- Mempool data
- Network information
- Search results

### Adding New Languages

1. Create a new JSON file in `i18n/locales/` (e.g., `fr_FR.json`)
2. Add the language to the `i18n.locales` array in `nuxt.config.ts`
3. Translate all message keys following the existing structure

### Configuration

The main configuration is in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
  i18n: {
    // Internationalization configuration
  },
  // Other Nuxt configuration options
});
```

Application-specific configuration is in `app/composables/config.js`:

```javascript
export const config = {
    useMockData: true      // Enable/disable mock data
};
```

## API Integration

The explorer includes both client-side API calls and server-side API routes:

### Client-side API (via composables)
- Network information
- Block details  
- Transaction data
- Mempool transactions
- Search functionality

### Server-side API routes (`server/api/`)
- `/api/networkinfo` - Network information
- `/api/blocks` - Block listing
- `/api/block/[id]` - Block details
- `/api/transactions` - Transaction data
- `/api/transaction/[hash]` - Individual transaction
- `/api/mempool` - Mempool transactions
- `/api/search` - Search functionality

## Browser Support

- Modern browsers with ES6+ support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use Vue 3 Composition API with Nuxt 4 conventions
- Follow Nuxt file-based routing and auto-imports
- Add components to `app/components/` (auto-imported)
- Create composables in `app/composables/` (auto-imported) 
- Add appropriate SCSS styling in `app/assets/css/`
- Use Pinia stores in `app/stores/` for state management
- Ensure components are responsive and accessible
- Test with both mock data and real API endpoints
- Leverage Nuxt's server-side capabilities when needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the Monero community
- Inspired by the need for privacy-focused blockchain exploration tools
- Thanks to all contributors and the Vue.js ecosystem

## Links

- [Monero Official Website](https://www.getmonero.org/)
- [Monero Documentation](https://monerodocs.org/)
- [Nuxt Documentation](https://nuxt.com/docs)
- [Vue.js Documentation](https://vuejs.org/)
