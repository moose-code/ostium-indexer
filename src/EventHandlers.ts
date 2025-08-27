/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  OstiumPairsInfos,
  OstiumPairsInfos_AccFundingFeesStored,
  OstiumPairsInfos_AccFundingFeesStoredV2,
  OstiumPairsInfos_AccRolloverFeesStored,
  OstiumPairsInfos_FeesCharged,
  OstiumPairsInfos_FundingFeeSlopeUpdated,
  OstiumPairsInfos_HillParamsUpdated,
  OstiumPairsInfos_Initialized,
  OstiumPairsInfos_LastVelocityUpdated,
  OstiumPairsInfos_LiqMarginThresholdPUpdated,
  OstiumPairsInfos_LiqThresholdPUpdated,
  OstiumPairsInfos_ManagerUpdated,
  OstiumPairsInfos_MaxFundingFeePerBlockUpdated,
  OstiumPairsInfos_MaxFundingFeeVelocityUpdated,
  OstiumPairsInfos_MaxNegativePnlOnOpenPUpdated,
  OstiumPairsInfos_MaxRolloverFeePerBlockUpdated,
  OstiumPairsInfos_MaxRolloverFeeSlopeUpdated,
  OstiumPairsInfos_MaxRolloverVolatilityUpdated,
  OstiumPairsInfos_PairFundingFeesUpdated,
  OstiumPairsInfos_PairFundingFeesUpdatedV2,
  OstiumPairsInfos_PairOpeningFeesUpdated,
  OstiumPairsInfos_PairRolloverFeesUpdated,
  OstiumPairsInfos_RolloverFeePerBlockUpdated,
  OstiumPairsInfos_TradeInitialAccFeesStored,
  OstiumPairsInfos_VaultFeePercentUpdated,
  OstiumPairsStorage,
  OstiumPairsStorage_PairAdded,
  OstiumPairsStorage_PairUpdated,
  OstiumPairsStorage_GroupUpdated,
  OstiumPairsStorage_FeeUpdated,
  OstiumPairsStorage_PairMaxLeverageUpdated,
  OstiumPairsStorage_PairOvernightMaxLeverageUpdated,
  OstiumTrading,
  OstiumTrading_MarketOpenOrderInitiated,
  OstiumTrading_MarketCloseOrderInitiated,
  OstiumTrading_MarketCloseOrderInitiatedV2,
  OstiumTrading_OpenLimitCanceled,
  OstiumTrading_OpenLimitPlaced,
  OstiumTrading_AutomationOpenOrderInitiated,
  OstiumTrading_AutomationCloseOrderInitiated,
  OstiumTrading_OpenLimitUpdated,
  OstiumTrading_SlUpdated,
  OstiumTrading_TpUpdated,
  OstiumTrading_MarketOpenTimeoutExecuted,
  OstiumTrading_MarketOpenTimeoutExecutedV2,
  OstiumTrading_MarketCloseTimeoutExecuted,
  OstiumTrading_MarketCloseTimeoutExecutedV2,
  OstiumTrading_TopUpCollateralExecuted,
  OstiumTrading_RemoveCollateralInitiated,
  OstiumTrading_Paused,
  OstiumTrading_MarketOrdersTimeoutUpdated,
  OstiumTrading_MaxAllowedCollateralUpdated,
  OstiumTradingCallbacks,
  OstiumTradingCallbacks_MarketOpenExecuted,
  OstiumTradingCallbacks_MarketCloseExecuted,
  OstiumTradingCallbacks_MarketCloseExecutedV2,
  OstiumTradingCallbacks_LimitOpenExecuted,
  OstiumTradingCallbacks_LimitCloseExecuted,
  OstiumTradingCallbacks_MarketOpenCanceled,
  OstiumTradingCallbacks_MarketCloseCanceled,
  OstiumTradingCallbacks_AutomationCloseOrderCanceled,
  OstiumTradingCallbacks_AutomationOpenOrderCanceled,
  OstiumTradingCallbacks_DevFeeCharged,
  OstiumTradingCallbacks_VaultOpeningFeeCharged,
  OstiumTradingCallbacks_VaultLiqFeeCharged,
  OstiumTradingCallbacks_OracleFeeCharged,
  OstiumTradingCallbacks_RemoveCollateralExecuted,
  OstiumTradingCallbacks_RemoveCollateralRejected,
  OstiumTradingCallbacks_FeesCharged,
  OstiumTradingCallbacks_Paused,
  OstiumVault,
  OstiumVault_Deposit,
  OstiumVault_Withdraw,
  OstiumVault_WithdrawRequested,
  OstiumVault_WithdrawCanceled,
  OstiumVault_DepositLocked,
  OstiumVault_DepositUnlocked,
  OstiumVault_AccPnlPerTokenUsedUpdated,
  OstiumVault_ShareToAssetsPriceUpdated,
  OstiumVault_RewardDistributed,
  OstiumVault_MaxDiscountPUpdated,
  OstiumVault_MaxDiscountThresholdPUpdated,
  OstiumVault_CurrentMaxSupplyUpdated,
  OstiumVault_Transfer,
  OstiumVault_Approval,
  OstiumLockedDepositNft,
  OstiumLockedDepositNft_Transfer,
  OstiumTradingStorage,
  OstiumTradingStorage_MaxOpenInterestUpdated,
  OstiumTradingStorage_MaxTradesPerPairUpdated,
  OstiumTradingStorage_MaxPendingMarketOrdersUpdated,
  OstiumOpenPnl,
  OstiumOpenPnl_LastTradePriceUpdated,
  Pair as PairEntity,
  MetaData as MetaDataEntity,
  Vault as VaultEntity,
  Order as OrderEntity,
  Trade as TradeEntity,
  Limit as LimitEntity,
  LpShare as LpShareEntity,
  LpAction as LpActionEntity,
  LpNFT as LpNFTEntity,
  User as UserEntity,
  UserPairStat as UserPairStatEntity,
  ShareToAssetsPriceDaily as ShareToAssetsPriceDailyEntity,
  EpochShare as EpochShareEntity,
} from "generated";

function toDayString(ts: bigint): string {
  const d = new Date(Number(ts) * 1000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function getMeta(context: any): Promise<MetaDataEntity> {
  const id = "global";
  const existing = await context.MetaData.get(id);
  const base: MetaDataEntity = { id } as unknown as MetaDataEntity;
  return existing ? (existing as MetaDataEntity) : base;
}

function add(a?: bigint, b?: bigint): bigint {
  return (a ?? 0n) + (b ?? 0n);
}

OstiumPairsInfos.AccFundingFeesStored.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_AccFundingFeesStored = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    valueLong: event.params.valueLong,
    valueShort: event.params.valueShort,
    lastFundingRate: event.params.lastFundingRate,
    velocity: event.params.velocity,
  };

  context.OstiumPairsInfos_AccFundingFeesStored.set(entity);
});

OstiumPairsInfos.AccFundingFeesStoredV2.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_AccFundingFeesStoredV2 = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    valueLong: event.params.valueLong,
    valueShort: event.params.valueShort,
    lastOiDelta: event.params.lastOiDelta,
    lastFundingRate: event.params.lastFundingRate,
  };

  context.OstiumPairsInfos_AccFundingFeesStoredV2.set(entity);
});

OstiumPairsInfos.AccRolloverFeesStored.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_AccRolloverFeesStored = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value: event.params.value,
  };

  context.OstiumPairsInfos_AccRolloverFeesStored.set(entity);
});

OstiumPairsInfos.FeesCharged.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_FeesCharged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    rolloverFees: event.params.rolloverFees,
    fundingFees: event.params.fundingFees,
  };

  context.OstiumPairsInfos_FeesCharged.set(entity);

  // Accumulate fees into Trade entity
  const tradeId = event.params.tradeId.toString();
  const trade = await context.Trade.get(tradeId);
  if (trade) {
    const updatedTrade: TradeEntity = {
      ...trade,
      rollover: add(
        trade.rollover as unknown as bigint | undefined,
        event.params.rolloverFees
      ),
      funding: add(
        trade.funding as unknown as bigint | undefined,
        event.params.fundingFees
      ),
    } as unknown as TradeEntity;
    context.Trade.set(updatedTrade);
  }

  // Update user fee counters
  const userId = event.params.trader.toLowerCase();
  const user = await context.User.get(userId);
  const userUpdated: UserEntity = {
    id: userId,
    totalRolloverFee: add(
      user?.totalRolloverFee as unknown as bigint | undefined,
      event.params.rolloverFees
    ),
    netFundingPayment: add(
      user?.netFundingPayment as unknown as bigint | undefined,
      event.params.fundingFees
    ),
  } as unknown as UserEntity;
  context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

  // Update MetaData global counters
  const meta = await getMeta(context);
  const metaUpdated: MetaDataEntity = {
    ...meta,
    totalRolloverFee: add(
      meta.totalRolloverFee as unknown as bigint | undefined,
      event.params.rolloverFees
    ),
  } as unknown as MetaDataEntity;
  context.MetaData.set(metaUpdated);
});

OstiumPairsInfos.FundingFeeSlopeUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_FundingFeeSlopeUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value: event.params.value,
  };

  context.OstiumPairsInfos_FundingFeeSlopeUpdated.set(entity);
});

OstiumPairsInfos.HillParamsUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_HillParamsUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    hillInflectionPoint: event.params.hillInflectionPoint,
    hillPosScale: event.params.hillPosScale,
    hillNegScale: event.params.hillNegScale,
  };

  context.OstiumPairsInfos_HillParamsUpdated.set(entity);
});

OstiumPairsInfos.Initialized.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_Initialized = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    version: event.params.version,
  };

  context.OstiumPairsInfos_Initialized.set(entity);
});

OstiumPairsInfos.LastVelocityUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_LastVelocityUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value: event.params.value,
  };

  context.OstiumPairsInfos_LastVelocityUpdated.set(entity);
});

