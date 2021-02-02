//Render Index
const index = (req,res) => {
    //Auth verify
    if(req.isAuthenticated()){
        return res.status(200).redirect('/app')
    }

    res.status(200).render('index',{error: {exist:false,message:null,type:null}})
}

//Render app
const app = (req,res) => {
    //Auth verify
    if(req.isAuthenticated()){
        return res.status(200).render('app',{user:req.user,error: {exist:false,message:null,type:null}})
    }

    res.status(403).redirect('/')
}

module.exports = { index , app }