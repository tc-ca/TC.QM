import { v4 as uuidv4 } from 'uuid';
import { QUESTION_TYPE } from '../src/data/questionTypes';

const tagsToReplace = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
 
export function escapeHTML (str) {
      return str.replace(/[&<>]/g, tag => tagsToReplace[tag] || tag)
}
export  function isEmptyValues(value) {
  return (
    value === undefined ||
    value === null ||
    value === isNaN ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
      (typeof value === "string" && value.trim().length === 0)
  );
}
  
export function pad (n, width, z) {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

export function generateName (name, prefix, postfix, removeVowels = true) {
  if (!name) return name

  let cn = name
  if (removeVowels) {
    cn = name.replace(/[aeiou]/ig,'')
  }

  cn = prefix + '_' + cn.replace(/\s+/g, '').     // replace whitespaces 
                         substring(0, 15).        // take first 15 characters
                         toUpperCase()            // to upper
  if (postfix) cn += '_' + postfix
  return cn
}

/**
 * https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
 * works on primitive values
 * example call: 
 * var unique = a.filter(onlyUnique);
 */
export function onlyUnique (value, index, self) {
  return self.indexOf(value) === index
}

// works on complex types
export function onlyUniqueObj (a, param) {
  return a.filter(function (item, pos, array) {
    return array.map(function (mapItem) {
      return mapItem[param]
    }).indexOf(item[param]) === pos
  })
}

export function groupBy (collection, property) {
  var i = 0; var val; var index
  var values = []; var result = []
  for (; i < collection.length; i++) {
    val = collection[i][property]
    index = values.indexOf(val)
    if (index > -1) { result[index].push(collection[i]) } else {
      values.push(val)
      result.push([collection[i]])
    }
  }
  return result
}

export function buildTreeFromFlatList(data, parentKey) {
  const idMapping = data.reduce((acc, el, i) => {
    acc[el.id] = i;
    return acc;
  }, {});

  let root;
  console.log(data.length);
  data.forEach(el => {
    // Handle the root element
    if (el[parentKey] === null) {
      root = el;
      return;
    }
    // Use our mapping to locate the parent element in our data array
    const parentEl = data[idMapping[el[parentKey]]];
    // Add our current el to its parent's `children` array
    parentEl.children = [...(parentEl.children || []), el];
  });
  return root
}

export function hydrateItems (itemToHydrate, dictionary) {
    let hydratedItems = []

    for (let index = 0; index < itemToHydrate.length; index++) {
      // get the key from array
      let key = itemToHydrate[index]
      // map to the value i want to extract
      let value = dictionary[key]
      hydratedItems.push(value)
    }
    return hydratedItems
    }

export function findParentInCollection(collection, guid) {
  if (collection.findIndex( q => q.guid === guid) > -1 ) return collection;
  let result = null;
  let x = 0;
  for(x = 0; result === null && x < collection.length; x++) {
    if(collection[x].childQuestions && collection[x].childQuestions.length > 0) {
      result = findParentInCollection(collection[x].childQuestions, guid)
    }
  }
  return result
}

export function getCollectionParent(group, guid) {
  if (group.questions.findIndex(q => q.guid === guid) > -1) return group.questions;
  let result = null;
  let x = 0;
  for(x = 0; result === null && x < group.questions.length; x++) {
    if(group.questions[x].childQuestions && group.questions[x].childQuestions.length > 0) {
      result = findParentInCollection(group.questions[x].childQuestions, guid)
    }
  }
  return result;
}

export function questionHasSupplementaryInfo(question)
{
  return (question.type !== QUESTION_TYPE.REFERENCE) // && (question.type !== QUESTION_TYPE.TEXT) && (question.type !== QUESTION_TYPE.NUMBER)
}

export function GetAllChildrenQuestions(question)
{
  const questions = []
       let childrenQuestions = GetChildQuestions(question);
       let childrenCount = childrenQuestions.length;

       while (childrenCount > 0) {
         for (let index = 0; index < childrenQuestions.length; index++) {
           let childQuestion = childrenQuestions[index];
           //add child question to array
           questions.push(childQuestion);
           //check to see if child has children
           const children = GetChildQuestions(childQuestion);
           //
           childrenCount = children.length;
           //wtv children questions that have been found will add it to the loop/queue for processing
           childrenQuestions = childrenQuestions.concat(children);
         }
       }
       return questions
}
function GetChildQuestions(question) {
  let questions = [];
  question.childQuestions.forEach(childQuestion => {
    questions.push(childQuestion);
  });
  return questions;
}
export function setNewGUID (question) {
  question.guid = uuidv4()
  if (question.childQuestions) {
    question.childQuestions.forEach(cq => {
      setNewGUID(cq)
    })
  }
}

export function isNumber (n) { 
  return /^-?[\d.]+(?:e-?\d+)?$/.test(n); 
} 

export function isString (obj) {
  return toString.call(obj) == '[object String]';
}

