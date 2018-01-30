const assertRevert = require('./helpers/assertRevert')
const expectedException = require('./helpers/expectedException')
const Election = artifacts.require('./Election.sol')

contract('Election', function (accounts){
    let election;
    const _voterIDs = ["0x6Aff82B3AD35925AC14C87f37773CDb56e40026d","0x6Aff82B3AD35925AC14C87f37773CDb56e40d26d","0x14723a09acff6d2a60dcdf7aa4aff308fddc160c"];
    const _weights = [10,5,8];
    const _candidates = ["brandon","kavi","nico"];
    const _isPartial = false;
    const _startingBlock = 0;
    const _endingBlock = 12000;

    beforeEach('Contract setup for testing', async function () {
        try {
            election = await Election.new(_voterIDs, _weights,  _candidates, _isPartial,  _startingBlock, _endingBlock);
        }
        catch(err) {
            console.log(err);
        }
       })

    it("Contract can deploy", async function() {
        assert(election);
    })

    it("Cannot vote from foreign address", async function() {
        try {
            await election.vote("brandon", 1);
        }
        catch(err) {
            console.log(err);
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