OstiumPairsInfos.LiqMarginThresholdPUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_LiqMarginThresholdPUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
    };

    context.OstiumPairsInfos_LiqMarginThresholdPUpdated.set(entity);
  }
);

OstiumPairsInfos.LiqThresholdPUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_LiqThresholdPUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };

  context.OstiumPairsInfos_LiqThresholdPUpdated.set(entity);
});

OstiumPairsInfos.ManagerUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_ManagerUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };

  context.OstiumPairsInfos_ManagerUpdated.set(entity);
});

OstiumPairsInfos.MaxFundingFeePerBlockUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_MaxFundingFeePerBlockUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
    };

    context.OstiumPairsInfos_MaxFundingFeePerBlockUpdated.set(entity);
  }
);

OstiumPairsInfos.MaxFundingFeeVelocityUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_MaxFundingFeeVelocityUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
    };

    context.OstiumPairsInfos_MaxFundingFeeVelocityUpdated.set(entity);
  }
);

OstiumPairsInfos.MaxNegativePnlOnOpenPUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_MaxNegativePnlOnOpenPUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
    };

    context.OstiumPairsInfos_MaxNegativePnlOnOpenPUpdated.set(entity);
  }
);

OstiumPairsInfos.MaxRolloverFeePerBlockUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_MaxRolloverFeePerBlockUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
    };

    context.OstiumPairsInfos_MaxRolloverFeePerBlockUpdated.set(entity);
  }
);

OstiumPairsInfos.MaxRolloverFeeSlopeUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_MaxRolloverFeeSlopeUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
    };

    context.OstiumPairsInfos_MaxRolloverFeeSlopeUpdated.set(entity);
  }
);

OstiumPairsInfos.MaxRolloverVolatilityUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_MaxRolloverVolatilityUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
    };

    context.OstiumPairsInfos_MaxRolloverVolatilityUpdated.set(entity);
  }
);

OstiumPairsInfos.PairFundingFeesUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_PairFundingFeesUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value_0: event.params.value[0],
    value_1: event.params.value[1],
    value_2: event.params.value[2],
    value_3: event.params.value[3],
    value_4: event.params.value[4],
    value_5: event.params.value[5],
    value_6: event.params.value[6],
    value_7: event.params.value[7],
  };

  context.OstiumPairsInfos_PairFundingFeesUpdated.set(entity);
});

OstiumPairsInfos.PairFundingFeesUpdatedV2.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_PairFundingFeesUpdatedV2 = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value_0: event.params.value[0],
      value_1: event.params.value[1],
      value_2: event.params.value[2],
      value_3: event.params.value[3],
      value_4: event.params.value[4],
      value_5: event.params.value[5],
      value_6: event.params.value[6],
      value_7: event.params.value[7],
      value_8: event.params.value[8],
      value_9: event.params.value[9],
      value_10: event.params.value[10],
      value_11: event.params.value[11],
    };

    context.OstiumPairsInfos_PairFundingFeesUpdatedV2.set(entity);
  }
);

OstiumPairsInfos.PairOpeningFeesUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_PairOpeningFeesUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value_0: event.params.value[0],
    value_1: event.params.value[1],
    value_2: event.params.value[2],
    value_3: event.params.value[3],
    value_4: event.params.value[4],
    value_5: event.params.value[5],
  };

  context.OstiumPairsInfos_PairOpeningFeesUpdated.set(entity);
  {
    const pairId = event.params.pairIndex.toString();
    const existingPair = await context.Pair.get(pairId);
    const updatedPair: PairEntity = {
      id: pairId,
      makerFeeP: entity.value_0,
      takerFeeP: entity.value_1,
      usageFeeP: entity.value_2,
      utilizationThresholdP: entity.value_3,
      makerMaxLeverage: entity.value_4,
      vaultFeePercent: entity.value_5,
    } as PairEntity;
    context.Pair.set(
      existingPair ? { ...existingPair, ...updatedPair } : updatedPair
    );
  }
});

OstiumPairsInfos.PairRolloverFeesUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_PairRolloverFeesUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value_0: event.params.value[0],
    value_1: event.params.value[1],
    value_2: event.params.value[2],
    value_3: event.params.value[3],
    value_4: event.params.value[4],
    value_5: event.params.value[5],
  };

  context.OstiumPairsInfos_PairRolloverFeesUpdated.set(entity);
  {
    const pairId = event.params.pairIndex.toString();
    const existing = await context.Pair.get(pairId);
    const updated: PairEntity = {
      id: pairId,
      accRollover: entity.value_0,
      rolloverFeePerBlock: entity.value_1,
      maxRolloverFeePerBlock: entity.value_2,
      maxRolloverVolatility: entity.value_3,
      lastRolloverBlock: entity.value_4,
      rolloverFeeSlope: entity.value_5,
    } as PairEntity;
    context.Pair.set(existing ? { ...existing, ...updated } : updated);
  }
});

OstiumPairsInfos.RolloverFeePerBlockUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_RolloverFeePerBlockUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
      volatility: event.params.volatility,
    };

    context.OstiumPairsInfos_RolloverFeePerBlockUpdated.set(entity);
    const pairId = event.params.pairIndex.toString();
    const existing = await context.Pair.get(pairId);
    if (existing) {
      const updated: PairEntity = {
        ...existing,
        rolloverFeePerBlock: entity.value,
      };
      context.Pair.set(updated);
    }
  }
);

OstiumPairsInfos.TradeInitialAccFeesStored.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_TradeInitialAccFeesStored = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      index: event.params.index,
      rollover: event.params.rollover,
      funding: event.params.funding,
    };

    context.OstiumPairsInfos_TradeInitialAccFeesStored.set(entity);
  }
);

OstiumPairsInfos.VaultFeePercentUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_VaultFeePercentUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value: event.params.value,
  };

  context.OstiumPairsInfos_VaultFeePercentUpdated.set(entity);
});

// OstiumPairsStorage
OstiumPairsStorage.PairAdded.handler(async ({ event, context }) => {
  const entity: OstiumPairsStorage_PairAdded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    index: event.params.index,
    from: event.params.from,
    to: event.params.to,
  };
  context.OstiumPairsStorage_PairAdded.set(entity);

  const pairId = event.params.index.toString();
  const existing = await context.Pair.get(pairId);
  const pair: PairEntity = {
    id: pairId,
    from: event.params.from,
    to: event.params.to,
  } as PairEntity;
  context.Pair.set(existing ? { ...existing, ...pair } : pair);
});

OstiumPairsStorage.PairUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsStorage_PairUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.index,
  };
  context.OstiumPairsStorage_PairUpdated.set(entity);
});

OstiumPairsStorage.GroupUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsStorage_GroupUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    index: event.params.index,
  };
  context.OstiumPairsStorage_GroupUpdated.set(entity);
});

OstiumPairsStorage.FeeUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsStorage_FeeUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    index: event.params.index,
  };
  context.OstiumPairsStorage_FeeUpdated.set(entity);
});

OstiumPairsStorage.PairMaxLeverageUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsStorage_PairMaxLeverageUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      maxLeverage: event.params.maxLeverage,
    };
    context.OstiumPairsStorage_PairMaxLeverageUpdated.set(entity);
    const pairId = event.params.pairIndex.toString();
    const existing = await context.Pair.get(pairId);
    if (existing) {
      const updated: PairEntity = {
        ...existing,
        maxLeverage: event.params.maxLeverage,
      };
      context.Pair.set(updated);
    }
  }
);

OstiumPairsStorage.PairOvernightMaxLeverageUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsStorage_PairOvernightMaxLeverageUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      overnightMaxLeverage: event.params.overnightMaxLeverage,
    };
    context.OstiumPairsStorage_PairOvernightMaxLeverageUpdated.set(entity);
    const pairId = event.params.pairIndex.toString();
    const existing = await context.Pair.get(pairId);
    if (existing) {
      const updated: PairEntity = {
        ...existing,
        overnightMaxLeverage: event.params.overnightMaxLeverage,
      };
      context.Pair.set(updated);
    }
  }
);

// OstiumTrading
OstiumTrading.MarketOpenOrderInitiated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_MarketOpenOrderInitiated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
  };
  context.OstiumTrading_MarketOpenOrderInitiated.set(entity);
  // Seed Trade and User counters
  const tradeId = `${event.params.trader.toLowerCase()}_${event.params.pairIndex.toString()}_${event.params.orderId.toString()}`;
  const trade: TradeEntity = {
    id: tradeId,
    trader: event.params.trader,
    pair_id: event.params.pairIndex.toString(),
    isOpen: true,
    timestamp: BigInt(event.block.timestamp),
  } as TradeEntity;
  const existingTrade = await context.Trade.get(tradeId);
  context.Trade.set(existingTrade ? { ...existingTrade, ...trade } : trade);

  const userId = event.params.trader.toLowerCase();
  const user = await context.User.get(userId);
  const updatedUser: UserEntity = {
    id: userId,
    totalMarketOrders:
      ((user?.totalMarketOrders as unknown as bigint) ?? BigInt(0)) + BigInt(1),
  } as unknown as UserEntity;
  context.User.set(user ? { ...user, ...updatedUser } : updatedUser);
  // bump MetaData totalMarketOrders
  const meta = await getMeta(context);
  const bumpedMeta: MetaDataEntity = {
    ...meta,
    totalMarketOrders: add(
      meta.totalMarketOrders as unknown as bigint | undefined,
      1n
    ),
  } as unknown as MetaDataEntity;
  context.MetaData.set(bumpedMeta);
});

OstiumTrading.MarketCloseOrderInitiated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_MarketCloseOrderInitiated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
  };
  context.OstiumTrading_MarketCloseOrderInitiated.set(entity);
});

OstiumTrading.MarketCloseOrderInitiatedV2.handler(
  async ({ event, context }) => {
    const entity: OstiumTrading_MarketCloseOrderInitiatedV2 = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      closePercentage: event.params.closePercentage,
    };
    context.OstiumTrading_MarketCloseOrderInitiatedV2.set(entity);
  }
);

