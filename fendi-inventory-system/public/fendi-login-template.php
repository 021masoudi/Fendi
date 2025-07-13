<?php
/**
 * Template Name: Fendi Login
 *
 * This is the template that displays the Fendi Inventory System login page.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Fendi_Inventory_System
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// If user is already logged in, redirect them to the admin panel.
if ( is_user_logged_in() ) {
	wp_redirect( admin_url( 'admin.php?page=fendi-inventory-system' ) );
	exit;
}

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
			<div id="fendi-login-root"></div>
		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
