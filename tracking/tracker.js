/**
 * MailFlow Site Tracker  v1.0.0
 * ─────────────────────────────
 * Drop-in client-side tracking script.
 *
 * Loader snippet (paste in <head>):
 *
 *   <script>
 *     (function(e,t,o,n,p,r,i){
 *       e.visitorGlobalObjectAlias=n;
 *       e[n]=e[n]||function(){(e[n].q=e[n].q||[]).push(arguments)};
 *       e[n].l=(new Date).getTime();
 *       r=t.createElement("script");r.src=o;r.async=true;
 *       i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i);
 *     })(window,document,"https://cdn.yourdomain.com/tracker.js","vgo");
 *     vgo('setAccount', 'YOUR_ACCOUNT_ID');
 *     vgo('setTrackByDefault', true);
 *     vgo('process');
 *   </script>
 *
 * Public API:
 *   vgo('setAccount',        accountId)           — required
 *   vgo('setTrackByDefault', true|false)          — auto-track pageviews
 *   vgo('process')                                — process the command queue
 *   vgo('identify',          email, [fields])     — identify a contact
 *   vgo('track',             eventName, [data])   — send a custom event
 *   vgo('pageview',          [url])               — manual pageview
 *   vgo('opt-out')                                — stop tracking this visitor
 *   vgo('opt-in')                                 — re-enable tracking
 */

