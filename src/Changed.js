
const Changed = ( props ) => {
  let changed = props.changed;
  let x = (
    <div>
    <h2>Changed: {changed.length}</h2>
{/*         <ul> */}
{/*         {changed.map(( item, index) => ( */}
{/*           <li>  - { item[0] } </li> */}
{/*         ))} */}
{/* </ul> */}
        {changed.map(( item, index) => (
            <div className="block block__sub" key={index}>
              <h4>{item[0]}</h4>
              
              {item[1].map(( prop, i ) => (
                <ul>
                  <li> - {prop[0]} before: {prop[1]}</li>
                  <li> - {prop[0]} after: {prop[2]}</li>
                </ul>
                

                        
                        
              ))}
             
                
            </div>
        ))}
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
        </div>
    );
  console.log(x)
  return x;
};

export default Changed;


