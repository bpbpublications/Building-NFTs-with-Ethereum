let simpleStorageInstance;

const SimpleStorage = artifacts.require("SimpleStorage");

contract("SimpleStorage", accounts => {

  beforeEach(async () => {
    simpleStorageInstance = await SimpleStorage.deployed({ gasPrice: 15000000 });
  })

  it("...should store the value 89.", async () => {
    // Set value of 89
    const tx = await simpleStorageInstance.set(89, { from: accounts[0], gasPrice: 15000000 });

    // Get stored value
    const storedData = await simpleStorageInstance.get.call();

    assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
