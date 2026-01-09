/**
 * Command to refresh GenerateBlocks CSS files.
 */

import { useState } from 'react';
import { useCommand } from '@wordpress/commands';
import apiFetch from '@wordpress/api-fetch';
import ProcessingModal from '../modals/ProcessingModal';
import { __ } from '@wordpress/i18n';


/**
 * Hook to register the Enable Plugin Panel Multisite Command.
 *
 * @return {JSX.Element|null} The EnablePluginPanelMultisiteCommand component.
 */
export function EnablePluginPanelMultisiteCommand() {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ message, setMessage ] = useState( '' );
	const [ error, setError ] = useState( false );
	const [ warning, setWarning ] = useState( false );

	useCommand( {
		name: 'dlx-cmd-starter-enable-plugin-panel-multisite',
		label: 'Enable Plugins Panel for Admins',
		keywords: [ 'enable', 'plugins', 'panel', 'multisite' ],
		callback: () => {
			setIsOpen( true );
			setIsLoading( true );
			setError( false );
			setWarning( false );
			setMessage( '' );

			apiFetch( {
				path: '/cmd-starter/v1/enable_plugin_panel_multisite',
				method: 'POST',
			} )
				.then( ( result ) => {
					setIsLoading( false );
					if ( result.success ) {
						setMessage( result.response || __( 'Plugin panel multisite enabled successfully.', 'cmd-starter' ) );
						setTimeout( () => {
							setIsOpen( false );
						}, 2000 );
					} else {
						setError( true );
						setMessage( result.response || __( 'Failed to enable plugin panel multisite.', 'cmd-starter' ) );
					}
				} )
				.catch( ( err ) => {
					setIsLoading( false );
					// Check if it's a permission error.
					if ( err.code === 'rest_forbidden' || err.status === 401 || err.status === 403 ) {
						setError( true );
						setMessage( __( 'You do not have permission to enable the plugins panel for admins in multisite.', 'cmd-starter' ) );
					} else {
						setError( true );
						setMessage( err.message || __( 'An error occurred while enabling the plugins panel for admins in multisite.', 'cmd-starter' ) );
					}
				} );
		},
		context: 'admin', // Works in both admin and block editor.
	} );

	return (
		<ProcessingModal
			title={ __( 'Enable Plugins Panel for Admins', 'cmd-starter' ) }
			processingMessage={ __( 'Enabling plugins panel for admins…', 'cmd-starter' ) }
			isOpen={ isOpen }
			onClose={ () => setIsOpen( false ) }
			isLoading={ isLoading }
			message={ message }
			error={ error }
			warning={ warning }
		/>
	);
}
