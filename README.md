# CMD Starter

A WordPress plugin for starting a command palette plugin.

![dlx-flush-permalinks](https://github.com/user-attachments/assets/4fdadb5e-5cc1-4f2e-8872-6476cee5183b)


## Available Starter Commands

- Flush Permalinks
- Clear Cache
- Enable Plugins for Admins (Multisite)

Commands run in the:
- Block Editor
- Admin Panel
- Network Admin Panel
- Frontend

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
- `php/Commands.php` - REST API endpoints for commands
- `php/Functions.php` - Main functions class
- `src/` - JavaScript source files
- `src/commands/` - Command palette components
  - `commands-admin.js` - Admin area commands registration
  - `commands-block-editor.js` - Block editor commands registration
  - `commands-frontend.js` - Frontend commands registration
  - `commands-network.js` - Network admin commands registration
  - `components/commands/` - Individual command components
  - `components/modals/` - Modal components for commands
- `build/` - Compiled JavaScript assets (generated)
- `vendor/` - Composer dependencies (generated)

## Adding Additional Commands

This plugin uses Webpack to bundle command files for different contexts (admin, block editor, frontend, network). Each command requires both a React component and a PHP REST API endpoint.

### Step 1: Create a Command Component

Create a new React component file in `src/commands/components/commands/YourCommandName.js`:

```javascript
/**
 * Command to [describe your command].
 */

import { useState } from 'react';
import { useCommand } from '@wordpress/commands';
import apiFetch from '@wordpress/api-fetch';
import ProcessingModal from '../modals/ProcessingModal';
import { __ } from '@wordpress/i18n';

// Optional: Add an icon (SVG element).
const YourIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
	<path d="..." />
</svg>;

/**
 * Hook to register the [Your Command Name] command.
 *
 * @return {JSX.Element|null} The YourCommandName component.
 */
export function YourCommandNameCommand() {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ message, setMessage ] = useState( '' );
	const [ error, setError ] = useState( false );
	const [ warning, setWarning ] = useState( false );

	useCommand( {
		name: 'dlx-cmd-starter-your-command-name',
		label: 'Your Command Label',
		icon: YourIcon, // Optional: Remove if no icon needed.
		keywords: [ 'keyword1', 'keyword2', 'keyword3' ],
		callback: () => {
			setIsOpen( true );
			setIsLoading( true );
			setError( false );
			setWarning( false );
			setMessage( '' );

			apiFetch( {
				path: '/cmd-starter/v1/your_command_name',
				method: 'POST',
			} )
				.then( ( result ) => {
					setIsLoading( false );
					if ( result.success ) {
						setMessage( result.response || __( 'Command executed successfully.', 'cmd-starter' ) );
						setTimeout( () => {
							setIsOpen( false );
						}, 2000 );
					} else {
						setError( true );
						setMessage( result.response || __( 'Failed to execute command.', 'cmd-starter' ) );
					}
				} )
				.catch( ( err ) => {
					setIsLoading( false );
					// Check if it's a permission error.
					if ( err.code === 'rest_forbidden' || err.status === 401 || err.status === 403 ) {
						setError( true );
						setMessage( __( 'You do not have permission to execute this command.', 'cmd-starter' ) );
					} else {
						setError( true );
						setMessage( err.message || __( 'An error occurred while executing the command.', 'cmd-starter' ) );
					}
				} );
		},
		context: 'admin', // Options: 'admin', 'site-editor', 'view'. Use 'admin' for both admin and block editor.
	} );

	return (
		<ProcessingModal
			title={ __( 'Your Command Title', 'cmd-starter' ) }
			processingMessage={ __( 'Processing command…', 'cmd-starter' ) }
			isOpen={ isOpen }
			onClose={ () => setIsOpen( false ) }
			isLoading={ isLoading }
			message={ message }
			error={ error }
			warning={ warning }
		/>
	);
}
```

### Step 2: Register the Command Component

Import and register your command in the appropriate registration file:

#### For Admin Area Commands
Add to `src/commands/commands-admin.js`:

```javascript
import { YourCommandNameCommand } from './components/commands/YourCommandName';

// Inside the CommandsAdmin component:
const YourCommandModal = YourCommandNameCommand();
return (
	<>
		{ YourCommandModal }
		{ /* ... other commands */ }
	</>
);
```

#### For Block Editor Commands
Add to `src/commands/commands-block-editor.js`:

```javascript
import { YourCommandNameCommand } from './components/commands/YourCommandName';

// Inside the CommandsBlockEditor component:
const YourCommandModal = YourCommandNameCommand();
return (
	<>
		{ YourCommandModal }
		{ /* ... other commands */ }
	</>
);
```

#### For Frontend Commands
Add to `src/commands/commands-frontend.js`:

```javascript
import { YourCommandNameCommand } from './components/commands/YourCommandName';

// Inside the CommandsFrontend component:
const YourCommandModal = YourCommandNameCommand();
return (
	<>
		{ YourCommandModal }
		{ /* ... other commands */ }
	</>
);
```

#### For Network Admin Commands
Add to `src/commands/commands-network.js`:

```javascript
import { YourCommandNameCommand } from './components/commands/YourCommandName';

// Inside the CommandsNetwork component:
const YourCommandModal = YourCommandNameCommand();
return (
	<>
		{ YourCommandModal }
		{ /* ... other commands */ }
	</>
);
```

### Step 3: Create the PHP REST API Endpoint

Add your REST API endpoint in `php/Commands.php`:

1. Register the route in the `register_commands()` method:

```php
/**
 * Register the commands.
 */
public function register_commands() {
	// Your command endpoint.
	register_rest_route(
		'cmd-starter/v1',
		'/your_command_name',
		array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'your_command_name' ),
			'permission_callback' => function () {
				return current_user_can( 'manage_options' ); // Adjust capability as needed.
			},
		)
	);

	// ... other routes.
}
```

2. Add the callback method:

```php
/**
 * Execute your command.
 *
 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
 */
public function your_command_name() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return new \WP_Error( 'rest_forbidden', __( 'You are not allowed to execute this command.', 'cmd-starter' ), array( 'status' => 403 ) );
	}

	// Execute your command logic here.

	return new \WP_REST_Response(
		array(
			'success'  => true,
			'response' => __( 'Command executed successfully.', 'cmd-starter' ),
		),
		200
	);
}
```

### Step 4: Build Assets

After making changes, rebuild the assets:

```bash
npm run build
```

Or during development, use:

```bash
npm run start
```

### Step 5: ZIP Assets.

Run:

```bash
npm run zip
```

### Webpack Entry Points

The `webpack.config.js` defines multiple entry points that correspond to different WordPress contexts:
- `cmds-block-editor` - Loaded in the block editor.
- `cmds-admin` - Loaded in the admin area (non-block editor).
- `cmds-frontend` - Loaded on the frontend.
- `cmds-network` - Loaded in the network admin area.

Make sure to register your command in the appropriate registration file so it's bundled in the correct entry point.