OstiumTrading.OpenLimitCanceled.handler(async ({ event, context }) => {
  const entity: OstiumTrading_OpenLimitCanceled = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    index: event.params.index,
  };
  context.OstiumTrading_OpenLimitCanceled.set(entity);
  // Decrement Pair and MetaData open limit counts and bump cancellations
  const pairId = event.params.pairIndex.toString();
  const pair = await context.Pair.get(pairId);
  if (pair) {
    const newCount = add(
      pair.totalOpenLimitOrders as unknown as bigint | undefined,
      -1n
    );
    const updatedPair: PairEntity = {
      ...pair,
      totalOpenLimitOrders: newCount < 0n ? 0n : newCount,
    } as unknown as PairEntity;
    context.Pair.set(updatedPair);
  }
  const meta = await getMeta(context);
  const newOpenLimits = add(
    meta.totalOpenLimitOrders as unknown as bigint | undefined,
    -1n
  );
  const metaUpd: MetaDataEntity = {
    ...meta,
    totalOpenLimitOrders: newOpenLimits < 0n ? 0n : newOpenLimits,
    totalCancelledOrders: add(
      meta.totalCancelledOrders as unknown as bigint | undefined,
      1n
    ),
  } as unknown as MetaDataEntity;
  context.MetaData.set(metaUpd);
  // Bump user and user-pair canceled
  const userId = event.params.trader.toLowerCase();
  const user = await context.User.get(userId);
  const userUpd: UserEntity = {
    id: userId,
    totalCancelledOrders: add(
      user?.totalCancelledOrders as unknown as bigint | undefined,
      1n
    ),
  } as unknown as UserEntity;
  context.User.set(user ? { ...user, ...userUpd } : userUpd);
  const upsId = `${userId}_${pairId}`;
  const ups = await context.UserPairStat.get(upsId);
  const upsUpd: UserPairStatEntity = {
    id: upsId,
    user_id: userId,
    pair_id: pairId,
    totalCancelledOrders: add(
      ups?.totalCancelledOrders as unknown as bigint | undefined,
      1n
    ),
  } as unknown as UserPairStatEntity;
  context.UserPairStat.set(ups ? { ...ups, ...upsUpd } : upsUpd);
});

OstiumTrading.OpenLimitPlaced.handler(async ({ event, context }) => {
  const entity: OstiumTrading_OpenLimitPlaced = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    index: event.params.index,
  };
  context.OstiumTrading_OpenLimitPlaced.set(entity);
  // Create/Update Limit entity
  const limitId = `${event.params.trader.toLowerCase()}_${event.params.pairIndex.toString()}_${event.params.index.toString()}`;
  const limit: LimitEntity = {
    id: limitId,
    trader: event.params.trader,
    pair_id: event.params.pairIndex.toString(),
    isActive: true,
    initiatedAt: BigInt(event.block.timestamp),
  } as LimitEntity;
  const existingLimit = await context.Limit.get(limitId);
  context.Limit.set(existingLimit ? { ...existingLimit, ...limit } : limit);
  // Bump user counter
  const userId2 = event.params.trader.toLowerCase();
  const user2 = await context.User.get(userId2);
  const updatedUser2: UserEntity = {
    id: userId2,
    totalOpenLimitOrders:
      ((user2?.totalOpenLimitOrders as unknown as bigint) ?? BigInt(0)) +
      BigInt(1),
  } as unknown as UserEntity;
  context.User.set(user2 ? { ...user2, ...updatedUser2 } : updatedUser2);
  // UserPairStat bump
  const pairId2 = event.params.pairIndex.toString();
  const upsId = `${userId2}_${pairId2}`;
  const ups = await context.UserPairStat.get(upsId);
  const upsUpdated: UserPairStatEntity = {
    id: upsId,
    user_id: userId2,
    pair_id: pairId2,
    totalOpenLimitOrders: add(
      ups?.totalOpenLimitOrders as unknown as bigint | undefined,
      1n
    ),
  } as unknown as UserPairStatEntity;
  context.UserPairStat.set(ups ? { ...ups, ...upsUpdated } : upsUpdated);
  // Pair + Meta bumps
  const pairExisting = await context.Pair.get(pairId2);
  const pairUpdated: PairEntity = {
    id: pairId2,
    totalOpenLimitOrders: add(
      pairExisting?.totalOpenLimitOrders as unknown as bigint | undefined,
      1n
    ),
  } as unknown as PairEntity;
  context.Pair.set(
    pairExisting ? { ...pairExisting, ...pairUpdated } : pairUpdated
  );
  const meta2 = await getMeta(context);
  const meta2Updated: MetaDataEntity = {
    ...meta2,
    totalOpenLimitOrders: add(
      meta2.totalOpenLimitOrders as unknown as bigint | undefined,
      1n
    ),
  } as unknown as MetaDataEntity;
  context.MetaData.set(meta2Updated);
});

OstiumTrading.AutomationOpenOrderInitiated.handler(
  async ({ event, context }) => {
    const entity: OstiumTrading_AutomationOpenOrderInitiated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      index: event.params.index,
    };
    context.OstiumTrading_AutomationOpenOrderInitiated.set(entity);
  }
);

OstiumTrading.AutomationCloseOrderInitiated.handler(
  async ({ event, context }) => {
    const entity: OstiumTrading_AutomationCloseOrderInitiated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      index: event.params.index,
    };
    context.OstiumTrading_AutomationCloseOrderInitiated.set(entity);
  }
);

OstiumTrading.OpenLimitUpdated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_OpenLimitUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    index: event.params.index,
    newPrice: event.params.newPrice,
    newTp: event.params.newTp,
    newSl: event.params.newSl,
  };
  context.OstiumTrading_OpenLimitUpdated.set(entity);
});

OstiumTrading.SlUpdated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_SlUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    index: event.params.index,
    newSl: event.params.newSl,
  };
  context.OstiumTrading_SlUpdated.set(entity);
});

OstiumTrading.TpUpdated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_TpUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    index: event.params.index,
    newTp: event.params.newTp,
  };
  context.OstiumTrading_TpUpdated.set(entity);
});

OstiumTrading.MarketOpenTimeoutExecuted.handler(async ({ event, context }) => {
  const o = event.params._1;
  const t = o[3];
  const entity: OstiumTrading_MarketOpenTimeoutExecuted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    order_0: o[0],
    order_1: o[1],
    order_2: o[2],
    order_3_0: t[0],
    order_3_1: t[1],
    order_3_2: t[2],
    order_3_3: t[3],
    order_3_4: t[4],
    order_3_5: t[5],
    order_3_6: t[6],
    order_3_7: t[7],
    order_3_8: t[8],
  };
  context.OstiumTrading_MarketOpenTimeoutExecuted.set(entity);
});

OstiumTrading.MarketOpenTimeoutExecutedV2.handler(
  async ({ event, context }) => {
    const o = event.params._1;
    const t = o[3];
    const entity: OstiumTrading_MarketOpenTimeoutExecutedV2 = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      order_0: o[0],
      order_1: o[1],
      order_2: o[2],
      order_3_0: t[0],
      order_3_1: t[1],
      order_3_2: t[2],
      order_3_3: t[3],
      order_3_4: t[4],
      order_3_5: t[5],
      order_3_6: t[6],
      order_3_7: t[7],
      order_3_8: t[8],
      order_4: o[4],
    };
    context.OstiumTrading_MarketOpenTimeoutExecutedV2.set(entity);
  }
);

OstiumTrading.MarketCloseTimeoutExecuted.handler(async ({ event, context }) => {
  const o = event.params._2;
  const t = o[3];
  const entity: OstiumTrading_MarketCloseTimeoutExecuted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    tradeId: event.params.tradeId,
    order_0: o[0],
    order_1: o[1],
    order_2: o[2],
    order_3_0: t[0],
    order_3_1: t[1],
    order_3_2: t[2],
    order_3_3: t[3],
    order_3_4: t[4],
    order_3_5: t[5],
    order_3_6: t[6],
    order_3_7: t[7],
    order_3_8: t[8],
  };
  context.OstiumTrading_MarketCloseTimeoutExecuted.set(entity);
});

OstiumTrading.MarketCloseTimeoutExecutedV2.handler(
  async ({ event, context }) => {
    const o = event.params._2;
    const t = o[3];
    const entity: OstiumTrading_MarketCloseTimeoutExecutedV2 = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      order_0: o[0],
      order_1: o[1],
      order_2: o[2],
      order_3_0: t[0],
      order_3_1: t[1],
      order_3_2: t[2],
      order_3_3: t[3],
      order_3_4: t[4],
      order_3_5: t[5],
      order_3_6: t[6],
      order_3_7: t[7],
      order_3_8: t[8],
      order_4: o[4],
    };
    context.OstiumTrading_MarketCloseTimeoutExecutedV2.set(entity);
  }
);

OstiumTrading.TopUpCollateralExecuted.handler(async ({ event, context }) => {
  const entity: OstiumTrading_TopUpCollateralExecuted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    topUpAmount: event.params.topUpAmount,
    newLeverage: event.params.newLeverage,
  };
  context.OstiumTrading_TopUpCollateralExecuted.set(entity);
});

OstiumTrading.RemoveCollateralInitiated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_RemoveCollateralInitiated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tradeId: event.params.tradeId,
    orderId: event.params.orderId,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    removeAmount: event.params.removeAmount,
  };
  context.OstiumTrading_RemoveCollateralInitiated.set(entity);
});

OstiumTrading.Paused.handler(async ({ event, context }) => {
  const entity: OstiumTrading_Paused = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    paused: event.params.paused,
  };
  context.OstiumTrading_Paused.set(entity);
});

