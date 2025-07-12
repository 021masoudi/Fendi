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
}
