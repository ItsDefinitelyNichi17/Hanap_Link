//this is for DB
import app from "./app.js";
import { getFirestore, addDoc, collection, getDoc, doc, getDocs } from "firebase/firestore";

const db = getFirestore(app);

export async function getAMissingPerson(){

}
export async function getAllMissingPerson(){

    const allData = await getDocs(collection(db,"missing_persons"));
    const dataInObject = {}
    allData.forEach(element => {
        dataInObject[element.id] = element.data()
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
export async function addMissingPerson(personalInfo, lastSeenInfo, status){
    if(personalInfo === null && lastSeenInfo === null && status === null){
        return;
    }
    const personalInfoArr = [...Object.values(personalInfo), ...Object.values(lastSeenInfo)] 

    personalInfoArr.forEach(element => {
        if(element === undefined || element === null){
        return `${element} is null or undefined`
        }
    });

    const {fullName, age, gender, height, hairColor, eyeColor, distinctMark} = personalInfo
    const {contactNo,dateLS, timeLS, lsLoc, otherInfo} = lastSeenInfo 

  

    const missingPerInfo = {
        status : status,
        personalInformation : {
            fullName : fullName,
            age : age,
            gender : gender,
            height : height, 
            hcolor : hairColor,
            ecolor : eyeColor,
            distinctMark : distinctMark
        },
        Information : {
            contactNo : contactNo,
            dateLS : dateLS,
            timeLS : timeLS,
            LSloc : lsLoc,
            otherInfo: otherInfo
        }
    }


    const docRef = await addDoc(collection(db, "missing_persons"), missingPerInfo);

    console.log(docRef.id)

}

 const missing1 = {
    status : false,
    personalInfo : {
        fullName : "nichi",
        age : 5,
        gender : "m",
        height : 32,
        hairColor : "brown",
        eyeColor : "brown",
        distinctMark : "chikinini"
    },
    Information : {
        contactNo : "094342342434",
        dateLS : Date(),
        timeLS: 123,
        lsLoc: "dsaha",
        otherInfo: "dasd"
    }
} 

//addMissingPerson(missing1.personalInfo, missing1.Information, missing1.status);
const data = await getAllMissingPerson()

console.log(data)