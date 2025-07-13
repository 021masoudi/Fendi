import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';

const Receipt = ({ order }) => {
  const [template, setTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This assumes we have a way to get the *active* receipt template
    // For now, we'll fetch all and use the first one.
    api.getPrintTemplates().then(response => {
        const receiptTemplate = response.data.find(t => t.meta._type && t.meta._type[0] === 'receipt');
        if (receiptTemplate) {
            setTemplate(receiptTemplate.post_content);
        } else {
            // Fallback to a default simple template
            setTemplate('<h2>Receipt</h2><p>Order ID: {{order_id}}</p><div>{{line_items}}</div><p><b>Total: {{total}}</b></p>');
        }
        setIsLoading(false);
    });
  }, []);

  if (isLoading || !order) return <p>{__('Loading receipt...', 'fendi-inventory-system')}</p>;

  const lineItemsHtml = order.line_items.map(item =>
    `<p>${item.name} x${item.quantity} - ${item.total}</p>`
  ).join('');

  let processedHtml = template
    .replace(/{{order_id}}/g, order.id)
    .replace(/{{order_date}}/g, new Date(order.date_created.date).toLocaleString())
    .replace(/{{customer_name}}/g, `${order.billing.first_name} ${order.billing.last_name}`)
    .replace(/{{line_items}}/g, lineItemsHtml)
    .replace(/{{total}}/g, order.total);

  return (
    <div className="p-4 bg-white text-black" dangerouslySetInnerHTML={{ __html: processedHtml }} />
  );
};

export default Receipt;
