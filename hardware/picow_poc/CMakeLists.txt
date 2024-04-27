cmake_minimum_required(VERSION 3.13)

# initialize pico-sdk from GIT
# (note this can come from environment, CMake cache etc)
set(PICO_SDK_FETCH_FROM_GIT on)

# pico_sdk_import.cmake is a single file copied from this SDK
# note: this must happen before project()
include(pico_sdk_import.cmake)

project(picow_poc)

# initialize the Raspberry Pi Pico SDK
pico_sdk_init()

# rest of your project
add_executable(main
    main.c
)

pico_enable_stdio_usb(main 1)
pico_enable_stdio_uart(main 0)

target_compile_definitions(
    main PRIVATE
    WIFI_SSID=\"${WIFI_SSID}\"
    WIFI_PASSWORD=\"${WIFI_PASSWORD}\"
    BACKEND_IP=\"${BACKEND_IP}\"
)

# Add pico_stdlib library which aggregates commonly used features
target_link_libraries(
    main
    pico_stdlib
    pico_cyw43_arch_none
    hardware_adc
    pico_cyw43_arch_lwip_threadsafe_background
    pico_lwip_mbedtls
    pico_lwip_mqtt
    pico_mbedtls
)
target_include_directories(main PRIVATE
    ${CMAKE_CURRENT_LIST_DIR}
    ${CMAKE_CURRENT_LIST_DIR}/.. # for our common lwipopts
)

# create map/bin/hex/uf2 file in addition to ELF.
pico_add_extra_outputs(main)

# Ignore warnings from lwip code
set_source_files_properties(
    ${PICO_LWIP_PATH}/src/apps/altcp_tls/altcp_tls_mbedtls.c
    PROPERTIES
    COMPILE_OPTIONS "-Wno-unused-result"
)
