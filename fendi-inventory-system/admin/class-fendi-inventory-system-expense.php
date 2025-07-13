<?php

class Fendi_Inventory_System_Expense {

    public function __construct() {
        add_action('init', array($this, 'register_expense_post_type'));
        add_action('add_meta_boxes', array($this, 'add_expense_meta_boxes'));
        add_action('save_post', array($this, 'save_expense_meta_data'));
    }

    public function register_expense_post_type() {
        $labels = array(
            'name'               => _x('Expenses', 'post type general name', 'fendi-inventory-system'),
            'singular_name'      => _x('Expense', 'post type singular name', 'fendi-inventory-system'),
            'menu_name'          => _x('Expenses', 'admin menu', 'fendi-inventory-system'),
            'name_admin_bar'     => _x('Expense', 'add new on admin bar', 'fendi-inventory-system'),
            'add_new'            => _x('Add New', 'expense', 'fendi-inventory-system'),
            'add_new_item'       => __('Add New Expense', 'fendi-inventory-system'),
            'new_item'           => __('New Expense', 'fendi-inventory-system'),
            'edit_item'          => __('Edit Expense', 'fendi-inventory-system'),
            'view_item'          => __('View Expense', 'fendi-inventory-system'),
            'all_items'          => __('All Expenses', 'fendi-inventory-system'),
            'search_items'       => __('Search Expenses', 'fendi-inventory-system'),
            'parent_item_colon'  => __('Parent Expenses:', 'fendi-inventory-system'),
            'not_found'          => __('No expenses found.', 'fendi-inventory-system'),
            'not_found_in_trash' => __('No expenses found in Trash.', 'fendi-inventory-system')
        );

        $args = array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => 'fendi-inventory-system',
            'query_var'          => true,
            'rewrite'            => array('slug' => 'expense'),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => null,
            'supports'           => array('title'),
            'show_in_rest'       => true,
        );

        register_post_type('expense', $args);
    }

    public function add_expense_meta_boxes() {
        add_meta_box(
            'expense_details',
            __('Expense Details', 'fendi-inventory-system'),
            array($this, 'render_expense_details_meta_box'),
            'expense',
            'normal',
            'high'
        );
    }

    public function render_expense_details_meta_box($post) {
        wp_nonce_field('fendi_expense_meta_box', 'fendi_expense_meta_box_nonce');
        $amount = get_post_meta($post->ID, '_amount', true);
        $date = get_post_meta($post->ID, '_date', true);
        ?>
        <p>
            <label for="amount"><?php _e('Amount', 'fendi-inventory-system'); ?></label>
            <input type="number" id="amount" name="amount" value="<?php echo esc_attr($amount); ?>" class="widefat">
        </p>
        <p>
            <label for="date"><?php _e('Date', 'fendi-inventory-system'); ?></label>
            <input type="date" id="date" name="date" value="<?php echo esc_attr($date); ?>" class="widefat">
        </p>
        <?php
    }

    public function save_expense_meta_data($post_id) {
        if (!isset($_POST['fendi_expense_meta_box_nonce'])) {
            return;
        }
        if (!wp_verify_nonce($_POST['fendi_expense_meta_box_nonce'], 'fendi_expense_meta_box')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (isset($_POST['post_type']) && 'expense' == $_POST['post_type']) {
            if (!current_user_can('edit_page', $post_id)) {
                return;
            }
        } else {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
        }
        if (isset($_POST['amount'])) {
            update_post_meta($post_id, '_amount', sanitize_text_field($_POST['amount']));
        }
        if (isset($_POST['date'])) {
            update_post_meta($post_id, '_date', sanitize_text_field($_POST['date']));
        }
    }
}

new Fendi_Inventory_System_Expense();
