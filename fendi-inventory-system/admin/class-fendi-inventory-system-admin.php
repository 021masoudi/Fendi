<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://example.com/
 * @since      1.0.0
 *
 * @package    Fendi_Inventory_System
 * @subpackage Fendi_Inventory_System/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Fendi_Inventory_System
 * @subpackage Fendi_Inventory_System/admin
 * @author     Your Name <email@example.com>
 */
class Fendi_Inventory_System_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/fendi-inventory-system-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/fendi-inventory-system-admin.js', array( 'wp-element', 'wp-i18n' ), $this->version, true );

		wp_set_script_translations( $this->plugin_name, 'fendi-inventory-system', plugin_dir_path( __FILE__ ) . '../languages' );

		wp_localize_script(
			$this->plugin_name,
			'wpApiSettings',
			array(
				'root'  => esc_url_raw( rest_url() ),
				'nonce' => wp_create_nonce( 'wp_rest' ),
			)
		);

	}

	/**
	 * Add the admin menu page.
	 *
	 * @since    1.0.0
	 */
	public function add_admin_menu() {

		add_menu_page(
			__( 'Fendi Inventory System', 'fendi-inventory-system' ),
			__( 'Fendi Inventory', 'fendi-inventory-system' ),
			'manage_options',
			$this->plugin_name,
			array( $this, 'display_admin_page' ),
			'dashicons-store',
			58
		);

	}

	/**
	 * Display the admin page.
	 *
	 * @since    1.0.0
	 */
	public function display_admin_page() {
		?>
		<div id="fendi-inventory-system-admin"></div>
		<?php
	}

}
