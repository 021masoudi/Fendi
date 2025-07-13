<?php

class Fendi_Inventory_System_Supplier {

    public function __construct() {
        add_action('init', array($this, 'register_supplier_post_type'));
        add_action('add_meta_boxes', array($this, 'add_supplier_meta_boxes'));
        add_action('save_post', array($this, 'save_supplier_meta_data'));
    }

    public function register_supplier_post_type() {
        $labels = array(
            'name'               => _x('Suppliers', 'post type general name', 'fendi-inventory-system'),
            'singular_name'      => _x('Supplier', 'post type singular name', 'fendi-inventory-system'),
            'menu_name'          => _x('Suppliers', 'admin menu', 'fendi-inventory-system'),
            'name_admin_bar'     => _x('Supplier', 'add new on admin bar', 'fendi-inventory-system'),
            'add_new'            => _x('Add New', 'supplier', 'fendi-inventory-system'),
            'add_new_item'       => __('Add New Supplier', 'fendi-inventory-system'),
            'new_item'           => __('New Supplier', 'fendi-inventory-system'),
            'edit_item'          => __('Edit Supplier', 'fendi-inventory-system'),
            'view_item'          => __('View Supplier', 'fendi-inventory-system'),
            'all_items'          => __('All Suppliers', 'fendi-inventory-system'),
            'search_items'       => __('Search Suppliers', 'fendi-inventory-system'),
            'parent_item_colon'  => __('Parent Suppliers:', 'fendi-inventory-system'),
            'not_found'          => __('No suppliers found.', 'fendi-inventory-system'),
            'not_found_in_trash' => __('No suppliers found in Trash.', 'fendi-inventory-system')
        );

        $args = array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => 'fendi-inventory-system',
            'query_var'          => true,
            'rewrite'            => array('slug' => 'supplier'),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => null,
            'supports'           => array('title'),
            'show_in_rest'       => true,
        );

        register_post_type('supplier', $args);
    }

    public function add_supplier_meta_boxes() {
        add_meta_box(
            'supplier_details',
            __('Supplier Details', 'fendi-inventory-system'),
            array($this, 'render_supplier_details_meta_box'),
            'supplier',
            'normal',
            'high'
        );
    }

    public function render_supplier_details_meta_box($post) {
        wp_nonce_field('fendi_supplier_meta_box', 'fendi_supplier_meta_box_nonce');
        $phone = get_post_meta($post->ID, '_supplier_phone', true);
        $email = get_post_meta($post->ID, '_supplier_email', true);
        $address = get_post_meta($post->ID, '_supplier_address', true);
        ?>
        <p>
            <label for="supplier_phone"><?php _e('Phone', 'fendi-inventory-system'); ?></label>
            <input type="text" id="supplier_phone" name="supplier_phone" value="<?php echo esc_attr($phone); ?>" class="widefat">
        </p>
        <p>
            <label for="supplier_email"><?php _e('Email', 'fendi-inventory-system'); ?></label>
            <input type="email" id="supplier_email" name="supplier_email" value="<?php echo esc_attr($email); ?>" class="widefat">
        </p>
        <p>
            <label for="supplier_address"><?php _e('Address', 'fendi-inventory-system'); ?></label>
            <textarea id="supplier_address" name="supplier_address" class="widefat"><?php echo esc_textarea($address); ?></textarea>
        </p>
        <?php
    }

    public function save_supplier_meta_data($post_id) {
        if (!isset($_POST['fendi_supplier_meta_box_nonce'])) {
            return;
        }
        if (!wp_verify_nonce($_POST['fendi_supplier_meta_box_nonce'], 'fendi_supplier_meta_box')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (isset($_POST['post_type']) && 'supplier' == $_POST['post_type']) {
            if (!current_user_can('edit_page', $post_id)) {
                return;
            }
        } else {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
        }
        if (isset($_POST['supplier_phone'])) {
            update_post_meta($post_id, '_supplier_phone', sanitize_text_field($_POST['supplier_phone']));
        }
        if (isset($_POST['supplier_email'])) {
            update_post_meta($post_id, '_supplier_email', sanitize_email($_POST['supplier_email']));
        }
        if (isset($_POST['supplier_address'])) {
            update_post_meta($post_id, '_supplier_address', sanitize_textarea_field($_POST['supplier_address']));
        }
    }
}

new Fendi_Inventory_System_Supplier();
