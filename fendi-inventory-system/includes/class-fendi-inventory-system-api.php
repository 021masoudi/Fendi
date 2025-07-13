<?php

/**
 * The API functionality of the plugin.
 *
 * @link       https://example.com/
 * @since      1.0.0
 *
 * @package    Fendi_Inventory_System
 * @subpackage Fendi_Inventory_System/includes
 */

/**
 * The API functionality of the plugin.
 *
 * @package    Fendi_Inventory_System
 * @subpackage Fendi_Inventory_System/includes
 * @author     Your Name <email@example.com>
 */
class Fendi_Inventory_System_Api {

	/**
	 * Register the API routes.
	 *
	 * @since    1.0.0
	 */
	public function register_routes() {
		register_rest_route(
			'fendi/v1',
			'/users',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_users' ),
				'permission_callback' => array( $this, 'get_users_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/users',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'create_user' ),
				'permission_callback' => array( $this, 'create_user_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/users/(?P<id>\\d+)',
			array(
				'methods'             => 'PUT',
				'callback'            => array( $this, 'update_user' ),
				'permission_callback' => array( $this, 'update_user_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/users/(?P<id>\\d+)',
			array(
				'methods'             => 'DELETE',
				'callback'            => array( $this, 'delete_user' ),
				'permission_callback' => array( $this, 'delete_user_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/warehouses',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_warehouses' ),
				'permission_callback' => array( $this, 'get_warehouses_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/warehouses',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'create_warehouse' ),
				'permission_callback' => array( $this, 'create_warehouse_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/warehouses/(?P<id>\\d+)',
			array(
				'methods'             => 'PUT',
				'callback'            => array( $this, 'update_warehouse' ),
				'permission_callback' => array( $this, 'update_warehouse_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/warehouses/(?P<id>\\d+)',
			array(
				'methods'             => 'DELETE',
				'callback'            => array( $this, 'delete_warehouse' ),
				'permission_callback' => array( $this, 'delete_warehouse_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/products',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_products' ),
				'permission_callback' => array( $this, 'get_products_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/orders',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'create_order' ),
				'permission_callback' => array( $this, 'create_order_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/me',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_current_user_data' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'fendi/v1',
			'/orders',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_orders' ),
				'permission_callback' => array( $this, 'get_orders_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/stock-requests',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_stock_requests' ),
				'permission_callback' => array( $this, 'get_stock_requests_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/stock-requests',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'create_stock_request' ),
				'permission_callback' => array( $this, 'create_stock_request_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/stock-requests/(?P<id>\\d+)',
			array(
				'methods'             => 'PUT',
				'callback'            => array( $this, 'update_stock_request' ),
				'permission_callback' => array( $this, 'update_stock_request_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/suppliers',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_suppliers' ),
				'permission_callback' => array( $this, 'get_suppliers_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/suppliers',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'create_supplier' ),
				'permission_callback' => array( $this, 'create_supplier_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/suppliers/(?P<id>\\d+)',
			array(
				'methods'             => 'PUT',
				'callback'            => array( $this, 'update_supplier' ),
				'permission_callback' => array( $this, 'update_supplier_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/suppliers/(?P<id>\\d+)',
			array(
				'methods'             => 'DELETE',
				'callback'            => array( $this, 'delete_supplier' ),
				'permission_callback' => array( $this, 'delete_supplier_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/purchase-orders',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_purchase_orders' ),
				'permission_callback' => array( $this, 'get_purchase_orders_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/purchase-orders',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'create_purchase_order' ),
				'permission_callback' => array( $this, 'create_purchase_order_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/purchase-orders/(?P<id>\\d+)',
			array(
				'methods'             => 'PUT',
				'callback'            => array( $this, 'update_purchase_order' ),
				'permission_callback' => array( $this, 'update_purchase_order_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/purchase-orders/(?P<id>\\d+)',
			array(
				'methods'             => 'DELETE',
				'callback'            => array( $this, 'delete_purchase_order' ),
				'permission_callback' => array( $this, 'delete_purchase_order_permissions_check' ),
			)
		);

		register_rest_route(
			'fendi/v1',
			'/financial-reports',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_financial_reports' ),
				'permission_callback' => array( $this, 'get_financial_reports_permissions_check' ),
			)
		);
	}

	/**
	 * Check if a given request has access to get users.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_users_permissions_check( $request ) {
		return current_user_can( 'list_users' );
	}

	/**
	 * Get a list of users.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_users( $request ) {
		$current_user = wp_get_current_user();
		$args = array();

		if ( in_array( 'warehouse_manager', $current_user->roles, true ) ) {
			$assigned_warehouse = get_user_meta( $current_user->ID, '_assigned_warehouse', true );
			if ( $assigned_warehouse ) {
				$args['meta_key'] = '_assigned_warehouse';
				$args['meta_value'] = $assigned_warehouse;
			}
		}

		$users = get_users( $args );
		foreach ( $users as $user ) {
			$user->meta = get_user_meta( $user->ID );
		}
		return new WP_REST_Response( $users, 200 );
	}

	/**
	 * Check if a given request has access to create a user.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function create_user_permissions_check( $request ) {
		return current_user_can( 'create_users' );
	}

	/**
	 * Create a new user.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_user( $request ) {
		$params = $request->get_params();
		$user_id = wp_create_user( $params['username'], $params['password'], $params['email'] );

		if ( is_wp_error( $user_id ) ) {
			return $user_id;
		}

		$user = get_user_by( 'id', $user_id );
		$user->set_role( $params['role'] );

		if ( isset( $params['meta'] ) ) {
			foreach ( $params['meta'] as $key => $value ) {
				update_user_meta( $user_id, $key, $value );
			}
		}

		return new WP_REST_Response( $user, 201 );
	}

	/**
	 * Check if a given request has access to update a user.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function update_user_permissions_check( $request ) {
		return current_user_can( 'edit_user', $request['id'] );
	}

	/**
	 * Update a user.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_user( $request ) {
		$params = $request->get_params();
		$user_id = wp_update_user( array( 'ID' => $request['id'] ) + $params );

		if ( is_wp_error( $user_id ) ) {
			return $user_id;
		}

		if ( isset( $params['meta'] ) ) {
			foreach ( $params['meta'] as $key => $value ) {
				update_user_meta( $user_id, $key, $value );
			}
		}

		$user = get_user_by( 'id', $user_id );
		return new WP_REST_Response( $user, 200 );
	}

	/**
	 * Check if a given request has access to delete a user.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function delete_user_permissions_check( $request ) {
		return current_user_can( 'delete_user', $request['id'] );
	}

	/**
	 * Delete a user.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_user( $request ) {
		$user = get_user_by( 'id', $request['id'] );
		if ( ! $user ) {
			return new WP_Error( 'user_not_found', __( 'User not found.', 'fendi-inventory-system' ), array( 'status' => 404 ) );
		}

		if ( ! current_user_can( 'delete_user', $user->ID ) ) {
			return new WP_Error( 'permission_denied', __( 'You do not have permission to delete this user.', 'fendi-inventory-system' ), array( 'status' => 403 ) );
		}

		$result = wp_delete_user( $user->ID );

		if ( ! $result ) {
			return new WP_Error( 'user_deletion_failed', __( 'Failed to delete user.', 'fendi-inventory-system' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( true, 200 );
	}

	/**
	 * Check if a given request has access to get warehouses.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_warehouses_permissions_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Get a list of warehouses.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_warehouses( $request ) {
		$posts = get_posts(
			array(
				'post_type'      => 'warehouse',
				'posts_per_page' => -1,
			)
		);
		foreach ( $posts as $post ) {
			$post->meta = get_post_meta( $post->ID );
		}
		return new WP_REST_Response( $posts, 200 );
	}

	/**
	 * Check if a given request has access to create a warehouse.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function create_warehouse_permissions_check( $request ) {
		return current_user_can( 'publish_posts' );
	}

	/**
	 * Create a new warehouse.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_warehouse( $request ) {
		$params = $request->get_params();
		$post_id = wp_insert_post(
			array(
				'post_title'  => $params['title'],
				'post_type'   => 'warehouse',
				'post_status' => 'publish',
			)
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		if ( isset( $params['meta'] ) ) {
			foreach ( $params['meta'] as $key => $value ) {
				update_post_meta( $post_id, $key, $value );
			}
		}

		$post = get_post( $post_id );
		return new WP_REST_Response( $post, 201 );
	}

	/**
	 * Check if a given request has access to update a warehouse.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function update_warehouse_permissions_check( $request ) {
		return current_user_can( 'edit_post', $request['id'] );
	}

	/**
	 * Update a warehouse.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_warehouse( $request ) {
		$params = $request->get_params();
		$post_id = wp_update_post(
			array(
				'ID'         => $request['id'],
				'post_title' => $params['title'],
			)
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		if ( isset( $params['meta'] ) ) {
			foreach ( $params['meta'] as $key => $value ) {
				update_post_meta( $post_id, $key, $value );
			}
		}

		$post = get_post( $post_id );
		return new WP_REST_Response( $post, 200 );
	}

	/**
	 * Check if a given request has access to delete a warehouse.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function delete_warehouse_permissions_check( $request ) {
		return current_user_can( 'delete_post', $request['id'] );
	}

	/**
	 * Delete a warehouse.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_warehouse( $request ) {
		$post = get_post( $request['id'] );
		if ( ! $post || $post->post_type !== 'warehouse' ) {
			return new WP_Error( 'post_not_found', __( 'Post not found.', 'fendi-inventory-system' ), array( 'status' => 404 ) );
		}

		if ( ! current_user_can( 'delete_post', $post->ID ) ) {
			return new WP_Error( 'permission_denied', __( 'You do not have permission to delete this post.', 'fendi-inventory-system' ), array( 'status' => 403 ) );
		}

		$result = wp_delete_post( $post->ID, true );

		if ( ! $result ) {
			return new WP_Error( 'post_deletion_failed', __( 'Failed to delete post.', 'fendi-inventory-system' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( true, 200 );
	}

	/**
	 * Check if a given request has access to get purchase orders.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_purchase_orders_permissions_check( $request ) {
		return current_user_can( 'manage_options' ) || current_user_can( 'accountant' );
	}

	/**
	 * Get a list of purchase orders.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_purchase_orders( $request ) {
		$posts = get_posts(
			array(
				'post_type'      => 'purchase_order',
				'posts_per_page' => -1,
			)
		);
		foreach ( $posts as $post ) {
			$post->meta = get_post_meta( $post->ID );
		}
		return new WP_REST_Response( $posts, 200 );
	}

	/**
	 * Check if a given request has access to create a purchase order.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function create_purchase_order_permissions_check( $request ) {
		return current_user_can( 'manage_options' ) || current_user_can( 'accountant' );
	}

	/**
	 * Create a new purchase order.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_purchase_order( $request ) {
		$params = $request->get_params();
		$post_id = wp_insert_post(
			array(
				'post_title'  => $params['title'],
				'post_type'   => 'purchase_order',
				'post_status' => 'publish',
			)
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		if ( isset( $params['meta'] ) ) {
			foreach ( $params['meta'] as $key => $value ) {
				update_post_meta( $post_id, $key, $value );
			}
		}

		$post = get_post( $post_id );
		return new WP_REST_Response( $post, 201 );
	}

	/**
	 * Check if a given request has access to update a purchase order.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function update_purchase_order_permissions_check( $request ) {
		return current_user_can( 'manage_options' ) || current_user_can( 'accountant' );
	}

	/**
	 * Update a purchase order.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_purchase_order( $request ) {
		$params = $request->get_params();
		$post_id = wp_update_post(
			array(
				'ID'         => $request['id'],
				'post_title' => $params['title'],
			)
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		if ( isset( $params['meta'] ) ) {
			foreach ( $params['meta'] as $key => $value ) {
				update_post_meta( $post_id, $key, $value );
			}
		}

		$post = get_post( $post_id );
		return new WP_REST_Response( $post, 200 );
	}

	/**
	 * Check if a given request has access to delete a purchase order.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function delete_purchase_order_permissions_check( $request ) {
		return current_user_can( 'manage_options' ) || current_user_can( 'accountant' );
	}

	/**
	 * Delete a purchase order.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_purchase_order( $request ) {
		$post = get_post( $request['id'] );
		if ( ! $post || $post->post_type !== 'purchase_order' ) {
			return new WP_Error( 'post_not_found', __( 'Post not found.', 'fendi-inventory-system' ), array( 'status' => 404 ) );
		}

		if ( ! current_user_can( 'delete_post', $post->ID ) ) {
			return new WP_Error( 'permission_denied', __( 'You do not have permission to delete this post.', 'fendi-inventory-system' ), array( 'status' => 403 ) );
		}

		$result = wp_delete_post( $post->ID, true );

		if ( ! $result ) {
			return new WP_Error( 'post_deletion_failed', __( 'Failed to delete post.', 'fendi-inventory-system' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( true, 200 );
	}

	/**
	 * Check if a given request has access to get products.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_products_permissions_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Get a list of products.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_products( $request ) {
		$args = array(
			'post_type'      => 'product',
			'posts_per_page' => -1,
		);

		if ( isset( $request['s'] ) ) {
			$args['s'] = $request['s'];
		}

		$products = wc_get_products( $args );
		$warehouses = get_posts(
			array(
				'post_type'      => 'warehouse',
				'posts_per_page' => -1,
			)
		);

		$current_user = wp_get_current_user();
		$assigned_warehouse = get_user_meta( $current_user->ID, '_assigned_warehouse', true );

		foreach ( $products as $product ) {
			$product_data = $product->get_data();
			$product_data['warehouse_stock'] = array();

			if ( ( in_array( 'cashier', $current_user->roles, true ) || in_array( 'warehouse_manager', $current_user->roles, true ) ) && $assigned_warehouse ) {
				$stock = get_post_meta( $product->get_id(), '_stock_warehouse_' . $assigned_warehouse, true );
				$product_data['warehouse_stock'][ $assigned_warehouse ] = $stock;
			} else {
				foreach ( $warehouses as $warehouse ) {
					$stock = get_post_meta( $product->get_id(), '_stock_warehouse_' . $warehouse->ID, true );
					$product_data['warehouse_stock'][ $warehouse->ID ] = $stock;
				}
			}
			$product->set_props( $product_data );
		}

		return new WP_REST_Response( $products, 200 );
	}

	/**
	 * Check if a given request has access to create an order.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function create_order_permissions_check( $request ) {
		return current_user_can( 'publish_posts' );
	}

	/**
	 * Create a new order.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_order( $request ) {
		$params = $request->get_params();
		$order = wc_create_order();
		$warehouse_id = $params['warehouse_id'];

		$central_warehouse_query = new WP_Query(
			array(
				'post_type'      => 'warehouse',
				'posts_per_page' => 1,
				'meta_key'       => '_is_central',
				'meta_value'     => true,
			)
		);
		$central_warehouse = $central_warehouse_query->have_posts() ? $central_warehouse_query->posts[0] : null;

		foreach ( $params['cart'] as $item ) {
			$product = wc_get_product( $item['id'] );
			$item_id = $order->add_product( $product, $item['quantity'] );

			$cost_price = get_post_meta( $item['id'], '_cost_price', true );
			wc_add_order_item_meta( $item_id, '_cost_price', $cost_price );

			if ( $warehouse_id ) {
				$stock = get_post_meta( $item['id'], '_stock_warehouse_' . $warehouse_id, true );
				update_post_meta( $item['id'], '_stock_warehouse_' . $warehouse_id, $stock - $item['quantity'] );
			}

			if ( $central_warehouse ) {
				$central_stock = get_post_meta( $item['id'], '_stock_warehouse_' . $central_warehouse->ID, true );
				update_post_meta( $item['id'], '_stock_warehouse_' . $central_warehouse->ID, $central_stock - $item['quantity'] );
			}
		}

		$order->set_customer_id( $params['customer'] );
		$order->calculate_totals();
		$order->update_status( 'completed' );

		return new WP_REST_Response( $order->get_data(), 201 );
	}

	/**
	 * Get the current user data.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_current_user_data( $request ) {
		$user = wp_get_current_user();
		if ( $user->ID === 0 ) {
			return new WP_Error( 'not_logged_in', __( 'You are not logged in.', 'fendi-inventory-system' ), array( 'status' => 401 ) );
		}
		$user->meta = get_user_meta( $user->ID );
		$user->meta['_assigned_warehouse'] = get_user_meta( $user->ID, '_assigned_warehouse', true );
		return new WP_REST_Response( $user, 200 );
	}

	/**
	 * Check if a given request has access to get orders.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_orders_permissions_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Get a list of orders.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_orders( $request ) {
		$args = array(
			'numberposts' => -1,
			'post_type'   => 'shop_order',
			'post_status' => 'wc-completed',
		);

		if ( isset( $request['start_date'] ) && isset( $request['end_date'] ) ) {
			$args['date_query'] = array(
				array(
					'after'     => $request['start_date'],
					'before'    => $request['end_date'],
					'inclusive' => true,
				),
			);
		}

		if ( isset( $request['user_id'] ) ) {
			$args['customer_id'] = $request['user_id'];
		}

		if ( isset( $request['warehouse_id'] ) ) {
			$args['meta_query'][] = array(
				'key'   => '_warehouse_id',
				'value' => $request['warehouse_id'],
			);
		}

		$orders = wc_get_orders( $args );
		$data = array();
		foreach ( $orders as $order ) {
			$data[] = $order->get_data();
		}
		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Check if a given request has access to get stock requests.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_stock_requests_permissions_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Get a list of stock requests.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_stock_requests( $request ) {
		$posts = get_posts(
			array(
				'post_type'      => 'stock_request',
				'posts_per_page' => -1,
			)
		);
		foreach ( $posts as $post ) {
			$post->meta = get_post_meta( $post->ID );
		}
		return new WP_REST_Response( $posts, 200 );
	}

	/**
	 * Check if a given request has access to create a stock request.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function create_stock_request_permissions_check( $request ) {
		return current_user_can( 'publish_posts' );
	}

	/**
	 * Create a new stock request.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_stock_request( $request ) {
		$params = $request->get_params();
		$post_id = wp_insert_post(
			array(
				'post_title'  => 'Stock Request ' . time(),
				'post_type'   => 'stock_request',
				'post_status' => 'publish',
			)
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		update_post_meta( $post_id, '_source_warehouse', get_current_user_id() );
		update_post_meta( $post_id, '_destination_warehouse', $params['destination_warehouse'] );
		update_post_meta( $post_id, '_cart', $params['cart'] );
		update_post_meta( $post_id, '_status', 'pending' );

		$post = get_post( $post_id );
		$post->meta = get_post_meta( $post->ID );
		return new WP_REST_Response( $post, 201 );
	}

	/**
	 * Check if a given request has access to update a stock request.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function update_stock_request_permissions_check( $request ) {
		return current_user_can( 'edit_post', $request['id'] );
	}

	/**
	 * Update a stock request.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_stock_request( $request ) {
		$params = $request->get_params();
		update_post_meta( $request['id'], '_status', $params['status'] );

		if ( $params['status'] === 'completed' ) {
			$cart = get_post_meta( $request['id'], '_cart', true );
			$source_warehouse = get_post_meta( $request['id'], '_source_warehouse', true );
			$destination_warehouse = get_post_meta( $request['id'], '_destination_warehouse', true );

			foreach ( $cart as $item ) {
				$source_stock = get_post_meta( $item['id'], '_stock_warehouse_' . $source_warehouse, true );
				update_post_meta( $item['id'], '_stock_warehouse_' . $source_warehouse, $source_stock - $item['quantity'] );

				$destination_stock = get_post_meta( $item['id'], '_stock_warehouse_' . $destination_warehouse, true );
				update_post_meta( $item['id'], '_stock_warehouse_' . $destination_warehouse, $destination_stock + $item['quantity'] );
			}
		}

		$post = get_post( $request['id'] );
		$post->meta = get_post_meta( $post->ID );
		return new WP_REST_Response( $post, 200 );
	}

	/**
	 * Check if a given request has access to get suppliers.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_suppliers_permissions_check( $request ) {
		return current_user_can( 'manage_options' ) || current_user_can( 'accountant' );
	}

	/**
	 * Get a list of suppliers.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_suppliers( $request ) {
		$posts = get_posts(
			array(
				'post_type'      => 'supplier',
				'posts_per_page' => -1,
			)
		);
		foreach ( $posts as $post ) {
			$post->meta = get_post_meta( $post->ID );
		}
		return new WP_REST_Response( $posts, 200 );
	}

	/**
	 * Check if a given request has access to create a supplier.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function create_supplier_permissions_check( $request ) {
		return current_user_can( 'manage_options' ) || current_user_can( 'accountant' );
	}

	/**
	 * Create a new supplier.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_supplier( $request ) {
		$params = $request->get_params();
		$post_id = wp_insert_post(
			array(
				'post_title'  => $params['title'],
				'post_type'   => 'supplier',
				'post_status' => 'publish',
			)
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		if ( isset( $params['meta'] ) ) {
			foreach ( $params['meta'] as $key => $value ) {
				update_post_meta( $post_id, $key, $value );
			}
		}

		$post = get_post( $post_id );
		return new WP_REST_Response( $post, 201 );
	}

	/**
	 * Check if a given request has access to update a supplier.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function update_supplier_permissions_check( $request ) {
		return current_user_can( 'manage_options' ) || current_user_can( 'accountant' );
	}

	/**
	 * Update a supplier.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_supplier( $request ) {
		$params = $request->get_params();
		$post_id = wp_update_post(
			array(
				'ID'         => $request['id'],
				'post_title' => $params['title'],
			)
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		if ( isset( $params['meta'] ) ) {
			foreach ( $params['meta'] as $key => $value ) {
				update_post_meta( $post_id, $key, $value );
			}
		}

		$post = get_post( $post_id );
		return new WP_REST_Response( $post, 200 );
	}

	/**
	 * Check if a given request has access to delete a supplier.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function delete_supplier_permissions_check( $request ) {
		return current_user_can( 'manage_options' ) || current_user_can( 'accountant' );
	}

	/**
	 * Delete a supplier.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_supplier( $request ) {
		$post = get_post( $request['id'] );
		if ( ! $post || $post->post_type !== 'supplier' ) {
			return new WP_Error( 'post_not_found', __( 'Post not found.', 'fendi-inventory-system' ), array( 'status' => 404 ) );
		}

		if ( ! current_user_can( 'delete_post', $post->ID ) ) {
			return new WP_Error( 'permission_denied', __( 'You do not have permission to delete this post.', 'fendi-inventory-system' ), array( 'status' => 403 ) );
		}

		$result = wp_delete_post( $post->ID, true );

		if ( ! $result ) {
			return new WP_Error( 'post_deletion_failed', __( 'Failed to delete post.', 'fendi-inventory-system' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( true, 200 );
	}

	/**
	 * Check if a given request has access to get financial reports.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_financial_reports_permissions_check( $request ) {
		return current_user_can( 'manage_options' ) || current_user_can( 'accountant' );
	}

	/**
	 * Get financial reports.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_financial_reports( $request ) {
		$start_date = $request->get_param( 'start_date' );
		$end_date   = $request->get_param( 'end_date' );

		$args = array(
			'post_type'      => 'shop_order',
			'posts_per_page' => -1,
			'post_status'    => array( 'wc-completed' ),
			'date_query'     => array(
				array(
					'after'     => $start_date,
					'before'    => $end_date,
					'inclusive' => true,
				),
			),
		);

		$orders = wc_get_orders( $args );

		$total_revenue = 0;
		$total_cogs    = 0;

		foreach ( $orders as $order ) {
			$total_revenue += $order->get_total();
			foreach ( $order->get_items() as $item ) {
				$product_id = $item->get_product_id();
				$cost_price = get_post_meta( $product_id, '_cost_price', true );
				$total_cogs += $cost_price * $item->get_quantity();
			}
		}

		$gross_profit = $total_revenue - $total_cogs;

		$response = array(
			'total_revenue' => $total_revenue,
			'total_cogs'    => $total_cogs,
			'gross_profit'  => $gross_profit,
		);

		return new WP_REST_Response( $response, 200 );
	}
}
