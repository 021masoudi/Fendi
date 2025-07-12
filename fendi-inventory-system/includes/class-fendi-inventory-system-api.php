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
		$users = get_users();
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

		foreach ( $products as $product ) {
			$product_data = $product->get_data();
			$product_data['warehouse_stock'] = array();
			foreach ( $warehouses as $warehouse ) {
				$stock = get_post_meta( $product->get_id(), '_stock_warehouse_' . $warehouse->ID, true );
				$product_data['warehouse_stock'][ $warehouse->ID ] = $stock;
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
		$orders = wc_get_orders( array( 'numberposts' => -1 ) );
		$data = array();
		foreach ( $orders as $order ) {
			$data[] = $order->get_data();
		}
		return new WP_REST_Response( $data, 200 );
	}
}
