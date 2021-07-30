import './App.css';
import { useState } from 'react';
import CSVReaderComponent from './CSVReader.js';
import { diff, generateJSON, processPrograms } from './utils.js';
import prev from './latest.json';


// Processing involves:
// - removing first three rows of headers from tsv
// - converting tsv to json
// - mapping to new json objects, copying only needed values:
//     - "Geographic Level" => "Type"
// .   - "State" or "Tribal Government/ Territory" => "State"
//       - Mariana Islands renamed to match state value in state select
//     - "Program Name" => "Program"
//     - "City/County/ Locality" or 
//       "Tribal Government/ Territory" or
//       "State" => "Name"
//     - Add "County" using county map if City
//     - "Program Page Link  (Phone # if Link is Unavailable)" =>
//       "URL" or "Phone" depending on value



function App() {
  const [ tribal, setTribal ] = useState( [] );
  const [ geographic, setGeographic ] = useState( [] );
  const [ noContact, setNoContact ]= useState( [] );
  const [ noURL, setNoURL ]= useState( [] );
  const [ noCounty, setNoCounty ]= useState( [] );
  const [ allData, setAllData ]= useState( [] );
  const [ changed, setChanged ] = useState( [] );

  const csvToJSON = data => {
    let importedJSON = generateJSON( data );
    const results = processPrograms( importedJSON );
    setGeographic( results.geographic )
    setTribal( results.tribal )
    setNoContact( results.noContact );
    setNoURL( results.noURL );
    setNoCounty( results.noCounty );
    setAllData(importedJSON)
    let updates = diff(prev, importedJSON)
    setChanged(updates.changed)
  }

  const copy = () => {
    navigator.clipboard.writeText( JSON.stringify({"geographic": geographic, "tribal": tribal}) )
  }

  const copyFull = () => {
    navigator.clipboard.writeText( JSON.stringify(allData) )
  }

  return (
    <div className="App">
      <div className="reader block u-mt15">
        <CSVReaderComponent handler={ csvToJSON }/>
      </div>
      { geographic.length > 0 &&
      <div>
        <h1>Programs</h1>
        { ( noContact.length > 0 || noURL.length > 0 || noCounty.length > 0 ) &&
          <h2>Issues</h2>
        }
        { noContact.length > 0 &&
          <div className="block block__sub">
            <h3>No contact info</h3>
            <ul>
            { noContact.map( ( item, index ) => (
              <li key={index}>{item}</li>
            ) ) } 
            </ul>
          </div>
        }
        { noURL.length > 0 &&
          <div className="block block__sub">
            <h3>No URL</h3>
            <ul>
            { noURL.map( ( item, index ) => (
              <li key={index}>{item[0]}: {item[1]}</li>
            ) ) } 
            </ul>
          </div>
        }
        { noCounty.length > 0 &&
          <div className="block block__sub">
            <h3>Cities not in county list</h3>
            <ul>
            { noCounty.map( ( item, index ) => (
              <li  key={index}>{item}</li>
            ) ) } 
            </ul>
          </div>
        }
        <h2>Changed: {changed.length}</h2>
        <ul>
        {changed.map(( item, index) => (
          <li>  - { item[0] } </li>
        ))}
</ul>
        {changed.map(( item, index) => (
            <div className="block block__sub" key={index}>
                <table className="changedTable">
                    <thead>
                      <tr>
                        <th>{item[0]}</th>
                        <th>Before</th>
                        <th>After</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item[1].map(( prop, i ) => (
                        
                            <tr>
                              <td>
                                {prop[0]}
                              </td>
                              <td>
                                <span>{prop[1]}</span>
                              </td>
                              <td>
                                <span>{prop[2]}</span>
                              </td>
                            </tr>
                        
                        
                      ))}
                  </tbody>
                  </table>
            </div>
        ))}
        
        <div className="block">
          <h2> There are {geographic.length} geographic programs</h2>
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Type</th>
                <th>Name</th>
                <th>Program</th>
                <th>URL</th>
                <th>Phone</th>
                <th>County</th>
              </tr>
            </thead>
            <tbody>
          { geographic.map( ( item, index ) => (
              <tr key={index}>
                <td>{ item.state }</td>
                <td>{ item.type }</td>
                <td>{ item.name }</td>
                <td>{ item.program }</td>
                <td className="url">{ item.url }</td>
                <td>{ item["Phone"] }</td>
                <td>
                  <ul>
                    { item.county && item.county.map( ( county, index ) => (
                      <li  key={ index }>{ county }</li>
                    ) ) } 
                    </ul>
                </td>
              </tr>
            ) ) } 
          </tbody>
          </table>
        </div>
        <div className="block">
          <h2> There are {tribal.length} tribal programs</h2>
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Type</th>
                <th>Name</th>
                <th>Program</th>
                <th>URL</th>
                <th>Phone</th>
                <th>County</th>
              </tr>
            </thead>
            <tbody>
          { tribal.map( ( item, index ) => (
              <tr key={index}>
                <td>{ item.state }</td>
                <td>{ item.type }</td>
                <td>{ item.name }</td>
                <td>{ item.program }</td>
                <td className="url">{ item.url }</td>
                <td>{ item["Phone"] }</td>
                <td>
                  <ul>
                    { item.county && item.county.map( ( county, index ) => (
                      <li  key={ index }>{ county }</li>
                    ) ) } 
                    </ul>
                </td>
              </tr>
            ) ) } 
          </tbody>
          </table>
        </div>
        <h2>JSON</h2>
        <button className="a-btn u-mb15" onClick={ copy }>Copy JSON</button>
        <div className="json">
          { JSON.stringify({"geographic": geographic, "tribal": tribal}) }
        </div>
        <button className="a-btn u-mb15" onClick={ copyFull }>Copy ALL JSON</button>


      </div>
      }
    </div>
  );
}

export default App;
