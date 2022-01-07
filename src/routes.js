//expres é 
const express =  require('express')
const routes = express.Router();

// camimnho base, __dirname é o  nome do diretório
const basePath = __dirname + '/views/'

const Jobs = {
    data: [
            {
                id: 1,
                name: "Pizzaria Louca",
                "daily-hours": 3,
                'total-hours': 42,  
                created_at: Date.now(),  
            },
            {
                id: 2,
                name: "OneTwo Project",
                "daily-hours": 2,
                'total-hours': 2, 
                created_at: Date.now(),
            },
        ],
    controllers: {
       index(req, res) { 
        const updatedJobs =  Jobs.data.map((job) => { 
        const remaining = Jobs.services.remainingDaysPerProject(job);
        const status = remaining <= 0 ? 'done' : 'progress';
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Jobs.services.calculateBudget(job, Profile.data['value-hour'])
                } 
            });
        return res.render(basePath + "index", {profile: Profile.data, jobs: updatedJobs})
    },  
        save(req, res) { 
        //req.body = {name: 'value', 'daily-hours': 'value', 'total-hours': '3'} ││
        const job = req.body

        const lastId = Jobs.data[Jobs.data.length - 1]?.id  || 1;

            Jobs.data.push({
            id: lastId + 1,
            name: job.name,
            "daily-hours": job['daily-hours'],
            'total-hours': job['total-hours'], 
            created_at: Date.now(),  //atribuindo uma data na hora da criação do JOB 
        })
        return res.redirect('/')
    }, 
        create(req, res){
        return res.render(basePath + 'job');
    },
        show(req, res){
            const jobId = Number(req.params.id);

            const job = Jobs.data.find(job => job.id === jobId);

            if (!job) { 
                return res.send("Job not found!") 
            }

            job.budget = Jobs.services.calculateBudget(job, Profile.data['value-hour']);

                return res.render(basePath + "job-edit", {job})
       
    },
        update(req,res){
            const body = req.body;
            const jobId = Number(req.params.id);
            const dailyHours = body['daily-hours'];
            const totalHours = body['total-hours'];
            const jobName = body['name'];
            const job = Jobs.data.find(job => job.id === jobId);
            if(!job) {return res.send('job not found')};

            const updatedJob = {
                ...job,
                name: jobName,
                "total-hours": totalHours,
                "daily-hours": dailyHours,
            }

            Jobs.data = Jobs.data.map (job => {
                if(job.id === jobId)  job = updatedJob
                return job
            })

            return res.redirect('/job/' + jobId);
    },
        delete(req, res){
            const deletedJobId = Number(req.params.id);

            Jobs.data = Jobs.data.filter((job) => deletedJobId !== job.id) 
 
            return res.redirect('/')
        }
    },

    services: {
        remainingDaysPerProject(job){
            const remainingDays = Number((job['total-hours'] / job['daily-hours']).toFixed());
           
            const createdDate = new Date(job.created_at);
            const today = Date.now();
            
            const dueDay = createdDate.getDate() + remainingDays
            const dueDateInMs = createdDate.setDate(dueDay);
            const timeDiffInMs = dueDateInMs - today;
            
            const dayInMs = 1000*60*60*24
            const dayDiff = Math.floor(timeDiffInMs / dayInMs)
        
            return dayDiff
        },
        calculateBudget(job, valueHour){
            return valueHour * job['total-hours']
        }
    }
}

const Profile = {
    data: {
        name: "Oberdan",
        avatar: "http://github.com/oberdan-angelim.png",
        'monthly-budget': 5000,
        'days-per-week': 5,
        'hours-per-day': 6,
        'vacation-per-year': 4, 
        'value-hour': 30,
    },
    controllers: {
        index(req, res) {
            return res.render(basePath + "profile", {profile: Profile.data})
        },
        update(req, res){
            const data = req.body
            const vacationWeeksPerYear =  data['vacation-per-year'];
            // --- controladores ------

            const weeksPerYear = 52;

            const weeksPerMonth = (weeksPerYear - vacationWeeksPerYear) / 12;

            const totalHoursWeekWorking = data['hours-per-day'] * data['days-per-week'];

            const monthlyTotalHoursWorking = totalHoursWeekWorking * weeksPerMonth;

            const monthlyBudget = data['monthly-budget'];
            
            const valueHour = monthlyBudget / monthlyTotalHoursWorking;

            Profile.data = {
                ...Profile.data,
                ...data,
                'value-hour': valueHour,
            }
            
            return res.redirect('/profile');
        },
    }
}

// CRIANDO O POST PARA SALVAR OS DADOS AO SEREM ADICIONADOS NO FORMULARIO DO HTML ./JOB

//INDEX!
routes.get('/', Jobs.controllers.index)
routes.post('/job', Jobs.controllers.save);
routes.get('/job', Jobs.controllers.create);

routes.post('/job/:id', Jobs.controllers.update);
routes.get('/job/:id', Jobs.controllers.show);

routes.post('/job/delete/:id', Jobs.controllers.delete)

routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);



module.exports  = routes;

