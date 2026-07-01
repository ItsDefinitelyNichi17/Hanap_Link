// (not app.js — that file relies on process.env, which doesn't exist
// in the browser, so it can't be used here).

import { db, rtdb } from "./firebase-config.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  ref,
  get,
  push,
  set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const COLLECTION_NAME = "missing_persons";

/**
 * Fetch a single missing person by their Firestore document id.
 * @param {string} id
 */
export async function getAMissingPerson(id) {
  try {
    const snap = await get(ref(rtdb, `${COLLECTION_NAME}/${id}`));
    if (snap.exists()) {
      return { id, ...(snap.val() || {}) };
    }
  } catch (error) {
    console.warn("Realtime Database read failed for single item:", error);
  }

  const firestoreSnap = await getDoc(doc(db, COLLECTION_NAME, id));
  if (!firestoreSnap.exists()) return null;
  return { id: firestoreSnap.id, ...firestoreSnap.data() };
}

/**
 * Fetch all missing person records.
 * Returns an ARRAY (not an object keyed by id) because that's the shape
 * script.js's renderCards()/filtering logic expects.
 */
export async function getAllMissingPerson() {
  try {
    const snapshot = await get(ref(rtdb, COLLECTION_NAME));
    if (snapshot.exists()) {
      const value = snapshot.val();
      if (Array.isArray(value)) {
        return value.map((item, index) => ({ id: item.id || String(index), ...item }));
      }
      if (value && typeof value === "object") {
        return Object.entries(value).map(([id, item]) => ({ id, ...(item || {}) }));
      }
    }
  } catch (error) {
    console.warn("Realtime Database read failed; trying Firestore fallback:", error);
  }

  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
}

/**
 * Add a missing person report to Firestore.
 * The shape is FLAT so it matches what the feed cards render directly —
 * no extra mapping step needed on the read side.
 *
 * @param {object} person
 * @param {string} person.name
 * @param {number} person.age
 * @param {string} person.sex
 * @param {string} person.location
 * @param {"Still Missing"|"Found"|"Closed"} person.status
 * @param {string} person.lastSeen  ISO date string, e.g. "2026-05-12"
 * @param {string} [person.photo]  image URL, optional
 * @param {string} [person.description]
 * @returns {Promise<string>} the new document's id
 */
export async function addMissingPerson(person) {
  if (!person || !person.name) {
    throw new Error("addMissingPerson: 'name' is required");
  }

  const record = {
    name: person.name,
    age: person.age ?? null,
    sex: person.sex ?? "",
    location: person.location ?? "",
    status: person.status ?? "Still Missing",
    lastSeen: person.lastSeen ?? "",
    photo: person.photo ?? "",
    description: person.description ?? ""
  };

  try {
    const newRef = push(ref(rtdb, COLLECTION_NAME));
    await set(newRef, record);
    return newRef.key;
  } catch (error) {
    console.warn("Realtime Database write failed; trying Firestore fallback:", error);
    const docRef = await addDoc(collection(db, COLLECTION_NAME), record);
    return docRef.id;
  }
}
