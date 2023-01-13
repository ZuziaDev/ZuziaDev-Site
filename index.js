//Package
const timestamp = require('time-stamp');
const mongoose = require('mongoose')
const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const fs = require('fs');
const events = require('events');
const discord = require("discord.js");
const client = new discord.Client();
const canvacord = require("canvacord");
const { Database } = require("nukleon");
let db = new Database("./nukleon/database.json");
let s = new Database("./nukleon/database2.json");
let a = new Database("./nukleon/database3.json");
let aa = new Database("./nukleon/database4.json");
const axios = require('axios');
const { lookup } = require('geoip-lite');
const router = express.Router();
const multer = require('multer')
const User = require('./models/user.js')
const uploadMidleware = multer({
	limits: {
		fileSize: 1024 * 1024 * 20
	},
	fileFilter: (req, file, cb) => {
		cb(undefined, true)
	},
	storage: multer.diskStorage({
		filename: (req, file, cb) => {
			cb(null, file.originalname)
		},
		destination: (req, file, cb) => {
			cb(null, 'uploads/')
		}
	})
})
client.on("ready", () => {
  console.log(`\x1b[5m\x1b[35m[BotLog] Discordda bağlanıldı.\x1b[0m`);
  client.user.setStatus('dnd');
  client.user.setActivity("zuziadev.ga");
});
/*function test(){
    setTimeout(() => {
    client.channels.cache.get('1054684436295323658').send('https://zuziadev.ga');
        }, 1000);
  }

mongoose
  .connect(config.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('Mongo Bağlandı')
  })
  .catch((err) => console.log('Mongoda hata var.'));
*/
const config = require("./config/config.json");
const EventEmitter = require('events').EventEmitter;
const em = new EventEmitter();
/* Discord Client */
const passport = require("passport");
const { Strategy } = require("passport-discord");
const session = require("express-session");

app.use(
  session({
    secret: "secret-session-thing",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((obj, done) => done(null, obj));

const scopes = ["identify", "guilds"];
passport.use(
  new Strategy(
    {
      clientID: config.clientID,
      clientSecret: config.secret,
      callbackURL: config.callbackURL,
      scope: scopes,
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }
  )
);

app.get("/login", passport.authenticate("discord", { scope: scopes }));
app.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: "/error" }),
  (req, res) => {
      let a = req.user.id
    res.cookie("userId", a);
  const member = client.users.cache.get(a);
    res.redirect('/');
    console.log(`\x1b[43m\x1b[35m[WebLog] ${member?.tag} Siteye giriş yaptı.\x1b[0m`, );
    let mc = new discord.MessageEmbed()
    .setTitle(`[${member?.tag}]`)
    .setThumbnail(member?.avatarURL({dynamic: true}))
    .setDescription(`_\`Siteye giriş yaptı.\`_`)
    .setFooter(timestamp.utc("HH:mm - DD/MM/YYYY"))
    .setColor("#8E44AD")
    client.channels.cache.get('1056573515098247170').send(mc);
  }
);
app.get("/logout", (req, res) => {
  req.logOut();
  res.clearCookie("userId");
  return res.redirect("/");
});

/* End Discord Client */
//View Engine 
const ejs = require("ejs");
app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
//Body-parse 
app.use(bodyParser.json()).use(
	bodyParser.urlencoded({
		extended: true,
	})
);

//Statik
app.use(express.static('public'));
app.set("views", "path/to/views");

