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
#include "lwip/apps/mqtt.h"

float read_onboard_temperature(const char);

int mqtt_connect(mqtt_client_t* mqtt_client, ip_addr_t* backend_ip);
int send_temperature_via_http(struct altcp_pcb* pcb);
int send_temperature_via_mqtt(mqtt_client_t* mqtt_client, ip_addr_t* backend_ip);

//
// TODO: check if stderr can be seperated on the client.
// TODO: consider making arrays dynamic. 
// TODO  handle disconnection, e.g., reconnection
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
        fprintf(stderr, "Failed to initialize cyw43 chip.\n");
        return 1;
    }
    cyw43_arch_enable_sta_mode();

    adc_init();
    adc_set_temp_sensor_enabled(true);
    adc_select_input(4);

    e = cyw43_arch_wifi_connect_timeout_ms(WIFI_SSID, WIFI_PASSWORD, CYW43_AUTH_WPA2_AES_PSK, 30000);
    if (e) {
        fprintf(stderr, "Failed to connect to the given WIFI network.\n");
        return 1;
    }

    ip_addr_t backend_ip; e = ipaddr_aton(BACKEND_IP, &backend_ip);
    if (e == 0) {
        fprintf(stderr, "Failed to convert BACKEND_IP to struct.\n");
        return 1;
    } 
    mqtt_client_t* mqtt_client = mqtt_client_new();
    if (mqtt_client == NULL) {
        fprintf(stderr, "Failed to initialize a MQTT client.\n");
        return 1;
    } 
    {
        cyw43_arch_lwip_begin();
        e = mqtt_connect(mqtt_client, &backend_ip); 
        if (e != 0) {
            fprintf(stderr, "MQTT connect error code: %d\n", e); 
            return e;
        }
        cyw43_arch_lwip_end();
    }
    
    while (true) {
        sleep_ms(250);
        cyw43_arch_gpio_put(CYW43_WL_GPIO_LED_PIN, 1);
        sleep_ms(250);
        cyw43_arch_gpio_put(CYW43_WL_GPIO_LED_PIN, 0);
        
        int _ = send_temperature_via_mqtt(mqtt_client, &backend_ip);
    }
    
    if (mqtt_client != NULL) mqtt_client_free(mqtt_client);
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

int mqtt_connect(mqtt_client_t* mqtt_client, ip_addr_t* backend_ip) {
    void on_connection(mqtt_client_t *mqtt_client, void *arg, mqtt_connection_status_t status) {
        fprintf(stderr, "MQTT on connection, status code: %d.\n", status);
    }
    struct mqtt_connect_client_info_t client_info;
    memset(&client_info, 0, sizeof(client_info));
    client_info.client_id = "picow_poc";
    client_info.client_user = "test-user";
    client_info.client_pass = "test-password";
    client_info.keep_alive = 10;
    int e = mqtt_client_connect(mqtt_client, backend_ip, 1885, on_connection, NULL, &client_info);
    if (e != ERR_OK) {
        fprintf(stderr, "Failed to connect to MQTT broker.\n");
        return 1;
    }
    return 0;
}

int send_temperature_via_http(struct altcp_pcb* pcb) {
    float onboard_temperature = read_onboard_temperature('C');
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
    int e = altcp_write(pcb, sensor_payload, strlen(sensor_payload), TCP_WRITE_FLAG_COPY);
    cyw43_arch_lwip_end();
    if (e != ERR_OK) {
        fprintf(stderr, "Failed to write TCP data, error code: %d\n", e);
        return e;
    }
    cyw43_arch_lwip_begin();
    e = altcp_output(pcb);
    if (e != ERR_OK) {
        fprintf(stderr, "Failed to send TCP data, error code: %d\n", e);
        return e;
    }
    cyw43_arch_lwip_end();
    return 0;
}

int send_temperature_via_mqtt(mqtt_client_t* mqtt_client, ip_addr_t* backend_ip) {
    float onboard_temperature = read_onboard_temperature('C');
    int max_length = 800;
    char body_payload[max_length]; snprintf(
        body_payload, max_length, "{"
            "\"time\": \"2012-04-23T18:25:43.511Z\","
            "\"type\": \"temperature\","
            "\"sensorId\": \"picow_poc\","
            "\"units\": \"°C\","
            "\"data\": \"%f\""
        "}", 
        onboard_temperature
    );

    void on_publish(void* arg, err_t e) {
        fprintf(stderr, "MQTT publish, error code: %d.\n", e);
    }
    cyw43_arch_lwip_begin();
    int e = mqtt_publish(
        mqtt_client, 
        "ibm/temperature", 
        body_payload, strlen(body_payload), 
        2, 0, on_publish, NULL
    );
    cyw43_arch_lwip_end();
    if (e != ERR_OK) {
        fprintf(stderr, "Failed to publish MQTT message, error code: %d.\n", e);
        return e;
    }
    return 0;
}
