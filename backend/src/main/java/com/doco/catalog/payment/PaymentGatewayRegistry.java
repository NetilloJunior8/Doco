package com.doco.catalog.payment;

import com.doco.catalog.domain.enums.PaymentProviderType;
import com.doco.catalog.exception.ResourceNotFoundException;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class PaymentGatewayRegistry {

    private final Map<PaymentProviderType, PaymentGateway> gateways = new EnumMap<>(PaymentProviderType.class);

    public PaymentGatewayRegistry(List<PaymentGateway> implementations) {
        for (PaymentGateway gateway : implementations) {
            gateways.put(gateway.provider(), gateway);
        }
    }

    public PaymentGateway get(PaymentProviderType provider) {
        PaymentGateway gateway = gateways.get(provider);
        if (gateway == null) {
            throw new ResourceNotFoundException("Proveedor de pago no disponible: " + provider);
        }
        return gateway;
    }
}
