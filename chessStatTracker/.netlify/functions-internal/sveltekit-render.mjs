import { init } from '../serverless.js';

export const handler = init((() => {
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
		client: {"start":"_app/immutable/entry/start.CrsRAJvy.js","app":"_app/immutable/entry/app.D2ZsmvR-.js","imports":["_app/immutable/entry/start.CrsRAJvy.js","_app/immutable/chunks/entry.BNXnYKRd.js","_app/immutable/chunks/scheduler.3q3s62UL.js","_app/immutable/chunks/index.BIZQkIVS.js","_app/immutable/entry/app.D2ZsmvR-.js","_app/immutable/chunks/scheduler.3q3s62UL.js","_app/immutable/chunks/index.CfPbG8to.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../server/nodes/0.js')),
			__memo(() => import('../server/nodes/1.js')),
			__memo(() => import('../server/nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})());
