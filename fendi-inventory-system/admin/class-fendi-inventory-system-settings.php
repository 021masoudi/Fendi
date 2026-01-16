<?php

class Fendi_Inventory_System_Settings {

    public function __construct() {
        add_action('admin_menu', array($this, 'add_settings_page'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    public function add_settings_page() {
        add_submenu_page(
            'fendi-inventory-system',
            __('Settings', 'fendi-inventory-system'),
            __('Settings', 'fendi-inventory-system'),
            'manage_options',
            'fendi-inventory-settings',
            array($this, 'render_settings_page')
        );
    }

    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('Fendi Inventory System Settings', 'fendi-inventory-system'); ?></h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('fendi_inventory_settings');
                do_settings_sections('fendi-inventory-settings');
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }

    public function register_settings() {
        register_setting('fendi_inventory_settings', 'fendi_low_stock_threshold');
        register_setting('fendi_inventory_settings', 'fendi_high_sales_threshold');
        register_setting('fendi_inventory_settings', 'fendi_high_sales_period');
        register_setting('fendi_inventory_settings', 'fendi_sms_api_key');
        register_setting('fendi_inventory_settings', 'fendi_sms_sender_number');
        register_setting('fendi_inventory_settings', 'fendi_sms_api_url');
        register_setting('fendi_inventory_settings', 'fendi_thank_you_sms_enabled');
        register_setting('fendi_inventory_settings', 'fendi_thank_you_sms_template');
        register_setting('fendi_inventory_settings', 'fendi_daily_sales_report_enabled');
        register_setting('fendi_inventory_settings', 'fendi_daily_sales_report_recipients');
        register_setting('fendi_inventory_settings', 'fendi_daily_sales_report_time');

        add_settings_section(
            'fendi_alerts_section',
            __('Alerts', 'fendi-inventory-system'),
            null,
            'fendi-inventory-settings'
        );

        add_settings_field(
            'fendi_low_stock_threshold',
            __('Low Stock Threshold', 'fendi-inventory-system'),
            array($this, 'render_low_stock_threshold_field'),
            'fendi-inventory-settings',
            'fendi_alerts_section'
        );

        add_settings_field(
            'fendi_high_sales_threshold',
            __('High Sales Threshold', 'fendi-inventory-system'),
            array($this, 'render_high_sales_threshold_field'),
            'fendi-inventory-settings',
            'fendi_alerts_section'
        );

        add_settings_field(
            'fendi_high_sales_period',
            __('High Sales Period (in hours)', 'fendi-inventory-system'),
            array($this, 'render_high_sales_period_field'),
            'fendi-inventory-settings',
            'fendi_alerts_section'
        );

        add_settings_section(
            'fendi_sms_section',
            __('SMS Settings', 'fendi-inventory-system'),
            null,
            'fendi-inventory-settings'
        );

        add_settings_field(
            'fendi_sms_api_key',
            __('SMS API Key', 'fendi-inventory-system'),
            array($this, 'render_sms_api_key_field'),
            'fendi-inventory-settings',
            'fendi_sms_section'
        );

        add_settings_field(
            'fendi_sms_sender_number',
            __('SMS Sender Number', 'fendi-inventory-system'),
            array($this, 'render_sms_sender_number_field'),
            'fendi-inventory-settings',
            'fendi_sms_section'
        );

        add_settings_field(
            'fendi_sms_api_url',
            __('SMS API URL', 'fendi-inventory-system'),
            array($this, 'render_sms_api_url_field'),
            'fendi-inventory-settings',
            'fendi_sms_section'
        );

        add_settings_field(
            'fendi_thank_you_sms_enabled',
            __('Enable Thank You SMS', 'fendi-inventory-system'),
            array($this, 'render_thank_you_sms_enabled_field'),
            'fendi-inventory-settings',
            'fendi_sms_section'
        );

        add_settings_field(
            'fendi_thank_you_sms_template',
            __('Thank You SMS Template', 'fendi-inventory-system'),
            array($this, 'render_thank_you_sms_template_field'),
            'fendi-inventory-system',
            'fendi_sms_section'
        );

        add_settings_field(
            'fendi_daily_sales_report_enabled',
            __('Enable Daily Sales Report SMS', 'fendi-inventory-system'),
            array($this, 'render_daily_sales_report_enabled_field'),
            'fendi-inventory-settings',
            'fendi_sms_section'
        );

        add_settings_field(
            'fendi_daily_sales_report_recipients',
            __('Daily Sales Report Recipients', 'fendi-inventory-system'),
            array($this, 'render_daily_sales_report_recipients_field'),
            'fendi-inventory-settings',
            'fendi_sms_section'
        );

        add_settings_field(
            'fendi_daily_sales_report_time',
            __('Daily Sales Report Time', 'fendi-inventory-system'),
            array($this, 'render_daily_sales_report_time_field'),
            'fendi-inventory-settings',
            'fendi_sms_section'
        );
    }

    public function render_low_stock_threshold_field() {
        $value = get_option('fendi_low_stock_threshold');
        echo '<input type="number" name="fendi_low_stock_threshold" value="' . esc_attr($value) . '" />';
    }

    public function render_high_sales_threshold_field() {
        $value = get_option('fendi_high_sales_threshold');
        echo '<input type="number" name="fendi_high_sales_threshold" value="' . esc_attr($value) . '" />';
    }

    public function render_high_sales_period_field() {
        $value = get_option('fendi_high_sales_period');
        echo '<input type="number" name="fendi_high_sales_period" value="' . esc_attr($value) . '" />';
    }

    public function render_sms_api_key_field() {
        $value = get_option('fendi_sms_api_key');
        echo '<input type="text" name="fendi_sms_api_key" value="' . esc_attr($value) . '" class="regular-text" />';
    }

    public function render_sms_sender_number_field() {
        $value = get_option('fendi_sms_sender_number');
        echo '<input type="text" name="fendi_sms_sender_number" value="' . esc_attr($value) . '" class="regular-text" />';
    }

    public function render_sms_api_url_field() {
        $value = get_option('fendi_sms_api_url');
        echo '<input type="url" name="fendi_sms_api_url" value="' . esc_attr($value) . '" class="regular-text" />';
    }

    public function render_thank_you_sms_enabled_field() {
        $value = get_option('fendi_thank_you_sms_enabled');
        echo '<input type="checkbox" name="fendi_thank_you_sms_enabled" value="1" ' . checked(1, $value, false) . ' />';
    }

    public function render_thank_you_sms_template_field() {
        $value = get_option('fendi_thank_you_sms_template');
        echo '<textarea name="fendi_thank_you_sms_template" class="large-text">' . esc_textarea($value) . '</textarea>';
    }

    public function render_daily_sales_report_enabled_field() {
        $value = get_option('fendi_daily_sales_report_enabled');
        echo '<input type="checkbox" name="fendi_daily_sales_report_enabled" value="1" ' . checked(1, $value, false) . ' />';
    }

    public function render_daily_sales_report_recipients_field() {
        $value = get_option('fendi_daily_sales_report_recipients');
        echo '<input type="text" name="fendi_daily_sales_report_recipients" value="' . esc_attr($value) . '" class="regular-text" />';
    }

    public function render_daily_sales_report_time_field() {
        $value = get_option('fendi_daily_sales_report_time');
        echo '<input type="time" name="fendi_daily_sales_report_time" value="' . esc_attr($value) . '" />';
    }
}

new Fendi_Inventory_System_Settings();
