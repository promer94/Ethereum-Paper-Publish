pragma solidity ^0.4.24;
/** TODO:  1. author data structure
            2. new verison function
            3. unit test
 */

contract SmartPaperList {
    address[] public smartPapers;
    function createPaper(bytes32 _description, bytes32 _metaData, bytes16 _paperMD5, address[] _authors) public returns(address){
        address newPaper = new SmartPaper(_description, _metaData, _paperMD5, _authors);
        smartPapers.push(newPaper);
        return newPaper;
    }

    function getProjects() public view returns(address[]) {
        return smartPapers;
    }
}

contract SmartPaper {
    struct Version{
        bytes32 versionNumber;
        bytes32 metaData;
        bool isPublished;
    }
    bytes32 public description;
    bytes32 public metaData;
    bytes16[] public listOfPaperMD5;
    address[] public authors;
    mapping (bytes16 => Version) public versions;   // MD5 => specific Version.
    mapping (address => uint) public verfiredAuthor;
    
    constructor (bytes32 _description, bytes32 _metaData, bytes16 _paperMD5, address[] _authors) public{
        require(_authors.length > 0, "Invalid authors list");
        description = _description;
        metaData = _metaData;
        listOfPaperMD5.push(_paperMD5);
        authors = _authors;  
        bytes32 versionNumber = bytes32(0);    // defalut version number 0
        Version memory newVersion = Version(
            versionNumber,
            _metaData,
            false        // defalut state false;
        );            
        versions[_paperMD5] = newVersion;
        verfiredAuthor[msg.sender] = 1;          
    }
    
    function checkIn() public{
        verfiredAuthor[msg.sender] = 1;
    }

    function getPapers() public view returns (bytes16[]){
        return listOfPaperMD5;
    }

    function getAuthors() public view returns (address[]){
        return authors;
    }

} 