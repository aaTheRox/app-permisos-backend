const PORT = process.env.PORT || 8888,

express = require("express")
app = express(),
bodyParser = require("body-parser"),
methodOverride = require("method-override"),
dotenv = require('dotenv');
dotenv.config()

const mongoose = require('./db') 


// Mongoose Models
const Users = require('./models/users');
const UUAA = require('./models/uuaas');
const Roles = require('./models/roles');


// CONFIG
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.listen(PORT, () => {
    console.log(`Node server running on http://localhost:${PORT}`);
});
app.get('/secret', async(req, res) => {
    const user = new Users({ user: 'admin', password: 'admin' });
    await user.save()
})


app.get('/u/delete/:user', async(req, res) => {
    console.log(req.body);

    try {
        const findUser = await Users.find({user: req.params.user});
        console.log(findUser);

        if(findUser.length>0) {
            const user = await Users.deleteOne({user: req.params.user});
            res.send({status: 'USER_DELETED'})
        } else {
            res.send({status: 'USER_NOT_FOUND'})
        }
        
    } catch (error) {
        console.log('ESTO HA PETADO ', error)
    }
});


app.post('/register', async(req, res) => {
    console.log(req.body);
    const findUser = await Users.find({user: req.body.user});
    console.log(findUser);
    
    if(findUser.length==0) {
        const user = await Users({user: req.body.user, password: req.body.password});
        user.save();
        res.send({status: 'USER_ADDED'})
    } else {
        res.send({status: 'USER_EXISTS'})
    }
});

app.post('/login', async(req, res) => {
    let user;
    try {
        user = await Users.find({username: req.body.username, password: req.body.password});
        if(user.length > 0) {
            resp = {status: 'LOGIN_SUCCESS'}
            
        } else {
            resp =  {status: 'LOGIN_FAILED'}
        }
        
    } catch (error) {
        res.send({status: 'ERROR'})
    }
    res.send(resp)
    
})

app.get('/getUsers', async(req, res) => {
    const users = await Users.find();
    res.send({users: users});
})

app.post('/getUser/:id', async(req, res) => {
    console.log(req.params.id)
    try {
        
    const user = await Users.findById({_id: req.params.id});
    const uuaa = await UUAA.find();

    res.send(user);

    } catch (error) {
        console.log(error)
        res.send({status: 'NOT_FOUND'})
    }
})

app.post('/getUUAAs', async(req, res) => {
    try {
    const uuaa = await UUAA.find();
    res.send(uuaa);

    } catch (error) {
        console.log(error)
        res.send({status: 'NOT_FOUND'})
    }
})
app.post('/updateUUAAs', async(req, res) => {
    const filter = req.body.data;
    try {
       const user = await Users.findById({_id: filter.userId});

       await Users.updateOne({_id: filter.userId}, {
                $set: {
                    uuaas: filter.uuaas
                }
            })
        const uuaa = await UUAA.find();
        res.send(uuaa);

    } catch (error) {
        console.log(error)
        res.send({status: 'NOT_FOUND'})
    }
})

app.post('/updateUserRole', async(req, res) => {
    const filter = req.body.data;
    console.log(filter)
    try {
       const user = await Users.findById({_id: filter.userId});

       await Users.updateOne({_id: filter.userId}, {
                $set: {
                    role: filter.role
                }
            })

       res.send({status: 'UPDATE_ROLE_SUCCESS'})

    } catch (error) {
        console.log(error)
        res.send({status: 'UPDATE_ROLE_FAILED'})
    }
})

app.post('/getRoles', async(req, res) => {
    try {
    const roles = await Roles.find();
    res.send(roles);

    } catch (error) {
        console.log(error)
        res.send({status: 'NOT_FOUND'})
    }
})

app.post('/addRole', async(req, res) => {
    const filter = req.body.data;
    try {
        const role = await Roles.find({name: filter.roleName});
        if(filter.editMode) { // EDIT A ROLE
            console.log('fff', filter)

            await Roles.updateOne({_id: filter._id}, {
                $set: {
                    name: filter.roleName,
                    uuaas: filter.uuaas
                }
            });

            res.send({status: 'ROLE_EDITED'})

        } else { // ADD A ROLE
            if(role.length==0) {
                const newRole = await Roles({name: filter.roleName, uuaas: filter.uuaas});
                newRole.save();
                res.send({status: 'ROLE_ADDED'})
            } else {
                res.send({status: 'ROLE_EXISTS'})
            }
        }
    } catch (error) {
        console.log(error)
        res.send({status: 'NOT_FOUND'})
    }
})


app.post('/deleteRole', async(req, res) => {
    const filter = req.body.data;
    try {
        const role = await Roles.findById({_id: filter._id});
        console.log(role)

        if(role) {
            const newRole = await role.deleteOne({_id: filter._id});
           res.send({status: 'ROLE_DELETED'})
        } else{
           res.send({status: 'ROLE_NOT_FOUND'})
        }

    } catch (error) {
        console.log(error)
        res.send({status: 'ERROR'})
    }
})


app.post('/addUUAA', async(req, res) => {
    const filter = req.body.data;
    try {
        const uuaa = await UUAA.find({name: filter.uuaaName});
        console.log(filter)
        if(filter.editMode) { // EDIT AN UUAA
            const findUUAA = await UUAA({_id: filter._id});
            await findUUAA.updateOne({name: filter.uuaaName}, {
                $set: {
                    name: filter.uuaaName
                }
            });
            res.send({status: 'UUAA_EDITED'})

        } else { // ADD AN UUAA
            if(uuaa.length==0) {
                const newUUAA = await UUAA({name: filter.uuaaName});
                newUUAA.save();
                res.send({status: 'UUAA_ADDED'})
            } else{
                res.send({status: 'UUAA_EXISTS'})
            }
        }

    } catch (error) {
        console.log(error)
        res.send({status: 'NOT_FOUND'})
    }
})


app.post('/deleteUUAA', async(req, res) => {
    const filter = req.body.data;
    try {
        const uuaa = await UUAA.findById({_id: filter._id});
        console.log(uuaa)

        if(uuaa) {
            const newRole = await uuaa.deleteOne({_id: filter._id});
           res.send({status: 'UUAA_DELETED'})
        } else{
           res.send({status: 'UUAA_NOT_FOUND'})
        }

    } catch (error) {
        console.log(error)
        res.send({status: 'ERROR'})
    }
})


app.get('/api/user/:name', async(req, res) => {
    try {
        const user = await Users.find({user: req.params.name}, { _id: 1, user: 1, uuaas: 1, role: 1, active: 1  })
       // const uuaa = await UUAA.find();
        if(user.length>0) {
            res.send(user);
        } else {
            res.send({status: 'USER_NOT_FOUND'})
        }
    } catch (error) {
        console.log(error)
        res.send({status: 'NOT_FOUND'})
    }
})


app.post('/getRoleUUAAS', async(req, res) => {
    try {
        const roleUUAAS = await Roles.find({name: req.body.data.rolename}, {uuaas: 1, _id: 0});
        res.send(...roleUUAAS);
    } catch (error) {
        console.log(error)
        res.send({status: 'NOT_FOUND'})
    }
})
