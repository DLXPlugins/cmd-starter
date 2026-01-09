/**
 * Modal for processing.
 */

import { Modal, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * ProcessingModal component.
 *
 * @param {Object}   props           - Component props.
 * @param {string}   props.title     - Title of the modal.
 * @param {string}   props.processingMessage - Message to display while processing.
 * @param {boolean}  props.isOpen    - Boolean to control modal visibility.
 * @param {Function} props.onClose   - Callback when modal is closed.
 * @param {boolean}  props.isLoading - Boolean indicating loading state.
 * @param {string}   props.message   - Message to display.
 * @param {boolean}  props.error     - Boolean indicating error state.
 * @param {boolean}  props.warning   - Boolean indicating warning state.
 * @return {JSX.Element|null} The ProcessingModal component.
 */
const ProcessingModal = ( { title, processingMessage, isOpen, onClose, isLoading, message, error, warning } ) => {
	if ( ! isOpen ) {
		return null;
	}

	// Determine message color.
	let messageColor = '#00a32a'; // Success color.
	if ( error ) {
		messageColor = '#d63638'; // Error color.
	} else if ( warning ) {
		messageColor = '#dba617'; // Warning color.
	}

	return (
		<Modal
			isDismissible={ ! isLoading }
			shouldCloseOnClickOutside={ false }
			onRequestClose={ () => {
				onClose();
			} }
			title={ title }
		>
			{ isLoading && (
				<div style={ { display: 'flex', alignItems: 'center', gap: '10px' } }>
					<Spinner />
					<p>{ processingMessage }</p>
				</div>
			) }
			{ ! isLoading && message && (
				<p style={ { color: messageColor } }>
					{ message }
				</p>
			) }
		</Modal>
	);
};

export default ProcessingModal;
