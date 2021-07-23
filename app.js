const express = require('express');
const fs = require('fs');
const webpush = require('web-push')
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

var corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.use(bodyParser.json());

const vapidKeys = {
    "publicKey": process.env.PUBLICKEY,
    "privateKey": process.env.PRIVATEKEY
}

webpush.setVapidDetails(
    'mailto:richardjimenez.9641@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const handleResponse = (res, data, cod = 200) => {
    res.status(code).send({data})
}

const savePush = (req, res) => {
    const name = Math.floor(Date.now() / 1000);
    let tokenBrowser = req.body.token;
    let data = JSON.stringify(tokenBrowser, null, 2);
    fs.writeFile(`./tokens/token-${name}.json`, data, (ErrnoException) => {
        if (err) throw err;
        handleResponse(res,`Save Success`)
    })
}

const sendPush = (req, res) => {
    const payload = {
        "notification": {
            "title": "HOLA GRACIAS POR NO SER PARTE DEL 80% DE NOMADAS SOCIALES!",
            "body": "Visita mis demas proyectos que estan en mi pagina principal",
            "vibrate": [100, 50, 100],
            "image": "https://richardev.netlify.app/assets/img/GlobalTech.jpg",
            "actions": [
                {
                "action": "explore",
                "title":"Juntos Crecemos!!!"
                }
            ]
        }
    }
    const directoryPath = path.join(__dirname, 'tokens');
    fs.readdir(directoryPath, (ErrnoException, files ) => {
        if (err) {
            handleResponse(res,data=`Error read`,code=500)
        }
        files.forEach((file = string) => {
            const tokenRaw = fs.readFileSync(`${directoryPath}/${file}`);
            const tokenParse = JSON.parse(tokenRaw);

            webpush.sendNotification(
                tokenParse,
                JSON.stringify(payload))
                .then(res => {
                    console.log("Enviado");
                }).catch(err => {
                    console.log("No tienes permisos");
                })
        })
    })
}


app.route('/save').post(savePush);

app.route('/send').post(sendPush);

const PORT = process.env.PORT || 9000;

const httpServer = app.listen(PORT, () => {
    console.log("Http Runing at http:..localhost:"+httpServer.address().port);
})