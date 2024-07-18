import express from "express";
import {createConnection} from "mysql2";
import {createTransport} from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import {log} from "node:console";
import {IncomingForm} from "formidable";
import session from "express-session";



const app = express();
const PORT = process.env.PORT || 4000;
const __dirname = url.fileURLToPath(import.meta.url);
const __filename = path.basename(__dirname);
const db = createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'login',

})


app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
  

app.set('view engine','ejs');


app.get('/',(req,res)=>{
  
    res.render('index',{
        erro : '',
    });
})


app.post('/',(req,res)=>{
    
    db.connect((err)=>{
        if(err){
              
            if(err);

        }else{
           
            const user_details = new IncomingForm();


            user_details.parse(req,(err,fields,file)=>{
                if(err){
                    log(err);
                }else{
                    
                    if(fields.username == "" || fields.password == ""){
                      
                        res.render('index',{
                            erro : `
                              <div class="error">
    <h3>fill all !!!</h3>
</div>
                            
                            
                            `,
                        })

                    }else{
                        
                        db.query("SELECT * FROM users WHERE username = ?",[fields.username],(err,result)=>{
                            if(err){
                                log(err);

                            }else{
                                if(result.length > 0){
                                    
                                    if(fields.password == result[0].password){
                                        
                                        req.session.udata = result;
                                        res.redirect('/dashboard');


                                    }else{
                                        res.render('index',{
                                            erro : `
                                              <div class="error">
                    <h3>wrong password !!!</h3>
                </div>
                                            
                                            
                                            `,
                                        })
                                    }

                                }else{
                                    res.render('index',{
                                        erro : `
                                          <div class="error">
                <h3>no user !!!</h3>
            </div>
                                        
                                        
                                        `,
                                    })
                                }
                            }
                        })

                    }

                }
            })

        }
    })

})


app.get('/dashboard',(req,res)=>{
    if(req.session.udata){ 

        res.render('dashboard',{
            account : req.session.udata,
        })


    }else{
        res.redirect('/');
    }
})


app.get('/logout',(req,res)=>{
    delete req.session.udata;
    res.redirect('/dashboard');
})


app.listen(PORT,()=>{
    log('server running : ' + PORT);
})