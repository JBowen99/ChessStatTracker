
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const chessStatsTheme: CustomThemeConfig = {
    name: 'chessStatsTheme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-family-heading": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "12px",
		"--theme-border-base": "2px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "255 255 255",
		"--on-secondary": "0 0 0",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #b80f42 
		"--color-primary-50": "244 219 227", // #f4dbe3
		"--color-primary-100": "241 207 217", // #f1cfd9
		"--color-primary-200": "237 195 208", // #edc3d0
		"--color-primary-300": "227 159 179", // #e39fb3
		"--color-primary-400": "205 87 123", // #cd577b
		"--color-primary-500": "184 15 66", // #b80f42
		"--color-primary-600": "166 14 59", // #a60e3b
		"--color-primary-700": "138 11 50", // #8a0b32
		"--color-primary-800": "110 9 40", // #6e0928
		"--color-primary-900": "90 7 32", // #5a0720
		// secondary | #a8e64c 
		"--color-secondary-50": "242 251 228", // #f2fbe4
		"--color-secondary-100": "238 250 219", // #eefadb
		"--color-secondary-200": "233 249 210", // #e9f9d2
		"--color-secondary-300": "220 245 183", // #dcf5b7
		"--color-secondary-400": "194 238 130", // #c2ee82
		"--color-secondary-500": "168 230 76", // #a8e64c
		"--color-secondary-600": "151 207 68", // #97cf44
		"--color-secondary-700": "126 173 57", // #7ead39
		"--color-secondary-800": "101 138 46", // #658a2e
		"--color-secondary-900": "82 113 37", // #527125
		// tertiary | #0dc3e7 
		"--color-tertiary-50": "219 246 251", // #dbf6fb
		"--color-tertiary-100": "207 243 250", // #cff3fa
		"--color-tertiary-200": "195 240 249", // #c3f0f9
		"--color-tertiary-300": "158 231 245", // #9ee7f5
		"--color-tertiary-400": "86 213 238", // #56d5ee
		"--color-tertiary-500": "13 195 231", // #0dc3e7
		"--color-tertiary-600": "12 176 208", // #0cb0d0
		"--color-tertiary-700": "10 146 173", // #0a92ad
		"--color-tertiary-800": "8 117 139", // #08758b
		"--color-tertiary-900": "6 96 113", // #066071
		// success | #3dcb15 
		"--color-success-50": "226 247 220", // #e2f7dc
		"--color-success-100": "216 245 208", // #d8f5d0
		"--color-success-200": "207 242 197", // #cff2c5
		"--color-success-300": "177 234 161", // #b1eaa1
		"--color-success-400": "119 219 91", // #77db5b
		"--color-success-500": "61 203 21", // #3dcb15
		"--color-success-600": "55 183 19", // #37b713
		"--color-success-700": "46 152 16", // #2e9810
		"--color-success-800": "37 122 13", // #257a0d
		"--color-success-900": "30 99 10", // #1e630a
		// warning | #EAB308 
		"--color-warning-50": "252 244 218", // #fcf4da
		"--color-warning-100": "251 240 206", // #fbf0ce
		"--color-warning-200": "250 236 193", // #faecc1
		"--color-warning-300": "247 225 156", // #f7e19c
		"--color-warning-400": "240 202 82", // #f0ca52
		"--color-warning-500": "234 179 8", // #EAB308
		"--color-warning-600": "211 161 7", // #d3a107
		"--color-warning-700": "176 134 6", // #b08606
		"--color-warning-800": "140 107 5", // #8c6b05
		"--color-warning-900": "115 88 4", // #735804
		// error | #D41976 
		"--color-error-50": "249 221 234", // #f9ddea
		"--color-error-100": "246 209 228", // #f6d1e4
		"--color-error-200": "244 198 221", // #f4c6dd
		"--color-error-300": "238 163 200", // #eea3c8
		"--color-error-400": "225 94 159", // #e15e9f
		"--color-error-500": "212 25 118", // #D41976
		"--color-error-600": "191 23 106", // #bf176a
		"--color-error-700": "159 19 89", // #9f1359
		"--color-error-800": "127 15 71", // #7f0f47
		"--color-error-900": "104 12 58", // #680c3a
        // surface | #212840 
		"--color-surface-50": "222 223 226", // #dedfe2
		"--color-surface-100": "211 212 217", // #d3d4d9
		"--color-surface-200": "200 201 207", // #c8c9cf
		"--color-surface-300": "166 169 179", // #a6a9b3
		"--color-surface-400": "100 105 121", // #646979
		"--color-surface-500": "33 40 64", // #212840
		"--color-surface-600": "30 36 58", // #1e243a
		"--color-surface-700": "25 30 48", // #191e30
		"--color-surface-800": "20 24 38", // #141826
		"--color-surface-900": "16 20 31", // #10141f
		/* // surface | #495a8f 
        "--color-surface-50": "228 230 238", // #e4e6ee
		"--color-surface-100": "219 222 233", // #dbdee9
		"--color-surface-200": "210 214 227", // #d2d6e3
		"--color-surface-300": "182 189 210", // #b6bdd2
		"--color-surface-400": "128 140 177", // #808cb1
		"--color-surface-500": "73 90 143", // #495a8f
		"--color-surface-600": "66 81 129", // #425181
		"--color-surface-700": "55 68 107", // #37446b
		"--color-surface-800": "44 54 86", // #2c3656
		"--color-surface-900": "36 44 70", // #242c46 */
		
	}
}