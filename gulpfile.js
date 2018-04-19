var gulp = require('gulp'),
    connect = require('gulp-connect'),
    // Proxy = require('gulp-connect-proxy'),  //不支持post请求
    url = require('url'),
    Proxy = require('proxy-middleware'),
    livereload = require('gulp-livereload'),
    runSequence = require('run-sequence'),

    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    mincss = require('gulp-mini-css'),
    htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat'),
    zip = require('gulp-zip'),
    changed = require('gulp-changed'), //只检查修改过的文件
    debug = require('gulp-debug'),
    rev = require('gulp-rev'), //对文件名加md5后缀，解决缓存问题
    revCollector = require('gulp-rev-collector');
// del = require('del');
//spriter = require('gulp-css-spriter');

var ydcfo = {
    //修改为项目webroot绝对路径，例如 D:/vscodeSVN/SimpleAC/WebRoot/
    // build: 'C:/Users/Administrator/git/OCRBss/WebRoot/'
    build: 'D:/git/OCR'
        // build: 'D:/git/WEB'
        // build: 'E:\\git\\SimpleAC\\WebRoot\\'
        // build: 'D:/workspace/SimpleBss/WebRoot/'
        // build: 'D:\\git\\SimpleBss\\WebRoot\\'
        // build: './SimpleAC/',
        // ydcfo: './',
        // build: './WebRoot/',
        // webroot: './webroot/',
        // build2: './test/',
        // test: './test/',
        // www: 'D:/秒账网站-定稿源文件+jpg-705',
        // ueditor: 'D:/test/utf8-jsp'
};

// var ydcfo = {
//     //修改为项目webroot绝对路径，例如 D:/vscodeSVN/SimpleAC/WebRoot/
// build: 'D:/git/WEB/'
//         // build: './SimpleAC/',
//         // ydcfo: './',
//         // build: './webroot/',
//         // webroot: './webroot/',
//         // build2: './test/',
//         // test: './test/',
//         // www: 'D:/秒账网站-定稿源文件+jpg-705',
//         // ueditor: 'D:/test/utf8-jsp'
// };

// var proxyOptions = url.parse('http://localhost:8090/SimpleAC');
// proxyOptions.route = '/proxy';
gulp.task('server', function() {
    // 将你的默认的任务代码放在此处
    connect.server({
        name: 'build v5',
        port: 8888,
        // root: ydcfo.www,
        root: ydcfo.build,
        livereload: true,
        //设置代理请求
        middleware: function(connect, opt) {
            // return [
            //     Proxy(proxyOptions)
            // ];
            //gulp-connect-proxy
            opt.route = '/OCRBss';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    })
});

//压缩测试html
gulp.task('minhtml', function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        // collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src('D:/git/OCR/page/*.html')
        .pipe(htmlmin(options))
        // .pipe(rename({ suffix: '.min' })) 
        .pipe(gulp.dest('E:/ocrys'));
})

//压缩css
gulp.task('mincsstest', function() {
    gulp.src(['D:/git/OCR/styles/' + '**/*.css', '!*.min.css']) //匹配所有的css，但不是 *.min.css 文件
        .pipe(mincss())
        // .pipe(rename({ suffix: '.min' })) 
        .pipe(gulp.dest('D:/git/OCR/WebRoot/styles'));
})

//压缩js
gulp.task('minjstest', function() {
    gulp.src(['D:/git/OCR/js/' + '**/*.js', '!*.min.js'])
        .pipe(stripDebug()) //删除console.log
        .pipe(uglify()) //执行压缩
        // .pipe(rename({ suffix: '.min' })) //重新命名
        .pipe(gulp.dest('D:/git/OCR/WebRoot/js')); //压缩文件位置
})

//压缩js
gulp.task('minjstest2', function() {
    gulp.src(['D:/git/OCR/WebRoot/js/common/setting.min.js'])
        .pipe(stripDebug()) //删除console.log
        .pipe(uglify()) //执行压缩
        // .pipe(rename({ suffix: '.min' })) //重新命名
        .pipe(gulp.dest('D:/git/OCR/WebRoot/js/common')); //压缩文件位置
})

var rootcs = 'D:/git/OCR/';
// var allcss = [
//     rootcs + 'js/common/jquery.i18n.properties.js',
//     rootcs + 'js/common/jquery.monthpicker.js',
//     rootcs + 'js/common/base64.js',
//     rootcs + 'js/jqwidgets-4.1/globalization/globalize.js',
//     rootcs + 'js/jqwidgets-4.1/globalization/globalize.culture.zh-CN.js'
// ]

var allcss = [
    rootcs + 'js/common/jqxgrid.pager.js',
    rootcs + 'js/common/validate-custom.js',
    rootcs + 'js/common/mindmup-editabletable.js',
    rootcs + 'js/common/power.js?v0106_v3',
    rootcs + 'js/common/quickKey.js'
]