OstiumTrading.MarketOrdersTimeoutUpdated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_MarketOrdersTimeoutUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };
  context.OstiumTrading_MarketOrdersTimeoutUpdated.set(entity);
});

OstiumTrading.MaxAllowedCollateralUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumTrading_MaxAllowedCollateralUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
    };
    context.OstiumTrading_MaxAllowedCollateralUpdated.set(entity);
  }
);

// OstiumTradingCallbacks
OstiumTradingCallbacks.MarketOpenExecuted.handler(
  async ({ event, context }) => {
    const t = event.params._1;
    const entity: OstiumTradingCallbacks_MarketOpenExecuted = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      t_0: t[0],
      t_1: t[1],
      t_2: t[2],
      t_3: t[3],
      t_4: t[4],
      t_5: t[5],
      t_6: t[6],
      t_7: t[7],
      t_8: t[8],
      priceImpactP: event.params.priceImpactP,
      tradeNotional: event.params.tradeNotional,
    };
    context.OstiumTradingCallbacks_MarketOpenExecuted.set(entity);

    // Create comprehensive Order entity
    const orderOpen: OrderEntity = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderType: "market_open_exec",
      orderAction: "open",
      trader: t[4],
      pair_id: t[1]?.toString() ?? undefined,
      trade_id: t[0]?.toString() ?? undefined,
      price: t[2],
      priceAfterImpact: t[2], // Will be calculated with impact
      priceImpactP: event.params.priceImpactP,
      collateral: t[5],
      notional: event.params.tradeNotional,
      tradeNotional: event.params.tradeNotional,
      isBuy: t[8] as unknown as boolean,
      leverage: t[6],
      executedAt: BigInt(event.block.timestamp),
      executedBlock: event.block.number,
      isPending: false,
      isCancelled: false,
    } as unknown as OrderEntity;
    context.Order.set(orderOpen);

    // Update or create Trade entity with complete information
    const tradeId = t[0]?.toString();
    if (tradeId) {
      const existingTrade = await context.Trade.get(tradeId);
      const updatedTrade: TradeEntity = {
        id: tradeId,
        trader: t[4],
        pair_id: t[1]?.toString() ?? undefined,
        index: t[7]?.toString() ?? undefined,
        trade_id: tradeId,
        tradeType: "market",
        openPrice: t[2],
        takeProfitPrice: t[3],
        stopLossPrice: 0n, // Will be set separately
        collateral: t[5],
        notional: event.params.tradeNotional,
        tradeNotional: event.params.tradeNotional,
        leverage: t[6],
        highestLeverage: t[6],
        isBuy: t[8] as unknown as boolean,
        isOpen: true,
        closeInitiated: 0n,
        funding: existingTrade?.funding ?? 0n,
        rollover: existingTrade?.rollover ?? 0n,
        timestamp: BigInt(event.block.timestamp),
      } as unknown as TradeEntity;
      context.Trade.set(updatedTrade);

      // Update user statistics
      const userId = t[4].toLowerCase();
      const user = await context.User.get(userId);
      const userUpdated: UserEntity = {
        id: userId,
        totalOpenTrades: add(
          user?.totalOpenTrades as unknown as bigint | undefined,
          1n
        ),
        totalTrades: add(
          user?.totalTrades as unknown as bigint | undefined,
          1n
        ),
        totalVolume: add(
          user?.totalVolume as unknown as bigint | undefined,
          event.params.tradeNotional
        ),
        totalOpenVolume: add(
          user?.totalOpenVolume as unknown as bigint | undefined,
          event.params.tradeNotional
        ),
      } as unknown as UserEntity;
      context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

      // Update UserPairStat
      const pairId = t[1]?.toString();
      if (pairId) {
        const upsId = `${userId}_${pairId}`;
        const ups = await context.UserPairStat.get(upsId);
        const upsUpdated: UserPairStatEntity = {
          id: upsId,
          user_id: userId,
          pair_id: pairId,
          totalOpenTrades: add(
            ups?.totalOpenTrades as unknown as bigint | undefined,
            1n
          ),
          totalTrades: add(
            ups?.totalTrades as unknown as bigint | undefined,
            1n
          ),
          totalMarketOrders: add(
            ups?.totalMarketOrders as unknown as bigint | undefined,
            1n
          ),
          totalVolume: add(
            ups?.totalVolume as unknown as bigint | undefined,
            event.params.tradeNotional
          ),
          totalOpenVolume: add(
            ups?.totalOpenVolume as unknown as bigint | undefined,
            event.params.tradeNotional
          ),
        } as unknown as UserPairStatEntity;
        context.UserPairStat.set(ups ? { ...ups, ...upsUpdated } : upsUpdated);
      }

      // Update pair statistics
      if (pairId) {
        const pair = await context.Pair.get(pairId);
        const pairUpdated: PairEntity = {
          id: pairId,
          totalOpenTrades: add(
            pair?.totalOpenTrades as unknown as bigint | undefined,
            1n
          ),
          volume: add(
            pair?.volume as unknown as bigint | undefined,
            event.params.tradeNotional
          ),
        } as unknown as PairEntity;
        context.Pair.set(pair ? { ...pair, ...pairUpdated } : pairUpdated);
      }

      // Update MetaData
      const meta = await getMeta(context);
      const metaUpdated: MetaDataEntity = {
        ...meta,
        totalOpenTrades: add(
          meta.totalOpenTrades as unknown as bigint | undefined,
          1n
        ),
        totalTrades: add(meta.totalTrades as unknown as bigint | undefined, 1n),
        totalVolume: add(
          meta.totalVolume as unknown as bigint | undefined,
          event.params.tradeNotional
        ),
        totalOpenVolume: add(
          meta.totalOpenVolume as unknown as bigint | undefined,
          event.params.tradeNotional
        ),
      } as unknown as MetaDataEntity;
      context.MetaData.set(metaUpdated);
    }
  }
);

OstiumTradingCallbacks.MarketCloseExecuted.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_MarketCloseExecuted = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      price: event.params.price,
      priceImpactP: event.params.priceImpactP,
      percentProfit: event.params.percentProfit,
      usdcSentToTrader: event.params.usdcSentToTrader,
    };
    context.OstiumTradingCallbacks_MarketCloseExecuted.set(entity);

    const orderClose: OrderEntity = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderType: "market_close_exec",
      orderAction: "close",
      price: event.params.price,
      priceAfterImpact: event.params.price,
      priceImpactP: event.params.priceImpactP,
      profitPercent: event.params.percentProfit,
      totalProfitPercent: event.params.percentProfit,
      amountSentToTrader: event.params.usdcSentToTrader,
      executedAt: BigInt(event.block.timestamp),
      executedBlock: event.block.number,
      trade_id: event.params.tradeId.toString(),
      isPending: false,
      isCancelled: false,
      closePercent: 100n, // Full close
    } as unknown as OrderEntity;
    context.Order.set(orderClose);

    const tId = event.params.tradeId.toString();
    const tr = await context.Trade.get(tId);
    if (tr) {
      const closed: TradeEntity = {
        ...tr,
        isOpen: false,
        closePrice: event.params.price,
      } as unknown as TradeEntity;
      context.Trade.set(closed);

      // Update user statistics
      const userId = tr.trader?.toLowerCase();
      if (userId) {
        const user = await context.User.get(userId);
        const isProfit = event.params.percentProfit > 0n;
        const userUpdated: UserEntity = {
          id: userId,
          totalOpenTrades: add(
            user?.totalOpenTrades as unknown as bigint | undefined,
            -1n
          ),
          totalClosedVolume: add(
            user?.totalClosedVolume as unknown as bigint | undefined,
            tr.tradeNotional as unknown as bigint
          ),
          totalOpenVolume: add(
            user?.totalOpenVolume as unknown as bigint | undefined,
            -(tr.tradeNotional as unknown as bigint)
          ),
          totalClosedCollateral: add(
            user?.totalClosedCollateral as unknown as bigint | undefined,
            tr.collateral as unknown as bigint
          ),
          totalProfitTrades: add(
            user?.totalProfitTrades as unknown as bigint | undefined,
            isProfit ? 1n : 0n
          ),
          totalLossTrades: add(
            user?.totalLossTrades as unknown as bigint | undefined,
            isProfit ? 0n : 1n
          ),
          totalPnL: add(
            user?.totalPnL as unknown as bigint | undefined,
            event.params.percentProfit
          ),
        } as unknown as UserEntity;
        context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

        // Update UserPairStat
        const pairId = tr.pair_id;
        if (pairId) {
          const upsId = `${userId}_${pairId}`;
          const ups = await context.UserPairStat.get(upsId);
          const upsUpdated: UserPairStatEntity = {
            id: upsId,
            user_id: userId,
            pair_id: pairId,
            totalOpenTrades: add(
              ups?.totalOpenTrades as unknown as bigint | undefined,
              -1n
            ),
            totalClosedVolume: add(
              ups?.totalClosedVolume as unknown as bigint | undefined,
              tr.tradeNotional as unknown as bigint
            ),
            totalOpenVolume: add(
              ups?.totalOpenVolume as unknown as bigint | undefined,
              -(tr.tradeNotional as unknown as bigint)
            ),
            totalClosedCollateral: add(
              ups?.totalClosedCollateral as unknown as bigint | undefined,
              tr.collateral as unknown as bigint
            ),
            totalProfitTrades: add(
              ups?.totalProfitTrades as unknown as bigint | undefined,
              isProfit ? 1n : 0n
            ),
            totalLossTrades: add(
              ups?.totalLossTrades as unknown as bigint | undefined,
              isProfit ? 0n : 1n
            ),
            totalPnL: add(
              ups?.totalPnL as unknown as bigint | undefined,
              event.params.percentProfit
            ),
          } as unknown as UserPairStatEntity;
          context.UserPairStat.set(
            ups ? { ...ups, ...upsUpdated } : upsUpdated
          );
        }
      }

      // Update Pair statistics
      const pairId = tr.pair_id;
      if (pairId) {
        const pair = await context.Pair.get(pairId);
        const pairUpdated: PairEntity = {
          id: pairId,
          totalOpenTrades: add(
            pair?.totalOpenTrades as unknown as bigint | undefined,
            -1n
          ),
        } as unknown as PairEntity;
        context.Pair.set(pair ? { ...pair, ...pairUpdated } : pairUpdated);
      }

      // Update MetaData
      const meta = await getMeta(context);
      const isProfit = event.params.percentProfit > 0n;
      const metaUpdated: MetaDataEntity = {
        ...meta,
        totalOpenTrades: add(
          meta.totalOpenTrades as unknown as bigint | undefined,
          -1n
        ),
        totalClosedVolume: add(
          meta.totalClosedVolume as unknown as bigint | undefined,
          tr.tradeNotional as unknown as bigint
        ),
        totalOpenVolume: add(
          meta.totalOpenVolume as unknown as bigint | undefined,
          -(tr.tradeNotional as unknown as bigint)
        ),
        totalProfitTrades: add(
          meta.totalProfitTrades as unknown as bigint | undefined,
          isProfit ? 1n : 0n
        ),
        totalLossTrades: add(
          meta.totalLossTrades as unknown as bigint | undefined,
          isProfit ? 0n : 1n
        ),
        totalPnL: add(
          meta.totalPnL as unknown as bigint | undefined,
          event.params.percentProfit
        ),
      } as unknown as MetaDataEntity;
      context.MetaData.set(metaUpdated);
    }
  }
);

