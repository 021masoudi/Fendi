<?php

class Fendi_Inventory_System_Transaction {

    public function __construct() {
        add_action('init', array($this, 'register_transaction_post_type'));
        add_action('add_meta_boxes', array($this, 'add_transaction_meta_boxes'));
        add_action('save_post', array($this, 'save_transaction_meta_data'));
    }

    public function register_transaction_post_type() {
        $labels = array(
            'name'               => _x('Transactions', 'post type general name', 'fendi-inventory-system'),
            'singular_name'      => _x('Transaction', 'post type singular name', 'fendi-inventory-system'),
            'menu_name'          => _x('Transactions', 'admin menu', 'fendi-inventory-system'),
            'name_admin_bar'     => _x('Transaction', 'add new on admin bar', 'fendi-inventory-system'),
            'add_new'            => _x('Add New', 'transaction', 'fendi-inventory-system'),
            'add_new_item'       => __('Add New Transaction', 'fendi-inventory-system'),
            'new_item'           => __('New Transaction', 'fendi-inventory-system'),
            'edit_item'          => __('Edit Transaction', 'fendi-inventory-system'),
            'view_item'          => __('View Transaction', 'fendi-inventory-system'),
            'all_items'          => __('All Transactions', 'fendi-inventory-system'),
            'search_items'       => __('Search Transactions', 'fendi-inventory-system'),
            'parent_item_colon'  => __('Parent Transactions:', 'fendi-inventory-system'),
            'not_found'          => __('No transactions found.', 'fendi-inventory-system'),
            'not_found_in_trash' => __('No transactions found in Trash.', 'fendi-inventory-system')
        );

        $args = array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => 'fendi-inventory-system',
            'query_var'          => true,
            'rewrite'            => array('slug' => 'transaction'),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => null,
            'supports'           => array('title'),
            'show_in_rest'       => true,
        );

        register_post_type('transaction', $args);
    }

    public function add_transaction_meta_boxes() {
        add_meta_box(
            'transaction_details',
            __('Transaction Details', 'fendi-inventory-system'),
            array($this, 'render_transaction_details_meta_box'),
            'transaction',
            'normal',
            'high'
        );
    }

    public function render_transaction_details_meta_box($post) {
        wp_nonce_field('fendi_transaction_meta_box', 'fendi_transaction_meta_box_nonce');
        $type = get_post_meta($post->ID, '_type', true);
        $amount = get_post_meta($post->ID, '_amount', true);
        $date = get_post_meta($post->ID, '_date', true);
        $related_id = get_post_meta($post->ID, '_related_id', true);
        ?>
        <p>
            <label for="type"><?php _e('Type', 'fendi-inventory-system'); ?></label>
            <select id="type" name="type" class="widefat">
                <option value="receivable" <?php selected($type, 'receivable'); ?>><?php _e('Accounts Receivable', 'fendi-inventory-system'); ?></option>
                <option value="payable" <?php selected($type, 'payable'); ?>><?php _e('Accounts Payable', 'fendi-inventory-system'); ?></option>
            </select>
        </p>
        <p>
            <label for="amount"><?php _e('Amount', 'fendi-inventory-system'); ?></label>
            <input type="number" id="amount" name="amount" value="<?php echo esc_attr($amount); ?>" class="widefat">
        </p>
        <p>
            <label for="date"><?php _e('Date', 'fendi-inventory-system'); ?></label>
            <input type="date" id="date" name="date" value="<?php echo esc_attr($date); ?>" class="widefat">
        </p>
        <p>
            <label for="related_id"><?php _e('Related ID (Order/PO)', 'fendi-inventory-system'); ?></label>
            <input type="number" id="related_id" name="related_id" value="<?php echo esc_attr($related_id); ?>" class="widefat">
        </p>
        <?php
    }

    public function save_transaction_meta_data($post_id) {
        if (!isset($_POST['fendi_transaction_meta_box_nonce'])) {
            return;
        }
        if (!wp_verify_nonce($_POST['fendi_transaction_meta_box_nonce'], 'fendi_transaction_meta_box')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (isset($_POST['post_type']) && 'transaction' == $_POST['post_type']) {
            if (!current_user_can('edit_page', $post_id)) {
                return;
            }
        } else {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
        }
        if (isset($_POST['type'])) {
            update_post_meta($post_id, '_type', sanitize_text_field($_POST['type']));
        }
        if (isset($_POST['amount'])) {
            update_post_meta($post_id, '_amount', sanitize_text_field($_POST['amount']));
        }
        if (isset($_POST['date'])) {
            update_post_meta($post_id, '_date', sanitize_text_field($_POST['date']));
        }
        if (isset($_POST['related_id'])) {
            update_post_meta($post_id, '_related_id', sanitize_text_field($_POST['related_id']));
        }
    }
}

new Fendi_Inventory_System_Transaction();
