//this is the latest version which create contract for container independently
pragma solidity ^0.4.23;

contract ContainerCreator{
    address public creatorAddress;
    //address[] public containerContracts;
    mapping(string => address) containerIDAddress;
    uint public containerNumber;

    event containerCreated(address indexed _address,uint _containerNumber,string _containerID);

    constructor () public {   //initialize the para
        creatorAddress=msg.sender;
        containerNumber = 0;
    }
    //creat a new contract of container
    function createContainer(string containerID) public returns(address containerAddress){
      //  OwnContainer c = new OwnContainer(containerID);
        require(containerIDAddress[containerID] == 0x0);
        address c = new OwnContainer(containerID);
        containerIDAddress[containerID] = c;
        containerNumber++;
        emit containerCreated(c,containerNumber, containerID);
        return c;
    }

    function clearContainerNumber() public returns (uint) {
      //  require(CreatorAddress == msg.sender);
        containerNumber = 0;
        return containerNumber;
    }
    
    function getNumberOfState(string containerID) view public returns (string){
        OwnContainer con = OwnContainer(containerIDAddress[containerID]);
        return con.containerID();
        
    }

    

} 

contract OwnContainer{

    address public containerAddress;
    //container
    string public containerID;
    mapping(string => string) containerState;
    //count the number of data in storage
    uint public numberOfState;

    event stateUploadEvent(address indexed _address,uint _index,string _containerState);

    constructor (string _containerID) public {   //initialize the para
        containerAddress=msg.sender;
        containerID=_containerID;
        numberOfState = 0;
    }


    //update the state of the container
    //don't use array or it will overflow
    function addState(string state) public returns(uint){
     //   require(containerAddress == msg.sender);
        containerState[containerID] = state;
        numberOfState++;
        emit stateUploadEvent(msg.sender,numberOfState, state);
        return numberOfState;
    }

    function clearDataOfState() public returns (uint) {
        numberOfState = 0;
        return numberOfState;
    }

    //to get the out put of the state array
    function getPresentState() view public returns (string) {
        return containerState[containerID];
    }
} 