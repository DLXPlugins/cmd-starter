<?php
/**
 * Functions class for CMD Starter.
 *
 * @package CMDStarter
 */

namespace CMDStarter\includes;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Functions class.
 */
class Functions {

	/**
	 * Initialize the class.
	 */
	public function init() {
		// Add actions and filters here.
		add_action( 'init', array( $this, 'register_assets' ) );
	}

	/**
	 * Register plugin assets.
	 */
	public function register_assets() {
		// Register scripts and styles here.
		$asset_file = CMD_STARTER_PATH . 'build/index.asset.php';
		
		if ( file_exists( $asset_file ) ) {
			$asset = include $asset_file;
			
			wp_register_script(
				'cmd-starter',
				CMD_STARTER_URL . 'build/index.js',
				$asset['dependencies'],
				$asset['version'],
				true
			);
		}
	}
}
