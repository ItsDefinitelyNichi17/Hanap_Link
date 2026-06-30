//this is for DB
import app from "./app.js";
import { getFirestore, addDoc, collection } from "firebase/firestore";

const db = getFirestore(app);

export async function getAMissingPerson(){

}
export async function getAllMissingPerson(){

}


/**
 * AddMissingPerson to the firestore db
 * @param {object} personalInfo 
 * @param {object} lastSeenInfo 
 * @returns 
 */
export async function addMissingPerson(personalInfo, lastSeenInfo){
    if(personalInfo == null && lastSeenInfo == null){
        return;
    }
    const personalInfoArr = [...Object.values(personalInfo), ...Object.values(lastSeenInfo)] 
    //console.log(personalInfoArr)

    personalInfoArr.forEach(element => {
        if(element === undefined || element === null){
        return `${element} is null or undefined`
        }
    });

    const {fullName, age, gender, height, hairColor, eyeColor, distinctMark} = personalInfo
    const {dateLS, timeLS, lsLoc, otherInfo} = lastSeenInfo 
    
    //console.log(personalInfo)
    
    const missingPerInfo = {
        personalInformation : {
            fullName : fullName,
            age : age,
            gender : gender,
            height : height, 
            hcolor : hairColor,
            ecolor : eyeColor,
            distinctMark : distinctMark
        },
        LastSeenInformation : {
            dateLS : dateLS,
            timeLS : timeLS,
            LSloc : lsLoc,
            otherInfo: otherInfo
        }
    }
    //console.log(missingPerInfo)
    const docRef = await addDoc(collection(db, "missing_person"), missingPerInfo);

}

/* const missing1 = {
personalInfo : {
    fullName : "nichi",
    age : 5,
    gender : "m",
    height : 32,
    hairColor : "brown",
    eyeColor : "brown",
    distinctMark : "chikinini"
},
lastSeenInformation : {
    dateLS : Date(),
    timeLS: 123,
    lsLoc: "dsaha",
    otherInfo: "dasd"
}
} */

//addMissingPerson(missing1.personalInfo, missing1.lastSeenInformation);