<?php

class Fendi_Inventory_System_Notifications {

    public function __construct() {
        add_action('fendi_check_low_stock', array($this, 'check_low_stock'));
        add_action('fendi_check_high_sales', array($this, 'check_high_sales'));
        add_action('woocommerce_order_status_completed', array($this, 'send_thank_you_sms'));
        add_action('fendi_send_daily_sales_report', array($this, 'send_daily_sales_report'));

        if (!wp_next_scheduled('fendi_check_low_stock')) {
            wp_schedule_event(time(), 'hourly', 'fendi_check_low_stock');
        }
        if (!wp_next_scheduled('fendi_check_high_sales')) {
            wp_schedule_event(time(), 'hourly', 'fendi_check_high_sales');
        }
        if (!wp_next_scheduled('fendi_send_daily_sales_report')) {
            $time = get_option('fendi_daily_sales_report_time', '23:00');
            wp_schedule_event(strtotime($time), 'daily', 'fendi_send_daily_sales_report');
        }
    }

    public function check_low_stock() {
        $warehouses = get_posts(
            array(
                'post_type'      => 'warehouse',
                'posts_per_page' => -1,
                'post_status'    => 'publish',
            )
        );

        if (empty($warehouses)) {
            return;
        }

        $products = wc_get_products(array('status' => 'publish', 'limit' => -1));

        foreach ($products as $product) {
            $product_id = $product->get_id();

            foreach ($warehouses as $warehouse) {
                $warehouse_id = $warehouse->ID;
                $warehouse_name = $warehouse->post_title;

                $stock = get_post_meta($product_id, '_stock_warehouse_' . $warehouse_id, true);
                $threshold = get_post_meta($product_id, '_low_stock_threshold_warehouse_' . $warehouse_id, true);

                // If threshold is not set, use a default or skip
                if ($threshold === '') {
                    $threshold = 10; // Default threshold
                }

                if (is_numeric($stock) && is_numeric($threshold) && (int)$stock < (int)$threshold) {
                    $this->create_notification(
                        __('Low Stock Alert', 'fendi-inventory-system'),
                        sprintf(
                            __('Product "%s" is low on stock in warehouse "%s". Current stock: %d, Threshold: %d.', 'fendi-inventory-system'),
                            $product->get_name(),
                            $warehouse_name,
                            $stock,
                            $threshold
                        ),
                        '_low_stock_alert_' . $product_id . '_' . $warehouse_id,
                        'active'
                    );
                }
            }
        }
    }

    public function check_high_sales() {
        $products = wc_get_products(array('status' => 'publish', 'limit' => -1));

        foreach ($products as $product) {
            $product_id = $product->get_id();
            $threshold = get_post_meta($product_id, '_high_sales_threshold', true);
            $period = get_post_meta($product_id, '_high_sales_period', true);

            // Use default values if not set
            if (empty($threshold)) {
                $threshold = 100; // Default threshold
            }
            if (empty($period)) {
                $period = 24; // Default period in hours
            }

            $sales = $this->get_sales_in_period($product_id, $period);

            if ($sales > $threshold) {
                $this->create_notification(
                    __('High Sales Alert', 'fendi-inventory-system'),
                    sprintf(
                        __('Product "%s" has high sales. Sold %d units in the last %d hours.', 'fendi-inventory-system'),
                        $product->get_name(),
                        $sales,
                        $period
                    ),
                    '_high_sales_alert_' . $product_id,
                    date('Y-m-d') // Store the date to prevent daily duplicates
                );
            }
        }
    }

    public function send_thank_you_sms($order_id) {
        if (!get_option('fendi_thank_you_sms_enabled')) {
            return;
        }
        $order = wc_get_order($order_id);
        $phone = $order->get_billing_phone();
        $template = get_option('fendi_thank_you_sms_template');
        $message = str_replace(
            array('[customer_name]', '[total_amount]'),
            array($order->get_billing_first_name(), $order->get_total()),
            $template
        );
        $this->send_sms($phone, $message);
    }

    public function send_daily_sales_report() {
        if (!get_option('fendi_daily_sales_report_enabled')) {
            return;
        }
        $recipients = explode(',', get_option('fendi_daily_sales_report_recipients'));
        $report = $this->generate_daily_sales_report();
        foreach ($recipients as $recipient) {
            $this->send_sms($recipient, $report);
        }
    }

    private function create_notification($title, $content, $meta_key = '', $meta_value = '') {
        // Check if a similar notification already exists
        $args = array(
            'post_type' => 'notification',
            'post_status' => 'publish',
            'posts_per_page' => 1,
            'title' => $title,
        );

        if (!empty($meta_key) && !empty($meta_value)) {
            $args['meta_query'] = array(
                array(
                    'key' => $meta_key,
                    'value' => $meta_value,
                )
            );
        }

        $existing_notifications = new WP_Query($args);

        if ($existing_notifications->have_posts()) {
            // A similar notification already exists, don't create a new one.
            return;
        }

        $post_data = array(
            'post_type' => 'notification',
            'post_title' => $title,
            'post_content' => $content,
            'post_status' => 'publish',
        );

        $post_id = wp_insert_post($post_data);

        if ($post_id && !empty($meta_key) && !empty($meta_value)) {
            add_post_meta($post_id, $meta_key, $meta_value);
        }
    }

    private function get_sales_in_period($product_id, $hours) {
        $orders = wc_get_orders(array(
            'status' => 'completed',
            'date_created' => '>' . (time() - ($hours * 3600)),
        ));
        $sales = 0;
        foreach ($orders as $order) {
            foreach ($order->get_items() as $item) {
                if ($item->get_product_id() === $product_id) {
                    $sales += $item->get_quantity();
                }
            }
        }
        return $sales;
    }

    private function generate_daily_sales_report() {
        $orders = wc_get_orders(array(
            'status' => 'completed',
            'date_created' => '>' . strtotime('today'),
        ));
        $total_sales = 0;
        foreach ($orders as $order) {
            $total_sales += $order->get_total();
        }
        return sprintf(__('Daily Sales Report: Total sales today is %s.', 'fendi-inventory-system'), wc_price($total_sales));
    }

    private function send_sms($to, $message) {
        $api_key = get_option('fendi_sms_api_key');
        $sender = get_option('fendi_sms_sender_number');
        $url = get_option('fendi_sms_api_url');

        $response = wp_remote_post($url, array(
            'body' => array(
                'api_key' => $api_key,
                'sender' => $sender,
                'to' => $to,
                'message' => $message,
            ),
        ));

        if (is_wp_error($response)) {
            error_log('SMS sending failed: ' . $response->get_error_message());
        }
    }
}

new Fendi_Inventory_System_Notifications();