;(function (window, document, undefined) {
    'use strict';

    // ─────────────────────────────────────────────────────────────────────────
    // 0. Guard: prevent double-initialisation
    // ─────────────────────────────────────────────────────────────────────────
    if (window.__mfTrackerLoaded) return;
    window.__mfTrackerLoaded = true;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. Configuration defaults
    // ─────────────────────────────────────────────────────────────────────────
    var CONFIG = {
        /** Account / workspace identifier */
        accountId: null,

        /** Automatically track every pageview */
        trackByDefault: true,

        /** Backend ingest endpoint */
        endpoint: 'https://ingest.yourdomain.com/t',

        /** Cookie domain (auto-detected when null) */
        cookieDomain: null,

        /** Cookie lifetime in days */
        cookieExpireDays: 365,

        /** Session timeout in minutes */
        sessionTimeoutMinutes: 30,

        /** Max events queued before a forced flush */
        batchSize: 10,

        /** Flush interval in ms when batching */
        batchIntervalMs: 2000,

        /** Name of the global command function */
        globalAlias: window.visitorGlobalObjectAlias || 'vgo',

        /** Debug mode — logs to console */
        debug: false,
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Utilities
    // ─────────────────────────────────────────────────────────────────────────

    function log() {
        if (CONFIG.debug && window.console && console.log) {
            console.log.apply(console, ['[MailFlow Tracker]'].concat(Array.prototype.slice.call(arguments)));
        }
    }

    /** Generate a UUID v4 */
    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0;
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
    }

    /** Current ISO timestamp */
    function now() {
        return new Date().toISOString();
    }

    /** Safe JSON stringify */
    function toJson(obj) {
        try { return JSON.stringify(obj); } catch (e) { return '{}'; }
    }

    /** Safe JSON parse */
    function fromJson(str) {
        try { return JSON.parse(str); } catch (e) { return null; }
    }

    /** Merge objects (shallow) */
    function merge() {
        var out = {};
        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];
            if (obj && typeof obj === 'object') {
                for (var k in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, k)) out[k] = obj[k];
                }
            }
        }
        return out;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Cookie helpers
    // ─────────────────────────────────────────────────────────────────────────

    var Cookie = {
        get: function (name) {
            var match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
            return match ? decodeURIComponent(match[1]) : null;
        },

        set: function (name, value, days) {
            var expires = '';
            if (days) {
                var d = new Date();
                d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
                expires = '; expires=' + d.toUTCString();
            }
            var domain = CONFIG.cookieDomain || _detectCookieDomain();
            var domainStr = domain ? '; domain=' + domain : '';
            document.cookie =
                name + '=' + encodeURIComponent(value) +
                expires + domainStr +
                '; path=/; SameSite=Lax';
        },

        del: function (name) {
            this.set(name, '', -1);
        },
    };

    /** Try to use root domain for cross-subdomain tracking */
    function _detectCookieDomain() {
        try {
            var parts = window.location.hostname.split('.');
            // Use last two segments (e.g. example.com)
            if (parts.length > 2) {
                return '.' + parts.slice(-2).join('.');
            }
            return '.' + window.location.hostname;
        } catch (e) {
            return null;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. SessionStorage helpers (session data, not persisted across tabs close)
    // ─────────────────────────────────────────────────────────────────────────

    var SS = {
        get: function (key) {
            try { return fromJson(sessionStorage.getItem('_mf_' + key)); } catch (e) { return null; }
        },
        set: function (key, val) {
            try { sessionStorage.setItem('_mf_' + key, toJson(val)); } catch (e) {}
        },
        del: function (key) {
            try { sessionStorage.removeItem('_mf_' + key); } catch (e) {}
        },
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 5. Visitor identity
    // ─────────────────────────────────────────────────────────────────────────

    var Visitor = {
        _id: null,
        _email: null,
        _fields: {},

        /** Persistent anonymous visitor ID */
        getId: function () {
            if (!this._id) {
                this._id = Cookie.get('vgo_vid') || uuid();
                Cookie.set('vgo_vid', this._id, CONFIG.cookieExpireDays);
            }
            return this._id;
        },

        /** Identify visitor with email (and optional extra fields) */
        identify: function (email, fields) {
            if (!email || typeof email !== 'string' || email.indexOf('@') === -1) {
                log('identify(): invalid email', email);
                return false;
            }
            this._email = email.toLowerCase().trim();
            this._fields = merge(this._fields, fields || {});
            Cookie.set('vgo_email', this._email, CONFIG.cookieExpireDays);
            log('identified as', this._email);
            return true;
        },

        /** Return known email if identified */
        getEmail: function () {
            if (!this._email) {
                this._email = Cookie.get('vgo_email') || null;
            }
            return this._email;
        },

        /** Payload fragment added to every event */
        toPayload: function () {
            var payload = { visitorId: this.getId() };
            if (this.getEmail()) payload.email = this.getEmail();
            if (Object.keys(this._fields).length) payload.contactFields = this._fields;
            return payload;
        },
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 6. Session
    // ─────────────────────────────────────────────────────────────────────────

    var Session = {
        _id: null,

        _isExpired: function (session) {
            if (!session || !session.lastActivity) return true;
            var elapsed = Date.now() - session.lastActivity;
            return elapsed > CONFIG.sessionTimeoutMinutes * 60 * 1000;
        },

        getId: function () {
            var stored = SS.get('session');
            if (!stored || this._isExpired(stored)) {
                stored = { id: uuid(), startedAt: Date.now(), lastActivity: Date.now() };
                SS.set('session', stored);
                log('new session', stored.id);
            } else {
                stored.lastActivity = Date.now();
                SS.set('session', stored);
            }
            this._id = stored.id;
            return this._id;
        },

        touch: function () {
            var stored = SS.get('session');
            if (stored) {
                stored.lastActivity = Date.now();
                SS.set('session', stored);
            }
        },
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 7. Page context
    // ─────────────────────────────────────────────────────────────────────────

    function getPageContext() {
        return {
            url:      window.location.href,
            path:     window.location.pathname,
            search:   window.location.search,
            hash:     window.location.hash,
            title:    document.title,
            referrer: document.referrer || null,
            viewport: {
                width:  window.innerWidth  || document.documentElement.clientWidth,
                height: window.innerHeight || document.documentElement.clientHeight,
            },
            screen: {
                width:  window.screen ? window.screen.width  : null,
                height: window.screen ? window.screen.height : null,
            },
        };
    }

    function getBrowserContext() {
        return {
            userAgent:    navigator.userAgent,
            language:     navigator.language || navigator.userLanguage || null,
            timezone:     (function () {
                try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return null; }
            })(),
            cookiesEnabled: navigator.cookieEnabled,
        };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 8. Opt-out
    // ─────────────────────────────────────────────────────────────────────────

    var OptOut = {
        COOKIE: 'vgo_optout',

        isOptedOut: function () {
            return Cookie.get(this.COOKIE) === '1';
        },

        optOut: function () {
            Cookie.set(this.COOKIE, '1', 365 * 10);
            // Clear identity
            Cookie.del('vgo_vid');
            Cookie.del('vgo_email');
            SS.del('session');
            log('visitor opted out');
        },

        optIn: function () {
            Cookie.del(this.COOKIE);
            log('visitor opted in');
        },
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 9. Transport — sendBeacon → fetch → XHR
    // ─────────────────────────────────────────────────────────────────────────

    var Transport = {
        send: function (events) {
            if (!CONFIG.accountId) {
                log('send() skipped — no accountId set');
                return;
            }
            if (!events || events.length === 0) return;

            var payload = toJson({
                accountId: CONFIG.accountId,
                events: events,
            });

            var url = CONFIG.endpoint;

            // sendBeacon (best for page unload)
            if (navigator.sendBeacon) {
                try {
                    var blob = new Blob([payload], { type: 'application/json' });
                    var ok = navigator.sendBeacon(url, blob);
                    if (ok) { log('sendBeacon:', events.length, 'event(s)'); return; }
                } catch (e) {}
            }

            // fetch
            if (window.fetch) {
                fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload,
                    keepalive: true,
                }).then(function () {
                    log('fetch:', events.length, 'event(s)');
                }).catch(function (err) {
                    log('fetch error:', err);
                });
                return;
            }

            // XHR fallback
            try {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', url, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(payload);
                log('XHR:', events.length, 'event(s)');
            } catch (e) {
                log('XHR error:', e);
            }
        },
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 10. Event queue & batching
    // ─────────────────────────────────────────────────────────────────────────

    var Queue = {
        _queue: [],
        _timer: null,

        push: function (event) {
            if (OptOut.isOptedOut()) { log('opt-out: event discarded'); return; }

            this._queue.push(merge(event, {
                timestamp:  now(),
                sessionId:  Session.getId(),
                accountId:  CONFIG.accountId,
            }, Visitor.toPayload()));

            log('queued event:', event.type, event.name || '');

            if (this._queue.length >= CONFIG.batchSize) {
                this.flush();
            } else {
                this._scheduleFlush();
            }
        },

        _scheduleFlush: function () {
            var self = this;
            if (this._timer) return;
            this._timer = setTimeout(function () {
                self.flush();
            }, CONFIG.batchIntervalMs);
        },

        flush: function () {
            clearTimeout(this._timer);
            this._timer = null;
            if (this._queue.length === 0) return;
            var batch = this._queue.splice(0);
            Transport.send(batch);
        },
    };

    // Flush on page hide / unload
    function _attachUnloadFlush() {
        var flushed = false;
        function onHide() {
            if (!flushed) { flushed = true; Queue.flush(); }
        }
        // visibilitychange is most reliable across browsers
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') onHide();
        });
        window.addEventListener('pagehide', onHide);
        window.addEventListener('beforeunload', onHide);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 11. Pageview tracking
    // ─────────────────────────────────────────────────────────────────────────

    var Pageview = {
        _lastTracked: null,

        track: function (url) {
            var currentUrl = url || window.location.href;
            if (currentUrl === this._lastTracked) return; // dedupe same-URL navigation
            this._lastTracked = currentUrl;

            Queue.push(merge({ type: 'pageview' }, getPageContext(), getBrowserContext()));
            Session.touch();
        },
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 12. SPA — history API patching
    // ─────────────────────────────────────────────────────────────────────────

    function _patchHistoryApi() {
        function wrapHistory(method) {
            var original = history[method];
            return function () {
                var result = original.apply(history, arguments);
                window.dispatchEvent(new Event('mf:locationchange'));
                return result;
            };
        }

        if (window.history && history.pushState) {
            history.pushState    = wrapHistory('pushState');
            history.replaceState = wrapHistory('replaceState');
        }

        window.addEventListener('popstate',          function () { window.dispatchEvent(new Event('mf:locationchange')); });
        window.addEventListener('hashchange',        function () { window.dispatchEvent(new Event('mf:locationchange')); });
        window.addEventListener('mf:locationchange', function () {
            // Small delay so the page title updates before we capture it
            setTimeout(function () {
                if (CONFIG.trackByDefault) Pageview.track();
            }, 50);
        });

        log('history API patched for SPA tracking');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 13. Form interception — contact identification
    // ─────────────────────────────────────────────────────────────────────────

    /** Known email field name/id/type patterns */
    var EMAIL_PATTERNS = [
        /^email$/i,
        /e[\-_]?mail/i,
        /your[\-_]?email/i,
        /contact[\-_]?email/i,
    ];

    function _isEmailInput(input) {
        if (input.type === 'email') return true;
        var attrs = [input.name, input.id, input.placeholder, input.className];
        for (var i = 0; i < attrs.length; i++) {
            if (!attrs[i]) continue;
            for (var j = 0; j < EMAIL_PATTERNS.length; j++) {
                if (EMAIL_PATTERNS[j].test(attrs[i])) return true;
            }
        }
        return false;
    }

    function _extractFormFields(form) {
        var fields = {};
        var inputs = form.querySelectorAll('input, select, textarea');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (!input.name || !input.value) continue;
            if (input.type === 'password') continue; // never capture passwords
            fields[input.name] = input.value;
        }
        return fields;
    }

    function _attachFormTracking() {
        document.addEventListener('submit', function (e) {
            var form = e.target;
            if (!form || form.tagName !== 'FORM') return;

            var emailInput = null;
            var inputs = form.querySelectorAll('input');
            for (var i = 0; i < inputs.length; i++) {
                if (_isEmailInput(inputs[i]) && inputs[i].value) {
                    emailInput = inputs[i];
                    break;
                }
            }

            if (emailInput) {
                var email = emailInput.value.trim();
                var fields = _extractFormFields(form);
                // Remove the email from generic fields to avoid duplication
                delete fields[emailInput.name];

                if (Visitor.identify(email, fields)) {
                    Queue.push({
                        type:   'identify',
                        email:  email,
                        fields: fields,
                        formAction: form.action || window.location.href,
                    });
                }
            } else {
                // Track anonymous form submission as an event
                Queue.push({
                    type:  'event',
                    name:  'form_submit',
                    page:  getPageContext(),
                    formAction: form.action || window.location.href,
                });
            }
        }, true /* capture phase — fires before form handlers */);

        log('form tracking attached');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 14. Link click tracking (external links)
    // ─────────────────────────────────────────────────────────────────────────

    function _attachLinkTracking() {
        document.addEventListener('click', function (e) {
            var target = e.target;
            // Walk up the DOM in case the click was on a child element (e.g. <img> inside <a>)
            while (target && target.tagName !== 'A') target = target.parentNode;
            if (!target || target.tagName !== 'A') return;

            var href = target.href;
            if (!href) return;

            var isExternal = (
                target.hostname &&
                target.hostname !== window.location.hostname
            );

            if (isExternal) {
                Queue.push({
                    type: 'event',
                    name: 'external_link_click',
                    href: href,
                    text: (target.innerText || target.textContent || '').trim().slice(0, 200),
                    page: getPageContext(),
                });
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 15. Custom event API
    // ─────────────────────────────────────────────────────────────────────────

    var Events = {
        track: function (name, data) {
            if (!name || typeof name !== 'string') {
                log('track(): eventName is required');
                return;
            }
            Queue.push({
                type: 'event',
                name: name,
                data: data || {},
                page: getPageContext(),
            });
        },
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 16. Command processor
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Maps command names to handler functions.
     * Each handler receives all arguments after the command name.
     */
    var Commands = {
        'setAccount': function (id) {
            CONFIG.accountId = String(id);
            log('accountId set to', CONFIG.accountId);
        },

        'setTrackByDefault': function (value) {
            CONFIG.trackByDefault = Boolean(value);
            log('trackByDefault:', CONFIG.trackByDefault);
        },

        'setEndpoint': function (url) {
            CONFIG.endpoint = url;
            log('endpoint set to', url);
        },

        'setCookieDomain': function (domain) {
            CONFIG.cookieDomain = domain;
        },

        'setDebug': function (value) {
            CONFIG.debug = Boolean(value);
        },

        'process': function () {
            // Kick off tracking
            _patchHistoryApi();
            _attachFormTracking();
            _attachLinkTracking();
            _attachUnloadFlush();

            if (CONFIG.trackByDefault) {
                Pageview.track();
            }

            log('tracker initialized, accountId:', CONFIG.accountId);
        },

        'identify': function (email, fields) {
            if (Visitor.identify(email, fields)) {
                Queue.push({
                    type:   'identify',
                    email:  email,
                    fields: fields || {},
                });
            }
        },

        'track': function (name, data) {
            Events.track(name, data);
        },

        'pageview': function (url) {
            Pageview.track(url || undefined);
        },

        'opt-out': function () {
            OptOut.optOut();
        },

        'opt-in': function () {
            OptOut.optIn();
        },

        'flush': function () {
            Queue.flush();
        },
    };

    function processCommand(args) {
        var cmd = args[0];
        var handler = Commands[cmd];
        if (!handler) {
            log('unknown command:', cmd);
            return;
        }
        try {
            handler.apply(null, Array.prototype.slice.call(args, 1));
        } catch (e) {
            log('command error [' + cmd + ']:', e);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 17. Bootstrap — replace the stub vgo function with the real one
    // ─────────────────────────────────────────────────────────────────────────

    (function bootstrap() {
        var alias = CONFIG.globalAlias;
        var stub  = window[alias] || { q: [] };
        var queue = stub.q || [];

        // Real vgo function from this point on
        window[alias] = function () {
            processCommand(arguments);
        };

        // Replay buffered commands from before the script loaded
        for (var i = 0; i < queue.length; i++) {
            processCommand(queue[i]);
        }

        log('bootstrap complete, replayed', queue.length, 'command(s)');
    })();

})(window, document);