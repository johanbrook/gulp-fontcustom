# gulp-fontcustom

This is a [gulp](http://gulpjs.com/) plugin that takes a bunch of SVG files and converts them to font icon files with [Fontcustom](http://fontcustom.com/).

## Usage

```bash
npm install --save gulp-fontcustom
```
```javascript
var gulp = require('gulp'),
    fontcustom = require('gulp-fontcustom')

gulp.src("./icons")
.pipe(fontcustom({
  font_name: 'myfont',  // defaults to 'fontcustom',
  'css-selector': '.prefix-{{glyph}}'
}))
.pipe(gulp.dest("./results"))
```

The following files will be generated into the `results` directory:

```
myfont-preview.html
myfont.css
myfont.eot
myfont.ttf
myfont.svg
myfont.woff
```
The `fontcustom` function above takes an options object and uses the same keys as the Fontcustom CLI uses. Check out the [Fontcustom documentation](https://github.com/FontCustom/fontcustom/) for more info on all configuration options.

`gulp-fontcustom` will default to these options:

```javascript
no_hash: true,
force: true
```

The `--output` option for Fontcustom is set inside of `gulp-fontcustom` and will thus precede any configuration.

Note that `fontcustom` must be installed on the system beforehand. If not:

```bash
# On Mac
brew install fontforge eot-utils
gem install fontcustom
```

See the [Fontcustom docs](https://github.com/FontCustom/fontcustom/) for further instructions.

## Stuff to do

- Enable putting stylesheets/preview HTML in another destination
- Support all relevant configuration options in Fontcustom
- Better tests ...

## Similar plugins

If this isn't your cup of tea:

- [gulp-iconfont](https://github.com/nfroidure/gulp-iconfont)
- [gulp-svgicons2svgfont](https://github.com/nfroidure/gulp-svgicons2svgfont)

## License

MIT.
