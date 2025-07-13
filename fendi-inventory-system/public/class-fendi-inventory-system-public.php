<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://example.com/
 * @since      1.0.0
 *
 * @package    Fendi_Inventory_System
 * @subpackage Fendi_Inventory_System/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Fendi_Inventory_System
 * @subpackage Fendi_Inventory_System/public
 * @author     Your Name <email@example.com>
 */
class Fendi_Inventory_System_Public {

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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	_...skipping a few lines..._
	 * in that particular class.
	 *
	 * The Fendi_Inventory_System_Loader will then create the relationship
	 * between the defined hooks and the functions defined in this
	 * class.
	 */

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Fendi_Inventory_System_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Fendi_Inventory_System_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/fendi-inventory-system-public.js', array( 'jquery' ), $this->version, false );

		if ( is_page_template( 'public/fendi-login-template.php' ) ) {
			wp_enqueue_script(
				$this->plugin_name . '-login',
				plugin_dir_url( __FILE__ ) . 'js/fendi-inventory-system-login.js',
				array( 'wp-element', 'wp-i18n' ),
				$this->version,
				true
			);
			wp_localize_script(
				$this->plugin_name . '-login',
				'wpApiSettings',
				array(
					'root'  => esc_url_raw( rest_url() ),
					'nonce' => wp_create_nonce( 'wp_rest' ),
					'redirect_url' => admin_url( 'admin.php?page=fendi-inventory-system' ),
				)
			);
		}

		wp_add_inline_script( $this->plugin_name, "
			if ('serviceWorker' in navigator) {
				window.addEventListener('load', function() {
					navigator.serviceWorker.register('/wp-content/plugins/fendi-inventory-system/public/service-worker.js').then(function(registration) {
						console.log('ServiceWorker registration successful with scope: ', registration.scope);
					}, function(err) {
						console.log('ServiceWorker registration failed: ', err);
					});
				});
			}
		" );
	}

	public function add_manifest_link() {
		echo '<link rel="manifest" href="/wp-content/plugins/fendi-inventory-system/public/manifest.json">';
	}

}
