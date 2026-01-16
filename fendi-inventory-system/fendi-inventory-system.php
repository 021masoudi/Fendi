<?php
/**
 * Plugin Name: Fendi Inventory System
 * Plugin URI: https://example.com/
 * Description: A Unified WooCommerce Integrated Plugin for In-Store Sales and Inventory Management.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com/
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: fendi-inventory-system
 * Domain Path: /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'FENDI_INVENTORY_SYSTEM_FILE', __FILE__ );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-fendi-inventory-system.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_fendi_inventory_system() {

	$plugin = new Fendi_Inventory_System();
	$plugin->run();

}
run_fendi_inventory_system();
