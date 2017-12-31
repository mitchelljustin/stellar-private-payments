#!/usr/bin/env bash


SENDERS="GBXHWJAXBKA7AQWBFEGTSJW6N2W4PNTZTM6EPNWRPBAHCMTE7DHDZYEE GBEE74VGVPCV7Z4LCMYAKIOBNAA7M2R7OZRPJ3LAC5JRNT33E36M6L2G GAVCCVXN2GYMTZ4CGIVG4I6KZCUBLAYYAD2JKCIDTMUH3LZN2CCTJ2R7 GAUK5XVVS3X4IKCPWCGWTQ7USBHZILOTBGPASSEQV6TWFWKXNLVJX65U"
for sender in $SENDERS; do
    receiver=`./scripts/str-rand-addr.js`
    echo "FROM: ${sender}"
    echo "TO: ${receiver}"
    http -b POST :4000/start_private_payment amount=100.0 sender=${sender} receiver=${receiver}
done

