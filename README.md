# CMD Starter

A WordPress plugin for starting a command palette plugin.

## Development

### Requirements

- PHP 7.4 or higher
- Node.js 14 or higher
- Composer

### Setup

1. Install dependencies:
```bash
npm install
composer install
```

2. Build assets:
```bash
npm run build
```

### Available Scripts

- `npm run build` - Build production assets
- `npm run start` - Start development server with hot reload
- `npm run lint:js` - Lint JavaScript files
- `npm run lint:css` - Lint CSS files
- `npm run format` - Format code

## Structure

The plugin follows PSR-4 autoloading standards:

- `cmd-starter.php` - Main plugin file
- `php/` - PHP classes (PSR-4 namespace: `CMDStarter`)
- `php/includes/Functions.php` - Main functions class
- `src/` - JavaScript source files
- `build/` - Compiled JavaScript assets (generated)
- `vendor/` - Composer dependencies (generated)
