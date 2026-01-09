/**
 * Command to refresh GenerateBlocks CSS files.
 */

import { useState } from 'react';
import { useCommand } from '@wordpress/commands';
import apiFetch from '@wordpress/api-fetch';
import ProcessingModal from '../modals/ProcessingModal';
import { __ } from '@wordpress/i18n';

const CodeIcon = <svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 512.449 512.449"
			>
			<path fill="currentColor" d="M152.083 286.805c7.109-8.155 1.318-20.888-9.501-20.888H110.19a147.458 147.458 0 0 1-.329-9.692c0-80.706 65.658-146.364 146.363-146.364 38.784 0 74.087 15.168 100.304 39.877l45.676-53.435c-39.984-36.577-91.44-56.612-145.98-56.612-57.838 0-112.214 22.524-153.112 63.421-40.897 40.898-63.421 95.274-63.421 153.112 0 3.243.081 6.473.222 9.692H12.629c-10.819 0-16.611 12.733-9.501 20.888l61.549 70.6 12.928 14.829 46.416-53.242zM509.321 245.614l-45.907-52.658-28.57-32.771-40.791 46.789-33.686 38.64c-7.109 8.155-1.318 20.888 9.501 20.888h32.354c-5.293 75.928-68.748 136.086-145.997 136.086-33.721 0-64.811-11.469-89.586-30.703l-45.679 53.439c38.267 30.731 85.479 47.434 135.266 47.434 57.838 0 112.214-22.523 153.112-63.421 38.466-38.466 60.672-88.856 63.177-142.834h27.306c10.818-.001 16.609-12.734 9.5-20.889z" />
		</svg>;

/**
 * Hook to register the Flush Permalinks command.
 *
 * @return {JSX.Element|null} The FlushPermalinks component.
 */
export function FlushPermalinksCommand() {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ message, setMessage ] = useState( '' );
	const [ error, setError ] = useState( false );
	const [ warning, setWarning ] = useState( false );

	useCommand( {
		name: 'dlx-cmd-starter-flush-permalinks',
		label: 'Flush Permalinks',
		icon: CodeIcon,
		keywords: [ 'flush', 'permalinks', 'regenerate' ],
		callback: () => {
			setIsOpen( true );
			setIsLoading( true );
			setError( false );
			setWarning( false );
			setMessage( '' );

			apiFetch( {
				path: '/cmd-starter/v1/flush_permalinks',
				method: 'POST',
			} )
				.then( ( result ) => {
					setIsLoading( false );
					if ( result.success ) {
						setMessage( result.response || __( 'Permalinks flushed successfully.', 'cmd-starter' ) );
						setTimeout( () => {
							setIsOpen( false );
						}, 2000 );
					} else {
						setError( true );
						setMessage( result.response || __( 'Failed to flush permalinks.', 'cmd-starter' ) );
					}
				} )
				.catch( ( err ) => {
					setIsLoading( false );
					// Check if it's a permission error.
					if ( err.code === 'rest_forbidden' || err.status === 401 || err.status === 403 ) {
						setError( true );
						setMessage( __( 'You do not have permission to flush permalinks.', 'cmd-starter' ) );
					} else {
						setError( true );
						setMessage( err.message || __( 'An error occurred while flushing permalinks.', 'cmd-starter' ) );
					}
				} );
		},
		context: 'admin', // Works in both admin and block editor.
	} );
	return (
		<ProcessingModal
			title={ __( 'Flush Permalinks', 'cmd-starter' ) }
			processingMessage={ __( 'Flushing permalinks…', 'cmd-starter' ) }
			isOpen={ isOpen }
			onClose={ () => setIsOpen( false ) }
			isLoading={ isLoading }
			message={ message }
			error={ error }
			warning={ warning }
		/>
	);
}
