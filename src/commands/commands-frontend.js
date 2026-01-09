/**
 * Frontend commands registration.
 */
import { createRoot } from 'react-dom/client';
import { registerPlugin } from '@wordpress/plugins';
import { FlushPermalinksCommand } from './components/commands/FlushPermalinks';
import { ClearCacheCommand } from './components/commands/ClearCache';

/**
 * Commands frontend component.
 *
 * @return {JSX.Element|null} The CommandsFrontend component.
 */
const CommandsFrontend = () => {
	const ClearCacheModal = ClearCacheCommand();
	const FlushPermalinksModal = FlushPermalinksCommand();
	return (
		<>
			{ ClearCacheModal }
			{ FlushPermalinksModal }
		</>
	);
};

registerPlugin( 'dlx-cmd-starter-commands-frontend', {
	render: CommandsFrontend,
} );
const rootElement = document.getElementById( 'cmds-frontend' );
if ( rootElement ) {
	const root = createRoot( rootElement );
	root.render( <CommandsFrontend /> );
}
