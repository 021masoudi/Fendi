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
        $threshold = get_option('fendi_low_stock_threshold', 10);
        $products = wc_get_products(array('status' => 'publish', 'limit' => -1));
        foreach ($products as $product) {
            if ($product->get_stock_quantity() < $threshold) {
                $this->create_notification(
                    __('Low Stock Alert', 'fendi-inventory-system'),
                    sprintf(__('Product %s is low on stock.', 'fendi-inventory-system'), $product->get_name())
                );
            }
        }
    }

    public function check_high_sales() {
        $threshold = get_option('fendi_high_sales_threshold', 100);
        $period = get_option('fendi_high_sales_period', 24);
        $products = wc_get_products(array('status' => 'publish', 'limit' => -1));
        foreach ($products as $product) {
            $sales = $this->get_sales_in_period($product->get_id(), $period);
            if ($sales > $threshold) {
                $this->create_notification(
                    __('High Sales Alert', 'fendi-inventory-system'),
                    sprintf(__('Product %s has high sales.', 'fendi-inventory-system'), $product->get_name())
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

    private function create_notification($title, $content) {
        wp_insert_post(array(
            'post_type' => 'notification',
            'post_title' => $title,
            'post_content' => $content,
            'post_status' => 'publish',
        ));
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
