import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
// We'll need a code editor component, for now we use a simple textarea
// import Editor from 'react-simple-code-editor';
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/themes/prism.css';

const TemplateBuilder = ({ template, onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('receipt');
    const [content, setContent] = useState('<h1>{{store_name}}</h1><p>Order ID: {{order_id}}</p>');

    useEffect(() => {
        if (template) {
            setTitle(template.title || '');
            setType(template.type || 'receipt');
            setContent(template.content || '');
        }
    }, [template]);

    const handleSave = () => {
        onSave({
            id: template ? template.id : null,
            title,
            type,
            content,
        });
    };

    const placeholders = {
        receipt: ['{{store_name}}', '{{order_id}}', '{{order_date}}', '{{customer_name}}', '{{line_items}}', '{{total}}'],
        barcode_label: ['{{product_name}}', '{{product_price}}', '{{barcode_svg}}'],
    };

    return (
        <div className="grid grid-cols-3 gap-6 p-4">
            <div className="col-span-2 space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={__('Template Name', 'fendi-inventory-system')}
                    className="w-full text-lg font-bold p-2 border-b-2"
                />
                 <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="receipt">{__('Receipt Template', 'fendi-inventory-system')}</option>
                    <option value="barcode_label">{__('Barcode Label Template', 'fendi-inventory-system')}</option>
                </select>
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full h-96 font-mono p-2 border rounded-md"
                />
            </div>
            <div className="col-span-1 bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold mb-2">{__('Available Placeholders', 'fendi-inventory-system')}</h3>
                <ul className="space-y-1">
                    {placeholders[type].map(p => <li key={p}><code className="bg-gray-200 p-1 rounded text-sm">{p}</code></li>)}
                </ul>
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">{__('Cancel', 'fendi-inventory-system')}</button>
                    <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md">{__('Save Template', 'fendi-inventory-system')}</button>
                </div>
            </div>
        </div>
    );
};

export default TemplateBuilder;
