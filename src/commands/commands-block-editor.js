/**
 * Block editor commands registration.
 */

import { registerPlugin } from '@wordpress/plugins';
import { FlushPermalinksCommand } from './components/commands/FlushPermalinks';
import { ClearCacheCommand } from './components/commands/ClearCache';

/**
 * Commands block editor component.
 *
 * @return {JSX.Element} The CommandsBlockEditor component.
 */
const CommandsBlockEditor = () => {
	const ClearCacheModal = ClearCacheCommand();
	const FlushPermalinksModal = FlushPermalinksCommand();
	return (
		<>
			{ ClearCacheModal }
			{ FlushPermalinksModal }
		</>
	);
};

registerPlugin( 'dlx-cmd-starter-commands-block-editor', {
	render: CommandsBlockEditor,
} );