// var allcss = [
//     rootcs + 'js/common/core.js',
//     rootcs + 'js/common/common.js',
//     rootcs + 'js/common/urlReg.js',
//     rootcs + 'js/common/easyGrid1.js',
//     rootcs + 'js/common/address.js',
//     rootcs + 'js/modules/main1.js'
// ]

//文件合并js
gulp.task('concatjs', function() {
    gulp.src(allcss) //要合并的文件
        .pipe(concat('setting.min.js')) // 合并匹配到的js文件并命名为 "all.js"
        .pipe(gulp.dest(rootcs + 'WebRoot/js/common'));
});

//压缩css
gulp.task('revCss', function() {
    console.log('css')
    return gulp.src(rootcs + '/styles/' + '**/*.css')
        .pipe(mincss())
        .pipe(gulp.dest(rootcs + '/styles'))
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('D:/git/OCR/WebRoot/styles')); //压缩文件位置，输出json文件
})

//Html替换css、js文件版本
gulp.task('revHtml', function() {
    console.log('html')
    return gulp.src(['D:/git/OCR/WebRoot/styles/*.json', 'D:/git/OCR/WebRoot/page/index.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('D:/git/OCR/WebRoot/page')); //替换html文件中<link>标签的引用，输出html到dest(目录)
});

gulp.task('cleanjson', function() {
    console.log('clean')
    return gulp.src('D:/git/OCR/WebRoot/styles/*.json', { read: false })
        .pipe(clean({ force: true })) //删除非当前工作目录中的文件。即不是在webToolAC下的文件
})

//开发构建
gulp.task('dev', ['cleanjson'], function(done) {
    condition = false;
    runSequence(
        ['revCss'], ['revHtml'],
        done);
});

gulp.task('copyall', function() {
    gulp.src('D:/git/OCR/WebRoot' + '/**/*.*')
        .pipe(gulp.dest('D:/ocrwebroot'))
})

//myserver. 监控root目录下的index.html，如有修改，实时刷新
gulp.task('myserver', function() {
    connect.server({
        root: 'D:/git/OCR/',
        port: 8888,
        livereload: true,
        middleware: function(connetc, opt) {
            // return [
            //         Proxy('/', {
            //             target: 'http://192.168.1.105:8080',
            //             changeOrigin: true,
            //         })
            //     ]
            opt.route = '/OCRBss';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    })
})

gulp.task('html', function() {
    gulp.src('D:/workspace/WebToolAC/index.html')
        .pipe(connect.reload())
})

gulp.task('watchserver', function() {
    gulp.watch('D:/workspace/WebToolAC/index.html', ['html'])
})

gulp.task('testserver', ['myserver', 'watchserver']);

gulp.task('reload-build', function() {
    //gulp.src(ydcfo.build + 'page/**/*.html')
    //gulp.src(ydcfo.build + 'page/**/*.html')
    // gulp.src(ydcfo.webroot + '*/**/*.*')
    gulp.src(ydcfo.build + 'page/index.html')
        //gulp.src(ydcfo.build)
        .pipe(connect.reload());
})

// gulp.task('watch', function() {
//     //gulp.watch(ydcfo.build + 'page/**/*.html', ['reload-build'])
//     //gulp.watch(ydcfo.build + 'page/**/*.html', ['reload-build'])
//     gulp.watch(ydcfo.build + '*/**/*.*', ['reload-build'])
//         //gulp.watch(ydcfo.build, ['reload-build'])
// })

//热更新
gulp.task('live', function(done) {
    condition = false;
    runSequence(['server'], ['watch'], done)
})

gulp.task('default', function() {
    console.log('hello yang')
        //gulp.run('minjs'); //'mincss', 
});

//执行压缩前，先删除以前压缩的文件
// gulp.task('clean', function() {
//     return del(['./all.css', './all.min.css', './all.min.js'])
// });

//复制文件
gulp.task('copy', function() {
    gulp.src('D:/workspace/WebToolAC' + '/*.min.js') //要复制的文件
        .pipe(gulp.dest('testgulp'));
})

//打包zip
gulp.task('zip', function() {
    return gulp.src('D:/workspace/WebToolAC/testgulp' + '/*.*')
        .pipe(zip('test.zip'))
        .pipe(gulp.dest('testgulp'));
})

//文件合并
gulp.task('concat', function() {
    gulp.src('D:/workspace/WebToolAC' + '/*.js') //要合并的文件
        .pipe(concat('all.js')) // 合并匹配到的js文件并命名为 "all.js"
        .pipe(gulp.dest('testgulp'));
});

//比较gulp.src()中和gulp.dest()中的文件最后一次修改时间。
//只编译修改过的文件
gulp.task('changed', function() {
        console.log('js has changed')
        gulp.src('D:/git/OCR/js/' + '**/*.js')
            // .pipe(uglify())
            // .pipe(rename({ suffix: '.min' }))
            .pipe(changed('E:/ocrchanged', { hasChanged: changed.compareSha1Digest })) //extension: '.js'
            .pipe(debug({ title: '编译' }))
            .pipe(gulp.dest('E:/ocrchanged'));
    })
    //用'E:/ocrchanged'下的文件与src()目录中的文件比较

//监听
gulp.task('watch', function() {
    console.log('start watch')
    gulp.watch('D:/git/OCR/js/' + '**/*.js', ['changed']);
})


//执行压缩前，先删除以前压缩的文件
gulp.task('clean', function() {
    return gulp.src(['D:/workspace/WebToolAC/testgulp' + '/*.js', 'D:/workspace/WebToolAC/testgulp' + '/*.html', 'D:/workspace/WebToolAC/testgulp' + '/*.css'], { read: false })
        .pipe(clean())
});

//压缩js测试  , ['clean']
gulp.task('testjs', ['clean'], function() {
    gulp.src(['D:/workspace/WebToolAC' + '/*.js', '!*.min.js']) //匹配所有的js，但不是 *.min.js 文件
        .pipe(stripDebug()) //删除console.log
        .pipe(uglify()) //执行压缩
        // .pipe(rename({ suffix: '.min' })) //重新命名
        .pipe(gulp.dest('testgulp')); //压缩文件位置

    gulp.src(['D:/workspace/WebToolAC' + '/*.html', '!*.min.html']) //匹配所有的html，但不是 *.min.html 文件
        .pipe(mincss())
        // .pipe(rename({ suffix: '.min' })) 
        .pipe(gulp.dest('testgulp'));

    gulp.src(['D:/workspace/WebToolAC' + '/*.css', '!*.min.css']) //匹配所有的css，但不是 *.min.css 文件
        .pipe(mincss())
        // .pipe(rename({ suffix: '.min' })) 
        .pipe(gulp.dest('testgulp'));
})

//控制任务执行顺序
// gulp.task('control', ['one', 'two', 'three']); //省略function

gulp.task('control', ['two', 'one', 'three'], function() {
    console.log('任务control执行完毕');
})

gulp.task('one', ['four'], function() {
    // setTimeout(function() {
    //     console.log('任务one执行完毕');
    // }, 2000)
    console.log('任务one执行完毕');
});

gulp.task('two', function() {
    console.log('任务two执行完毕');
});

gulp.task('three', function() {
    console.log('任务three执行完毕');
})

gulp.task('four', function(cb) {
    setTimeout(function() {
            console.log('任务four执行完毕');
            cb();
        }, 10)
        // console.log('任务four执行完毕');
})

// //合并测试
gulp.task('minjs', function() {
    gulp.src(ydcfo.bulid + '/js/**/*.js')
        .pipe(stripDebug()) //删除console.log
        .pipe(uglify()) //执行压缩
        .pipe(rename({ suffix: '.min' })) //重新命名
        .pipe(gulp.dest(ydcfo.build + '/js')); //压缩文件位置
})

// gulp.task('mincss', function() {
//     gulp.src(ydcfo.build + '/css/**/*.css')
//         .pipe(mincss())
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(ydcfo.build + '/css'));
// })

// gulp.task('minhtml', function() {
//     gulp.src(ydcfo.build + '/html/**/*.html')
//         .pipe(mincss())
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(ydcfo.build + '/html'));
// })


// //项目合并
// gulp.task('ydcfo2', function() {
//     gulp.src(ydcfo.build + '/js/**/*.js')
//         .pipe(stripDebug()) //删除console.log
//         .pipe(uglify()) //删除注释
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(ydcfo.build + '/js'));
//     gulp.src(ydcfo.build + '/page/**/*.html')
//         .pipe(mincss())
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(ydcfo.build + '/page'));
//     gulp.src(ydcfo.build + '/styles/**/*.css')
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(ydcfo.build + '/styles'));
// })

