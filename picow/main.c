/**
 * Copyright (c) 2022 Raspberry Pi (Trading) Ltd.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

#include <stdio.h>
#include "pico/stdlib.h"
#include "pico/cyw43_arch.h"
#include "hardware/adc.h"
#include "lwip/altcp.h"
#include "lwip/altcp_tcp.h"
#include "lwip/altcp_tls.h"
#include "lwip/pbuf.h"
#include "lwip/dns.h"

#define TEMPERATURE_UNITS 'C'
#define TLS_CLIENT_HTTP_REQUEST  "GET / HTTP/1.1\r\n" \
                                 "\r\n"

static err_t on_tcp_connection_success(void *arg, struct altcp_pcb *pcb, err_t e);
int has_connected = 0;
int write_e = 0;
int send_e = 0;
static void on_tcp_error(void *arg, err_t e);
int generic_e = 0;

float read_onboard_temperature(const char);

//
// Just a proof of concept for bare-metal micro-processor / sensor integration.
// There's pico SDKs and examples- this is mainly cobbling them together.
// The SDK codes themselves (i.e., https://github.com/raspberrypi/pico-sdk) are pretty good to get a
// concrete understanding of what we're dealing with programming against bare-metal.
//
// TODO: have not found a good way to debug; board does not await for the serial connection to begin running.
// As such, stdout before connection will get lost.
//
int main() {
    stdio_init_all();
    printf("Testing if serial communication is buffered.\n");

    int country_e = cyw43_arch_init_with_country(CYW43_COUNTRY_AUSTRALIA);
    if (country_e) {
        printf("Failed to initialize cyw43 chip.\n");
        return 1;
    }
    cyw43_arch_enable_sta_mode();

    adc_init();
    adc_set_temp_sensor_enabled(true);
    adc_select_input(4);

    int connect_e = cyw43_arch_wifi_connect_timeout_ms(WIFI_SSID, WIFI_PASSWORD, CYW43_AUTH_WPA2_AES_PSK, 30000);
    if (connect_e) {
        printf("Failed to connect to the given WIFI network.\n");
        return 1;
    }
    int tcp_e = 0;
    // TODO: make this a build parameter.
    ip_addr_t address; IP4_ADDR(&address, 192,168,1,7);
    int port = 8000;
    {
        cyw43_arch_lwip_begin();

        struct altcp_pcb* pcb = altcp_new(NULL);
        altcp_err(pcb, on_tcp_error);
        tcp_e = altcp_connect(pcb, &address, port, on_tcp_connection_success);
        
        cyw43_arch_lwip_end();
    }
    
    read_onboard_temperature(TEMPERATURE_UNITS);
    while (true) {
        cyw43_arch_gpio_put(CYW43_WL_GPIO_LED_PIN, 1);
        sleep_ms(250);
        cyw43_arch_gpio_put(CYW43_WL_GPIO_LED_PIN, 0);
        sleep_ms(250);
        printf("WIFI country set error code: %d\n", country_e);
        printf("WIFI connection error code: %d\n", connect_e);
        printf("IP: %s, port: %d\n", ipaddr_ntoa(&address), port);
        printf("TCP connection error code: %d\n", tcp_e);
        printf("Has connected: %d\n", has_connected);
        printf("Error writing data: %d\n", write_e);
        printf("Error sending data: %d\n", send_e);
        printf("Generic: %d\n", generic_e);
    }
}

static err_t on_tcp_connection_success(void *arg, struct altcp_pcb *pcb, err_t e) {
    has_connected = 1;
    write_e = altcp_write(pcb, TLS_CLIENT_HTTP_REQUEST, strlen(TLS_CLIENT_HTTP_REQUEST), TCP_WRITE_FLAG_COPY);
    send_e = altcp_output(pcb);

    return ERR_OK;
}

static void on_tcp_error(void *arg, err_t e) {
    generic_e = e;
}

float read_onboard_temperature(const char unit) {
    /* 12-bit conversion, assume max value == ADC_VREF == 3.3 V */
    const float conversionFactor = 3.3f / (1 << 12);

    float adc = (float)adc_read() * conversionFactor;
    float tempC = 27.0f - (adc - 0.706f) / 0.001721f;

    if (unit == 'C') {
        return tempC;
    } else if (unit == 'F') {
        return tempC * 9 / 5 + 32;
    }

    return -1.0f;
}
