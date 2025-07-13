import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';

const TimeClock = ({ currentUser }) => {
    const [lastLog, setLastLog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (currentUser) {
            api.getLastTimeLog().then(response => {
                setLastLog(response.data);
                setIsLoading(false);
            });
        }
    }, [currentUser]);

    const handleClockIn = () => {
        setIsProcessing(true);
        api.clockIn().then(response => {
            setLastLog(response.data);
            setIsProcessing(false);
        });
    };

    const handleClockOut = () => {
        setIsProcessing(true);
        api.clockOut(lastLog.ID).then(response => {
            setLastLog(response.data);
            setIsProcessing(false);
        });
    };

    if (isLoading) {
        return <div className="text-center p-4">{__('Loading Time Clock...', 'fendi-inventory-system')}</div>;
    }

    const hasClockedIn = lastLog && lastLog.clock_in && !lastLog.clock_out;

    return (
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h2 className="text-xl font-bold mb-4">{__('Time Clock', 'fendi-inventory-system')}</h2>
            <div className="flex justify-center space-x-4">
                <button
                    onClick={handleClockIn}
                    disabled={isProcessing || hasClockedIn}
                    className={`px-6 py-3 font-semibold rounded-md ${hasClockedIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                    {__('Clock In', 'fendi-inventory-system')}
                </button>
                <button
                    onClick={handleClockOut}
                    disabled={isProcessing || !hasClockedIn}
                    className={`px-6 py-3 font-semibold rounded-md ${!hasClockedIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                >
                    {__('Clock Out', 'fendi-inventory-system')}
                </button>
            </div>
            {lastLog && lastLog.clock_in && (
                 <p className="mt-4 text-sm text-gray-600">
                    {__('Last clock in:', 'fendi-inventory-system')} {new Date(lastLog.clock_in).toLocaleString()}
                 </p>
            )}
        </div>
    );
};

export default TimeClock;