// gulp.task('onehtml', function() {
//     var options = {
//         removeComments: true, //清除HTML注释
//         collapseWhitespace: true, //压缩HTML
//         collapseBooleanAttributes: false, //省略布尔属性的��? <input checked="true"/> ==> <input checked />
//         removeEmptyAttributes: false, //删除所有空格作属性��? <input id="" /> ==> <input />
//         removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
//         removeStyleLinkTypeAttributes: true, //删除<style>��?<link>的type="text/css"
//         minifyJS: true, //压缩页面JS
//         minifyCSS: true //压缩页面CSS
//     };
//     gulp.src(ydcfo.build + '/page/modules/utf8-jsp/dialogs/webapp/webapp.html')
//         .pipe(htmlmin(options).on('error', function(x) { console.log(x) }))
//         .pipe(rename({ suffix: '' }))
//         .pipe(gulp.dest(ydcfo.build + '/page'));
// })

// gulp.task('imghb', function() {
//     // gulp.src(ydcfo.build + '/styles/**/*.css')
//     //     //.pipe(mincss())
//     //     .pipe(rename({ suffix: '' }))
//     //     .pipe(gulp.dest(ydcfo.build + '/styles'));
//     gulp.src(ydcfo.build + '/styles/**/*.css') //比如recharge.css这个样式里面什么都不用改，是你想要合并的图就要引用这个样式。 很重要 注意(recharge.css)这个是我的项目。别傻到家抄我一样的。
//         .pipe(spriter({
//             // The ydcfo and file name of where we will save the sprite sheet
//             'spriteSheet': ydcfo.build + '/images/spritesheet.png', //这是雪碧图自动合成的图。 很重要
//             // Because we don't know where you will end up saving the CSS file at this point in the pipe,
//             // we need a litle help identifying where it will be.
//             'ydcfoToSpriteSheetFromCSS': '/images/spritesheet.png' //这是在css引用的图片路径，很重要
//         }))
//         .pipe(gulp.dest(ydcfo.build + '/styles')); //最后生成出来
// })

