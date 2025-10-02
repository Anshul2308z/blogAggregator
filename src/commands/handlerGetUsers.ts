import { readConfig } from "src/config";
import { getAllUsers } from "src/lib/db/queries/users";

export async function handlerGetUsers(){
    const users = await getAllUsers();
    users.forEach(
        (u)=>{
            const name = u.name;
            if(u.name === readConfig().currentUserName){
                console.log(`* ${name} (current)`);
            }else{
                console.log(`* ${name}`);
            }
        });
};
