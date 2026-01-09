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
 * Commands class.
 */
class Commands {
	/**
	 * Run the commands.
	 */
	public function run() {
		add_action( 'rest_api_init', array( $this, 'register_commands' ) );
	}

	/**
	 * Register the commands.
	 */
	public function register_commands() {
		// Flush Permalinks command.
		register_rest_route(
			'cmd-starter/v1',
			'/flush_permalinks',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'flush_permalinks' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		// Enable Plugin Panel Multisite command.
		register_rest_route(
			'cmd-starter/v1',
			'/enable_plugin_panel_multisite',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'enable_plugin_panel_multisite' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_network' );
				},
			)
		);

		// Clear Cache command.
		register_rest_route(
			'cmd-starter/v1',
			'/clear_cache',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'clear_cache' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
	}

	/**
	 * Flush the permalinks.
	 */
	public function flush_permalinks() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return new \WP_Error( 'rest_forbidden', __( 'You are not allowed to flush permalinks.', 'cmd-starter' ), array( 'status' => 403 ) );
		}

		flush_rewrite_rules( true );

		return new \WP_REST_Response(
			array(
				'success'  => true,
				'response' => __( 'Permalinks flushed successfully.', 'cmd-starter' ),
			),
			200
		);
	}

	/**
	 * Enable the plugin panel multisite.
	 */
	public function enable_plugin_panel_multisite() {
		if ( ! current_user_can( 'manage_network' ) ) {
			return new \WP_Error( 'rest_forbidden', __( 'You are not allowed to enable the plugins panel for admins.', 'cmd-starter' ), array( 'status' => 403 ) );
		}

		// Enable the plugins panel for admins.
		$menu_items            = get_site_option( 'menu_items', array() );
		$menu_items['plugins'] = 1;
		update_site_option( 'menu_items', $menu_items );

		return new \WP_REST_Response(
			array(
				'success'  => true,
				'response' => __( 'Plugins panel enabled successfully.', 'cmd-starter' ),
			),
			200
		);
	}

	/**
	 * Clear the cache.
	 */
	public function clear_cache() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return new \WP_Error( 'rest_forbidden', __( 'You are not allowed to clear the cache.', 'cmd-starter' ), array( 'status' => 403 ) );
		}

		// Clear WordPress cache.
		wp_cache_flush();
		do_action( 'cache_flush' );
		do_action( 'cache_cleared' );

		// Clear WP Rocket cache.
		if ( function_exists( 'rocket_clean_domain' ) ) {
			rocket_clean_domain();
		}

		return new \WP_REST_Response(
			array(
				'success'  => true,
				'response' => __( 'Cache cleared successfully.', 'cmd-starter' ),
			),
			200
		);
	}
}
