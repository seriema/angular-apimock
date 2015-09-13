var components = {
	"core": {
		"meta": {
			"path": "components/prism-core.js",
			"option": "mandatory"
		},
		"core": "Core"
	},
	"themes": {
		"meta": {
			"path": "themes/{id}.css",
			"link": "index.html?theme={id}",
			"exclusive": true
		},
		"prism": {
			"title": "Default",
			"option": "default"
		},
		"prism-dark": "Dark",
		"prism-funky": "Funky",
		"prism-okaidia": {
			"title": "Okaidia",
			"owner": "ocodia"
		},
		"prism-twilight": {
			"title": "Twilight",
			"owner": "remybach"
		},
		"prism-coy": {
			"title": "Coy",
			"owner": "tshedor"
		}
	},
	"languages": {
		"meta": {
			"path": "components/prism-{id}",
			"noCSS": true,
			"examplesPath": "examples/prism-{id}",
			"addCheckAll": true
		},
		"markup": {
			"title": "Markup",
			"option": "default"
		},
		"css": {
			"title": "CSS",
			"option": "default"
		},
		"clike": {
			"title": "C-like",
			"option": "default"
		},
		"javascript": {
			"title": "JavaScript",
			"option": "default",
			"require": "clike"
		},



		"abap": {
			"title": "ABAP",
			"owner": "dellagustin"
		},
		"actionscript": {
			"title": "ActionScript",
			"require": "javascript",
			"owner": "Golmote"
		},
		"apacheconf": {
			"title": "Apache Configuration",
			"owner": "GuiTeK"
		},
		"apl": {
			"title": "APL",
			"owner": "ngn"
		},
		"applescript": {
			"title": "AppleScript",
			"owner": "Golmote"
		},
		"aspnet": {
			"title": "ASP.NET (C#)",
			"require": "markup",
			"owner": "nauzilus"
		},
		"autohotkey": {
			"title": "AutoHotkey",
			"owner": "aviaryan"
		},
		"bash": {
			"title": "Bash",
			"require": "clike",
			"owner": "zeitgeist87"
		},
		"basic": {
			"title": "BASIC",
			"owner": "Golmote"
		},
		"brainfuck": {
			"title": "Brainfuck",
			"owner": "Golmote"
		},
		"c": {
			"title": "C",
			"require": "clike",
			"owner": "zeitgeist87"
		},
		"csharp": {
			"title": "C#",
			"require": "clike",
			"owner": "mvalipour"
		},
		"cpp": {
			"title": "C++",
			"require": "c",
			"owner": "zeitgeist87"
		},
		"coffeescript": {
			"title": "CoffeeScript",
			"require": "javascript",
			"owner": "R-osey"
		},
		"css-extras": {
			"title": "CSS Extras",
			"require": "css",
			"owner": "milesj"
		},
		"d": {
			"title": "D",
			"require": "clike",
			"owner": "Golmote"
		},
		"dart": {
			"title": "Dart",
			"require": "clike",
			"owner": "Golmote"
		},
		"docker": {
			"title": "Docker",
			"owner": "JustinBeckwith"
		},
		"eiffel": {
			"title": "Eiffel",
			"owner": "Conaclos"
		},
		"elixir": {
			"title": "Elixir",
			"owner": "Golmote"
		},
		"erlang": {
			"title": "Erlang",
			"owner": "Golmote"
		},
		"fsharp": {
			"title": "F#",
			"require": "clike",
			"owner": "simonreynolds7"
		},
		"fortran": {
			"title": "Fortran",
			"owner": "Golmote"
		},
		"gherkin": {
			"title": "Gherkin",
			"owner": "hason"
		},
		"git": {
			"title": "Git",
			"owner": "lgiraudel"
		},
		"glsl": {
			"title": "GLSL",
			"require": "clike",
			"owner": "Golmote"
		},
		"go": {
			"title": "Go",
			"require": "clike",
			"owner": "arnehormann"
		},
		"groovy": {
			"title": "Groovy",
			"require": "clike",
			"owner": "robfletcher"
		},
		"haml": {
			"title": "Haml",
			"require": "ruby",
			"owner": "Golmote"
		},
		"handlebars": {
			"title": "Handlebars",
			"require": "markup",
			"owner": "Golmote"
		},
		"haskell": {
			"title": "Haskell",
			"owner": "bholst"
		},
		"http": {
			"title": "HTTP",
			"owner": "danielgtaylor"
		},
		"inform7": {
			"title": "Inform 7",
			"owner": "Golmote"
		},
		"ini": {
			"title": "Ini",
			"owner": "aviaryan"
		},
		"j": {
			"title": "J",
			"owner": "Golmote"
		},
		"jade": {
			"title": "Jade",
			"require": "javascript",
			"owner": "Golmote"
		},
		"java": {
			"title": "Java",
			"require": "clike",
			"owner": "sherblot"
		},
		"julia": {
			"title": "Julia",
			"owner": "cdagnino"
		},
		"keyman": {
			"title": "Keyman",
			"owner": "mcdurdin"
		},
		"latex": {
			"title": "LaTeX",
			"owner": "japborst"
		},
		"less": {
			"title": "Less",
			"require": "css",
			"owner": "Golmote"
		},
		"lolcode": {
			"title": "LOLCODE",
			"owner": "Golmote"
		},
		"makefile": {
			"title": "Makefile",
			"owner": "Golmote"
		},
		"markdown": {
			"title": "Markdown",
			"require": "markup",
			"owner": "Golmote"
		},
		"matlab": {
			"title": "MATLAB",
			"owner": "Golmote"
		},
		"mel": {
			"title": "MEL",
			"owner": "Golmote"
		},
		"mizar": {
			"title": "Mizar",
			"owner": "Golmote"
		},
		"monkey": {
			"title": "Monkey",
			"owner": "Golmote"
		},
		"nasm": {
			"title": "NASM",
			"owner": "rbmj"
		},
		"nim": {
			"title": "Nim",
			"owner": "Golmote"
		},
		"nsis": {
			"title": "NSIS",
			"owner": "idleberg"
		},
		"objectivec": {
			"title": "Objective-C",
			"require": "c",
			"owner": "uranusjr"
		},
		"ocaml": {
			"title": "OCaml",
			"owner": "Golmote"
		},
		"pascal": {
			"title": "Pascal",
			"owner": "Golmote"
		},
		"perl": {
			"title": "Perl",
			"owner": "Golmote"
		},
		"php": {
			"title": "PHP",
			"require": "clike",
			"owner": "milesj"
		},
		"php-extras": {
			"title": "PHP Extras",
			"require": "php",
			"owner": "milesj"
		},
		"powershell": {
			"title": "PowerShell",
			"owner": "nauzilus"
		},
		"processing": {
			"title": "Processing",
			"require": "clike",
			"owner": "Golmote"
		},
		"prolog": {
			"title": "Prolog",
			"owner": "Golmote"
		},
		"pure": {
			"title": "Pure",
			"owner": "Golmote"
		},
		"python": {
			"title": "Python",
			"owner": "multipetros"
		},
		"q": {
			"title": "Q",
			"owner": "Golmote"
		},
		"qore": {
			"title": "Qore",
			"require": "clike",
			"owner": "temnroegg"
		},
		"r": {
			"title": "R",
			"owner": "Golmote"
		},
		"jsx":{
			"title": "React JSX",
			"require": ["markup", "javascript"],
			"owner": "vkbansal"
		},
		"rest": {
			"title": "reST (reStructuredText)",
			"owner": "Golmote"
		},
		"rip": {
			"title": "Rip",
			"owner": "ravinggenius"
		},
		"ruby": {
			"title": "Ruby",
			"require": "clike",
			"owner": "samflores"
		},
		"rust": {
			"title": "Rust",
			"owner": "Golmote"
		},
		"sas": {
			"title": "SAS",
			"owner": "Golmote"
		},
		"sass": {
			"title": "Sass (Sass)",
			"require": "css",
			"owner": "Golmote"
		},
		"scss": {
			"title": "Sass (Scss)",
			"require": "css",
			"owner": "MoOx"
		},
		"scala": {
			"title": "Scala",
			"require": "java",
			"owner": "jozic"
		},
		"scheme" : {
			"title": "Scheme",
			"owner" : "bacchus123"
		},
		"smalltalk": {
			"title": "Smalltalk",
			"owner": "Golmote"
		},
		"smarty": {
			"title": "Smarty",
			"require": "markup",
			"owner": "Golmote"
		},
		"sql": {
			"title": "SQL",
			"owner": "multipetros"
		},
		"stylus" : {
			"title": "Stylus",
			"owner": "vkbansal"
		},
		"swift": {
			"title": "Swift",
			"require": "clike",
			"owner": "chrischares"
		},
		"tcl": {
			"title": "Tcl",
			"owner": "PeterChaplin"
		},
		"textile": {
			"title": "Textile",
			"require": "markup",
			"owner": "Golmote"
		},
		"twig": {
			"title": "Twig",
			"require": "markup",
			"owner": "brandonkelly"
		},
		"typescript":{
			"title": "TypeScript",
			"require": "javascript",
			"owner": "vkbansal"
		},
		"vhdl": {
			"title": "VHDL",
			"owner": "a-rey"
		},
		"wiki": {
			"title": "Wiki markup",
			"require": "markup",
			"owner": "Golmote"
		},
		"yaml": {
			"title": "YAML",
			"owner": "hason"
		}
	},
	"plugins": {
		"meta": {
			"path": "plugins/{id}/prism-{id}",
			"link": "plugins/{id}/"
		},
		"line-highlight": "Line Highlight",
		"line-numbers": {
			"title": "Line Numbers",
			"owner": "kuba-kubula"
		},
		"show-invisibles": "Show Invisibles",
		"autolinker": "Autolinker",
		"wpd": "WebPlatform Docs",
		"file-highlight": {
			"title": "File Highlight",
			"noCSS": true
		},
		"show-language": {
			"title": "Show Language",
			"owner": "nauzilus"
		},
		"jsonp-highlight": {
			"title": "JSONP Highlight",
			"noCSS": true,
			"owner": "nauzilus"
		},
		"highlight-keywords": {
			"title": "Highlight Keywords",
			"owner": "vkbansal",
			"noCSS": true
		},
		"remove-initial-line-feed": {
			"title": "Remove initial line feed",
			"owner": "Golmote",
			"noCSS": true
		},
		"previewer-base": {
			"title": "Previewer Base",
			"owner": "Golmote"
		},
		"previewer-color": {
			"title": "Previewer Color",
			"require": "previewer-base",
			"owner": "Golmote"
		}
	}
};
