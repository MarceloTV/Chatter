const index = (req,res) => {
    if(req.isAuthenticated()){
        return res.status(200).redirect('/app')
    }

    res.status(200).render('index')
}

const app = (req,res) => {
    if(req.isAuthenticated()){
        return res.status(200).render('app',{user:req.user})
    }

    res.status(403).redirect('/')
}

module.exports = { index , app }