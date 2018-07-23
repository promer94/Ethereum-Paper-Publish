# Topic: Trusted Collaborative Authoring on Publishing  
---
## Reading List  
* [Blockchain for OpenScience and Knowledge creation](https://docs.google.com/document/d/1Uhjb4K69l0bSx7UXYUStV_rjuPC7VGo0ERa-7xEsr58/edit#)  
* [Dynamic Publication Formats and Collaborative Authoring](https://link.springer.com/chapter/10.1007%2F978-3-319-00026-8_13)  
* [SmartPapers](https://2018.eswc-conferences.org/paper_205/)  
* [ScienceMiles](https://dl.acm.org/authorize?N655236)   

## General Process of the project  
* Understand the dynamic publishing model  
* Get on track with Ethereum  
* Development and testing of Solidity code for the following use cases


##  Specification
The aim of this project is to develop smart contracts that can be used for publishing the scientific papers and their metadata. The implementation will be evaluated by the cost of the contracts

## User cases
* Researcher (assume 3) can use the contracts to publish a research artifacts (PDF or HTML).
* Every contracts (papers) contains the informations about the version of the research artifacts, the metadata (contributions ....) and authors (Represented by their ethereum address). Researcher can use contracts' function to get all this informations.
* Researcher can use contract to confirm their local file is correct with respect to the specific version Id

These are the three main functionalities which are intented to be implemented in the project.

Then one of these two functionalities is probably implemented later
* Reviewer should be able to Add an annotation to a published paper
* New author can be added to an ongoing Smart Paper.

## Contracts Design
### Data structure
##### Struct Version
* unit versionNumber
* bytes32 versionDescription;
* bytes metaData;
* mapping (address => bool) signs;
* uint voterCount;
* bool isPublished 
#### Contract SmartPaper
* bytes32 latestDescription: 
* bytes32 latestMetaData: 
* bytes16[] latestPaper;
* uint latestVersion
* address[] authors
* bytes16[] md5List;
* Version[] versions;
*  mapping ( byte16 paperMD5=> Version )
#### Contract SmartPaperList
* address[] public smartPapers
 
### Workflow
1. Firstly a SmartPaperList will be created for store all the smart papers.
2. The Smart paper should be initialized with **descriptions** , **metaData** encoded in **bytes32**, MD5(paper) in **bytes16**, and an **etherum adress** array. A new **version** will be initialze with default version number 1, defalut state **isPublished** false. and original **metadata**.
3. Then authors need to check in.
4. Authors can create a new version.
5. Other author need to approve the version.



## Checklist
-[✅] Researcher can use contract to publish new paper, checkin, create new version and approve new version.

-[✅] new paper, checkin, create new version and approve new version function test

-[] Add annotation

-[] annotation function test

-[] Add author

-[] add function test

-[] cost analysis

-[] demo


## Contract performance and cost test
+ Author + Cost
+ Size + Cost
+ Release + Cost 
+ Deploy + Cost
+ Verify + Cost