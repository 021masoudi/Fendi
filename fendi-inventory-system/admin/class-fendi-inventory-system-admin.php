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

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/fendi-inventory-system-admin.js', array( 'wp-element', 'wp-i18n', 'wp-hooks' ), $this->version, true );

		if ( 'product' === get_post_type() ) {
			wp_enqueue_script( 'jsbarcode', 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js', array(), '3.11.5', true );
			wp_enqueue_script( $this->plugin_name . '-barcode', plugin_dir_url( __FILE__ ) . 'js/fendi-inventory-system-barcode.js', array( 'jquery', 'jsbarcode' ), $this->version, true );
		}

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
			'manage_woocommerce', // Use WooCommerce's capability
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

	/**
	 * Add the warehouse inventory metabox.
	 *
	 * @since    1.0.0
	 */
	public function add_warehouse_inventory_metabox() {
		add_meta_box(
			'fendi_warehouse_inventory',
			__( 'Warehouse Inventory', 'fendi-inventory-system' ),
			array( $this, 'render_warehouse_inventory_metabox' ),
			'product',
			'normal',
			'default'
		);
	}

	/**
	 * Render the warehouse inventory metabox.
	 *
	 * @since    1.0.0
	 */
	public function render_warehouse_inventory_metabox( $post ) {
		wp_nonce_field( 'fendi_warehouse_inventory_data', 'fendi_warehouse_inventory_nonce' );
		$warehouses = get_posts(
			array(
				'post_type'      => 'warehouse',
				'posts_per_page' => -1,
			)
		);

		$cost_price = get_post_meta( $post->ID, '_cost_price', true );
		?>
		<p>
			<label for="fendi_cost_price">
				<?php esc_html_e( 'Cost Price', 'fendi-inventory-system' ); ?>
			</label>
			<input
				type="number"
				id="fendi_cost_price"
				name="fendi_cost_price"
				value="<?php echo esc_attr( $cost_price ); ?>"
			/>
		</p>
		<?php

		foreach ( $warehouses as $warehouse ) {
			$stock = get_post_meta( $post->ID, '_stock_warehouse_' . $warehouse->ID, true );
			$threshold = get_post_meta( $post->ID, '_low_stock_threshold_warehouse_' . $warehouse->ID, true );
			?>
			<div style="border: 1px solid #c3c4c7; padding: 10px; margin-bottom: 10px;">
				<h4><?php echo esc_html( $warehouse->post_title ); ?></h4>
				<p>
					<label for="fendi_warehouse_<?php echo esc_attr( $warehouse->ID ); ?>" style="display: block; margin-bottom: 5px;">
						<?php esc_html_e( 'Current Stock', 'fendi-inventory-system' ); ?>
					</label>
					<input
						type="number"
						id="fendi_warehouse_<?php echo esc_attr( $warehouse->ID ); ?>"
						name="fendi_warehouse_<?php echo esc_attr( $warehouse->ID ); ?>"
						value="<?php echo esc_attr( $stock ); ?>"
						placeholder="<?php esc_attr_e( 'Current Stock', 'fendi-inventory-system' ); ?>"
					/>
				</p>
				<p>
					<label for="fendi_low_stock_threshold_<?php echo esc_attr( $warehouse->ID ); ?>" style="display: block; margin-bottom: 5px;">
						<?php esc_html_e( 'Low Stock Threshold', 'fendi-inventory-system' ); ?>
					</label>
					<input
						type="number"
						id="fendi_low_stock_threshold_<?php echo esc_attr( $warehouse->ID ); ?>"
						name="fendi_low_stock_threshold_<?php echo esc_attr( $warehouse->ID ); ?>"
						value="<?php echo esc_attr( $threshold ); ?>"
						placeholder="<?php esc_attr_e( 'e.g., 10', 'fendi-inventory-system' ); ?>"
					/>
				</p>
			</div>
			<?php
		}
		?>
		<hr>
		<h4><?php esc_html_e( 'Alerts', 'fendi-inventory-system' ); ?></h4>
		<?php
		$high_sales_threshold = get_post_meta( $post->ID, '_high_sales_threshold', true );
		$high_sales_period = get_post_meta( $post->ID, '_high_sales_period', true );
		?>
		<p>
			<label for="fendi_high_sales_threshold" style="display: block; margin-bottom: 5px;">
				<?php esc_html_e( 'High Sales Threshold', 'fendi-inventory-system' ); ?>
			</label>
			<input
				type="number"
				id="fendi_high_sales_threshold"
				name="fendi_high_sales_threshold"
				value="<?php echo esc_attr( $high_sales_threshold ); ?>"
				placeholder="<?php esc_attr_e( 'e.g., 100', 'fendi-inventory-system' ); ?>"
			/>
			<span class="description"><?php esc_html_e( 'Number of sales to trigger the alert.', 'fendi-inventory-system' ); ?></span>
		</p>
		<p>
			<label for="fendi_high_sales_period" style="display: block; margin-bottom: 5px;">
				<?php esc_html_e( 'High Sales Period (hours)', 'fendi-inventory-system' ); ?>
			</label>
			<input
				type="number"
				id="fendi_high_sales_period"
				name="fendi_high_sales_period"
				value="<?php echo esc_attr( $high_sales_period ); ?>"
				placeholder="<?php esc_attr_e( 'e.g., 24', 'fendi-inventory-system' ); ?>"
			/>
			<span class="description"><?php esc_html_e( 'The period in hours to check for high sales.', 'fendi-inventory-system' ); ?></span>
		</p>
		<hr>
		<h4><?php esc_html_e( 'Barcode', 'fendi-inventory-system' ); ?></h4>
		<p>
			<button type="button" id="fendi-generate-barcode" class="button button-secondary" data-product-id="<?php echo esc_attr( $post->ID ); ?>">
				<?php esc_html_e( 'Generate Barcode', 'fendi-inventory-system' ); ?>
			</button>
		</p>
		<div id="fendi-barcode-modal" style="display:none;">
			<div id="fendi-barcode-modal-content">
				<svg id="fendi-barcode"></svg>
				<button type="button" id="fendi-print-barcode" class="button button-primary"><?php esc_html_e( 'Print', 'fendi-inventory-system' ); ?></button>
				<button type="button" id="fendi-close-barcode-modal" class="button button-secondary"><?php esc_html_e( 'Close', 'fendi-inventory-system' ); ?></button>
			</div>
		</div>
		<?php
	}

	/**
	 * Save the warehouse inventory metabox data.
	 *
	 * @since    1.0.0
	 */
	public function save_warehouse_inventory_metabox( $post_id ) {
		if ( ! isset( $_POST['fendi_warehouse_inventory_nonce'] ) ) {
			return;
		}

		if ( ! wp_verify_nonce( $_POST['fendi_warehouse_inventory_nonce'], 'fendi_warehouse_inventory_data' ) ) {
			return;
		}

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		$warehouses = get_posts(
			array(
				'post_type'      => 'warehouse',
				'posts_per_page' => -1,
			)
		);

		if ( isset( $_POST['fendi_cost_price'] ) ) {
			update_post_meta( $post_id, '_cost_price', sanitize_text_field( $_POST['fendi_cost_price'] ) );
		}

		foreach ( $warehouses as $warehouse ) {
			if ( isset( $_POST[ 'fendi_warehouse_' . $warehouse->ID ] ) ) {
				update_post_meta(
					$post_id,
					'_stock_warehouse_' . $warehouse->ID,
					sanitize_text_field( $_POST[ 'fendi_warehouse_' . $warehouse->ID ] )
				);
			}
			if ( isset( $_POST[ 'fendi_low_stock_threshold_' . $warehouse->ID ] ) ) {
				update_post_meta(
					$post_id,
					'_low_stock_threshold_warehouse_' . $warehouse->ID,
					sanitize_text_field( $_POST[ 'fendi_low_stock_threshold_' . $warehouse->ID ] )
				);
			}
		}

		if ( isset( $_POST['fendi_high_sales_threshold'] ) ) {
			update_post_meta( $post_id, '_high_sales_threshold', sanitize_text_field( $_POST['fendi_high_sales_threshold'] ) );
		}

		if ( isset( $_POST['fendi_high_sales_period'] ) ) {
			update_post_meta( $post_id, '_high_sales_period', sanitize_text_field( $_POST['fendi_high_sales_period'] ) );
		}
	}

	/**
	 * Render the user warehouse field.
	 *
	 * @since    1.0.0
	 */
	public function render_user_warehouse_field( $user ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( ! in_array( 'cashier', $user->roles, true ) && ! in_array( 'warehouse_manager', $user->roles, true ) ) {
			return;
		}

		wp_nonce_field( 'fendi_user_warehouse_data', 'fendi_user_warehouse_nonce' );

		$warehouses = get_posts(
			array(
				'post_type'      => 'warehouse',
				'posts_per_page' => -1,
			)
		);

		$assigned_warehouse = get_user_meta( $user->ID, '_assigned_warehouse', true );
		?>
		<h3><?php esc_html_e( 'Warehouse Assignment', 'fendi-inventory-system' ); ?></h3>
		<table class="form-table">
			<tr>
				<th>
					<label for="fendi_assigned_warehouse">
						<?php esc_html_e( 'Assigned Warehouse', 'fendi-inventory-system' ); ?>
					</label>
				</th>
				<td>
					<select name="fendi_assigned_warehouse" id="fendi_assigned_warehouse">
						<option value=""><?php esc_html_e( 'Select a warehouse', 'fendi-inventory-system' ); ?></option>
						<?php foreach ( $warehouses as $warehouse ) : ?>
							<option value="<?php echo esc_attr( $warehouse->ID ); ?>" <?php selected( $assigned_warehouse, $warehouse->ID ); ?>>
								<?php echo esc_html( $warehouse->post_title ); ?>
							</option>
						<?php endforeach; ?>
					</select>
				</td>
			</tr>
		</table>
		<?php
	}

	/**
	 * Save the user warehouse field.
	 *
	 * @since    1.0.0
	 */
	public function save_user_warehouse_field( $user_id ) {
		if ( ! isset( $_POST['fendi_user_warehouse_nonce'] ) ) {
			return;
		}

		if ( ! wp_verify_nonce( $_POST['fendi_user_warehouse_nonce'], 'fendi_user_warehouse_data' ) ) {
			return;
		}

		if ( ! current_user_can( 'edit_user', $user_id ) ) {
			return;
		}

		if ( isset( $_POST['fendi_assigned_warehouse'] ) ) {
			update_user_meta( $user_id, '_assigned_warehouse', sanitize_text_field( $_POST['fendi_assigned_warehouse'] ) );
		}
	}
}
