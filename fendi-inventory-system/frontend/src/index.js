import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

document.addEventListener('DOMContentLoaded', function () {
  var element = document.getElementById('fendi-inventory-system-admin');
  if (typeof element !== 'undefined' && element !== null) {
    ReactDOM.render(<App />, document.getElementById('fendi-inventory-system-admin'));
  }
});

if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then(sw => {
    sw.sync.register('sync-sales');
  });
}
