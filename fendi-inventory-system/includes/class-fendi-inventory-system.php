<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://example.com/
 * @since      1.0.0
 *
 * @package    Fendi_Inventory_System
 * @subpackage Fendi_Inventory_System/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Fendi_Inventory_System
 * @subpackage Fendi_Inventory_System/includes
 * @author     Your Name <email@example.com>
 */
class Fendi_Inventory_System {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Fendi_Inventory_System_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'FENDI_INVENTORY_SYSTEM_VERSION' ) ) {
			$this->version = FENDI_INVENTORY_SYSTEM_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'fendi-inventory-system';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->define_activation_hooks();

	}

	/**
	 * Define the activation and deactivation hooks.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_activation_hooks() {
		register_activation_hook( FENDI_INVENTORY_SYSTEM_FILE, array( $this, 'activate' ) );
		register_deactivation_hook( FENDI_INVENTORY_SYSTEM_FILE, array( $this, 'deactivate' ) );
	}

	/**
	 * The code that runs during plugin activation.
	 *
	 * @since    1.0.0
	 */
	public function activate() {
		$this->add_roles();
		flush_rewrite_rules();
	}

	/**
	 * The code that runs during plugin deactivation.
	 *
	 * @since    1.0.0
	 */
	public function deactivate() {
		$this->remove_roles();
		flush_rewrite_rules();
	}

	/**
	 * Add custom user roles.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function add_roles() {
		add_role(
			'warehouse_manager',
			__( 'Warehouse Manager', 'fendi-inventory-system' ),
			array(
				'read'         => true,
				'edit_posts'   => true,
				'delete_posts' => true,
			)
		);
		add_role(
			'cashier',
			__( 'Cashier', 'fendi-inventory-system' ),
			array(
				'read' => true,
			)
		);
		add_role(
			'accountant',
			__( 'Accountant', 'fendi-inventory-system' ),
			array(
				'read'         => true,
				'edit_posts'   => true,
				'delete_posts' => true,
			)
		);
	}

	/**
	 * Remove custom user roles.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function remove_roles() {
		remove_role( 'warehouse_manager' );
		remove_role( 'cashier' );
		remove_role( 'accountant' );
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Fendi_Inventory_System_Loader. Orchestrates the hooks of the plugin.
	 * - Fendi_Inventory_System_i18n. Defines internationalization functionality.
	 * - Fendi_Inventory_System_Admin. Defines all hooks for the admin area.
	 * - Fendi_Inventory_System_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-fendi-inventory-system-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-fendi-inventory-system-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-fendi-inventory-system-admin.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-fendi-inventory-system-supplier.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-fendi-inventory-system-purchase-order.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-fendi-inventory-system-settings.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-fendi-inventory-system-expense.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-fendi-inventory-system-transaction.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-fendi-inventory-system-public.php';

		/**
		 * The class responsible for defining all API routes.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-fendi-inventory-system-api.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-fendi-inventory-system-notifications.php';

		$this->loader = new Fendi_Inventory_System_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Fendi_Inventory_System_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Fendi_Inventory_System_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Fendi_Inventory_System_Admin( $this->get_plugin_name(), $this->get_version() );
		$plugin_api = new Fendi_Inventory_System_Api();

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'add_admin_menu' );
		$this->loader->add_action( 'rest_api_init', $plugin_api, 'register_routes' );
		$this->loader->add_action( 'init', $this, 'register_post_types' );
		$this->loader->add_action( 'add_meta_boxes', $plugin_admin, 'add_warehouse_inventory_metabox' );
		$this->loader->add_action( 'save_post_product', $plugin_admin, 'save_warehouse_inventory_metabox' );
		$this->loader->add_action( 'show_user_profile', $plugin_admin, 'render_user_warehouse_field' );
		$this->loader->add_action( 'edit_user_profile', $plugin_admin, 'render_user_warehouse_field' );
		$this->loader->add_action( 'personal_options_update', $plugin_admin, 'save_user_warehouse_field' );
		$this->loader->add_action( 'edit_user_profile_update', $plugin_admin, 'save_user_warehouse_field' );

		// Loyalty Program Hooks
		$this->loader->add_action( 'woocommerce_order_status_completed', array( $plugin_api, 'add_loyalty_points' ), 10, 1 );

		// Login Redirect Hook
		$this->loader->add_filter('login_redirect', array( $this, 'fendi_login_redirect'), 10, 3);

		// Block WP Admin access for non-admins
		$this->loader->add_action('admin_init', array($this, 'block_wp_admin_access'));
	}

	/**
	 * Register the custom post types for the plugin.
	 *
	 * @since    1.0.0
	 */
	public function register_post_types() {
		$labels = array(
			'name'                  => _x( 'Warehouses', 'Post type general name', 'fendi-inventory-system' ),
			'singular_name'         => _x( 'Warehouse', 'Post type singular name', 'fendi-inventory-system' ),
			'menu_name'             => _x( 'Warehouses', 'Admin Menu text', 'fendi-inventory-system' ),
			'name_admin_bar'        => _x( 'Warehouse', 'Add New on Toolbar', 'fendi-inventory-system' ),
			'add_new'               => __( 'Add New', 'fendi-inventory-system' ),
			'add_new_item'          => __( 'Add New Warehouse', 'fendi-inventory-system' ),
			'new_item'              => __( 'New Warehouse', 'fendi-inventory-system' ),
			'edit_item'             => __( 'Edit Warehouse', 'fendi-inventory-system' ),
			'view_item'             => __( 'View Warehouse', 'fendi-inventory-system' ),
			'all_items'             => __( 'All Warehouses', 'fendi-inventory-system' ),
			'search_items'          => __( 'Search Warehouses', 'fendi-inventory-system' ),
			'parent_item_colon'     => __( 'Parent Warehouses:', 'fendi-inventory-system' ),
			'not_found'             => __( 'No warehouses found.', 'fendi-inventory-system' ),
			'not_found_in_trash'    => __( 'No warehouses found in Trash.', 'fendi-inventory-system' ),
			'featured_image'        => _x( 'Warehouse Cover Image', 'Overrides the “Featured Image” phrase for this post type. Added in 4.3', 'fendi-inventory-system' ),
			'set_featured_image'    => _x( 'Set cover image', 'Overrides the “Set featured image” phrase for this post type. Added in 4.3', 'fendi-inventory-system' ),
			'remove_featured_image' => _x( 'Remove cover image', 'Overrides the “Remove featured image” phrase for this post type. Added in 4.3', 'fendi-inventory-system' ),
			'use_featured_image'    => _x( 'Use as cover image', 'Overrides the “Use as featured image” phrase for this post type. Added in 4.3', 'fendi-inventory-system' ),
			'archives'              => _x( 'Warehouse archives', 'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4', 'fendi-inventory-system' ),
			'insert_into_item'      => _x( 'Insert into warehouse', 'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4', 'fendi-inventory-system' ),
			'uploaded_to_this_item' => _x( 'Uploaded to this warehouse', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4', 'fendi-inventory-system' ),
			'filter_items_list'     => _x( 'Filter warehouses list', 'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4', 'fendi-inventory-system' ),
			'items_list_navigation' => _x( 'Warehouses list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4', 'fendi-inventory-system' ),
			'items_list'            => _x( 'Warehouses list', 'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4', 'fendi-inventory-system' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => false,
			'query_var'          => true,
			'rewrite'            => array( 'slug' => 'warehouse' ),
			'capability_type'    => 'post',
			'has_archive'        => true,
			'hierarchical'       => false,
			'menu_position'      => null,
			'supports'           => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments' ),
			'show_in_rest'       => true,
		);

		register_post_type( 'warehouse', $args );

		$labels = array(
			'name'                  => _x( 'Stock Requests', 'Post type general name', 'fendi-inventory-system' ),
			'singular_name'         => _x( 'Stock Request', 'Post type singular name', 'fendi-inventory-system' ),
			'menu_name'             => _x( 'Stock Requests', 'Admin Menu text', 'fendi-inventory-system' ),
			'name_admin_bar'        => _x( 'Stock Request', 'Add New on Toolbar', 'fendi-inventory-system' ),
			'add_new'               => __( 'Add New', 'fendi-inventory-system' ),
			'add_new_item'          => __( 'Add New Stock Request', 'fendi-inventory-system' ),
			'new_item'              => __( 'New Stock Request', 'fendi-inventory-system' ),
			'edit_item'             => __( 'Edit Stock Request', 'fendi-inventory-system' ),
			'view_item'             => __( 'View Stock Request', 'fendi-inventory-system' ),
			'all_items'             => __( 'All Stock Requests', 'fendi-inventory-system' ),
			'search_items'          => __( 'Search Stock Requests', 'fendi-inventory-system' ),
			'parent_item_colon'     => __( 'Parent Stock Requests:', 'fendi-inventory-system' ),
			'not_found'             => __( 'No stock requests found.', 'fendi-inventory-system' ),
			'not_found_in_trash'    => __( 'No stock requests found in Trash.', 'fendi-inventory-system' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => false,
			'show_in_menu'       => false,
			'query_var'          => false,
			'rewrite'            => false,
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'menu_position'      => null,
			'supports'           => array( 'title', 'editor' ),
			'show_in_rest'       => true,
		);

		register_post_type( 'stock_request', $args );

		$labels = array(
			'name'                  => _x( 'Notifications', 'Post type general name', 'fendi-inventory-system' ),
			'singular_name'         => _x( 'Notification', 'Post type singular name', 'fendi-inventory-system' ),
			'menu_name'             => _x( 'Notifications', 'Admin Menu text', 'fendi-inventory-system' ),
			'name_admin_bar'        => _x( 'Notification', 'Add New on Toolbar', 'fendi-inventory-system' ),
			'add_new'               => __( 'Add New', 'fendi-inventory-system' ),
			'add_new_item'          => __( 'Add New Notification', 'fendi-inventory-system' ),
			'new_item'              => __( 'New Notification', 'fendi-inventory-system' ),
			'edit_item'             => __( 'Edit Notification', 'fendi-inventory-system' ),
			'view_item'             => __( 'View Notification', 'fendi-inventory-system' ),
			'all_items'             => __( 'All Notifications', 'fendi-inventory-system' ),
			'search_items'          => __( 'Search Notifications', 'fendi-inventory-system' ),
			'parent_item_colon'     => __( 'Parent Notifications:', 'fendi-inventory-system' ),
			'not_found'             => __( 'No notifications found.', 'fendi-inventory-system' ),
			'not_found_in_trash'    => __( 'No notifications found in Trash.', 'fendi-inventory-system' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => 'fendi-inventory-system',
			'query_var'          => false,
			'rewrite'            => false,
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'menu_position'      => null,
			'supports'           => array( 'title', 'editor' ),
			'show_in_rest'       => true,
		);

		register_post_type( 'notification', $args );

		$labels = array(
			'name'                  => _x( 'Discount Campaigns', 'Post type general name', 'fendi-inventory-system' ),
			'singular_name'         => _x( 'Discount Campaign', 'Post type singular name', 'fendi-inventory-system' ),
			'menu_name'             => _x( 'Discount Campaigns', 'Admin Menu text', 'fendi-inventory-system' ),
			'name_admin_bar'        => _x( 'Discount Campaign', 'Add New on Toolbar', 'fendi-inventory-system' ),
			'add_new'               => __( 'Add New', 'fendi-inventory-system' ),
			'add_new_item'          => __( 'Add New Discount Campaign', 'fendi-inventory-system' ),
			'new_item'              => __( 'New Discount Campaign', 'fendi-inventory-system' ),
			'edit_item'             => __( 'Edit Discount Campaign', 'fendi-inventory-system' ),
			'view_item'             => __( 'View Discount Campaign', 'fendi-inventory-system' ),
			'all_items'             => __( 'All Discount Campaigns', 'fendi-inventory-system' ),
			'search_items'          => __( 'Search Discount Campaigns', 'fendi-inventory-system' ),
			'not_found'             => __( 'No discount campaigns found.', 'fendi-inventory-system' ),
			'not_found_in_trash'    => __( 'No discount campaigns found in Trash.', 'fendi-inventory-system' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => 'fendi-inventory-system',
			'query_var'          => false,
			'rewrite'            => false,
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'menu_position'      => null,
			'supports'           => array( 'title' ),
			'show_in_rest'       => true,
		);

		register_post_type( 'discount_campaign', $args );

		$labels = array(
			'name'                  => _x( 'Time Logs', 'Post type general name', 'fendi-inventory-system' ),
			'singular_name'         => _x( 'Time Log', 'Post type singular name', 'fendi-inventory-system' ),
			'menu_name'             => _x( 'Time Logs', 'Admin Menu text', 'fendi-inventory-system' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => false,
			'show_in_menu'       => false,
			'query_var'          => false,
			'rewrite'            => false,
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'supports'           => array( 'title', 'author' ),
			'show_in_rest'       => true,
		);

		register_post_type( 'time_log', $args );

		$labels = array(
			'name'                  => _x( 'Print Templates', 'Post type general name', 'fendi-inventory-system' ),
			'singular_name'         => _x( 'Print Template', 'Post type singular name', 'fendi-inventory-system' ),
			'menu_name'             => _x( 'Print Templates', 'Admin Menu text', 'fendi-inventory-system' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => false,
			'show_in_menu'       => false,
			'query_var'          => false,
			'rewrite'            => false,
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'supports'           => array( 'title', 'editor' ),
			'show_in_rest'       => true,
		);

		register_post_type( 'print_template', $args );
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Fendi_Inventory_System_Public( $this->get_plugin_name(), $this->get_version() );

		// The line below was causing a fatal error because the method does not exist in the public class.
		// $this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
		$this->loader->add_action( 'wp_head', $plugin_public, 'add_manifest_link' );

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Fendi_Inventory_System_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Redirect users to the Fendi admin panel after login.
	 *
	 * @param string $redirect_to           The redirect destination URL.
	 * @param string $requested_redirect_to The requested redirect destination URL passed as a parameter.
	 * @param WP_User|WP_Error $user        WP_User object if login was successful, WP_Error object otherwise.
	 * @return string
	 */
	public function fendi_login_redirect( $redirect_to, $requested_redirect_to, $user ) {
		// Check if login was successful and user is not an administrator.
		if ( ! is_wp_error( $user ) ) {
			$fendi_roles = array('cashier', 'warehouse_manager', 'accountant');
			$user_roles = (array) $user->roles;

			// If the user has one of the custom roles and is not an admin
			if ( array_intersect( $fendi_roles, $user_roles ) && ! in_array( 'administrator', $user_roles ) ) {
				return admin_url( 'admin.php?page=fendi-inventory-system' );
			}
		}
		return $redirect_to;
	}

	/**
	 * Block non-administrator users from accessing the WordPress admin area.
	 */
	public function block_wp_admin_access() {
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return;
		}

		if ( current_user_can( 'manage_options' ) ) {
			return;
		}

		$fendi_roles = array('cashier', 'warehouse_manager', 'accountant');
		$user = wp_get_current_user();
		$user_roles = (array) $user->roles;

		if ( array_intersect( $fendi_roles, $user_roles ) ) {
			wp_redirect( admin_url( 'admin.php?page=fendi-inventory-system' ) );
			exit;
		}
	}
}
