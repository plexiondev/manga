// visual logging


let em_log_parent = document.getElementById('log_parent');

const log_icons = {
    'general': 'info',
    'error': 'alert-octagon',
    'warning': 'alert-triangle',
    'enabled': 'check-circle',
    'disabled': 'x-circle',
    'debug': 'code',
    'search': 'search',
    'auth': 'lock'
};
const log_headers = {
    'general': 'General',
    'error': 'Error',
    'warning': 'Warning',
    'enabled': 'Settings',
    'disabled': 'Settings',
    'debug': 'Debug',
    'search': 'Search',
    'auth': 'Authorisation'
};

const log_raw_icons = {
    'general': '⏺️',
    'error': '❌',
    'warning': '⚠️',
    'enabled': '✅',
    'disabled': '❎',
    'debug': '💾',
    'search': '🔎',
    'auth': '🔒'
};

function log(type,details,advanced) {
    if (advanced == true && localStorage.getItem('op_show_debug') == 1) {
        // debug-only

        let em_log = document.createElement('span');
        em_log.classList.add('log');
    
        // info
        em_log.innerHTML = (`
        <span class="icon"><i class="icon w-32" data-feather="${log_icons[type]}"></i></span>
        <span class="info"><span><h5>${log_headers[type]}</h5><p>${details}</p></span></span>
        `);
    
        // append
        em_log_parent.appendChild(em_log);
        feather.replace();
    
        // auto-hide after timeout
        setTimeout(function() {
            em_log.classList.add('hide');
            setTimeout(function() {
                em_log_parent.removeChild(em_log);    
            }, 200);  
        }, 4000);
    
        // log to console
        console.log(`[${log_raw_icons[type]}] ${details}`);
    } else if (advanced == false) {
        // normal-level

        let em_log = document.createElement('span');
        em_log.classList.add('log');

        // info
        em_log.innerHTML = (`
        <span class="icon"><i class="icon w-32" data-feather="${log_icons[type]}"></i></span>
        <span class="info"><span><h5>${log_headers[type]}</h5><p>${details}</p></span></span>
        `);

        // append
        em_log_parent.appendChild(em_log);
        feather.replace();

        // auto-hide after timeout
        setTimeout(function() {
            em_log.classList.add('hide');
            setTimeout(function() {
                em_log_parent.removeChild(em_log);    
            }, 200);  
        }, 4000);

        // log to console
        console.log(`[${log_raw_icons[type]}] ${details}`);
    }
}