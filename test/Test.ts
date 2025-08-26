import assert from "assert";
import { 
  TestHelpers,
  OstiumPairsInfos_AccFundingFeesStored
} from "generated";
const { MockDb, OstiumPairsInfos } = TestHelpers;

describe("OstiumPairsInfos contract AccFundingFeesStored event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for OstiumPairsInfos contract AccFundingFeesStored event
  const event = OstiumPairsInfos.AccFundingFeesStored.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("OstiumPairsInfos_AccFundingFeesStored is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await OstiumPairsInfos.AccFundingFeesStored.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualOstiumPairsInfosAccFundingFeesStored = mockDbUpdated.entities.OstiumPairsInfos_AccFundingFeesStored.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedOstiumPairsInfosAccFundingFeesStored: OstiumPairsInfos_AccFundingFeesStored = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      valueLong: event.params.valueLong,
      valueShort: event.params.valueShort,
      lastFundingRate: event.params.lastFundingRate,
      velocity: event.params.velocity,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualOstiumPairsInfosAccFundingFeesStored, expectedOstiumPairsInfosAccFundingFeesStored, "Actual OstiumPairsInfosAccFundingFeesStored should be the same as the expectedOstiumPairsInfosAccFundingFeesStored");
  });
});
