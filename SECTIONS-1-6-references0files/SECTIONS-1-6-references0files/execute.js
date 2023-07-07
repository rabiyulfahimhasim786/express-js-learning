const execute = require('child_process').exec;

execute("ls", (err, stdout)=>{

    if(err){
        console.log(err)

        return err;

    }

    console.log(stdout);


});