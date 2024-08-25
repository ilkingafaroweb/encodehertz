import { useState, useEffect } from 'react';

type ExtraChargeItem = {
    quantity: number | string;
    customerPrice: number | string;
    outsourcePrice: number | string;
};

function useTotalPrices(
    priceToCustomer: number | string,
    priceToSupplier: number | string,
    selectedExtraCharges: ExtraChargeItem[]
) {
    const [summaryCustomer, setSummaryCustomer] = useState<number>(0);
    const [summarySupplier, setSummarySupplier] = useState<number>(0);

    useEffect(() => {
        if (priceToCustomer || priceToSupplier || selectedExtraCharges) {
            const totalCustomer = selectedExtraCharges.reduce(
                (acc: number, item: ExtraChargeItem) => acc + (+item.quantity || 0) * (+item.customerPrice || 0),
                +priceToCustomer || 0
            );

            const totalSupplier = selectedExtraCharges.reduce(
                (acc: number, item: ExtraChargeItem) => acc + (+item.quantity || 0) * (+item.outsourcePrice || 0),
                +priceToSupplier || 0
            );

            const formattedPriceToCustomer = parseFloat(totalCustomer.toFixed(2));
            const formattedPriceToSupplier = parseFloat(totalSupplier.toFixed(2));

            setSummaryCustomer(formattedPriceToCustomer);
            setSummarySupplier(formattedPriceToSupplier);
        }
    }, [priceToCustomer, priceToSupplier, selectedExtraCharges]);

    return { summaryCustomer, summarySupplier };
}

export default useTotalPrices;
