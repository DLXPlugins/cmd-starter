/**
 * Admin-wide commands registration.
 */

import { createRoot } from 'react-dom/client';
import { registerPlugin } from '@wordpress/plugins';
import { EnablePluginPanelMultisiteCommand } from './components/commands/EnablePluginPanelMultisite';
import { ClearCacheCommand } from './components/commands/ClearCache';

/**
 * Commands admin component.
 *
 * @return {JSX.Element|null} The CommandsAdmin component.
 */
const CommandsAdmin = () => {
	const EnablePluginPanelMultisiteModal = EnablePluginPanelMultisiteCommand();
	const ClearCacheModal = ClearCacheCommand();
	return (
		<>
			{ EnablePluginPanelMultisiteModal }
			{ ClearCacheModal }
		</>
	);
};

// Works in the block editor.
registerPlugin( 'dlx-cmd-starter-commands-admin', {
	render: CommandsAdmin,
} );

// Works in the admin area (non-block editor).
// Attach to admin footer div.
const rootElement = document.getElementById( 'cmds-admin' );
if ( rootElement ) {
	const root = createRoot( rootElement );
	root.render( <CommandsAdmin /> );
}