//Sayfalar
/*app.get('/', (req, res) => {
	res.send('Sorunsuz proje çalışıyor.')
})*/
client.on('message', message => {
    
	if (message.content === '!site-bakım-aç') {
        if(s.get('bakim') == "açık"){
            message.channel.send('Site zaten bakımda.'); 
        } else {
            message.channel.send('Site bakıma alındı.');
            s.set('bakim', "açık")
        let mc = new discord.MessageEmbed()
    .setTitle(`[ZuziaDev]`)
    .setThumbnail('https://zuziadev.ga/uploads/avatar.png')
    .setDescription(`_\`Site bakıma alındı! \n ${message.author.username}\`_`)
    .setFooter(timestamp.utc("HH:mm - DD/MM/YYYY"))
    .setColor("#8E44AD")
    client.channels.cache.get('1054885197583237231').send(mc);
        }
        if(message.author.id == "890626326350946364"){
} else {
            message.channel.send('Sen site admini değilsin.');
        }
    }
        
});
client.on('message', message => {
	if (message.content === '!site-bakım-kapat') {
        if(s.get('bakim') == "kapalı"){
            message.channel.send('Site zaten bakımda değil.'); 
        } else {
            message.channel.send('Site bakımdan çıkarıldı.');
            s.set('bakim', "kapalı")
        let mc = new discord.MessageEmbed()
    .setTitle(`[ZuziaDev]`)
    .setThumbnail('https://zuziadev.ga/uploads/avatar.png')
    .setDescription(`_\`Site bakımadan çıktı! \n ${message.author.username}\`_`)
    .setFooter(timestamp.utc("HH:mm - DD/MM/YYYY"))
    .setColor("#8E44AD")
    client.channels.cache.get('1054885197583237231').send(mc);
        } 
    
    if(message.author.id == "890626326350946364"){
} else {
            message.channel.send('Sen site admini değilsin.');
        }
    }
});
client.on('message', message => {
  if (message.content === '!ping') {  
      let m = new discord.MessageEmbed()
    .setTitle(`[ZuziaDev]`)
    .setThumbnail('https://zuziadev.ga/uploads/avatar.png')
    .setDescription(`**Site Ping:** _\`${Date.now() - message.createdTimestamp}\`_ \n **API Ping:** _\`${Math.round(client.ws.ping)}\`_`)
    .setFooter(timestamp.utc("HH:mm - DD/MM/YYYY"))
    .setColor("#8E44AD")
    client.channels.cache.get(message.channel.id).send(m);
  }
});
client.on('message', message => {
  if (message.content === '!rank') {  
      const img = "https://cdn.discordapp.com/embed/avatars/5.png";
const userData = db.get('test');
console.log(userData.xp, userData.requiredXP)
const rank = new canvacord.Rank()
    .setAvatar(img)
    .setCurrentXP(userData.xp)
    .setRequiredXP(userData.requiredXP)
    .setStatus("dnd")
    .setProgressBar("#8E44AD", "COLOR")
    .setUsername("ZuziaDev")
    .setDiscriminator("0000");

rank.build()
    .then(data => {
        const attachment = new discord.MessageAttachment(data, "RankCard.png");
        message.channel.send(attachment);
    });
  }
});
client.on('message', message => {

  if (message.content === '!site') {  

client.channels.cache.get(message.channel.id).send('https://zuziadev.ga');

  }

});
app.get('/', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let userId = req.cookies.userId;
  let member = client.users.cache.get(userId);
  const axios = require('axios');
axios.get('https://ipgeolocation.abstractapi.com/v1/?api_key=30f7f0c1d211404d9107ed0af9ecad18&fields=city')
    .then(response => {
    if(s.get('bakim') == "kapalı"){
    let data = response.data
       res.render(`${__dirname}/views/index.ejs`, {
		userData: req.cookies.userId,
        member: member,
		ekipo: config.ekipo,
		ekipl: config.ekipl,
		ekipk: config.ekipk,
		ekipm: config.ekipm,
        main: db.get('main'),
        bakim: "kapalı"
           
	}) } else {
           res.render(`${__dirname}/views/bakim.ejs`,{ 
        date: timestamp.utc("HH:mm - DD/MM/YYYY"),
        userData: req.cookies.userId,
        member: member,
		ekipo: config.ekipo,
		ekipl: config.ekipl,
		ekipk: config.ekipk,
		ekipm: config.ekipm,
        main: db.get('main'),
        bakim: "açık"
           }) 
	}
    aa.add(data?.city, 1)
}).catch(error => {
        console.log(error);
    });
})
app.get('/analysis', (req, res) => {
     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let userId = req.cookies.userId;
  let member = client.users.cache.get(userId);
    const axios = require('axios');
axios.get('https://ipgeolocation.abstractapi.com/v1/?api_key=30f7f0c1d211404d9107ed0af9ecad18&fields=city')
    .then(response => {
    let data = response.data
    let number = aa.get(data?.city)
    if(s.get('bakim') == "kapalı"){
    let data = response.data
       res.render(`${__dirname}/views/analysis.ejs`, {
		userData: req.cookies.userId,
        member: member,
		ekipo: config.ekipo,
		ekipl: config.ekipl,
		ekipk: config.ekipk,
		ekipm: config.ekipm,
        number: number,
        bakim: "kapalı"
	}) } else {
           res.render(`${__dirname}/views/bakim.ejs`,{ 
        date: timestamp.utc("HH:mm - DD/MM/YYYY"),
        userData: req.cookies.userId,
        member: member,
		ekipo: config.ekipo,
		ekipl: config.ekipl,
		ekipk: config.ekipk,
		ekipm: config.ekipm,
        main: db.get('main'),
        bakim: "açık"
           }) 
	}
    })
    .catch(error => {
        console.log(error);
    });
})
app.get('/codes', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let userId = req.cookies.userId;
  let member = client.users.cache.get(userId);
    if(userId){
      if(s.get('bakim') == "kapalı"){
   
    
            res.render(`${__dirname}/views/codes.ejs`, {
		userData: req.cookies.userId,
        member: member,
		ekipo: config.ekipo,
		ekipl: config.ekipl,
		ekipk: config.ekipk,
		ekipm: config.ekipm,
        main: db.get('main'),
        date: timestamp.utc("HH:mm - DD/MM/YYYY"),
        bakim: "kapalı"
	});
  
                } else {
           res.render(`${__dirname}/views/bakim.ejs`,{ 
        date: timestamp.utc("HH:mm - DD/MM/YYYY"),
        userData: req.cookies.userId,
        member: member,
		ekipo: config.ekipo,
		ekipl: config.ekipl,
		ekipk: config.ekipk,
		ekipm: config.ekipm,
        main: db.get('main'),
        bakim: "açık"
           }) 
	}
            
    } else {
		res.redirect("/login")
	}
    
})
app.post('/upload/info', uploadMidleware.single('avatar'), (req, res, next) => {
	if (!req.file) {
		return res.send('hata')
	}

	return res.json({
		success: true,
		message: "Yüklendi.",
		file: req.file
	})
})
app.post('/dashboard/info',(req,res)=>{
      let userId = req.cookies.userId;
  let member = client.users.cache.get(userId);
      s.add("discriminator", 1); 
      let discriminator = s.get('discriminator')
      var sayi = discriminator;
      let title = req.body.tit
      let description = req.body.description
      let date = timestamp.utc("HH:mm - DD/MM/YYYY")
      if(sayi.toString().length == 1){
          let a = "000"
          db.push('main', {'title': title, 'description': description, 'discriminator': `${a}${discriminator}`, 'date': date, 'user': member?.username})
      } else if(sayi.toString().length == 2){
          let a = "00"
          db.push('main', {'title': title, 'description': description, 'discriminator': `${a}${discriminator}`, 'date': date, 'user': member?.username})
      } else if(sayi.toString().length == 3){
          let a = "0"
          db.push('main', {'title': title, 'description': description, 'discriminator': `${a}${discriminator}`, 'date': date, 'user': member?.username})
      } else if(sayi.toString().length == 4){
          let a = ""
          db.push('main', {'title': title, 'description': description, 'discriminator': `${a}${discriminator}`, 'date': date, 'user': member?.username})
      }
      db.push('test', {discriminator: db.get('main')})
      
      res.redirect("/codes")
      let mc = new discord.MessageEmbed()
    .setTitle(`**[**${member?.tag}**]** Yeni Bir İçerik Ekledi.`)
    .setDescription(`**Form Adı:** [${title}](https://zuziadev.ga)\n
**Form Linki:** [Tıkla](https://zuziadev.ga/codes#${discriminator})`)
    .setThumbnail(member?.avatarURL({dynamic: true}))
    .setFooter(timestamp.utc("HH:mm - DD/MM/YYYY"))
    .setColor("#8E44AD")
    client.channels.cache.get('1056562857027833918').send(mc);
  })

