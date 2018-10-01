pragma solidity ^0.4.23;

contract Sensor{

    address public containerAddress;
    // mapping(address => string) containerContent;
    string[] containerState;
   // bytes32[] device;

    event stateUploadEvent(address indexed _address,uint _index,string _containerState);

    constructor () public {   //initialize the para
        containerAddress=msg.sender;
    }


    //update the state of the container
    function addState(string state) public returns(uint){
        require(containerAddress == msg.sender);
        containerState.push(state);
        emit stateUploadEvent(msg.sender, containerState.length, state);
        return containerState.length;
    }

    //to get the last index of the array
    function getStateIndex() view public returns (uint) {
        return containerState.length;
    }

    //to get the out put of the state array
    function getStateByIndex(uint _index) view public returns (string) {
        require(_index <= (containerState.length-1));
        return containerState[_index];
    }

    function clearstate() public returns (uint) {
        require(containerAddress == msg.sender);
        delete containerState;
        return containerState.length;
    }
    
} 