// #include <stdlib.h> - this results in a runtime error btw.
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include "pico/stdlib.h"
#include "pico/cyw43_arch.h"
#include "hardware/adc.h"
#include "lwip/altcp.h"
#include "lwip/altcp_tcp.h"
#include "lwip/altcp_tls.h"
#include "lwip/pbuf.h"
#include "lwip/dns.h"

float read_onboard_temperature(const char);

//
// Just a proof of concept for bare-metal micro-processor / sensor integration.
// There's pico SDKs and examples- this is mainly cobbling them together.
// The SDK codes themselves (i.e., https://github.com/raspberrypi/pico-sdk) are pretty good to get a
// concrete understanding of what we're dealing with programming against bare-metal.
//
int main() {
    stdio_init_all();
    
    while (true) {
        sleep_ms(100);

        char input_character = getchar();
        if (input_character == EOF) {
            printf("EOF detected in input.\n");
            continue;
        } else if (ferror(stdin)) {
            printf("Reading stdin failed.\n");
            continue;
        }

        if (input_character == 'g') {
            printf("Proceeding.\n");
            break;
        } else {
            printf("To proceed, input needs to have a g in it.\n");
        }
    }

    int e = cyw43_arch_init_with_country(CYW43_COUNTRY_AUSTRALIA);
    if (e) {
        printf("Failed to initialize cyw43 chip.\n");
        return 1;
    }
    cyw43_arch_enable_sta_mode();

    adc_init();
    adc_set_temp_sensor_enabled(true);
    adc_select_input(4);

    e = cyw43_arch_wifi_connect_timeout_ms(WIFI_SSID, WIFI_PASSWORD, CYW43_AUTH_WPA2_AES_PSK, 30000);
    if (e) {
        printf("Failed to connect to the given WIFI network.\n");
        return 1;
    }
    struct altcp_pcb* pcb = altcp_new(NULL);
    {
        cyw43_arch_lwip_begin();

        void on_error(void *arg, err_t e) {
            printf("Generic TCP error: %d\n", e);
        }
        altcp_err(pcb, on_error);
        errno = 0; long int ip_part_1 = strtol(BACKEND_IP_PART_1, NULL, 10);         
        if (errno) {
            printf("Failed to convert part 1 of IP.\n");
            return 1;
        } 
        errno = 0; long int ip_part_2 = strtol(BACKEND_IP_PART_2, NULL, 10);         
        if (errno) {
            printf("Failed to convert part 2 of IP.\n");
            return 1;
        } 
        errno = 0; long int ip_part_3 = strtol(BACKEND_IP_PART_3, NULL, 10);         
        if (errno) {
            printf("Failed to convert part 3 of IP.\n");
            return 1;
        } 
        errno = 0; long int ip_part_4 = strtol(BACKEND_IP_PART_4, NULL, 10);         
        if (errno) {
            printf("Failed to convert part 4 of IP.\n");
            return 1;
        } 
        ip_addr_t address; IP4_ADDR(
            &address, 
            ip_part_1 & 0xFF, 
            ip_part_2 & 0xFF, 
            ip_part_3 & 0xFF, 
            ip_part_4 & 0xFF
        );
        err_t on_connection(void *arg, struct altcp_pcb *pcb, err_t e) {
            fprintf(stderr, "Connect callback error code: %d\n", e); 
            return e;
        }
        e = altcp_connect(pcb, &address, 8000, on_connection);
        if (e != 0) {
            printf("TCP connection error code: %d\n", e);
        }
        
        cyw43_arch_lwip_end();
    }
    
    while (true) {
        sleep_ms(250);
        cyw43_arch_gpio_put(CYW43_WL_GPIO_LED_PIN, 1);
        sleep_ms(250);
        cyw43_arch_gpio_put(CYW43_WL_GPIO_LED_PIN, 0);

        float onboard_temperature = read_onboard_temperature('C');
        // TODO: consider making this dynamic. And yes, truncation station.
        int max_length = 800;
        char body_payload[max_length]; snprintf(
            body_payload, max_length, 
            "onboardTemperature=%f\r\n", 
            onboard_temperature
        );

        int _max_length = 1000;
        char sensor_payload[_max_length]; snprintf(
            sensor_payload, max_length, 
            "POST /some-endpoint HTTP/1.1\r\n" \
            "Content-Length: %d\r\n" \
            "\r\n" \
            "%s", 
            strlen(body_payload), body_payload
        );

        cyw43_arch_lwip_begin();
        // TODO: check if stderr can be seperated on the client.
        e = altcp_write(pcb, sensor_payload, strlen(sensor_payload), TCP_WRITE_FLAG_COPY);
        fprintf(stderr, "Write error code: %d\n", e);
        e = altcp_output(pcb);
        fprintf(stderr, "Send error code: %d\n", e);
        cyw43_arch_lwip_end();
    }
    
    altcp_close(pcb);
}

float read_onboard_temperature(char unit) {
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
