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

  // if ( ['http', 'www', '.gov'].some( s => val.includes( s ) ) ) {
  //     return ['url', val];
  //   } 
}

const sortByName = ( a, b ) => {
  return a.name.localeCompare( b.name );
}

const getProgramName = ( type, item ) => {
  switch( type ) {
    case 'State':
      return item['State'];
    case 'County':
    case 'City':
      return item['City/County/ Locality'];
    case 'Tribal Government':
    case 'Territory':
      return item['Tribal Government/ Territory'];
    default:
      return item['City/County/ Locality'] ||
             item['Tribal Government/ Territory'] ||
             item['State'];
  }
}

export const processPrograms = programs => {
  let geographic = [];
  let tribal = [];
  let results = [];
  let noContact = [];
  let noURL = [];
  let noCounty = [];
  let statuses = new Set();
  let statusCount = {};
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
    // set status
    // let stat = item['Program Status'];
    // itemCopy['status'] = stat;
    // statuses.add(stat)
    // let count = statusCount[stat] || 0;
    // statusCount[stat] = count + 1;
    //  
    // Set Name based on type
    itemCopy['name'] = getProgramName( type, item );
    let test = item['City/County/ Locality'] ||
             item['Tribal Government/ Territory'] ||
             item['State'];
    if ( test !== itemCopy['name'] ) {
      console.log('different', itemCopy['type'], itemCopy['name'], test)

    }

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
    tribal.sort((a,b)=> a.name.localeCompare( b.name ))
  })

  console.log(tribal)
  console.log(statuses)
    console.log(statusCount)

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
  prev = [...prev.geographic, ...prev.tribal]
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






