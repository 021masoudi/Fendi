<?php

class Fendi_Inventory_System_Purchase_Order {

    public function __construct() {
        add_action('init', array($this, 'register_purchase_order_post_type'));
        add_action('add_meta_boxes', array($this, 'add_purchase_order_meta_boxes'));
        add_action('save_post', array($this, 'save_purchase_order_meta_data'));
    }

    public function register_purchase_order_post_type() {
        $labels = array(
            'name'               => _x('Purchase Orders', 'post type general name', 'fendi-inventory-system'),
            'singular_name'      => _x('Purchase Order', 'post type singular name', 'fendi-inventory-system'),
            'menu_name'          => _x('Purchase Orders', 'admin menu', 'fendi-inventory-system'),
            'name_admin_bar'     => _x('Purchase Order', 'add new on admin bar', 'fendi-inventory-system'),
            'add_new'            => _x('Add New', 'purchase order', 'fendi-inventory-system'),
            'add_new_item'       => __('Add New Purchase Order', 'fendi-inventory-system'),
            'new_item'           => __('New Purchase Order', 'fendi-inventory-system'),
            'edit_item'          => __('Edit Purchase Order', 'fendi-inventory-system'),
            'view_item'          => __('View Purchase Order', 'fendi-inventory-system'),
            'all_items'          => __('All Purchase Orders', 'fendi-inventory-system'),
            'search_items'       => __('Search Purchase Orders', 'fendi-inventory-system'),
            'parent_item_colon'  => __('Parent Purchase Orders:', 'fendi-inventory-system'),
            'not_found'          => __('No purchase orders found.', 'fendi-inventory-system'),
            'not_found_in_trash' => __('No purchase orders found in Trash.', 'fendi-inventory-system')
        );

        $args = array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => 'fendi-inventory-system',
            'query_var'          => true,
            'rewrite'            => array('slug' => 'purchase-order'),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => null,
            'supports'           => array('title'),
            'show_in_rest'       => true,
        );

        register_post_type('purchase_order', $args);
    }

    public function add_purchase_order_meta_boxes() {
        add_meta_box(
            'purchase_order_details',
            __('Purchase Order Details', 'fendi-inventory-system'),
            array($this, 'render_purchase_order_details_meta_box'),
            'purchase_order',
            'normal',
            'high'
        );
    }

    public function render_purchase_order_details_meta_box($post) {
        wp_nonce_field('fendi_purchase_order_meta_box', 'fendi_purchase_order_meta_box_nonce');
        $supplier_id = get_post_meta($post->ID, '_supplier_id', true);
        $products = get_post_meta($post->ID, '_products', true);
        $status = get_post_meta($post->ID, '_status', true);

        $suppliers = get_posts(array('post_type' => 'supplier', 'numberposts' => -1));
        ?>
        <p>
            <label for="supplier_id"><?php _e('Supplier', 'fendi-inventory-system'); ?></label>
            <select id="supplier_id" name="supplier_id" class="widefat">
                <option value=""><?php _e('Select a supplier', 'fendi-inventory-system'); ?></option>
                <?php foreach ($suppliers as $supplier) : ?>
                    <option value="<?php echo esc_attr($supplier->ID); ?>" <?php selected($supplier_id, $supplier->ID); ?>>
                        <?php echo esc_html($supplier->post_title); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </p>
        <p>
            <label for="products"><?php _e('Products', 'fendi-inventory-system'); ?></label>
            <textarea id="products" name="products" class="widefat"><?php echo esc_textarea(json_encode($products)); ?></textarea>
        </p>
        <p>
            <label for="status"><?php _e('Status', 'fendi-inventory-system'); ?></label>
            <select id="status" name="status" class="widefat">
                <option value="pending" <?php selected($status, 'pending'); ?>><?php _e('Pending', 'fendi-inventory-system'); ?></option>
                <option value="completed" <?php selected($status, 'completed'); ?>><?php _e('Completed', 'fendi-inventory-system'); ?></option>
            </select>
        </p>
        <?php
    }

    public function save_purchase_order_meta_data($post_id) {
        if (!isset($_POST['fendi_purchase_order_meta_box_nonce'])) {
            return;
        }
        if (!wp_verify_nonce($_POST['fendi_purchase_order_meta_box_nonce'], 'fendi_purchase_order_meta_box')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (isset($_POST['post_type']) && 'purchase_order' == $_POST['post_type']) {
            if (!current_user_can('edit_page', $post_id)) {
                return;
            }
        } else {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
        }
        if (isset($_POST['supplier_id'])) {
            update_post_meta($post_id, '_supplier_id', sanitize_text_field($_POST['supplier_id']));
        }
        if (isset($_POST['products'])) {
            update_post_meta($post_id, '_products', json_decode(stripslashes($_POST['products']), true));
        }
        if (isset($_POST['status'])) {
            update_post_meta($post_id, '_status', sanitize_text_field($_POST['status']));
        }
    }
}

new Fendi_Inventory_System_Purchase_Order();
