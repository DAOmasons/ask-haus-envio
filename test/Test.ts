import assert from "assert";
import { 
  TestHelpers,
  FastFactory_AdminAdded
} from "generated";
const { MockDb, FastFactory } = TestHelpers;

describe("FastFactory contract AdminAdded event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for FastFactory contract AdminAdded event
  const event = FastFactory.AdminAdded.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("FastFactory_AdminAdded is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await FastFactory.AdminAdded.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualFastFactoryAdminAdded = mockDbUpdated.entities.FastFactory_AdminAdded.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedFastFactoryAdminAdded: FastFactory_AdminAdded = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      admin: event.params.admin,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualFastFactoryAdminAdded, expectedFastFactoryAdminAdded, "Actual FastFactoryAdminAdded should be the same as the expectedFastFactoryAdminAdded");
  });
});
