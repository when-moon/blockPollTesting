const assertRevert = require('./helpers/assertRevert')
const expectedException = require('./helpers/expectedException')
const Election = artifacts.require('./Election.sol')

contract('Election', function (accounts){
    let election
    const _voterIDs = [accounts[0],"0x6Aff82B3AD35925AC14C87f37773CDb56e40d26d","0x14723a09acff6d2a60dcdf7aa4aff308fddc160c"]
    const _weights = [10,5,8]
    const _candidates = ["brandon","kavi","nico"]
    const _isPartial = false
    const _startingBlock = 120
    const _endingBlock = 12000
    const voter = accounts[0]

    beforeEach('setup contract for test', async function () {
            election = await Election.new(_voterIDs, _weights,  _candidates, _isPartial,  _startingBlock, _endingBlock);
       })

    it("Contract is deployed", async function() {
        assert(election);
    })

    it('Partial voting is set', async function (){
        const electionType = await election.isPartial();
        const expected = false;
        assert.equal(electionType, expected);

    })

    it('Number of voters are set to 3', async function (){
        const numberOfVoters = await election.numberOfVoters();
        const expected = 3;
        assert.equal(numberOfVoters, expected);

    })

    it('Voter has correct weighting assosciated with it', async function (){
        const expectedCredits = 10;
        const credits = await election.votingRoll(_voterIDs[0]);
        assert.equal(credits,expectedCredits);
    })

    it('Candidates have votes set to -1 as default', async function (){
        var isSetCorrectly = true; //change name
        for (var i = 0; i < _candidates.length; i++){
            if (await election.candidates(_candidates[i]) != -1){
                isSetCorrectly = false;
            }
        }
        assert(isSetCorrectly);
    })

    it('Voting uses up specified credits in non-partial', async function (){
        await election.vote("brandon", 1);
        const expectedCredits = -1;
        const voterCredits = await election.votingRoll(_voterIDs[0]);
        assert.equal(voterCredits.valueOf(),expectedCredits);
    })

    it('Voting gives away specified credits in non-partial', async function (){
        await election.vote("kavi", 1);   
        const voteCandidate = await election.candidates(_candidates[1]);
        const expectedVotes = 10;
        assert.equal(voteCandidate.valueOf(), expectedVotes); 
    })


    it("Cant vote with more credits than you have", async function() {
        try {
            await election.vote("brandon", 20)
        }
        catch(err) {
            console.log(err)
        }
    
        const expectedCredits = 10;
        const credits = await election.votingRoll(_voterIDs[0]);
        assert.equal(credits,expectedCredits);
    })

    it("Cant vote for a non-existent candidate", async function() {
        try {
            await election.vote("Iordan", 1)
        }
        catch(err) {
            console.log(err)
        }
    
        var constractCandidatesUntampered = true; //change name
        for (var i = 0; i < _candidates.length; i++){
            if (await election.candidates(_candidates[i]) != -1){
             constractCandidatesUntampered = false;
            }
        }
        assert(constractCandidatesUntampered);
    })

})