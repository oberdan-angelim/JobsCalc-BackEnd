//expres é 
const express =  require('express')
const routes = express.Router();

// camimnho base, __dirname é o  nome do diretório
const basePath = __dirname + '/views/'

class Job {
    name;
    dailyHour;
    totalHour;

    constructor(name, dailyHour, totalHour){
        this.name = name;
        this.dailyHour = dailyHour;
        this.totalHour = totalHour;
    }
}

const jobs = []

const profile = {
    name: "Oberdan",
    avatar: "http://github.com/oberdan-angelim.png",
    'monthly-budget': 5000,
    'days-per-week': 5,
    'hours-per-day': 6,
    'vacation-per-year': 4, 
}

// exemplo com return
routes.get('/profile', (req, res)=>{ return res.render(basePath + "profile", {profile: profile}) })


routes.post('/job', (req, res)=>{ 
const body = req.body
console.log(body.name)
console.log(body['daily-hours'])   
console.log(body['total-hours'])
jobs.push(req.body)
return res.redirect('/')
})

// exemplo sem return com
routes.get('/', (req, res)=> res.render(basePath + "index", {profile: profile}))
routes.get('/job', (req, res)=> res.render(basePath + "job"))
routes.get('/job-edit', (req, res)=> res.render(basePath + "job-edit"))


module.exports  = routes;

