import React, { Component } from 'react'

import { CSVReader } from 'react-papaparse'

export default class CSVReaderComponent extends Component {
  handleOnDrop = (data) => {
    this.props.handler(data);
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleOnRemoveFile = (data) => {
    this.props.handler([])
  }

  removeHeaders = (chunk) => {
    var rows = chunk.split( /\r\n|\r|\n/ );
    rows.splice(0, 3);
    return rows.join("\r\n");
  }

  render() {
    return (
      <CSVReader
        onDrop={this.handleOnDrop}
        onError={this.handleOnError}
        addRemoveButton
        onRemoveFile={this.handleOnRemoveFile}
        config={{header:true, beforeFirstChunk: this.removeHeaders}}
        accept='text/csv, .csv, .tsv, application/vnd.ms-excel'>
        <span>Drop CSV file here or click to upload.</span>
      </CSVReader>
    )
  }
}