app.get('/uploads/:filename', (req, res) => {
	var file = req.params.filename
	res.sendFile(__dirname + '/uploads/' + file)
})
app.get('/error', (req, res) => {
    const zuzia = require("./public/img/404.json");
	let img = zuzia[Math.floor(Math.random() * zuzia.length)]
	res.render(__dirname + '/views/redricet.ejs', { img:img, code:"Bir hata oldu lütfen anasayfa 'ya dönünüz.", url:"/", error:"Anasayfa" })
})

app.get("/dashboard", (req, res) => {
	let userId = req.cookies.userId;
	if (userId == config.ekipo || userId == config.ekipl || userId == config.ekipk || userId == config.ekipm) {
  let member = client.users.cache.get(userId);
		res.render(`${__dirname}/views/dashboard.ejs`, {
			userData: req.cookies.userId,
            member: member,
            main: db.get('main'),
			ekipo: config.ekipo,
			ekipl: config.ekipl,
			ekipk: config.ekipk,
			ekipm: config.ekipm,
            bakim: "kapalı"
		});
	} else {
		res.redirect("/")
	}
})


app.get('/*', (req, res) => {
    const zuzia = require("./public/img/404.json");
	let img = zuzia[Math.floor(Math.random() * zuzia.length)]
	res.redirect("/redricet")
})


//Server listen
const port = 25874
app.listen(port, () => {
	console.log(port, "portu ile sistem sorunsuz çalışıyor.");
});

/*const folderName = './Users';

try {
	if (!fs.existsSync(folderName)) {
		fs.mkdirSync(folderName);
	}
} catch (err) {
	console.error(err);
}
*/




/* let date = new Date()
	 let x = date.toLocaleDateString()
*/


client.login(config.token);