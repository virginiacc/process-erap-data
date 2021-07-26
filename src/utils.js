import counties from './county-map.json';

export const generateJSON = data => {
  return data.map( item => {
    return item['data']
  })
}

export const getContactInfo = ( val, program ) => {
  if ( val ) {
    if ( val.startsWith( 'http' ) ){
      return ['URL', val];
    } else if ( val.startsWith( 'www' ) ) {
      return ['URL', 'http://' + val ];
    } else {
      return ['Phone', val];
    }
  }
}

export const processPrograms = programs => {
  let results = [];
  let noContact = [];
  let noURL = [];
  let noCounty = [];
  programs.forEach( item => {
    let itemCopy = {};
    // Copy and rename values
    // Copy Geographic Level as Type
    let type = item['Geographic Level'];
    itemCopy['Type'] = type;
    // Copy State as State
    itemCopy['State'] = item['State'];
    // Set State to territory name if territory
    if ( type === 'Territory' ) {
      let val = item['Tribal Government/ Territory'];
      if ( val === 'Commonwealth of the Northern Mariana Islands' ) {
        // Rename Mariana Islands to match state name
        itemCopy['State'] = 'Northern Mariana Islands';
      } else {
        itemCopy['State'] = val;
      }
    }
    // copy Program Name as Program
    itemCopy['Program'] = item['Program Name'];
    // Set Name based on type
    itemCopy['Name'] = item['City/County/ Locality'] ||
                       item['Tribal Government/ Territory'] ||
                       item['State'];
    // Add County if type === 'City'
    if ( type === 'City' ) {
      const state = item['State'];
      let stateObj = counties[state] || {};
      let county = stateObj[item['City/County/ Locality']]
      itemCopy['County'] = county;
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
      if ( contact[0] === 'Phone' ) {
        noURL.push( [item['Program Name'], contact[1]] )
      }
    } else {
      noContact.push(item['Program Name']);
    }
    results.push(itemCopy)
  })
  return {
    programs: results,
    noContact: noContact,
    noCounty: noCounty,
    noURL: noURL
  }
}