// //项目合并
// gulp.task('ydcfo', function() {
//     var options = {
//         removeComments: true, //清除HTML注释
//         collapseWhitespace: true, //压缩HTML
//         collapseBooleanAttributes: false, //省略布尔属性的? <input checked="true"/> ==> <input checked />
//         removeEmptyAttributes: false, //删除所有空格作属性? <input id="" /> ==> <input />
//         removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
//         removeStyleLinkTypeAttributes: true, //删除<style>?<link>的type="text/css"
//         minifyJS: true, //压缩页面JS
//         minifyCSS: true //压缩页面CSS
//     };
//     gulp.src(ydcfo.build + '/images/**/*.*')
//         //.pipe(mincss())
//         //.pipe(rename({ suffix: '' }))
//         .pipe(gulp.dest(ydcfo.build + '/images'));
//     gulp.src(ydcfo.build + 'js/**/*.*')
//         //.pipe(stripDebug()) //删除console.log
//         // .pipe(uglify({ output: { comments: 'some' } }).on('error', function(x) { console.log(x) })) //删除注释
//         // .pipe(rename({ suffix: '' }))
//         .pipe(gulp.dest(ydcfo.build + '/js'));
//     gulp.src(ydcfo.build + '/page/**/*.*')
//         // .pipe(htmlmin(options).on('error', function(x) { console.log(x) }))
//         // .pipe(rename({ suffix: '' }))
//         .pipe(gulp.dest(ydcfo.build + '/page'));
//     gulp.src(ydcfo.build + '/styles/**/*.*')
//         //.pipe(mincss())
//         // .pipe(rename({ suffix: '' }))
//         .pipe(gulp.dest(ydcfo.build + '/styles'));
//     // gulp.src(ydcfo.build + '/styles/**/*.css') //比如recharge.css这个样式里面什么都不用改，是你想要合并的图就要引用这个样式。 很重要 注意(recharge.css)这个是我的项目。别傻到家抄我一样的。
//     //     .pipe(spriter({
//     //         // The ydcfo and file name of where we will save the sprite sheet
//     //         'spriteSheet': ydcfo.build + '/images/spritesheet.png', //这是雪碧图自动合成的图。 很重要
//     //         // Because we don't know where you will end up saving the CSS file at this point in the pipe,
//     //         // we need a litle help identifying where it will be.
//     //         'ydcfoToSpriteSheetFromCSS': '/images/spritesheet.png' //这是在css引用的图片路径，很重要
//     //     }))
//     //     .pipe(gulp.dest(ydcfo.build + '/styles')); //最后生成出来
// })

// gulp.task('test', function() {
//     gulp.src(test.build + 'js/**/*.js')
//         .pipe(stripDebug()) //删除console.log
//         .pipe(uglify().on('error', function(x) { console.log(x) })) //删除注释
//         .pipe(rename({ suffix: '' }))
//         .pipe(gulp.dest(test.build + '/js'));
// })


// gulp.task("scripts", function() {
//     gulp.src(ydcfo.test + "js/**/*.js")
//         //.pipe(concat("all.js"))
//         //.pipe(gulp.dest(ydcfo.test))
//         .pipe(stripDebug()) //删除console.log
//         .pipe(uglify({ output: { comments: 'some' } }).on('error', function(x) { console.log(x) })) //删除注释
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(ydcfo.test))
//         //.pipe(function() { console.log(1) })
//         //.pipe(console.log(1))
// });

// gulp.task('min', ['scripts'], function() {
//     console.log(1)
// })