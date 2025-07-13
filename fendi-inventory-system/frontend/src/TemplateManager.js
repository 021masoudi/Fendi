import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';
import Modal from './Modal';
import TemplateBuilder from './TemplateBuilder';

const TemplateManager = () => {
    const [templates, setTemplates] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = () => {
        // api.getPrintTemplates().then(response => {
        //     setTemplates(response.data);
        // });
    };

    const handleSave = (templateData) => {
        const apiCall = templateData.id
            ? api.updatePrintTemplate(templateData.id, templateData)
            : api.createPrintTemplate(templateData);

        apiCall.then(() => {
            loadTemplates();
            setIsModalOpen(false);
        });
    };

    const handleDelete = (id) => {
        if (window.confirm(__('Are you sure you want to delete this template?', 'fendi-inventory-system'))) {
            api.deletePrintTemplate(id).then(() => {
                loadTemplates();
            });
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{__('Print Template Management', 'fendi-inventory-system')}</h1>
            <div className="text-right mb-4">
                <button onClick={() => { setEditingTemplate(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm">
                    {__('Create New Template', 'fendi-inventory-system')}
                </button>
            </div>
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} size="large">
                    <TemplateBuilder
                        template={editingTemplate}
                        onSave={handleSave}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            )}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                     <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Template Name', 'fendi-inventory-system')}</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Type', 'fendi-inventory-system')}</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Mock data */}
                        <tr>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">Default Receipt</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">Receipt</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                <button onClick={() => { setEditingTemplate({}); setIsModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4">{__('Edit', 'fendi-inventory-system')}</button>
                                <button className="text-red-600 hover:text-red-900">{__('Delete', 'fendi-inventory-system')}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TemplateManager;
