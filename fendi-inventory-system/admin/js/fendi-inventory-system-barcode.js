(function($) {
    'use strict';

    $(function() {
        $('#fendi-generate-barcode').on('click', function() {
            var productId = $(this).data('product-id');
            var sku = $('#_sku').val();
            var barcodeValue = sku || productId;

            if (barcodeValue) {
                JsBarcode('#fendi-barcode', barcodeValue, {
                    format: 'CODE128',
                    lineColor: '#000',
                    width: 2,
                    height: 40,
                    displayValue: true
                });
                $('#fendi-barcode-modal').show();
            }
        });

        $('#fendi-close-barcode-modal').on('click', function() {
            $('#fendi-barcode-modal').hide();
        });

        $('#fendi-print-barcode').on('click', function() {
            window.print();
        });
    });

})(jQuery);
