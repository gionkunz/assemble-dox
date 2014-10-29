# assemble-dox - Generate API documentation with Assemble and Dox

> An [Assemble](http://assemble.io) plugin for API documentation generation using [dox](https://github.com/tj/dox)

## Usage

First, setup a project with Grunt and Assemble.

Then install the plugin: 

```sh
npm install --save-dev assemble-dox
```

Add the plugin to your Grunt assemble config:

```js
assemble: {
  options: {
    plugins: ['assemble-dox'],
    dox: {
      sourceFiles: ['source/scripts/**/*.js']
    }
  },
  ...
},
```

Source files will be parsed for dox comments and an array is exposed to the data context of assemble. Use the `contextRoot`
option to specify the root property name in the context where the array with all parsed dox comments will be stored.

All parsed dox comments will be stored in an array where each element is representing a file with it's parsed dox comments
for a detailed description how the dox comment data structure is constructed please visit the [dox documentation](https://github.com/tj/dox)

```js
[
  {
    file: 'src/scripts/button.js',
    comments: [
      {},
      {},
      ...
    ]
  },
  {
    file: 'src/scripts/lightbox.js',
    comments: [
     {},
     ...
    ]
  },
  ...
]
```

## Options

Put the assemble dox options under `dox` in the assemble options.

```js
// You assemble options in your Gruntfile.js
options: {
  helpers: ['source/helpers/**/*.js'],
  partials: ['source/templates/**/*.hbs'],
  layout: ['source/layouts/default.hbs'],
  data: ['source/data/**/*.yml'],
  // Loading the assemble-dox plugin
  plugins: ['assemble-dox'],
  // Put your assemble-dox options here
  dox: {
    // Multi glob of source files you'd like to include for dox to parse
    sourceFiles: [
      'source/scripts/**/*.js',
      'source/components/**/*.js'
    ],
    // The context root will be where the parsed comments will be placed in the assemble data context
    // which is the root context for Handlebars. By default this option is set to dox and therefore the
    // parsed comments will be available as {{dox}} in the Handlebars root context.
    contextRoot: 'dox',
    // These options will be delegated to dox. Check the dox manual for all available options.
    doxOptions: {
      skipSingleStar: true
    }
  }
},
```

## Example

Annotate your code with dox comments. You can also include jsdoc that will be exposed as tags. Read the
[dox documentation](https://github.com/tj/dox) for more information.

```js
/**
 * Activates a tab in the tabs component.
 *
 * - very handy
 * - simple
 * - easy to use
 *
 * **Example**
 *
 *    var repeated = repeat('hello', 10);
 *    console.log(repeated);
 *
 * Please check the [online manual](http://www.example.com)
 *
 * @param {String} str String that should be repeated
 * @param {Number} n How many times you wish to repeat the string
 * @returns {String} A new string that contains a repetition of `str` exactly `n` times
 */
function repeat(str, n) {
  return new Array(Math.max(n || 0, 0) + 1).join(str);
}
```

With the default settings you will now have the parsed comments available in Handlebars as {{dox}}. Dox will be an array
that looks like this:

```js
{
  "file": "src/components/repeater/repeater.js",
  "comments": [
    {
      "tags": [
        {
          "type": "param",
          "types": [
            "String"
          ],
          "name": "str",
          "description": "String that should be repeated",
          "optional": false
        },
        {
          "type": "param",
          "types": [
            "Number"
          ],
          "name": "n",
          "description": "How many times you wish to repeat the string",
          "optional": false
        },
        {
          "type": "returns",
          "types": [
            "String"
          ],
          "description": "A new string that contains a repetition of `str` exactly `n` times"
        }
      ],
      "description": {
        "full": "<p>Activates a tab in the tabs component.</p><ul>\n<li>very handy</li>\n<li>simple</li>\n<li>easy to use</li>\n</ul>\n<p><strong>Example</strong></p><p> var repeated = repeat(&#39;hello&#39;, 10);<br /> console.log(repeated);</p><p>Please check the <a href=\"http://www.example.com\">online manual</a></p>",
        "summary": "<p>Activates a tab in the tabs component.</p>",
        "body": "<ul>\n<li>very handy</li>\n<li>simple</li>\n<li>easy to use</li>\n</ul>\n<p><strong>Example</strong></p><p> var repeated = repeat(&#39;hello&#39;, 10);<br /> console.log(repeated);</p><p>Please check the <a href=\"http://www.example.com\">online manual</a></p>"
      },
      "isPrivate": false,
      "isConstructor": false,
      "isEvent": false,
      "ignore": false,
      "line": 1,
      "codeStart": 19,
      "code": "function repeat(str, n) {\n return new Array(Math.max(n || 0, 0) + 1).join(str);\n}",
      "ctx": {
        "type": "function",
        "name": "repeat",
        "string": "repeat()"
      }
    }
  ]
}
```

## Dox Handlebars helpers

Included in the module you can also find handlebars helpers that help you with some common issues while reading through
the dox data structure. You can find them in `assemble-dox/dox-helpers.js`. In assemble you can add this helper script
in your options or just copy it to your own helper directory.

Here is an example of how to build a simple API documentation using the helpers.

```handlebars
{{#each dox}}
  <h3>File {{file}}</h3>
  {{#each (doxElementsWithCtxType comments 'function')}}
    <article>
      <header>
        <h4>Function {{ctx.string}}</h4>
      </header>
      <div class="description">
        {{{description.full}}}
      </div>
      <p>Arguments:</p>
      <ul class="params">
        {{#each (doxTagsOfType this 'param')}}
          <li><code>{{name}} ({{types}})</code> - {{description}}</li>
        {{/each}}
      </ul>
      <div class="return">
        {{#with (doxTag this 'returns')}}
          Returns <code>{{types}}</code> - {{description}}
        {{/with}}
      </div>
    </article>
  {{/each}}
  {{jsonStringify this}}
{{/each}}
```