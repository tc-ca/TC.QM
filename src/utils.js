
export function pad (n, width, z) {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

// works on primitive types
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



export function buildNotificationObject (q, text, icon = 'mdi-message-alert', lang = 'en', color = 'error') {
  const notice = { header: `Question: ${q.text[lang]}`, text: text, icon: icon, color: color };
  return notice;
}
