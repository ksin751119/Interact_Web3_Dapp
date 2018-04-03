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
        if(error) setData('version_information',error,true);
        else {
            setData('version_information',result,false);

            if(result.toLowerCase().includes('metamask')){
                nodeType = 'metamask';
            } else if(result.toLowerCase().includes('testrpc')){
                nodeType = 'testrpc';
            } else {
                nodeType = 'geth';
            }


            // set up UI elements based on the node type
            setUIBasedOnNodeType();
        }
    });
}




function    startApp(){

    // If the app is reconnected we should reset the watch
    //doFilterStopWatching();
    //doContractEventWatchStop();

    // Set the connect status on the app
    if (web3 && web3.isConnected()) {
        setData('connect_status','Connected', false);

        // Gets the version data and populates the result UI
        setWeb3Version();

        if(autoRetrieveFlag) doGetAccounts();

    } else {
        setData('connect_status','Not Connected', true);
    }

    // no action to be taken if this flag is OFF
    // during development for convinience you may set autoRetrieveFlag=true
    if(!autoRetrieveFlag)  return;



    // doConnect();
    // // doGetAccounts();
    //doGetNodeStatus();

    // Compilation is available only for TestRPC
    // Geth 1.6 and above does not support compilation
    // MetaMask does not support compilation
    //doGetCompilers();
}

function doConnect()    {

    // Get the provider URL
    var provider = document.getElementById('provider_url').value;
    //var provider = document.getElementById('provider_url').value;
    window.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    startApp();

}

function readAbiDefinition() {
  abiDefinitionString = '[{"constant":false,"inputs":[{"name":"yourName","type":"bytes32"}],"name":"interact","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"currentName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fromAddres","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastUpdatedMinutes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"},{"indexed":true,"name":"timeUpdated","type":"uint256"}],"name":"Interaction","type":"event"}]"'
  var abiDefinition = JSON.parse(abiDefinitionString)
  return abiDefinition;
}

// Utility method for creating the contract instance
function  createContractInstance(addr){
    var     abiDefinitionString = document.getElementById('compiled_abidefinition').value;
    var     abiDefinition = JSON.parse(abiDefinitionString);

    // Instance uses the definition to create the function

    var    contract = web3.eth.contract(abiDefinition);

   // THIS IS AN EXAMPLE - How to create a deploy using the contract
   // var instance = contract.new(constructor_params, {from:coinbase, gas:10000})
   // Use the next for manual deployment using the data generated
   // var contractData = contract.new.getData(constructor_params, {from:coinbase, gas:10000});

    var    address = addr;

    if(!address) address = document.getElementById('contractaddress').value;

    // Instance needs the address

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
    var estimatedGas = document.getElementById('contract_execute_estimatedgas').value;
    var parameterValue = document.getElementById('setnum_parameter').value;
    var funcName = document.getElementById('contract_select_function').value;
    //value NOT used as the contract function needs to be modified with "payable" modifier
    //var value = document.getElementById('invocation_send_value_in_ether').value;
    //value = web3.toWei(value,'ether');

    // Create the transaction object
    var    txnObject = {
        from: web3.eth.coinbase,
        gas: estimatedGas
    }

    if(funcName === 'setNum'){
        // setNum with sendTransaction
        instance.setNum.sendTransaction(parameterValue,txnObject,function(error, result)  {

            console.log('RECVED>>',error,result);
            if(error){
                setExecuteResultUI('Send Transaction:   ',funcName,'',error,'',true);
            } else {
                setExecuteResultUI('Send Transaction:   ',funcName,parameterValue,result,result,false);
            }
        });
    } else {
         // getNum with sendTransaction
        instance.getNum.sendTransaction(txnObject,function(error, result)  {

            console.log('RECVED>>',error,result);
            if(error){
                setExecuteResultUI('Send Transaction:   ',funcName,'',error,'',true);
            } else {
                setExecuteResultUI('Send Transaction:   ',funcName,'',result,result,false);
            }
        });
    }
}
