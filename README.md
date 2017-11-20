`v2.1.0`
# Frontend
Среда сборки frontend проекта (Gulp, Sass, jQuery, BrowserSync).

## Установка
`cd <папка проекта>` - перейти в папку куда нужно установить среду  
`npm install` - установка пакетов (должен быть установлен Node.js)  
`bower install` - установка плагинов  
`gulp` - старт проекта  
`ctrl + c` - остановка проекта

## Возможные ошибки и как их устранить
```
Error: `libsass` bindings not found. Try reinstalling `node-sass`?
at getBinding (/Users/username/front/node_modules/gulp-sass/node_modules/node-sass/lib/index.js:22:11)
``` 
`npm uninstall --save-dev gulp-sass` - шаг 1  
`npm install --save-dev gulp-sass@2` - шаг 2