OstiumTradingCallbacks.MarketCloseExecutedV2.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_MarketCloseExecutedV2 = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      price: event.params.price,
      priceImpactP: event.params.priceImpactP,
      percentProfit: event.params.percentProfit,
      usdcSentToTrader: event.params.usdcSentToTrader,
      percentageClosed: event.params.percentageClosed,
    };
    context.OstiumTradingCallbacks_MarketCloseExecutedV2.set(entity);
    const orderClose2: OrderEntity = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderType: "market_close_exec_v2",
      price: event.params.price,
      priceImpactP: event.params.priceImpactP,
      profitPercent: event.params.percentProfit,
      amountSentToTrader: event.params.usdcSentToTrader,
      closePercent: event.params.percentageClosed,
      executedAt: BigInt(event.block.timestamp),
      executedBlock: event.block.number,
      trade_id: event.params.tradeId.toString(),
    } as unknown as OrderEntity;
    context.Order.set(orderClose2);
  }
);

OstiumTradingCallbacks.LimitOpenExecuted.handler(async ({ event, context }) => {
  const t = event.params._2;
  const entity: OstiumTradingCallbacks_LimitOpenExecuted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    limitIndex: event.params.limitIndex,
    t_0: t[0],
    t_1: t[1],
    t_2: t[2],
    t_3: t[3],
    t_4: t[4],
    t_5: t[5],
    t_6: t[6],
    t_7: t[7],
    t_8: t[8],
    priceImpactP: event.params.priceImpactP,
    tradeNotional: event.params.tradeNotional,
  };
  context.OstiumTradingCallbacks_LimitOpenExecuted.set(entity);

  const orderLimitOpen: OrderEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderType: "limit_open_exec",
    orderAction: "open",
    trader: t[4],
    pair_id: t[1]?.toString() ?? undefined,
    trade_id: t[0]?.toString() ?? undefined,
    limit_id: event.params.limitIndex.toString(),
    price: t[2],
    priceAfterImpact: t[2],
    priceImpactP: event.params.priceImpactP,
    collateral: t[5],
    notional: event.params.tradeNotional,
    tradeNotional: event.params.tradeNotional,
    isBuy: t[8] as unknown as boolean,
    leverage: t[6],
    executedAt: BigInt(event.block.timestamp),
    executedBlock: event.block.number,
    isPending: false,
    isCancelled: false,
  } as unknown as OrderEntity;
  context.Order.set(orderLimitOpen);

  // Update Limit entity
  const possibleLimitId = `${t[4].toLowerCase()}_${t[1]?.toString()}_${event.params.limitIndex.toString()}`;
  const limitEnt = await context.Limit.get(possibleLimitId);
  if (limitEnt) {
    const updatedLimit: LimitEntity = {
      ...limitEnt,
      isActive: false,
      executionStarted: BigInt(event.block.timestamp),
      updatedAt: BigInt(event.block.timestamp),
      orderId: event.params.orderId.toString(),
    } as unknown as LimitEntity;
    context.Limit.set(updatedLimit);
  }

  // Create/Update Trade entity (similar to market open)
  const tradeId = t[0]?.toString();
  if (tradeId) {
    const existingTrade = await context.Trade.get(tradeId);
    const updatedTrade: TradeEntity = {
      id: tradeId,
      trader: t[4],
      pair_id: t[1]?.toString() ?? undefined,
      index: t[7]?.toString() ?? undefined,
      trade_id: tradeId,
      tradeType: "limit",
      openPrice: t[2],
      takeProfitPrice: t[3],
      stopLossPrice: 0n,
      collateral: t[5],
      notional: event.params.tradeNotional,
      tradeNotional: event.params.tradeNotional,
      leverage: t[6],
      highestLeverage: t[6],
      isBuy: t[8] as unknown as boolean,
      isOpen: true,
      closeInitiated: 0n,
      funding: existingTrade?.funding ?? 0n,
      rollover: existingTrade?.rollover ?? 0n,
      timestamp: BigInt(event.block.timestamp),
    } as unknown as TradeEntity;
    context.Trade.set(updatedTrade);

    // Update user statistics (similar to market open)
    const userId = t[4].toLowerCase();
    const user = await context.User.get(userId);
    const userUpdated: UserEntity = {
      id: userId,
      totalOpenTrades: add(
        user?.totalOpenTrades as unknown as bigint | undefined,
        1n
      ),
      totalTrades: add(user?.totalTrades as unknown as bigint | undefined, 1n),
      totalVolume: add(
        user?.totalVolume as unknown as bigint | undefined,
        event.params.tradeNotional
      ),
      totalOpenVolume: add(
        user?.totalOpenVolume as unknown as bigint | undefined,
        event.params.tradeNotional
      ),
      totalOpenLimitOrders: add(
        user?.totalOpenLimitOrders as unknown as bigint | undefined,
        -1n
      ), // Limit was consumed
    } as unknown as UserEntity;
    context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

    // Update UserPairStat
    const pairIdForStats = t[1]?.toString();
    if (pairIdForStats) {
      const upsId = `${userId}_${pairIdForStats}`;
      const ups = await context.UserPairStat.get(upsId);
      const upsUpdated: UserPairStatEntity = {
        id: upsId,
        user_id: userId,
        pair_id: pairIdForStats,
        totalOpenTrades: add(
          ups?.totalOpenTrades as unknown as bigint | undefined,
          1n
        ),
        totalTrades: add(ups?.totalTrades as unknown as bigint | undefined, 1n),
        totalVolume: add(
          ups?.totalVolume as unknown as bigint | undefined,
          event.params.tradeNotional
        ),
        totalOpenVolume: add(
          ups?.totalOpenVolume as unknown as bigint | undefined,
          event.params.tradeNotional
        ),
        totalOpenLimitOrders: add(
          ups?.totalOpenLimitOrders as unknown as bigint | undefined,
          -1n
        ),
      } as unknown as UserPairStatEntity;
      context.UserPairStat.set(ups ? { ...ups, ...upsUpdated } : upsUpdated);
    }
  }
});

OstiumTradingCallbacks.LimitCloseExecuted.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_LimitCloseExecuted = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      index: event.params.index,
      price: event.params.price,
      priceImpactP: event.params.priceImpactP,
      percentProfit: event.params.percentProfit,
      usdcSentToTrader: event.params.usdcSentToTrader,
    };
    context.OstiumTradingCallbacks_LimitCloseExecuted.set(entity);

    const orderLimitClose: OrderEntity = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderType: "limit_close_exec",
      orderAction: "close",
      price: event.params.price,
      priceAfterImpact: event.params.price,
      priceImpactP: event.params.priceImpactP,
      profitPercent: event.params.percentProfit,
      totalProfitPercent: event.params.percentProfit,
      amountSentToTrader: event.params.usdcSentToTrader,
      executedAt: BigInt(event.block.timestamp),
      executedBlock: event.block.number,
      trade_id: event.params.tradeId.toString(),
      isPending: false,
      isCancelled: false,
      closePercent: 100n, // Assume full close for limit
    } as unknown as OrderEntity;
    context.Order.set(orderLimitClose);

    // Close the trade and update statistics (similar to market close)
    const tId = event.params.tradeId.toString();
    const tr = await context.Trade.get(tId);
    if (tr) {
      const closed: TradeEntity = {
        ...tr,
        isOpen: false,
        closePrice: event.params.price,
      } as unknown as TradeEntity;
      context.Trade.set(closed);

      // Update user statistics
      const userId = tr.trader?.toLowerCase();
      if (userId) {
        const user = await context.User.get(userId);
        const isProfit = event.params.percentProfit > 0n;
        const userUpdated: UserEntity = {
          id: userId,
          totalOpenTrades: add(
            user?.totalOpenTrades as unknown as bigint | undefined,
            -1n
          ),
          totalClosedVolume: add(
            user?.totalClosedVolume as unknown as bigint | undefined,
            tr.tradeNotional as unknown as bigint
          ),
          totalOpenVolume: add(
            user?.totalOpenVolume as unknown as bigint | undefined,
            -(tr.tradeNotional as unknown as bigint)
          ),
          totalClosedCollateral: add(
            user?.totalClosedCollateral as unknown as bigint | undefined,
            tr.collateral as unknown as bigint
          ),
          totalProfitTrades: add(
            user?.totalProfitTrades as unknown as bigint | undefined,
            isProfit ? 1n : 0n
          ),
          totalLossTrades: add(
            user?.totalLossTrades as unknown as bigint | undefined,
            isProfit ? 0n : 1n
          ),
          totalPnL: add(
            user?.totalPnL as unknown as bigint | undefined,
            event.params.percentProfit
          ),
          totalTPOrders: add(
            user?.totalTPOrders as unknown as bigint | undefined,
            1n
          ), // Count as TP order
        } as unknown as UserEntity;
        context.User.set(user ? { ...user, ...userUpdated } : userUpdated);
      }
    }
  }
);

