<?php
/**
 * Functions class for CMD Starter.
 *
 * @package CMDStarter
 */

namespace CMDStarter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Functions class.
 */
class Enqueue {
	public function run() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_commands' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_commands' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_network_admin_commands' ) );
		add_action( 'admin_footer', array( $this, 'admin_commands_footer' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_commands' ) );
		add_action( 'wp_footer', array( $this, 'frontend_commands_footer' ) );
	}

	/**
	 * Enqueue network admin commands.
	 */
	public function enqueue_network_admin_commands() {
		if ( ! current_user_can( 'manage_network' ) || ! is_network_admin() ) {
			return;
		}

		$deps = require Functions::get_plugin_dir( 'build/cmds-network.asset.php' );
		wp_enqueue_script(
			'cmds-network',
			Functions::get_plugin_url( 'build/cmds-network.js' ),
			$deps['dependencies'],
			$deps['version'],
			true
		);
	}

	/**
	 * Enqueue block editor commands.
	 */
	public function enqueue_block_editor_commands() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$deps = require Functions::get_plugin_dir( 'build/cmds-block-editor.asset.php' );
		wp_enqueue_script(
			'cmds-block-editor',
			Functions::get_plugin_url( 'build/cmds-block-editor.js' ),
			$deps['dependencies'],
			$deps['version'],
			true
		);
	}

	/**
	 * Enqueue admin-wide commands.
	 */
	public function enqueue_admin_commands() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( get_current_screen()->is_block_editor() || is_network_admin() ) {
			return;
		}

		$deps = require Functions::get_plugin_dir( 'build/cmds-admin.asset.php' );
		wp_enqueue_script(
			'cmds-admin',
			Functions::get_plugin_url( 'build/cmds-admin.js' ),
			$deps['dependencies'],
			$deps['version'],
			true
		);
	}

	/**
	 * Add hidden div for admin-wide command palette.
	 */
	public function admin_commands_footer() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		echo '<div id="cmds-admin" style="display: none; visibility: hidden; position: absolute; top: 0; left: 0; width: 0; height: 0; overflow: hidden;"></div>';
	}

	/**
	 * Add hidden div for frontend command palette.
	 */
	public function frontend_commands_footer() {
		if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
			return;
		}
		echo '<div id="cmds-frontend" style="display: none; visibility: hidden; position: absolute; top: 0; left: 0; width: 0; height: 0; overflow: hidden;"></div>';
	}

	/**
	 * Enqueue frontend commands (optional).
	 *
	 * Note: WordPress doesn't officially support command palette on frontend,
	 * but we can manually enqueue assets and initialize it.
	 */
	public function enqueue_frontend_commands() {
		if ( ! is_user_logged_in() ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		// Enqueue WordPress command palette assets (WordPress 6.9+).
		// Only call if not already enqueued (check if wp-commands script is already queued).
		if ( function_exists( 'wp_enqueue_command_palette_assets' ) && ! wp_script_is( 'wp-commands', 'enqueued' ) ) {
			wp_enqueue_command_palette_assets();
		}

		// Enqueue our frontend commands script.
		$deps = require Functions::get_plugin_dir( 'build/cmds-frontend.asset.php' );
		wp_enqueue_script(
			'cmds-frontend',
			Functions::get_plugin_url( 'build/cmds-frontend.js' ),
			$deps['dependencies'],
			$deps['version'],
			true
		);

		// Needed to clear up some potential conflicts with other plugins.
		wp_add_inline_style(
			'wp-commands',
			'.commands-command-menu__container .has-icon:not(.components-button) {
				width: inherit;
				height: inherit;
			}'
		);
	}
}
