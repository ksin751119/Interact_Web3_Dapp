// Holds the base URL for etherscan.io
var etherscanBaseUrl = 'https://ropsten.etherscan.io/';

// Set Data to innerHTML
function setData(docElementId, html) {
  document.getElementById(docElementId).innerHTML = html;
}


// Set Data to input value
function setDataValue(docElementId, value, disabled = false) {
  document.getElementById(docElementId).value = value;
  document.getElementById(docElementId).disabled = disabled;
}


/**
 * Sets the href in the <a> tag for etherscan.io
 */
function setEtherscanIoLink(aId, type, hashOrNumber) {
  var etherscanLinkA = document.getElementById(aId);
  etherscanLinkA.href = createEtherscanIoUrl(type, hashOrNumber);
  if (hashOrNumber)
    etherscanLinkA.innerHTML = 'etherscan.io';
  else
    etherscanLinkA.innerHTML = '';
}


/**
 * Create the etherscan link
 */
function createEtherscanIoUrl(type, hashOrNumber) {
  // For TestRPC - this URL will have no meaning as the
  // Etherscan.io will not know about the Tx Hash

  var url = etherscanBaseUrl;
  if (type === 'tx') {
    url += 'tx/' + hashOrNumber;
  } else if (type === 'block') {
    url += 'block/' + hashOrNumber;
  } else if (type === 'address') {
    url += 'address/' + hashOrNumber;
  }
  return url;
}


/**
 * Adds a list element in the 0th position
 * Removes the last element if the length exceeds provided ln
 */
function addEventTableItem(tableId, childData, len) {
  var table = document.getElementById(tableId);
  var num = table.rows.length
  console.log("table length" + num)
  //console.log(num);
  if (table.rows.length >= len) {
    var i = table.rows.length - 1; // last child
    table.deleteRow(i);
  }

  var Tr = table.insertRow(0);
  console.log(Tr.cells.length);
  var Td = Tr.insertCell(Tr.cells.length);
  var p = document.createElement('A');
  p.text = childData.name;
  Td.appendChild(p);

  Td = Tr.insertCell(Tr.cells.length);
  Td.width = '200%'
  Td.align = "middle"
  var p = document.createElement('A');
  p.text = childData.date;
  Td.appendChild(p);

  Td = Tr.insertCell(Tr.cells.length);
  var aLink = document.createElement('A')
  aLink.text = childData.addr;
  aLink.href = createEtherscanIoUrl('address', childData.addr);
  aLink.target = '_blank';
  Td.width = "25%"
  Td.align = "right"
  Td.appendChild(aLink);
}


/**
 * Clears the items from a list element on the HTML page
 */
function clearTable(tableId) {
  var table = document.getElementById(tableId);
  console.log("length" + table.childNodes.length);
  for (var i = table.childNodes.length - 1; i >= 0; i--) {
    //console.log(table.childNodes[i]);
    table.removeChild(table.childNodes[i]);
  }
}