OstiumTradingCallbacks.MarketOpenCanceled.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_MarketOpenCanceled = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      cancelReason: event.params.cancelReason,
    };
    context.OstiumTradingCallbacks_MarketOpenCanceled.set(entity);
  }
);

OstiumTradingCallbacks.MarketCloseCanceled.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_MarketCloseCanceled = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      index: event.params.index,
      cancelReason: event.params.cancelReason,
    };
    context.OstiumTradingCallbacks_MarketCloseCanceled.set(entity);
  }
);

OstiumTradingCallbacks.AutomationCloseOrderCanceled.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_AutomationCloseOrderCanceled = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      index: event.params.index,
      cancelReason: event.params.cancelReason,
    };
    context.OstiumTradingCallbacks_AutomationCloseOrderCanceled.set(entity);
  }
);

OstiumTradingCallbacks.AutomationOpenOrderCanceled.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_AutomationOpenOrderCanceled = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      cancelReason: event.params.cancelReason,
    };
    context.OstiumTradingCallbacks_AutomationOpenOrderCanceled.set(entity);
  }
);

OstiumTradingCallbacks.DevFeeCharged.handler(async ({ event, context }) => {
  const entity: OstiumTradingCallbacks_DevFeeCharged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    amount: event.params.amount,
  };
  context.OstiumTradingCallbacks_DevFeeCharged.set(entity);

  // Create Order record for dev fee
  const orderEntity: OrderEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}_devfee`,
    orderType: "dev_fee_charged",
    trader: event.params.trader,
    trade_id: event.params.tradeId.toString(),
    devFee: event.params.amount,
    executedAt: BigInt(event.block.timestamp),
    executedBlock: event.block.number,
  } as unknown as OrderEntity;
  context.Order.set(orderEntity);

  // Update user dev fee total
  const userId = event.params.trader.toLowerCase();
  const user = await context.User.get(userId);
  const userUpdated: UserEntity = {
    id: userId,
    totalDevFee: add(
      user?.totalDevFee as unknown as bigint | undefined,
      event.params.amount
    ),
  } as unknown as UserEntity;
  context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

  // Update UserPairStat if we can determine the pair
  const trade = await context.Trade.get(event.params.tradeId.toString());
  if (trade?.pair_id) {
    const upsId = `${userId}_${trade.pair_id}`;
    const ups = await context.UserPairStat.get(upsId);
    const upsUpdated: UserPairStatEntity = {
      id: upsId,
      user_id: userId,
      pair_id: trade.pair_id,
      totalDevFee: add(
        ups?.totalDevFee as unknown as bigint | undefined,
        event.params.amount
      ),
    } as unknown as UserPairStatEntity;
    context.UserPairStat.set(ups ? { ...ups, ...upsUpdated } : upsUpdated);
  }

  // Update MetaData dev fee total
  const meta = await getMeta(context);
  const metaUpdated: MetaDataEntity = {
    ...meta,
    totalDevFee: add(
      meta.totalDevFee as unknown as bigint | undefined,
      event.params.amount
    ),
  } as unknown as MetaDataEntity;
  context.MetaData.set(metaUpdated);
});

OstiumTradingCallbacks.VaultOpeningFeeCharged.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_VaultOpeningFeeCharged = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      amount: event.params.amount,
    };
    context.OstiumTradingCallbacks_VaultOpeningFeeCharged.set(entity);

    // Create Order record for vault opening fee
    const orderEntity: OrderEntity = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}_vaultfee`,
      orderType: "vault_opening_fee_charged",
      trader: event.params.trader,
      trade_id: event.params.tradeId.toString(),
      vaultFee: event.params.amount,
      executedAt: BigInt(event.block.timestamp),
      executedBlock: event.block.number,
    } as unknown as OrderEntity;
    context.Order.set(orderEntity);

    // Update user vault fee total
    const userId = event.params.trader.toLowerCase();
    const user = await context.User.get(userId);
    const userUpdated: UserEntity = {
      id: userId,
      totalVaultFee: add(
        user?.totalVaultFee as unknown as bigint | undefined,
        event.params.amount
      ),
    } as unknown as UserEntity;
    context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

    // Update UserPairStat
    const trade = await context.Trade.get(event.params.tradeId.toString());
    if (trade?.pair_id) {
      const upsId = `${userId}_${trade.pair_id}`;
      const ups = await context.UserPairStat.get(upsId);
      const upsUpdated: UserPairStatEntity = {
        id: upsId,
        user_id: userId,
        pair_id: trade.pair_id,
        totalVaultFee: add(
          ups?.totalVaultFee as unknown as bigint | undefined,
          event.params.amount
        ),
      } as unknown as UserPairStatEntity;
      context.UserPairStat.set(ups ? { ...ups, ...upsUpdated } : upsUpdated);
    }

    // Update MetaData vault fee total
    const meta = await getMeta(context);
    const metaUpdated: MetaDataEntity = {
      ...meta,
      totalVaultFee: add(
        meta.totalVaultFee as unknown as bigint | undefined,
        event.params.amount
      ),
    } as unknown as MetaDataEntity;
    context.MetaData.set(metaUpdated);
  }
);

OstiumTradingCallbacks.VaultLiqFeeCharged.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_VaultLiqFeeCharged = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      amount: event.params.amount,
    };
    context.OstiumTradingCallbacks_VaultLiqFeeCharged.set(entity);

    // Create Order record for liquidation fee
    const orderEntity: OrderEntity = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}_liqfee`,
      orderType: "liquidation_fee_charged",
      trader: event.params.trader,
      trade_id: event.params.tradeId.toString(),
      liquidationFee: event.params.amount,
      executedAt: BigInt(event.block.timestamp),
      executedBlock: event.block.number,
    } as unknown as OrderEntity;
    context.Order.set(orderEntity);

    // Update user liquidation fee total
    const userId = event.params.trader.toLowerCase();
    const user = await context.User.get(userId);
    const userUpdated: UserEntity = {
      id: userId,
      totalLiquidationFee: add(
        user?.totalLiquidationFee as unknown as bigint | undefined,
        event.params.amount
      ),
      totalLIQOrders: add(
        user?.totalLIQOrders as unknown as bigint | undefined,
        1n
      ),
    } as unknown as UserEntity;
    context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

    // Update UserPairStat
    const trade = await context.Trade.get(event.params.tradeId.toString());
    if (trade?.pair_id) {
      const upsId = `${userId}_${trade.pair_id}`;
      const ups = await context.UserPairStat.get(upsId);
      const upsUpdated: UserPairStatEntity = {
        id: upsId,
        user_id: userId,
        pair_id: trade.pair_id,
        totalLiquidationFee: add(
          ups?.totalLiquidationFee as unknown as bigint | undefined,
          event.params.amount
        ),
        totalLIQOrders: add(
          ups?.totalLIQOrders as unknown as bigint | undefined,
          1n
        ),
      } as unknown as UserPairStatEntity;
      context.UserPairStat.set(ups ? { ...ups, ...upsUpdated } : upsUpdated);
    }

    // Update MetaData liquidation counters
    const meta = await getMeta(context);
    const metaUpdated: MetaDataEntity = {
      ...meta,
      totalLiquidationFee: add(
        meta.totalLiquidationFee as unknown as bigint | undefined,
        event.params.amount
      ),
      totalLIQOrders: add(
        meta.totalLIQOrders as unknown as bigint | undefined,
        1n
      ),
    } as unknown as MetaDataEntity;
    context.MetaData.set(metaUpdated);
  }
);

OstiumTradingCallbacks.OracleFeeCharged.handler(async ({ event, context }) => {
  const entity: OstiumTradingCallbacks_OracleFeeCharged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    amount: event.params.amount,
  };
  context.OstiumTradingCallbacks_OracleFeeCharged.set(entity);

  // Create Order record for oracle fee
  const orderEntity: OrderEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}_oraclefee`,
    orderType: "oracle_fee_charged",
    trader: event.params.trader,
    trade_id: event.params.tradeId.toString(),
    oracleFee: event.params.amount,
    executedAt: BigInt(event.block.timestamp),
    executedBlock: event.block.number,
  } as unknown as OrderEntity;
  context.Order.set(orderEntity);

  // Update user oracle fee total
  const userId = event.params.trader.toLowerCase();
  const user = await context.User.get(userId);
  const userUpdated: UserEntity = {
    id: userId,
    totalOracleFee: add(
      user?.totalOracleFee as unknown as bigint | undefined,
      event.params.amount
    ),
  } as unknown as UserEntity;
  context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

  // Update UserPairStat
  const trade = await context.Trade.get(event.params.tradeId.toString());
  if (trade?.pair_id) {
    const upsId = `${userId}_${trade.pair_id}`;
    const ups = await context.UserPairStat.get(upsId);
    const upsUpdated: UserPairStatEntity = {
      id: upsId,
      user_id: userId,
      pair_id: trade.pair_id,
      totalOracleFee: add(
        ups?.totalOracleFee as unknown as bigint | undefined,
        event.params.amount
      ),
    } as unknown as UserPairStatEntity;
    context.UserPairStat.set(ups ? { ...ups, ...upsUpdated } : upsUpdated);
  }

  // Update MetaData oracle fee total
  const meta = await getMeta(context);
  const metaUpdated: MetaDataEntity = {
    ...meta,
    totalOracleFee: add(
      meta.totalOracleFee as unknown as bigint | undefined,
      event.params.amount
    ),
  } as unknown as MetaDataEntity;
  context.MetaData.set(metaUpdated);
});

