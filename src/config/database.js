const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/chatter',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err){
        return console.error(err)
    }

    console.log('Database is connected')
})