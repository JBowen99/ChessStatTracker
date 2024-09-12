export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","logo.svg","faviconRook.png","logo3.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.qo1GHX0h.js","app":"_app/immutable/entry/app.DRdT5ClH.js","imports":["_app/immutable/entry/start.qo1GHX0h.js","_app/immutable/chunks/entry.DwlJXoij.js","_app/immutable/chunks/scheduler.3q3s62UL.js","_app/immutable/chunks/index.BIZQkIVS.js","_app/immutable/entry/app.DRdT5ClH.js","_app/immutable/chunks/scheduler.3q3s62UL.js","_app/immutable/chunks/index.DgewMqUA.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/uploadBatchDocuments",
				pattern: /^\/api\/uploadBatchDocuments\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/uploadBatchDocuments/_server.js'))
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
