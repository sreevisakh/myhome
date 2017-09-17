#!/bin/bash

sudo hcitool cc A0:D7:95:CC:43:29 2> /dev/null

while true
do
    bt=$(hcitool rssi A0:D7:95:CC:43:29 2> /dev/null)
    if [ "$bt" == "" ]; then
        sudo hcitool cc A0:D7:95:CC:43:29  2> /dev/null
        bt=$(hcitool rssi A0:D7:95:CC:43:29 2> /dev/null)
    fi

    echo "$bt"
done