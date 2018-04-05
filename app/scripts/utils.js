// Holds the base URL for etherscan.io
var etherscanBaseUrl='https://ropsten.etherscan.io/';


function setData(docElementId, html) {
    document.getElementById(docElementId).innerHTML = html;
}

function setDataValue(docElementId, value, disabled=false) {
    document.getElementById(docElementId).value = value;
    document.getElementById(docElementId).disabled = disabled;
}


/**
 * Adds a list element in the 0th position
 * Removes the last element if the length exceeds provided ln
 */
function    addEventListItem(listId, childData, len){

    //console.log('Event:',childData);

    // check length
    var list = document.getElementById(listId);
    if(list.childNodes.length >= len){
        var i = list.childNodes.length - 1; // last child
        list.removeChild(list.childNodes[i]);
    }
    // Create the List Item for the events list
    var li = document.createElement('LI');

    // Add new event in the 0th position
    li.appendChild(createEventListItem(childData));
    list.insertBefore(li, list.childNodes[0]);
}

/**
 * Adds a list element in the 0th position
 * Removes the last element if the length exceeds provided ln
 */
function    addEventTableItem(tableId, childData, len){

    //console.log('Event:',childData);

    // check length
    var table = document.getElementById(tableId);
    var num = table.rows.length
    //console.log(num);
    if(table.rows.length >= len){
        var i = table.rows.length - 1; // last child
        table.deleteRow(i);
    }

    var Tr = table.insertRow(num);
    console.log(Tr.cells.length);
    var Td = Tr.insertCell(Tr.cells.length);
    var p = document.createElement('A');
    p.text = childData.name;
    Td.appendChild(p);

    //這裡也可以用不同的變數來辨別不同的td (我是用同一個比較省事XD)
    Td = Tr.insertCell(Tr.cells.length);
    Td.width = '200%'
    Td.align="middle"
    var p = document.createElement('A');
    p.text = childData.date;
    Td.appendChild(p);

    //<td width="25%" align="right"><a target="_new" href="http://ropsten.etherscan.io/address/0xcfbf434a06c03b417d97528eea3ca46539165daf">0xcfbf4...</a></td>

    Td = Tr.insertCell(Tr.cells.length);
    var aLink = document.createElement('A')
    aLink.text = childData.addr;
    aLink.href = createEtherscanIoUrl('address', childData.addr);
    aLink.target='_blank';
    Td.width = "25%"
    Td.align = "right"
    Td.appendChild(aLink);
}

// Creates the item in the events list
function    createEventListItem(childData){


    var div = document.createElement('SPAN');
    var p = document.createElement('A');
    p.text = childData.name;
    div.appendChild(p);

    // Add txn info link
    var aLink = document.createElement('A')
    aLink.text = childData.date;
    div.appendChild(aLink);

    // Address

    aLink = document.createElement('A')
    aLink.text = childData.addr;
    aLink.href = createEtherscanIoUrl('address', childData.addr);
    aLink.target='_blank';
    div.appendChild(aLink);

    return div;
}

/**
 * Sets the href in the <a> tag for etherscan.io
 */
function   setEtherscanIoLink(aId, type, hashOrNumber){
    var etherscanLinkA=document.getElementById(aId);
    etherscanLinkA.href = createEtherscanIoUrl(type,hashOrNumber);
    if(hashOrNumber)
        etherscanLinkA.innerHTML='etherscan.io';
    else
        etherscanLinkA.innerHTML='';
}

/**
 * Create the etherscan link
 */
function    createEtherscanIoUrl(type,hashOrNumber){

    // For TestRPC - this URL will have no meaning as the
    // Etherscan.io will not know about the Tx Hash

    var url = etherscanBaseUrl;
    if(type === 'tx'){
        url += 'tx/'+hashOrNumber;
    } else if(type === 'block'){
        url += 'block/'+hashOrNumber;
    } else if(type === 'address'){
        url += 'address/'+hashOrNumber;
    }
    return url;
}

/**
 * Clears the items from a list element on the HTML page
 */
function    clearList(listId){
    var list = document.getElementById(listId);
    for(var i=list.childNodes.length-1; i>=0 ;i--){
        list.removeChild(list.childNodes[i]);
    }
}
