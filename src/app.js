const express= require('express');
const morgan= require('morgan');
const exphbs= require('express-handlebars');
const path= require('path');
const app=express();


//settings
app.set('port',process.env.PORT || 3000); //configurar puertos
app.set('views',path.join(__dirname,'views')); //incluir la carpeta views al node
//especificar el motor de plantillas de handlebars a hbs
app.engine('.hbs',exphbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    helpers:{
        ifCond: function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        }
    },
    extname:'.hbs'
}));
app.set('view engine','hbs');



//middlewares 
app.use(morgan('dev')); //en desarrollo
app.use(express.urlencoded({extended: true}));
app.use(express.json())

//routes
app.use(require('./routes/index.router'));

//static files
app.use(express.static(path.join(__dirname,'public')));


module.exports=app;

