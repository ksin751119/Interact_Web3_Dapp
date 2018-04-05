var nodeType;

var abiDefinitionString = '[{"constant":false,"inputs":[{"name":"yourName","type":"bytes32"}],"name":"interact","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"currentName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fromAddres","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastUpdatedMinutes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"},{"indexed":true,"name":"timeUpdated","type":"uint256"}],"name":"Interaction","type":"event"}]'

var contractEvent;
var contractEventCounter=0;
var defaultContractAddress = '0x10fcfbba14a146856f2644f05fb0fc134ffeb033';
/**
 * Get the version information for Web3
 */


 window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log('Injected web3 Not Found!!!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

    var provider = document.getElementById('provider_url').value;
    window.web3 = new Web3(new Web3.providers.HttpProvider(provider));
  }

  // Now you can start your app & access web3 freely:
  startApp()

})


function    setWeb3Version() {

    var versionJson = {};

    // Asynchronous version
    web3.version.getNode(function(error, result){
        if(error) setData('version_information',error);
        else {
            setData('version_information',result);

            if(result.toLowerCase().includes('metamask')){
                nodeType = 'metamask';
            } else if(result.toLowerCase().includes('testrpc')){
                nodeType = 'testrpc';
            } else {
                nodeType = 'geth';
            }
        }
    });
}


function    doGetAccounts() {
    // This is the synch call for getting the accounts
    // var accounts = web3.eth.accounts

    // Asynchronous call to get the accounts
    // result = [Array of accounts]
    // MetaMask returns 1 account in the array - that is the currently selected account
    web3.eth.getAccounts(function (error, result) {
        if (error) {
            setData('accounts_count', error, true);
        } else {
            // You need to have at least 1 account to proceed
            if(result.length == 0) {
                if(nodeType == 'metamask'){
                    alert('Unlock MetaMask *and* click \'Get Accounts\'');
                }
                return;
            }

            var defaultAccount = web3.eth.defaultAccount;
            if(!defaultAccount){
                web3.eth.defaultAccount =  result[0];
                defaultAccount = '[Undef]' + result[0];
            }
            setDataValue('userAccount', defaultAccount, true);
        }

        // This populates the SELECT boxes with the accounts
        //addAccountsToSelects(accounts);
    });
}

function    startApp(){

    // If the app is reconnected we should reset the watch
    //doFilterStopWatching();
    //doContractEventWatchStop();

    // Set the connect status on the app
    if (web3 && web3.isConnected()) {
        setData('connect_status','Connected');

        // Gets the version data and populates the result UI
        setWeb3Version();
        doGetAccounts();
        doContractEventWatchStart();
        doContractFunctionCall();

    } else {
        setData('connect_status','Not Connected');
    }

    return;
}

function doConnect()    {

    // Get the provider URL
    var provider = document.getElementById('provider_url').value;
    //var provider = document.getElementById('provider_url').value;
    window.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    startApp();

}


/**
 * To stop the event watching using the contract object
 */

function    doContractEventWatchStop()   {

    if(contractEvent){
        contractEvent.stopWatching();
        contractEvent = undefined;
    }
    contractEventCounter = 0;
    clearList('watch_contract_events_list');
}

/**
 * To start the event watching using the contract object
 */

function    doContractEventWatchStart() {

    if(contractEvent){
        doContractEventWatchStop();
    }

    // Reset the UI
    //setData('watch_contract_instance_event_count','0');
    //console.log(contractEventCounter);
    //watch_contract_instance_event_count = 0;
    contractEvent = createContractEventInstance();
    //console.log('XXXXX');


    contractEvent.watch(function(error, result){
        if(error){
            console.error('Contract Event Error');
        } else {
            //    console.log("Event.watch="+JSON.stringify(result))
            // increment the count watch_instance_event_count
            contractEventCounter++;
            //setData('watch_contract_instance_event_count',contractEventCounter);

            var watchEvent = {
              'name': web3.toAscii(result['args']['name']),
              'addr': result['args']['addr'],
              'date': (new Date(1000 * result['args']['timeUpdated'])).toUTCString()
            }
            //addEventListItem('watch_contract_events_list', watchEvent);
            addEventTableItem('eventTable', watchEvent);
            setData('txn_link', '');
        }
    });
}


/**
 * Utility method for creating an instance of the event
 */
function createContractEventInstance(){
    var contractAddress = document.getElementById('contract_instance_address').value
    console.log("contract Address: " + contractAddress);


    var contractInstance = createContractInstance(contractAddress);

    // geth the indexed data values JSON

    //var indexedEventValues = document.getElementById('indexed_event_values').value
    var indexedEventValues = '{}';
    indexedEventValues = JSON.parse(indexedEventValues)

    //var additionalFilterOptions = document.getElementById('additional_filter_event_values').value;
    var additionalFilterOptions = {
        "fromBlock": 0
    }
    //additionalFilterOptions = JSON.parse(additionalFilterOptions);

    //console.log(indexedEventValues);
    //console.log(additionalFilterOptions);
    return contractInstance.Interaction(indexedEventValues, additionalFilterOptions);
}


// Utility method for creating the contract instance
function  createContractInstance(addr){
    //var     abiDefinitionString = document.getElementById('compiled_abidefinition').value;
    var     abiDefinition = JSON.parse(abiDefinitionString);

    // Instance uses the definition to create the function

    var    contract = web3.eth.contract(abiDefinition);
    var    address = addr;

    if(!address) address = document.getElementById('contract_instance_address').value;
    var    instance = contract.at(address);

    return instance;
}

/**
 * send Transaction costs Gas. State changes are recorded on the chain.
 */
function    doContractSendCall()   {
    // creating the cntract instance
    var instance = createContractInstance();
    // read the ui elements
    var estimatedGas = 4500000;
    var something = document.getElementById('something').value;

    // Create the transaction object
    var    txnObject = {
        from: web3.eth.defaultAccount,
        gas: estimatedGas
    }

    instance.interact.sendTransaction(something,txnObject,function(error, result)  {
        console.log('RECVED>>',error,result);
        if(error){
            console.log(error);
        } else {

            console.log(result);
            setEtherscanIoLink('txn_link', 'tx', result);

        }
    });
}

/**
 * This invokes the contract function
 * locally on the node with no state change propagation
 */
function    doContractFunctionCall()  {
    // This leads to the invocation of the method locally
    var instance = createContractInstance();
    instance.currentName.call({},web3.eth.defaultBlock, function(error,result){
      if(error) {
        console.log(error);
      } else {
        console.log(result);
      }
    });
}


function updateContractAddress() {
  var contractAddress = document.getElementById('contract_instance_address').value
  document.getElementById('contract_instance_address').value = contractAddress;
  startApp();
}

function resetContractAddress() {
  document.getElementById('contract_instance_address').value = defaultContractAddress;
  startApp();
}
