/**
 * Command to refresh GenerateBlocks CSS files.
 */

import { useState } from 'react';
import { useCommand } from '@wordpress/commands';
import apiFetch from '@wordpress/api-fetch';
import ProcessingModal from '../modals/ProcessingModal';
import { __ } from '@wordpress/i18n';

/**
 * Hook to register the Clear Cache command.
 *
 * @return {JSX.Element|null} The ClearCache component.
 */
export function ClearCacheCommand() {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ message, setMessage ] = useState( '' );
	const [ error, setError ] = useState( false );
	const [ warning, setWarning ] = useState( false );

	useCommand( {
		name: 'dlx-cmd-starter-clear-cache',
		label: 'Clear Cache',
		keywords: [ 'clear', 'cache', 'regenerate' ],
		callback: () => {
			setIsOpen( true );
			setIsLoading( true );
			setError( false );
			setWarning( false );
			setMessage( '' );

			apiFetch( {
				path: '/cmd-starter/v1/clear_cache',
				method: 'POST',
			} )
				.then( ( result ) => {
					setIsLoading( false );
					if ( result.success ) {
						setMessage( result.response || __( 'Cache cleared successfully.', 'cmd-starter' ) );
						setTimeout( () => {
							setIsOpen( false );
						}, 2000 );
					} else {
						setError( true );
						setMessage( result.response || __( 'Failed to clear cache.', 'cmd-starter' ) );
					}
				} )
				.catch( ( err ) => {
					setIsLoading( false );
					// Check if it's a permission error.
					if ( err.code === 'rest_forbidden' || err.status === 401 || err.status === 403 ) {
						setError( true );
						setMessage( __( 'You do not have permission to clear cache.', 'cmd-starter' ) );
					} else {
						setError( true );
						setMessage( err.message || __( 'An error occurred while clearing cache.', 'cmd-starter' ) );
					}
				} );
		},
		context: 'admin', // Works in both admin and block editor.
	} );

	return (
		<ProcessingModal
			title={ __( 'Clear Cache', 'cmd-starter' ) }
			processingMessage={ __( 'Clearing cache…', 'cmd-starter' ) }
			isOpen={ isOpen }
			onClose={ () => setIsOpen( false ) }
			isLoading={ isLoading }
			message={ message }
			error={ error }
			warning={ warning }
		/>
	);
}