OstiumTradingCallbacks.RemoveCollateralExecuted.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_RemoveCollateralExecuted = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      tradeId: event.params.tradeId,
      orderId: event.params.orderId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      removeAmount: event.params.removeAmount,
      leverage: event.params.leverage,
      tp: event.params.tp,
      sl: event.params.sl,
    };
    context.OstiumTradingCallbacks_RemoveCollateralExecuted.set(entity);
  }
);

OstiumTradingCallbacks.RemoveCollateralRejected.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_RemoveCollateralRejected = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      tradeId: event.params.tradeId,
      orderId: event.params.orderId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      removeAmount: event.params.removeAmount,
      reason: event.params.reason,
    };
    context.OstiumTradingCallbacks_RemoveCollateralRejected.set(entity);
  }
);

OstiumTradingCallbacks.FeesCharged.handler(async ({ event, context }) => {
  const entity: OstiumTradingCallbacks_FeesCharged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    rolloverFees: event.params.rolloverFees,
    fundingFees: event.params.fundingFees,
  };
  context.OstiumTradingCallbacks_FeesCharged.set(entity);

  // Update Order entity with fees
  const orderEntity: OrderEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}_fees`,
    orderType: "fees_charged",
    trader: event.params.trader,
    trade_id: event.params.tradeId.toString(),
    rolloverFee: event.params.rolloverFees,
    fundingFee: event.params.fundingFees,
    executedAt: BigInt(event.block.timestamp),
    executedBlock: event.block.number,
  } as unknown as OrderEntity;
  context.Order.set(orderEntity);

  // Accumulate fees into Trade entity (same as PairsInfos version)
  const tradeId = event.params.tradeId.toString();
  const trade = await context.Trade.get(tradeId);
  if (trade) {
    const updatedTrade: TradeEntity = {
      ...trade,
      rollover: add(
        trade.rollover as unknown as bigint | undefined,
        event.params.rolloverFees
      ),
      funding: add(
        trade.funding as unknown as bigint | undefined,
        event.params.fundingFees
      ),
    } as unknown as TradeEntity;
    context.Trade.set(updatedTrade);
  }

  // Update user fee counters
  const userId = event.params.trader.toLowerCase();
  const user = await context.User.get(userId);
  const userUpdated: UserEntity = {
    id: userId,
    totalRolloverFee: add(
      user?.totalRolloverFee as unknown as bigint | undefined,
      event.params.rolloverFees
    ),
    netFundingPayment: add(
      user?.netFundingPayment as unknown as bigint | undefined,
      event.params.fundingFees
    ),
  } as unknown as UserEntity;
  context.User.set(user ? { ...user, ...userUpdated } : userUpdated);
});

OstiumTradingCallbacks.Paused.handler(async ({ event, context }) => {
  const entity: OstiumTradingCallbacks_Paused = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    paused: event.params.paused,
  };
  context.OstiumTradingCallbacks_Paused.set(entity);
});

// OstiumVault
OstiumVault.Deposit.handler(async ({ event, context }) => {
  const entity: OstiumVault_Deposit = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    owner: event.params.owner,
    assets: event.params.assets,
    shares: event.params.shares,
  };
  context.OstiumVault_Deposit.set(entity);

  // Update or create LpShare entity
  const userId = event.params.owner.toLowerCase();
  const existingShare = await context.LpShare.get(userId);
  const updatedShare: LpShareEntity = {
    id: userId,
    user: event.params.owner,
    assets: add(
      existingShare?.assets as unknown as bigint | undefined,
      event.params.assets
    ),
    shares: add(
      existingShare?.shares as unknown as bigint | undefined,
      event.params.shares
    ),
    lockedAssets: existingShare?.lockedAssets ?? 0n,
    lockedShares: existingShare?.lockedShares ?? 0n,
    hasLocked: existingShare?.hasLocked ?? false,
  } as unknown as LpShareEntity;
  context.LpShare.set(updatedShare);

  // Create LpAction record
  const actionEntity: LpActionEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.owner,
    assets: event.params.assets,
    shares: event.params.shares,
    actionType: "deposit",
    timestamp: BigInt(event.block.timestamp),
    epoch: 0n, // Will be updated if epoch info is available
    withdrawShares: 0n,
    withdrawRequestEpoch: 0n,
    withdrawUnlockEpoch: 0n,
  } as unknown as LpActionEntity;
  context.LpAction.set(actionEntity);

  // Update Vault totals
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    assets: add(
      vault?.assets as unknown as bigint | undefined,
      event.params.assets
    ),
    shares: add(
      vault?.shares as unknown as bigint | undefined,
      event.params.shares
    ),
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);
});

OstiumVault.Withdraw.handler(async ({ event, context }) => {
  const entity: OstiumVault_Withdraw = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    receiver: event.params.receiver,
    owner: event.params.owner,
    assets: event.params.assets,
    shares: event.params.shares,
  };
  context.OstiumVault_Withdraw.set(entity);

  // Update LpShare entity
  const userId = event.params.owner.toLowerCase();
  const existingShare = await context.LpShare.get(userId);
  if (existingShare) {
    const newAssets =
      (existingShare.assets as unknown as bigint) - event.params.assets;
    const newShares =
      (existingShare.shares as unknown as bigint) - event.params.shares;
    const updatedShare: LpShareEntity = {
      ...existingShare,
      assets: newAssets < 0n ? 0n : newAssets,
      shares: newShares < 0n ? 0n : newShares,
    } as unknown as LpShareEntity;
    context.LpShare.set(updatedShare);
  }

  // Create LpAction record
  const actionEntity: LpActionEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.owner,
    assets: event.params.assets,
    shares: event.params.shares,
    actionType: "withdraw",
    timestamp: BigInt(event.block.timestamp),
    epoch: 0n,
    withdrawShares: 0n,
    withdrawRequestEpoch: 0n,
    withdrawUnlockEpoch: 0n,
  } as unknown as LpActionEntity;
  context.LpAction.set(actionEntity);

  // Update Vault totals
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  if (vault) {
    const newAssets = (vault.assets as unknown as bigint) - event.params.assets;
    const newShares = (vault.shares as unknown as bigint) - event.params.shares;
    const updatedVault: VaultEntity = {
      ...vault,
      assets: newAssets < 0n ? 0n : newAssets,
      shares: newShares < 0n ? 0n : newShares,
    } as unknown as VaultEntity;
    context.Vault.set(updatedVault);
  }
});

OstiumVault.WithdrawRequested.handler(async ({ event, context }) => {
  const entity: OstiumVault_WithdrawRequested = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    owner: event.params.owner,
    shares: event.params.shares,
    currEpoch: event.params.currEpoch,
    unlockEpoch: event.params.unlockEpoch,
  };
  context.OstiumVault_WithdrawRequested.set(entity);

  // Create LpAction record for withdraw request
  const actionEntity: LpActionEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.owner,
    assets: 0n,
    shares: event.params.shares,
    actionType: "withdraw_requested",
    timestamp: BigInt(event.block.timestamp),
    epoch: event.params.currEpoch,
    withdrawShares: event.params.shares,
    withdrawRequestEpoch: event.params.currEpoch,
    withdrawUnlockEpoch: event.params.unlockEpoch,
  } as unknown as LpActionEntity;
  context.LpAction.set(actionEntity);

  // Update Vault current epoch if newer
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    currentEpoch: event.params.currEpoch,
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);
});

OstiumVault.WithdrawCanceled.handler(async ({ event, context }) => {
  const entity: OstiumVault_WithdrawCanceled = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    owner: event.params.owner,
    shares: event.params.shares,
    currEpoch: event.params.currEpoch,
    unlockEpoch: event.params.unlockEpoch,
  };
  context.OstiumVault_WithdrawCanceled.set(entity);

  // Create LpAction record for withdraw cancellation
  const actionEntity: LpActionEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.owner,
    assets: 0n,
    shares: event.params.shares,
    actionType: "withdraw_canceled",
    timestamp: BigInt(event.block.timestamp),
    epoch: event.params.currEpoch,
    withdrawShares: event.params.shares,
    withdrawRequestEpoch: event.params.currEpoch,
    withdrawUnlockEpoch: event.params.unlockEpoch,
  } as unknown as LpActionEntity;
  context.LpAction.set(actionEntity);
});

OstiumVault.DepositLocked.handler(async ({ event, context }) => {
  const d = event.params._3;
  const entity: OstiumVault_DepositLocked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    owner: event.params.owner,
    depositId: event.params.depositId,
    d_0: d[0],
    d_1: d[1],
    d_2: d[2],
    d_3: d[3],
    d_4: d[4],
    d_5: d[5],
  };
  context.OstiumVault_DepositLocked.set(entity);

  // Create LpNFT entity
  const nftId = event.params.depositId.toString();
  const nftEntity: LpNFTEntity = {
    id: nftId,
    user: event.params.owner,
    assetsDeposited: d[1], // d_1 should be assets deposited
    assetsDiscount: d[2], // d_2 should be discount
    shares: d[3], // d_3 should be shares
    atTime: BigInt(event.block.timestamp),
    lockDuration: d[4], // d_4 should be lock duration
    isUnlocked: false,
  } as unknown as LpNFTEntity;
  context.LpNFT.set(nftEntity);

  // Update LpShare entity to track locked amounts
  const userId = event.params.owner.toLowerCase();
  const existingShare = await context.LpShare.get(userId);
  const updatedShare: LpShareEntity = {
    id: userId,
    user: event.params.owner,
    assets: existingShare?.assets ?? 0n,
    shares: existingShare?.shares ?? 0n,
    lockedAssets: add(
      existingShare?.lockedAssets as unknown as bigint | undefined,
      d[1]
    ),
    lockedShares: add(
      existingShare?.lockedShares as unknown as bigint | undefined,
      d[3]
    ),
    hasLocked: true,
  } as unknown as LpShareEntity;
  context.LpShare.set(updatedShare);

  // Create LpAction record
  const actionEntity: LpActionEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.owner,
    assets: d[1],
    shares: d[3],
    actionType: "deposit_locked",
    timestamp: BigInt(event.block.timestamp),
    epoch: 0n,
    withdrawShares: 0n,
    withdrawRequestEpoch: 0n,
    withdrawUnlockEpoch: 0n,
  } as unknown as LpActionEntity;
  context.LpAction.set(actionEntity);

  // Update Vault locked users count
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    totalLockedUsers: add(
      vault?.totalLockedUsers as unknown as bigint | undefined,
      1n
    ),
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);
});

OstiumVault.DepositUnlocked.handler(async ({ event, context }) => {
  const d = event.params._4;
  const entity: OstiumVault_DepositUnlocked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    receiver: event.params.receiver,
    owner: event.params.owner,
    depositId: event.params.depositId,
    d_0: d[0],
    d_1: d[1],
    d_2: d[2],
    d_3: d[3],
    d_4: d[4],
    d_5: d[5],
  };
  context.OstiumVault_DepositUnlocked.set(entity);

  // Update LpNFT entity to mark as unlocked
  const nftId = event.params.depositId.toString();
  const existingNft = await context.LpNFT.get(nftId);
  if (existingNft) {
    const updatedNft: LpNFTEntity = {
      ...existingNft,
      isUnlocked: true,
    } as unknown as LpNFTEntity;
    context.LpNFT.set(updatedNft);

    // Update LpShare entity to reduce locked amounts
    const userId = event.params.owner.toLowerCase();
    const existingShare = await context.LpShare.get(userId);
    if (existingShare) {
      const newLockedAssets =
        (existingShare.lockedAssets as unknown as bigint) - d[1];
      const newLockedShares =
        (existingShare.lockedShares as unknown as bigint) - d[3];
      const updatedShare: LpShareEntity = {
        ...existingShare,
        lockedAssets: newLockedAssets < 0n ? 0n : newLockedAssets,
        lockedShares: newLockedShares < 0n ? 0n : newLockedShares,
        hasLocked: newLockedAssets > 0n || newLockedShares > 0n,
      } as unknown as LpShareEntity;
      context.LpShare.set(updatedShare);
    }
  }

  // Create LpAction record
  const actionEntity: LpActionEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.owner,
    assets: d[1],
    shares: d[3],
    actionType: "deposit_unlocked",
    timestamp: BigInt(event.block.timestamp),
    epoch: 0n,
    withdrawShares: 0n,
    withdrawRequestEpoch: 0n,
    withdrawUnlockEpoch: 0n,
  } as unknown as LpActionEntity;
  context.LpAction.set(actionEntity);
});

OstiumVault.AccPnlPerTokenUsedUpdated.handler(async ({ event, context }) => {
  const entity: OstiumVault_AccPnlPerTokenUsedUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    prevPositiveOpenPnl: event.params.prevPositiveOpenPnl,
    newPositiveOpenPnl: event.params.newPositiveOpenPnl,
    newEpochPositiveOpenPnl: event.params.newEpochPositiveOpenPnl,
    newAccPnlPerTokenUsed: event.params.newAccPnlPerTokenUsed,
  };
  context.OstiumVault_AccPnlPerTokenUsedUpdated.set(entity);

  // Update Vault entity
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    accPnlPerTokenUsed: event.params.newAccPnlPerTokenUsed,
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);
});

OstiumVault.ShareToAssetsPriceUpdated.handler(async ({ event, context }) => {
  const entity: OstiumVault_ShareToAssetsPriceUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };
  context.OstiumVault_ShareToAssetsPriceUpdated.set(entity);
  // Update Vault share price, and write daily snapshot
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    sharePrice: event.params.value,
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);
  const day = toDayString(event.block.timestamp as unknown as bigint);
  const dailyId = `${day}`;
  const daily = await context.ShareToAssetsPriceDaily.get(dailyId);
  const dailyEntity: ShareToAssetsPriceDailyEntity = {
    id: dailyId,
    sharePrice: event.params.value,
    timestamp: BigInt(event.block.timestamp),
    day,
  } as unknown as ShareToAssetsPriceDailyEntity;
  context.ShareToAssetsPriceDaily.set(
    daily ? { ...daily, ...dailyEntity } : dailyEntity
  );
});

OstiumVault.RewardDistributed.handler(async ({ event, context }) => {
  const entity: OstiumVault_RewardDistributed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    assets: event.params.assets,
    accRewardsPerToken: event.params.accRewardsPerToken,
  };
  context.OstiumVault_RewardDistributed.set(entity);

  // Update Vault rewards
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    rewardsPerToken: event.params.accRewardsPerToken,
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);
});

OstiumVault.MaxDiscountPUpdated.handler(async ({ event, context }) => {
  const entity: OstiumVault_MaxDiscountPUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };
  context.OstiumVault_MaxDiscountPUpdated.set(entity);

  // Update Vault max discount
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    maxDiscountP: event.params.value,
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);
});

OstiumVault.MaxDiscountThresholdPUpdated.handler(async ({ event, context }) => {
  const entity: OstiumVault_MaxDiscountThresholdPUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };
  context.OstiumVault_MaxDiscountThresholdPUpdated.set(entity);

  // Update Vault max discount threshold
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    maxDiscountThresholdP: event.params.value,
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);
});

OstiumVault.CurrentMaxSupplyUpdated.handler(async ({ event, context }) => {
  const entity: OstiumVault_CurrentMaxSupplyUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };
  context.OstiumVault_CurrentMaxSupplyUpdated.set(entity);

  // Update Vault current max supply
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    currentMaxSupply: event.params.value,
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);
});

OstiumVault.Transfer.handler(async ({ event, context }) => {
  const entity: OstiumVault_Transfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
  };
  context.OstiumVault_Transfer.set(entity);
});

OstiumVault.Approval.handler(async ({ event, context }) => {
  const entity: OstiumVault_Approval = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    spender: event.params.spender,
    value: event.params.value,
  };
  context.OstiumVault_Approval.set(entity);
});

// OstiumLockedDepositNft
OstiumLockedDepositNft.Transfer.handler(async ({ event, context }) => {
  const entity: OstiumLockedDepositNft_Transfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    tokenId: event.params.tokenId,
  };
  context.OstiumLockedDepositNft_Transfer.set(entity);

  // Update LpNFT owner on transfer (skip mint/burn with zero addresses)
  const nftId = event.params.tokenId.toString();
  const existingNft = await context.LpNFT.get(nftId);
  if (
    existingNft &&
    event.params.from !== "0x0000000000000000000000000000000000000000" &&
    event.params.to !== "0x0000000000000000000000000000000000000000"
  ) {
    const updatedNft: LpNFTEntity = {
      ...existingNft,
      user: event.params.to,
    } as unknown as LpNFTEntity;
    context.LpNFT.set(updatedNft);

    // Update LpShare entities for both old and new owners
    const oldUserId = event.params.from.toLowerCase();
    const newUserId = event.params.to.toLowerCase();

    // Remove from old owner
    const oldShare = await context.LpShare.get(oldUserId);
    if (oldShare) {
      const newOldLockedAssets =
        (oldShare.lockedAssets as unknown as bigint) -
        (existingNft.assetsDeposited as unknown as bigint);
      const newOldLockedShares =
        (oldShare.lockedShares as unknown as bigint) -
        (existingNft.shares as unknown as bigint);
      const updatedOldShare: LpShareEntity = {
        ...oldShare,
        lockedAssets: newOldLockedAssets < 0n ? 0n : newOldLockedAssets,
        lockedShares: newOldLockedShares < 0n ? 0n : newOldLockedShares,
        hasLocked: newOldLockedAssets > 0n || newOldLockedShares > 0n,
      } as unknown as LpShareEntity;
      context.LpShare.set(updatedOldShare);
    }

    // Add to new owner
    const newShare = await context.LpShare.get(newUserId);
    const updatedNewShare: LpShareEntity = {
      id: newUserId,
      user: event.params.to,
      assets: newShare?.assets ?? 0n,
      shares: newShare?.shares ?? 0n,
      lockedAssets: add(
        newShare?.lockedAssets as unknown as bigint | undefined,
        existingNft.assetsDeposited as unknown as bigint
      ),
      lockedShares: add(
        newShare?.lockedShares as unknown as bigint | undefined,
        existingNft.shares as unknown as bigint
      ),
      hasLocked: true,
    } as unknown as LpShareEntity;
    context.LpShare.set(updatedNewShare);
  }
});

// OstiumTradingStorage
OstiumTradingStorage.MaxOpenInterestUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingStorage_MaxOpenInterestUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
    };
    context.OstiumTradingStorage_MaxOpenInterestUpdated.set(entity);
  }
);

OstiumTradingStorage.MaxTradesPerPairUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingStorage_MaxTradesPerPairUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
    };
    context.OstiumTradingStorage_MaxTradesPerPairUpdated.set(entity);
  }
);

OstiumTradingStorage.MaxPendingMarketOrdersUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingStorage_MaxPendingMarketOrdersUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
    };
    context.OstiumTradingStorage_MaxPendingMarketOrdersUpdated.set(entity);
  }
);

// OstiumOpenPnl
OstiumOpenPnl.LastTradePriceUpdated.handler(async ({ event, context }) => {
  const entity: OstiumOpenPnl_LastTradePriceUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    lastTradePrice: event.params.lastTradePrice,
  };
  context.OstiumOpenPnl_LastTradePriceUpdated.set(entity);
  const pairId = event.params.pairIndex.toString();
  const existing = await context.Pair.get(pairId);
  if (existing) {
    const updated: PairEntity = {
      ...existing,
      lastTradePrice: event.params.lastTradePrice,
    };
    context.Pair.set(updated);
  }
});
