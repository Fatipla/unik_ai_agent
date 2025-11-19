<?php
/**
 * Plugin Name: Unik AI Agent
 * Plugin URI: https://agent.unik.ai
 * Description: Embed the Unik AI chatbot widget on your WordPress site
 * Version: 1.0.0
 * Author: Unik AI
 * Author URI: https://agent.unik.ai
 * License: GPL2
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Add settings page
add_action('admin_menu', 'unik_ai_agent_menu');

function unik_ai_agent_menu() {
    add_options_page(
        'Unik AI Agent Settings',
        'Unik AI Agent',
        'manage_options',
        'unik-ai-agent',
        'unik_ai_agent_settings_page'
    );
}

function unik_ai_agent_settings_page() {
    ?>
    <div class="wrap">
        <h1>Unik AI Agent Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('unik_ai_agent_settings');
            do_settings_sections('unik-ai-agent');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

// Register settings
add_action('admin_init', 'unik_ai_agent_settings_init');

function unik_ai_agent_settings_init() {
    register_setting('unik_ai_agent_settings', 'unik_ai_agent_id');
    register_setting('unik_ai_agent_settings', 'unik_ai_lang');
    register_setting('unik_ai_agent_settings', 'unik_ai_theme');
    register_setting('unik_ai_agent_settings', 'unik_ai_brand_color');
    register_setting('unik_ai_agent_settings', 'unik_ai_greeting');

    add_settings_section(
        'unik_ai_agent_section',
        'Widget Configuration',
        'unik_ai_agent_section_callback',
        'unik-ai-agent'
    );

    add_settings_field(
        'agent_id',
        'Agent ID',
        'unik_ai_agent_id_render',
        'unik-ai-agent',
        'unik_ai_agent_section'
    );

    add_settings_field(
        'lang',
        'Language',
        'unik_ai_lang_render',
        'unik-ai-agent',
        'unik_ai_agent_section'
    );

    add_settings_field(
        'theme',
        'Theme',
        'unik_ai_theme_render',
        'unik-ai-agent',
        'unik_ai_agent_section'
    );

    add_settings_field(
        'brand_color',
        'Brand Color',
        'unik_ai_brand_color_render',
        'unik-ai-agent',
        'unik_ai_agent_section'
    );

    add_settings_field(
        'greeting',
        'Greeting Message',
        'unik_ai_greeting_render',
        'unik-ai-agent',
        'unik_ai_agent_section'
    );
}

function unik_ai_agent_section_callback() {
    echo '<p>Enter your Unik AI Agent configuration below. Get your Agent ID from your <a href="https://agent.unik.ai/dashboard" target="_blank">Unik AI dashboard</a>.</p>';
}

function unik_ai_agent_id_render() {
    $value = get_option('unik_ai_agent_id', '');
    echo '<input type="text" name="unik_ai_agent_id" value="' . esc_attr($value) . '" size="50" required>';
}

function unik_ai_lang_render() {
    $value = get_option('unik_ai_lang', 'en');
    ?>
    <select name="unik_ai_lang">
        <option value="en" <?php selected($value, 'en'); ?>>English</option>
        <option value="de" <?php selected($value, 'de'); ?>>German</option>
        <option value="al" <?php selected($value, 'al'); ?>>Albanian</option>
    </select>
    <?php
}

function unik_ai_theme_render() {
    $value = get_option('unik_ai_theme', 'light');
    ?>
    <select name="unik_ai_theme">
        <option value="light" <?php selected($value, 'light'); ?>>Light</option>
        <option value="dark" <?php selected($value, 'dark'); ?>>Dark</option>
    </select>
    <?php
}

function unik_ai_brand_color_render() {
    $value = get_option('unik_ai_brand_color', '#624CAB');
    echo '<input type="text" name="unik_ai_brand_color" value="' . esc_attr($value) . '" size="10">';
    echo '<p class="description">Hex color code (e.g., #624CAB)</p>';
}

function unik_ai_greeting_render() {
    $value = get_option('unik_ai_greeting', '👋 Hello! How can I help you today?');
    echo '<input type="text" name="unik_ai_greeting" value="' . esc_attr($value) . '" size="50">';
}

// Add widget script to footer
add_action('wp_footer', 'unik_ai_agent_widget_script');

function unik_ai_agent_widget_script() {
    $agent_id = get_option('unik_ai_agent_id', '');
    
    if (empty($agent_id)) {
        return;
    }

    $lang = get_option('unik_ai_lang', 'en');
    $theme = get_option('unik_ai_theme', 'light');
    $brand_color = get_option('unik_ai_brand_color', '#624CAB');
    $greeting = get_option('unik_ai_greeting', '👋 Hello! How can I help you today?');

    ?>
    <script
        src="https://agent.unik.ai/widget.js"
        data-agent-id="<?php echo esc_attr($agent_id); ?>"
        data-lang="<?php echo esc_attr($lang); ?>"
        data-theme="<?php echo esc_attr($theme); ?>"
        data-brand-color="<?php echo esc_attr($brand_color); ?>"
        data-greeting="<?php echo esc_attr($greeting); ?>"
        defer
    ></script>
    <?php
}
