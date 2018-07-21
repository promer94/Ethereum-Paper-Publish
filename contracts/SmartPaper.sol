/**The MIT License (MIT)
Copyright (c) 2016 Smart Contract Solutions, Inc.
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
pragma solidity ^0.4.24;
/**
 * @title Roles
 * @author Francisco Giordano (@frangio)
 * @dev Library for managing addresses assigned to a Role.
 * See RBAC.sol for example usage.
 */
library Roles {
    struct Role {
        mapping (address => bool) bearer;
    }

  /**
   * @dev give an address access to this role
   */
    function add(Role storage role, address addr)
      internal{
        role.bearer[addr] = true;
    }

  /**
   * @dev remove an address' access to this role
   */
    function remove (Role storage role, address addr) internal{
        role.bearer[addr] = false;
    }

  /**
   * @dev check if an address has this role
   * // reverts
   */
    function check(Role storage role, address addr) view internal{
        require(has(role, addr));
    }

  /**
   * @dev check if an address has this role
   * @return bool
   */
    function has(Role storage role, address addr) view internal returns (bool){
        return role.bearer[addr];
    }
}
/**
 * @title RBAC (Role-Based Access Control)
 * @author Matt Condon (@Shrugs)
 * @dev Stores and provides setters and getters for roles and addresses.
 * Supports unlimited numbers of roles and addresses.
 * See //contracts/mocks/RBACMock.sol for an example of usage.
 * This RBAC method uses strings to key roles. It may be beneficial
 * for you to write your own implementation of this interface using Enums or similar.
 */
contract RBAC {
    using Roles for Roles.Role;

    mapping (string => Roles.Role) private roles;

    event RoleAdded(address indexed operator, string role);
    event RoleRemoved(address indexed operator, string role);

  /**
   * @dev reverts if addr does not have role
   * @param _operator address
   * @param _role the name of the role
   * // reverts
   */
    function checkRole(address _operator, string _role) view public{
        roles[_role].check(_operator);
    }

  /**
   * @dev determine if addr has role
   * @param _operator address
   * @param _role the name of the role
   * @return bool
   */
    function hasRole(address _operator, string _role) view public returns (bool){
        return roles[_role].has(_operator);
    }

  /**
   * @dev add a role to an address
   * @param _operator address
   * @param _role the name of the role
   */
    function addRole(address _operator, string _role) internal {
        roles[_role].add(_operator);
        emit RoleAdded(_operator, _role);
    }

  /**
   * @dev remove a role from an address
   * @param _operator address
   * @param _role the name of the role
   */
    function removeRole(address _operator, string _role) internal{
        roles[_role].remove(_operator);
        emit RoleRemoved(_operator, _role);
    }

  /**
   * @dev modifier to scope access to a single role (uses msg.sender as addr)
   * @param _role the name of the role
   * // reverts
   */
    modifier onlyRole(string _role){
        checkRole(msg.sender, _role);
        _;
    }

  /**
   * @dev modifier to scope access to a set of roles (uses msg.sender as addr)
   * @param _roles the names of the roles to scope access to
   * // reverts
   *
   * @TODO - when solidity supports dynamic arrays as arguments to modifiers, provide this
   *  see: https://github.com/ethereum/solidity/issues/2467
   */
  // modifier onlyRoles(string[] _roles) {
  //     bool hasAnyRole = false;
  //     for (uint8 i = 0; i < _roles.length; i++) {
  //         if (hasRole(msg.sender, _roles[i])) {
  //             hasAnyRole = true;
  //             break;
  //         }
  //     }

  //     require(hasAnyRole);

  //     _;
  // }
}
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

contract SmartPaper is RBAC{
    struct Version{
        bytes32 versionNumber;
        bytes32 metaData;
        bool isPublished;
    }
    bytes32 public description;
    bytes32 public metaData;
    bytes16[] public listOfPaperMD5;
    address[] public authors;
    mapping (bytes16 => Version) public versions;   // md5 => specific Version.
    mapping (address => uint) public verifiedAuthors; // verified => 1
    
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
        verifiedAuthors[msg.sender] = 1;          
    }
    

    function getPapers() public view returns (bytes16[]){
        return listOfPaperMD5;
    }

    function getAuthors() public view returns (address[]){
        return authors;
    }
} 