import './App.css';
import { useState } from 'react';
import CSVReaderComponent from './CSVReader.js';
import { generateJSON, processPrograms } from './utils.js';

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
  const [ programs, setPrograms ] = useState( [] );
  const [ noContact, setNoContact ]= useState( [] );
  const [ noURL, setNoURL ]= useState( [] );
  const [ noCounty, setNoCounty ]= useState( [] );

  const csvToJSON = data => {
    const json = generateJSON( data );
    const results = processPrograms( json );
    setPrograms( results.programs )
    setNoContact( results.noContact );
    setNoURL( results.noURL );
    setNoCounty( results.noCounty );
  }

  const copy = () => {
    navigator.clipboard.writeText( JSON.stringify(programs) )
  }

  return (
    <div className="App">
      <div className="reader block u-mt15">
        <CSVReaderComponent handler={ csvToJSON }/>
      </div>
      { programs.length > 0 &&
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
        
        <div className="block">
          <h2> There are {programs.length} programs</h2>
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
          { programs.map( ( item, index ) => (
              <tr key={index}>
                <td>{ item["State"] }</td>
                <td>{ item["Type"] }</td>
                <td>{ item["Name"] }</td>
                <td>{ item["Program"] }</td>
                <td className="url">{ item["URL"] }</td>
                <td>{ item["Phone"] }</td>
                <td>
                  <ul>
                    { item["County"] && item["County"].map( ( county, index ) => (
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
        <button className="a-btn u-mb15" onClick={ copy }>Copy</button>
        <div className="json">
          { JSON.stringify(programs) }
        </div>
      </div>
      }
    </div>
  );
}

export default App;
