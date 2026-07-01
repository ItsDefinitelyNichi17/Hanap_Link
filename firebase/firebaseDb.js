//this is for DB
import app from "./app.js";
import { getFirestore, addDoc, collection, getDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore(app);

export async function getAMissingPerson(){

}
export async function getAllMissingPerson(){

    const allData = await getDocs(collection(db,"missing_persons"));
    let dataInObject;
    let index  = 1
    allData.forEach((element)=> {
        dataInObject = { 
            ...dataInObject,
            [index] : {
                id : element.id,
                ...element.data()
            }
        }
        index++
    })
    return dataInObject  
}


/**
 * AddMissingPerson to the firestore db
 * @param {object} personalInfo 
 * @param {object} status 
 * @param {object} lastSeenInfo 
 * @returns 
 */
export async function addMissingPerson(info){
    if(info === null){
        return;
    }
    const personalInfoArr = [Object.values(info)] 

    personalInfoArr.forEach(element => {
        if(element === undefined || element === null){
        return `${element} is null or undefined`
        }
    });

    const {name, age, sex, location, status, lastSeen, photo, description} = info

    const missingPerInfo = {
        name: name,
        age: age,
        sex: sex, 
        location: location, 
        status: status,
        lastseen: lastSeen,
        photo: photo,
        description: description
    }


    const docRef = await addDoc(collection(db, "missing_persons"), missingPerInfo);

    console.log(docRef.id)

}

 const missing1 = {
    id: '1',
    name: 'Maria Santos',
    age: 24,
    sex: 'Female',
    location: 'Quezon City',
    status: 'Still Missing',
    lastSeen: '2026-05-12',
    photo: '',
    description: 'Last seen wearing a blue jacket near Commonwealth Avenue.'
}


const data = await getAllMissingPerson()

//addMissingPerson(missing1)
