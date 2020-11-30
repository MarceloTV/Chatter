const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err){
        return console.error(err)
    }

    console.log('Database is connected')
})