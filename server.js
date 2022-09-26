require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./modules/users/utils/passport');
const numCPUs = require('os').cpus().length;
const cluster = require('cluster');
const compression = require('compression');
const logger = require('./utils/loggers/winston');
const argsparse = require('./utils/argsparse');

const apiRoutes = require('./src/routes/index');

const colMessages = require('./src/containers/messagesContainer_firebase');
const { getAllProducts } = require('./modules/products/controllersProducts');
const { ProductService } = require('./modules/products/serviceProducts');

const app = express();
const httpServer = new HttpServer(app);
const ioServer = new SocketServer(httpServer);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_ATLAS_CONNECTION,
        dbName: 'ecommerce',
        ttl: 10 * 60,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: 'desafio26',
    resave: true,
    rolling: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(compression());

app.engine(
    'hbs',
    engine({
      extname: '.hbs',
      defaultLayout: 'index.hbs',
    })
);

app.set('views', './public/views');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    logger.info(`ruta: ${req.url}, método: ${req.method}`);
    next();
});

const port = process.env.PORT || argsparse.port;

logger.info(`en server admin: ${process.env.ADMIN}, persistenceType: ${argsparse.persistenceType}`);

//arreglar esta ruta, pasé args para otro lado
//Ruta info
app.get('/info', (req, res) => {
    let arguments = 'No se ingresaron argumentos';
    if (args.length !== 0) {
        const puerto = JSON.stringify({port})
        arguments = puerto ;
    }
    const info = {
        arguments: arguments ,
        platform: process.platform,
        version: process.version,
        memory: process.memoryUsage().rss,
        path: process.execPath,
        id: process.pid,
        folder: process.cwd(),
        numCPUs: numCPUs
    };
    logger.info(`info en /info ${info}`);
    res.render('info', {info});
});

app.use('/', apiRoutes);

// Para cualquier ruta no implementada
app.use((req, res) => {
    logger.warn(`ruta: ${req.url}, método: ${req.method} no implementada`);
    res.status(404).send("ruta no implementada");
});

logger.info(`argsparse.mode ${argsparse.mode}`)
logger.info(`process.env.MODE ${process.env.MODE}`)

if (argsparse.mode === "cluster" || process.env.MODE === "cluster") {
    if (cluster.isMaster) {
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }    
    } else {
        httpServer.listen(port, () => {
            logger.info(`escuchando desafio 44 en puerto ${port}, pid: ${process.pid}`);
        });
    }
} else {
    httpServer.listen(port, () => {
        logger.info(`escuchando desafio 44 en puerto ${port}, pid: ${process.pid}`);
    });
} 

const productService = new ProductService()

ioServer.on('connection', (socket) => {
    logger.info('Nuevo cliente conectado');
    const getTables = (async () => {
        socket.emit('messages', await colMessages.getAll());  
        /* socket.emit('products', await getAllProducts()); */
        socket.emit('products', await productService.getListProducts());
    }) ();

    socket.on("newMessage", (message) => {
        const saveMessage = (async (message) => {
            const messagesNorm = await colMessages.save(message);
            ioServer.sockets.emit("messages", messagesNorm);
        }) (message);
    });
    socket.on('newProduct', (product) => {
        const getProducts = (async (product) => {
            await tableProducts.save(product);
            const allProducts = await tableProducts.getAll()
            ioServer.sockets.emit("products", allProducts);
        }) (product);
    });
});