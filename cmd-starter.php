<?php
/**
 * Plugin Name: CMD Starter
 * Plugin URI: https://github.com/DLXPlugins/cmd-starter
 * Description: A WordPress plugin for starting a command palette plugin.
 * Version: 1.0.0
 * Author: DLX Plugins
 * Author URI: https://dlxplugins.com
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: cmd-starter
 * Domain Path: /languages
 *
 * @package CMDStarter
 */

namespace CMDStarter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants.
define( 'CMD_STARTER_VERSION', '1.0.0' );
define( 'CMD_STARTER_FILE', __FILE__ );
define( 'CMD_STARTER_PATH', plugin_dir_path( __FILE__ ) );
define( 'CMD_STARTER_URL', plugin_dir_url( __FILE__ ) );

// Require Composer autoloader.
if ( file_exists( CMD_STARTER_PATH . 'vendor/autoload.php' ) ) {
	require_once CMD_STARTER_PATH . 'vendor/autoload.php';
}

/**
 * Initialize the plugin.
 */
function plugins_loaded() {
	$enqueue = new Enqueue();
	$enqueue->run();

	// Initialize Commands class.
	$commands = new Commands();
	$commands->run();
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\plugins_loaded' );
