import counties from './county-map.json';

export const generateJSON = data => {
  return data.map( item => {
    return item['data']
  })
}

export const getContactInfo = ( val, program ) => {
  if ( val ) {
    if ( val.startsWith( 'http' ) ){
      return ['url', val];
    } else if ( val.startsWith( 'www' ) ) {
      return ['url', 'http://' + val ];
    } else {
      return ['phone', val];
    }
  }
}

const sortByName = ( a, b ) => {
  return a['name'].localeCompare( b['name'] );
}

export const processPrograms = programs => {
  let geographic = [];
  let tribal = [];
  let results = [];
  let noContact = [];
  let noURL = [];
  let noCounty = [];
  programs.forEach( item => {
    let itemCopy = {};
    // Copy and rename values
    // Copy Geographic Level as Type
    let type = item['Geographic Level'];
    itemCopy['type'] = type;

    // Copy State as State
    itemCopy['state'] = item['State'];
    // Set State to territory name if territory
    if ( type === 'Territory' ) {
      let val = item['Tribal Government/ Territory'];
      if ( val === 'Commonwealth of the Northern Mariana Islands' ) {
        // Rename Mariana Islands to match state name
        itemCopy['state'] = 'Northern Mariana Islands';
      } else {
        itemCopy['state'] = val;
      }
    }
    // copy Program Name as Program
    itemCopy['program'] = item['Program Name'];
    // Set Name based on type
    itemCopy['name'] = item['City/County/ Locality'] ||
                       item['Tribal Government/ Territory'] ||
                       item['State'];
    // Add County if type === 'City'
    if ( type === 'City' ) {
      const state = item['State'];
      let stateObj = counties[state] || {};
      let county = stateObj[item['City/County/ Locality']]
      itemCopy['county'] = county;
      if (!county) {
        noCounty.push( `${item['City/County/ Locality']}, ${item['State']}`)
      }
    }
    // check to see whether contact info is URL or phone
    // and set Phone or URL property
    let contact = getContactInfo(
      item['Program Page Link  (Phone # if Link is Unavailable)']
    )
    if (contact) {
      itemCopy[contact[0]] = contact[1];
      if ( contact[0] === 'phone' ) {
        noURL.push( [item['Program Name'], contact[1]] )
      }
    } else {
      noContact.push(item['Program Name']);
    }
    if ( type === 'Tribal Government' ) {
      tribal.push(itemCopy)
    } else {
      geographic.push(itemCopy)
    }
    tribal.sort(sortByName)
  })

  console.log(tribal)
  return {
    geographic: geographic,
    tribal: tribal,
    noContact: noContact,
    noCounty: noCounty,
    noURL: noURL
  }
}

export const diff = ( prev, current ) => {
  console.log(prev)
  console.log(current)
  let changedRecords = [];
  let addedRecords = [];
  let removedRecords = [];
  let foundRecords = [];
  current.forEach( item => {
    let match = false;
    let changed = [];
    prev.some( prevItem => {
      if ( item.program === prevItem.program  && item.state === prevItem.state) {
        match = true;
        Object.keys( item ).forEach( key => {
          if (key !== 'county') {
            if ( item[key] !== prevItem[key] ) {
              changed.push([key, prevItem[key], item[key]])
            }
          }
        })
        return match
      }
      return false;
    })
    if ( match ) {
      foundRecords.push( item.program );
      if ( Object.keys(changed).length ) {
        changedRecords.push([item.name + ', ' + item.state + ': ' + changed[0][2], changed])
      }
    } else {
      addedRecords.push(item)
    }
  })
  console.log(foundRecords)
  prev.forEach( item => {
    if ( !foundRecords.includes(item.program )) {
      removedRecords.push(item)
    }
  })
  console.log('removed', removedRecords)
  console.log('added', addedRecords)
  return {
    added: addedRecords, 
    removed: removedRecords,
    changed: changedRecords
  }
}






